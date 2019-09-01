interface MergeRequestUser {
  id: number;
  name: string;
  username: string;
  state: 'active' | 'inactive';
  avatar_url: string;
  web_url: string;
}

type MergeRequestPipelineStatus =
  | 'running'
  | 'pending'
  | 'success'
  | 'failed'
  | 'canceled'
  | 'skipped';

export interface MergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: 'opened' | 'closed' | 'locked' | 'merged';
  created_at: string;
  updated_at: string;
  merged_by: MergeRequestUser;
  merged_at: string;
  closed_by: MergeRequestUser;
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
    human_time_estimate: number;
    human_total_time_spent: number;
  };
  squash: boolean;
  task_completion_status: {
    count: number;
    completed_count: number;
  };
  subscribed: boolean;
  changes_count: string;
  latest_build_started_at: string;
  latest_build_finished_at: string;
  first_deployed_to_production_at: string;
  pipeline: {
    id: number;
    sha: string;
    ref: string;
    status: MergeRequestPipelineStatus;
    web_url: string;
  };
  head_pipeline: {
    id: number;
    sha: string;
    ref: string;
    status: MergeRequestPipelineStatus;
    web_url: string;
    before_sha: string;
    tag: false;
    yaml_errors: any;
    user: MergeRequestUser;
    created_at: string;
    updated_at: string;
    started_at: string;
    finished_at: string;
    committed_at: string;
    duration: number;
    coverage: string;
    detailed_status: {
      icon: string;
      text: string;
      label: string;
      group: string;
      tooltip: string;
      has_details: boolean;
      details_path: string;
      illustration: any;
      favicon: string;
    };
  };
  diff_refs: {
    base_sha: string;
    head_sha: string;
    start_sha: string;
  };
  merge_error: boolean;
  user: {
    can_merge: boolean;
  };
  approvals_before_merge: number;
}

export interface SimpleMergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: 'opened' | 'closed' | 'locked' | 'merged';
  created_at: string;
  updated_at: string;
  web_url: string;
}
