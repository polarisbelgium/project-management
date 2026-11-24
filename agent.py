import os, sys, re, json, sqlite3, smtplib
import datetime as dt
from email.message import EmailMessage
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
client = Anthropic()
MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-5-5")

# ---------- database ----------
def conn():
    c = sqlite3.connect("agent.db")
    c.row_factory = sqlite3.Row
    return c

def now():
    return dt.datetime.now().isoformat(timespec="seconds")

def init():
    with conn() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS project(id INTEGER PRIMARY KEY, description TEXT);
        CREATE TABLE IF NOT EXISTS prospects(
            id INTEGER PRIMARY KEY, name TEXT, company TEXT, email TEXT,
            why_fit TEXT, status TEXT DEFAULT 'new', last_contact TEXT);
        CREATE TABLE IF NOT EXISTS actions(
            id INTEGER PRIMARY KEY, prospect_id INTEGER, kind TEXT,
            subject TEXT, body TEXT, status TEXT DEFAULT 'pending', created TEXT);
        CREATE TABLE IF NOT EXISTS offers(
            id INTEGER PRIMARY KEY, prospect_id INTEGER, details TEXT, created TEXT);
        """)

def project():
    with conn() as c:
        r = c.execute("SELECT description FROM project WHERE id=1").fetchone()
    if not r:
        sys.exit('Set a project first: python agent.py project "..."')
    return r["description"]

# ---------- Claude ----------
def text_of(resp):
    return "".join(b.text for b in resp.content if b.type == "text")

def research(proj, n=8):
    resp = client.messages.create(
        model=MODEL, max_tokens=4000,
        tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 6}],
        messages=[{"role": "user", "content":
            f"Project:\n{proj}\n\nFind {n} real companies or people likely to be "
            "interested (partners, investors, clients, suppliers). Return ONLY a JSON "
            "list of objects with keys: name, company, email (empty string if unknown), why_fit."}])
    m = re.search(r"\[.*\]", text_of(resp), re.S)
    return json.loads(m.group(0)) if m else []

def draft(proj, p, kind="proposal", history=""):
    prompt = (f"Project:\n{proj}\n\nProspect: {p['name']} at {p['company']}. "
              f"Why fit: {p['why_fit']}\n")
    if kind == "followup":
        prompt += f"Previous messages:\n{history}\nWrite a short, polite follow-up.\n"
    else:
        prompt += "Write a concise, personalized proposal email.\n"
    prompt += 'Return ONLY JSON: {"subject": "...", "body": "..."}'
    resp = client.messages.create(model=MODEL, max_tokens=1200,
                                  messages=[{"role": "user", "content": prompt}])
    m = re.search(r"\{.*\}", text_of(resp), re.S)
    return json.loads(m.group(0))

def make_report(data):
    resp = client.messages.create(model=MODEL, max_tokens=800, messages=[{
        "role": "user", "content":
        f"Write a brief status report for the project owner with next recommended actions:\n{data}"}])
    return text_of(resp)

# ---------- email (only runs after you approve) ----------
def send_email(to, subject, body):
    m = EmailMessage()
    m["From"] = f"{os.getenv('SENDER_NAME', '')} <{os.getenv('SMTP_USER')}>"
    m["To"], m["Subject"] = to, subject
    m.set_content(body)
    with smtplib.SMTP(os.getenv("SMTP_HOST"), int(os.getenv("SMTP_PORT", 587))) as s:
        s.starttls()
        s.login(os.getenv("SMTP_USER"), os.getenv("SMTP_PASS"))
        s.send_message(m)

def email_ready():
    return bool(os.getenv("SMTP_USER") and os.getenv("SMTP_PASS"))

# ---------- commands ----------
def cmd_project(text):
    with conn() as c:
        c.execute("INSERT OR REPLACE INTO project VALUES(1,?)", (text,))
    print("Saved.")

def cmd_research():
    with conn() as c:
        for p in research(project()):
            c.execute("INSERT INTO prospects(name,company,email,why_fit) VALUES(?,?,?,?)",
                      (p["name"], p["company"], p.get("email", ""), p["why_fit"]))
            print(f"+ {p['name']} ({p['company']})")

def queue_action(c, pid, kind, d):
    c.execute("INSERT INTO actions(prospect_id,kind,subject,body,created) VALUES(?,?,?,?,?)",
              (pid, kind, d["subject"], d["body"], now()))

def cmd_draft():
    proj = project()
    with conn() as c:
        for p in c.execute("SELECT * FROM prospects WHERE status='new'").fetchall():
            queue_action(c, p["id"], "proposal", draft(proj, p))
            c.execute("UPDATE prospects SET status='drafted' WHERE id=?", (p["id"],))
    print("Drafts added. Run: python agent.py queue")

def cmd_followups(days=3):
    proj = project()
    cutoff = (dt.datetime.now() - dt.timedelta(days=days)).isoformat()
    with conn() as c:
        rows = c.execute("SELECT * FROM prospects WHERE status='contacted' AND last_contact<?",
                         (cutoff,)).fetchall()
        for p in rows:
            hist = "\n".join(r["body"] for r in c.execute(
                "SELECT body FROM actions WHERE prospect_id=? AND status='sent'", (p["id"],)))
            queue_action(c, p["id"], "followup", draft(proj, p, "followup", hist))
    print(f"{len(rows)} follow-up(s) drafted. Run: python agent.py queue")

def cmd_queue():
    with conn() as c:
        items = c.execute("""SELECT a.*, p.name, p.email FROM actions a
                             JOIN prospects p ON p.id=a.prospect_id
                             WHERE a.status='pending'""").fetchall()
        if not items:
            return print("Nothing pending.")
        for a in items:
            body = a["body"]
            print(f"\n--- [{a['kind']}] to {a['name']} <{a['email'] or 'no email'}>")
            print(f"Subject: {a['subject']}\n\n{body}\n")
            ch = input("(a)pprove  (e)dit  (r)eject  (s)kip: ").strip().lower()
            if ch == "e":
                body = input("New body: ")
                c.execute("UPDATE actions SET body=? WHERE id=?", (body, a["id"]))
                ch = "a"
            if ch == "a":
                if email_ready() and a["email"]:
                    send_email(a["email"], a["subject"], body)
                    print("Sent.")
                else:
                    print("Email not set up or no address. Copy the text above and send it yourself.")
                c.execute("UPDATE actions SET status='sent' WHERE id=?", (a["id"],))
                c.execute("UPDATE prospects SET status='contacted', last_contact=? WHERE id=?",
                          (now(), a["prospect_id"]))
            elif ch == "r":
                c.execute("UPDATE actions SET status='rejected' WHERE id=?", (a["id"],))

def cmd_offer(pid, details):
    with conn() as c:
        c.execute("INSERT INTO offers(prospect_id,details,created) VALUES(?,?,?)",
                  (pid, details, now()))
        c.execute("UPDATE prospects SET status='offer' WHERE id=?", (pid,))
    print("Logged.")

def cmd_report():
    with conn() as c:
        data = {
            "prospects": [dict(r) for r in c.execute("SELECT id,name,company,status FROM prospects")],
            "offers": [dict(r) for r in c.execute("SELECT * FROM offers")],
            "pending_approvals": c.execute(
                "SELECT COUNT(*) FROM actions WHERE status='pending'").fetchone()[0],
        }
    print(make_report(data))

HELP = """Commands:
  python agent.py project "describe your project"
  python agent.py research
  python agent.py draft
  python agent.py queue
  python agent.py followups
  python agent.py offer 1 "They offered X"
  python agent.py report"""

if __name__ == "__main__":
    init()
    a = sys.argv[1:]
    if not a: print(HELP)
    elif a[0] == "project": cmd_project(a[1])
    elif a[0] == "research": cmd_research()
    elif a[0] == "draft": cmd_draft()
    elif a[0] == "queue": cmd_queue()
    elif a[0] == "followups": cmd_followups()
    elif a[0] == "offer": cmd_offer(int(a[1]), a[2])
    elif a[0] == "report": cmd_report()
    else: print(HELP)
