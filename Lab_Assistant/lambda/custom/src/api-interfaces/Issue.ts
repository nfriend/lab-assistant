interface IssueUser {
  id: number;
  name: string;
  username: string;
  state: 'active' | 'inactive';
  avatar_url: string;
  web_url: string;
}

export interface Issue {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: 'opened' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string;
  closed_by: string;
  labels: string[];
  milestone: {
    id: number;
    iid: number;
    group_id: number;
    title: string;
    description: string;
    state: 'active' | 'closed';
    created_at: string;
    updated_at: string;
    due_date: string;
    start_date: string;
    web_url: string;
  };
  assignees: IssueUser[];
  author: IssueUser;
  assignee: IssueUser;
  user_notes_count: number;
  merge_requests_count: number;
  upvotes: number;
  downvotes: number;
  due_date: string;
  confidential: boolean;
  discussion_locked: boolean;
  web_url: string;
  time_stats: {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate: number;
    human_total_time_spent: number;
  };
  task_completion_status: {
    count: number;
    completed_count: number;
  };
  has_tasks: boolean;
  _links: {
    self: string;
    notes: string;
    award_emoji: string;
    project: string;
  };
  weight: number;
}
