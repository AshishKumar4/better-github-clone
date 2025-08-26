import { DurableObject } from "cloudflare:workers";
import { Issue, Comment, Repository } from '../src/lib/types';
import { mockRepositories, mockIssues, mockComments, mockUsers } from '../src/lib/mock-data';
interface RepoStorage {
  issues: Issue[];
  comments: Record<number, Comment[]>;
}
// **DO NOT MODIFY THE CLASS NAME**
export class GlobalDurableObject extends DurableObject {
  private async getRepoData(repoName: string): Promise<RepoStorage> {
    let data: RepoStorage | null = await this.ctx.storage.get(repoName);
    if (!data) {
      // Seed with mock data if it doesn't exist
      data = {
        issues: mockIssues,
        comments: mockComments as Record<number, Comment[]>,
      };
      await this.ctx.storage.put(repoName, data);
    }
    return data;
  }
  async getIssues(repoName: string): Promise<Issue[]> {
    const data = await this.getRepoData(repoName);
    return data.issues;
  }
  async getIssue(repoName: string, issueId: number): Promise<Issue | undefined> {
    const data = await this.getRepoData(repoName);
    return data.issues.find(i => i.id === issueId);
  }
  async getComments(repoName: string, issueId: number): Promise<Comment[]> {
    const data = await this.getRepoData(repoName);
    return data.comments[issueId] || [];
  }
  async createIssue(repoName: string, title: string, body: string): Promise<Issue> {
    const data = await this.getRepoData(repoName);
    const newIssue: Issue = {
      id: (data.issues.length > 0 ? Math.max(...data.issues.map(i => i.id)) : 0) + 1,
      title,
      body,
      author: mockUsers['ada'], // Hardcoded for now
      status: 'open',
      createdAt: new Date().toISOString(),
      commentsCount: 0,
      labels: [],
    };
    data.issues.unshift(newIssue);
    await this.ctx.storage.put(repoName, data);
    return newIssue;
  }
  async addComment(repoName: string, issueId: number, body: string): Promise<Comment> {
    const data = await this.getRepoData(repoName);
    const issue = data.issues.find(i => i.id === issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }
    if (!data.comments[issueId]) {
      data.comments[issueId] = [];
    }
    const newComment: Comment = {
      // Generate a new numeric ID for the comment.
      // If there are existing comments, find the maximum ID and increment. Otherwise, start from 1.
      id: (data.comments[issueId].length > 0 ? Math.max(...data.comments[issueId].map(c => typeof c.id === 'string' ? parseInt(c.id.split('-').pop()!) : c.id)) : 0) + 1,
      body,
      author: mockUsers['ada'], // Hardcoded for now
      createdAt: new Date().toISOString(),
    };
    data.comments[issueId].push(newComment);
    issue.commentsCount = data.comments[issueId].length;
    await this.ctx.storage.put(repoName, data);
    return newComment;
  }
}