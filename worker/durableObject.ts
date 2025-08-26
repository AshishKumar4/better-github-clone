import { DurableObject } from "cloudflare:workers";
import { Issue, Comment, FileContent, Commit, User } from '../src/lib/types';
import { mockIssues, mockComments, mockUsers, mockFileContents } from '../src/lib/mock-data';
interface RepoStorage {
  issues: Issue[];
  comments: Record<number, Comment[]>;
  files: Record<string, FileContent>;
  commits: Commit[];
}
const findUserById = (id: string): User | undefined => {
    return Object.values(mockUsers).find(u => u.id === id);
}
// **DO NOT MODIFY THE CLASS NAME**
export class GlobalDurableObject extends DurableObject {
  private async getRepoData(repoName: string): Promise<RepoStorage> {
    let data: RepoStorage | undefined = await this.ctx.storage.get(repoName);
    if (!data) {
      // Seed with mock data if it doesn't exist
      data = {
        issues: mockIssues,
        comments: mockComments as Record<number, Comment[]>,
        files: mockFileContents,
        commits: [],
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
  async createIssue(repoName: string, title: string, body: string, authorId: string): Promise<Issue> {
    const author = findUserById(authorId);
    if (!author) throw new Error("Author not found");
    const data = await this.getRepoData(repoName);
    const newIssue: Issue = {
      id: (data.issues.length > 0 ? Math.max(...data.issues.map(i => i.id)) : 0) + 1,
      title,
      body,
      author,
      status: 'open',
      createdAt: new Date().toISOString(),
      commentsCount: 0,
      labels: [],
    };
    data.issues.unshift(newIssue);
    await this.ctx.storage.put(repoName, data);
    return newIssue;
  }
  async addComment(repoName: string, issueId: number, body: string, authorId: string): Promise<Comment> {
    const author = findUserById(authorId);
    if (!author) throw new Error("Author not found");
    const data = await this.getRepoData(repoName);
    const issue = data.issues.find(i => i.id === issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }
    if (!data.comments[issueId]) {
      data.comments[issueId] = [];
    }
    const nextId = (data.comments[issueId].length > 0 ? Math.max(...data.comments[issueId].map(c => {
      const idPart = parseInt(c.id.split('-').pop()!);
      return Number.isFinite(idPart) ? idPart : 0;
    })) : 0) + 1;
    const newComment: Comment = {
      id: `comment-${issueId}-${nextId}`,
      body,
      author,
      createdAt: new Date().toISOString(),
    };
    data.comments[issueId].push(newComment);
    issue.commentsCount = data.comments[issueId].length;
    await this.ctx.storage.put(repoName, data);
    return newComment;
  }
  async getFileContent(repoName: string, path: string): Promise<FileContent | undefined> {
    const data = await this.getRepoData(repoName);
    return data.files[path];
  }
  async updateFileContent(repoName: string, path: string, content: string, message: string, authorId: string): Promise<Commit> {
    const author = findUserById(authorId);
    if (!author) throw new Error("Author not found");
    const data = await this.getRepoData(repoName);
    if (!data.files[path]) {
      throw new Error("File not found");
    }
    data.files[path].content = content;
    const newCommit: Commit = {
      id: crypto.randomUUID(),
      message,
      author,
      createdAt: new Date().toISOString(),
    };
    data.commits.unshift(newCommit);
    await this.ctx.storage.put(repoName, data);
    return newCommit;
  }
  async getCommits(repoName: string): Promise<Commit[]> {
    const data = await this.getRepoData(repoName);
    return data.commits;
  }
}