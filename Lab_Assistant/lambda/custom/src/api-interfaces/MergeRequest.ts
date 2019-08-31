interface MergeRequestUser {
  id: number;
  name: string;
  username: string;
  state: 'active' | 'inactive';
  avatar_url: string;
  web_url: string;
}

export interface MergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: 'opened' | 'closed' | 'locked' | 'merged';
  created_at: string;
  updated_at: string;
  merged_by: string;
  merged_at: string;
  closed_by: string;
  closed_at: string;
  target_branch: string;
  source_branch: string;
  user_notes_count: number;
  upvotes: number;
  downvotes: number;
  assignee: MergeRequestUser;
  author: MergeRequestUser;
  assignees: MergeRequestUser[];
  source_project_id: number;
  target_project_id: number;
  labels: string[];
  work_in_progress: boolean;
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
  merge_when_pipeline_succeeds: boolean;
  merge_status: string;
  sha: string;
  merge_commit_sha: string;
  discussion_locked: boolean;
  should_remove_source_branch: boolean;
  force_remove_source_branch: boolean;
  reference: string;
  web_url: string;
  time_stats: {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate: string;
    human_total_time_spent: string;
  };
  squash: boolean;
  task_completion_status: {
    count: number;
    completed_count: number;
  };
  approvals_before_merge: number;
}
