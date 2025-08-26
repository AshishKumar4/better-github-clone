import { QueryClient } from '@tanstack/react-query';
import { Repository, FileNode, FileContent, Issue, Comment, PullRequest } from './types';
export const queryClient = new QueryClient();
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }
  return data.data;
}
export const getRepositories = (): Promise<Repository[]> => fetcher<Repository[]>('/api/user/repos');
export const getRepository = (user: string, repo: string): Promise<Repository> => fetcher<Repository>(`/api/repos/${user}/${repo}`);
export const getFileTree = (user: string, repo: string): Promise<FileNode[]> => fetcher<FileNode[]>(`/api/repos/${user}/${repo}/tree`);
export const getFileContent = (user: string, repo: string, path: string): Promise<FileContent> => fetcher<FileContent>(`/api/repos/${user}/${repo}/contents/${path}`);
export const getIssues = (user: string, repo: string): Promise<Issue[]> => fetcher<Issue[]>(`/api/repos/${user}/${repo}/issues`);
export const getIssue = (user: string, repo: string, issueId: string): Promise<Issue> => fetcher<Issue>(`/api/repos/${user}/${repo}/issues/${issueId}`);
export const getIssueComments = (user: string, repo: string, issueId: string): Promise<Comment[]> => fetcher<Comment[]>(`/api/repos/${user}/${repo}/issues/${issueId}/comments`);
export const getPullRequests = (user: string, repo: string): Promise<PullRequest[]> => fetcher<PullRequest[]>(`/api/repos/${user}/${repo}/pulls`);