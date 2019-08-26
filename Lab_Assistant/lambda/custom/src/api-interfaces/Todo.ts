export enum TodoAction {
  Assigned = 'assigned',
  Mentioned = 'mentioned',
  BuildFailed = 'build_failed',
  Marked = 'marked',
  ApprovalRequired = 'approval_required',
  Unmergeable = 'unmergeable',
  DirectlyAddressed = 'directly_addressed',
}

/** https://docs.gitlab.com/ee/api/todos.html */
export interface Todo {
  id: number;
  project: {
    id: number;
    name: string;
    name_with_namespace: string;
    path: string;
    path_with_namespace: string;
  };
  author: {
    name: string;
    username: string;
    id: number;
    state: string;
    avatar_url: string;
    web_url: string;
  };
  action_name: TodoAction;
  target_type: 'Issue' | 'MergeRequest';
  target: any;
  target_url: string;
  body: string;
  state: 'pending' | 'done';
  created_at: string;
}
