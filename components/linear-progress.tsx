type LinearProgressProps = {
  value: number;
  label: string;
};

export function LinearProgress({ value, label }: LinearProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="linear-progress-wrap">
      <progress className="linear-progress" value={safeValue} max={100} aria-label={label} />
      <span className="linear-progress-value">{safeValue}%</span>
    </div>
  );
}
