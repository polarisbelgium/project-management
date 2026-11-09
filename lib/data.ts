export type ProjectStage = 'Analyze' | 'Design' | 'Develop' | 'Implement' | 'Monitor' | 'Evaluate';

export type Branch = {
  name: string;
  city: string;
  health: 'Healthy' | 'At Risk' | 'Delayed';
};

export type Department = {
  name: string;
  lead: string;
  budget: string;
};

export type Project = {
  id: number;
  name: string;
  branch: string;
  department: string;
  owner: string;
  stage: ProjectStage;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Delayed';
  dueDate: string;
  budget: string;
  risk: string;
};

export type Recommendation = {
  title: string;
  detail: string;
  priority: 'High' | 'Medium' | 'Low';
};

export const branches: Branch[] = [
  { name: 'Head Office', city: 'London', health: 'Healthy' },
  { name: 'Regional Hub', city: 'Dubai', health: 'At Risk' },
  { name: 'Operations Center', city: 'Johannesburg', health: 'Delayed' },
];

export const departments: Department[] = [
  { name: 'Operations', lead: 'Lilian Chen', budget: '$1.2M' },
  { name: 'Product', lead: 'Hassan Ali', budget: '$860K' },
  { name: 'Sales', lead: 'Nina Jansen', budget: '$950K' },
  { name: 'Finance', lead: 'Amina Noor', budget: '$700K' },
];

export const projects: Project[] = [
  {
    id: 1,
    name: 'ERP Rollout',
    branch: 'Head Office',
    department: 'Operations',
    owner: 'Lilian Chen',
    stage: 'Implement',
    progress: 82,
    status: 'On Track',
    dueDate: '2026-12-10',
    budget: '$420K',
    risk: 'Integration tuning is still pending.',
  },
  {
    id: 2,
    name: 'Branch Expansion Plan',
    branch: 'Regional Hub',
    department: 'Sales',
    owner: 'Nina Jansen',
    stage: 'Design',
    progress: 58,
    status: 'At Risk',
    dueDate: '2026-11-27',
    budget: '$260K',
    risk: 'Hiring pipeline and local compliance review are behind.',
  },
  {
    id: 3,
    name: 'AI Workflow Assistant',
    branch: 'Head Office',
    department: 'Product',
    owner: 'Hassan Ali',
    stage: 'Develop',
    progress: 74,
    status: 'On Track',
    dueDate: '2026-12-18',
    budget: '$580K',
    risk: 'Evaluation metrics should be validated before rollout.',
  },
  {
    id: 4,
    name: 'Vendor Compliance Audit',
    branch: 'Operations Center',
    department: 'Finance',
    owner: 'Amina Noor',
    stage: 'Monitor',
    progress: 49,
    status: 'Delayed',
    dueDate: '2026-11-15',
    budget: '$170K',
    risk: 'Documentation backlog is delaying final sign-off.',
  },
];

export const recommendations: Recommendation[] = [
  {
    title: 'Approve vendor onboarding review',
    detail: 'The compliance audit is blocked on final document sign-off; the AI recommends one reviewer escalation.',
    priority: 'High',
  },
  {
    title: 'Rebalance design staffing',
    detail: 'Branch expansion is at risk because design review capacity is concentrated in one team.',
    priority: 'Medium',
  },
  {
    title: 'Prepare evaluation checklist',
    detail: 'The AI workflow assistant should be assessed against quality standards before full deployment.',
    priority: 'High',
  },
];

export const approvalQueue = [
  { id: 1, item: 'Budget approval for ERP training', owner: 'Executive Office', date: 'Today' },
  { id: 2, item: 'Branch expansion hiring plan', owner: 'HR', date: 'Tomorrow' },
  { id: 3, item: 'AI assistant pilot go-live', owner: 'Product Council', date: 'This week' },
];
