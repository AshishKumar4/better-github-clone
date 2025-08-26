export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}
export interface Repository {
  id: string;
  name: string;
  owner: User;
  description: string;
  stars: number;
  forks: number;
  updatedAt: string;
  isPrivate: boolean;
}
export interface FileNode {
  type: 'file' | 'dir';
  name: string;
  path: string;
  children?: FileNode[];
}
export interface FileContent {
  path: string;
  content: string;
}
export type IssueStatus = 'open' | 'closed' | 'in_progress';
export interface Label {
  id: string;
  name: string;
  color: string;
}
export interface Issue {
  id: number;
  title: string;
  author: User;
  status: IssueStatus;
  createdAt: string;
  commentsCount: number;
  labels: Label[];
  body: string;
}
export interface Comment {
  id: string;
  author: User;
  createdAt: string;
  body: string;
}
export interface PullRequest {
  id: number;
  title: string;
  author: User;
  status: 'open' | 'closed' | 'merged';
  createdAt: string;
  branch: string;
}