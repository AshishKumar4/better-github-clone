import { Hono } from "hono";
import { Env } from './core-utils';
import { mockRepositories, mockFileTree } from '../src/lib/mock-data';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Static data routes
    app.get('/api/user/repos', (c) => {
        return c.json({ success: true, data: mockRepositories });
    });
    app.get('/api/repos/:user/:repo', (c) => {
        const { user, repo } = c.req.param();
        const repository = mockRepositories.find(r => r.owner.username === user && r.name === repo);
        if (repository) {
            return c.json({ success: true, data: repository });
        }
        return c.json({ success: false, error: 'Repository not found' }, 404);
    });
    app.get('/api/repos/:user/:repo/tree', (c) => {
        return c.json({ success: true, data: mockFileTree });
    });
    app.get('/api/repos/:user/:repo/pulls', (c) => {
        const { repo } = c.req.param();
        // In a real app, this would fetch from the DO
        const pullRequests = [{ id: 1, title: 'feat: Add user authentication', author: { id: 'user-2', name: 'Grace Hopper', username: 'grace', avatarUrl: 'https://i.pravatar.cc/150?u=grace' }, status: 'open', createdAt: '2024-08-15T18:00:00Z', branch: 'feat/auth' }];
        return c.json({ success: true, data: pullRequests });
    });
    // Durable Object routes
    app.get('/api/repos/:user/:repo/issues', async (c) => {
        const { repo } = c.req.param();
        const id = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(id);
        const issues = await stub.getIssues(repo);
        return c.json({ success: true, data: issues });
    });
    app.post('/api/repos/:user/:repo/issues', async (c) => {
        const { repo } = c.req.param();
        const { title, body } = await c.req.json();
        if (!title || !body) return c.json({ success: false, error: 'Title and body are required' }, 400);
        const id = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(id);
        const newIssue = await stub.createIssue(repo, title, body);
        return c.json({ success: true, data: newIssue }, 201);
    });
    app.get('/api/repos/:user/:repo/issues/:id', async (c) => {
        const { repo, id } = c.req.param();
        const issueId = parseInt(id);
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        const issue = await stub.getIssue(repo, issueId);
        if (issue) return c.json({ success: true, data: issue });
        return c.json({ success: false, error: 'Issue not found' }, 404);
    });
    app.get('/api/repos/:user/:repo/issues/:id/comments', async (c) => {
        const { repo, id } = c.req.param();
        const issueId = parseInt(id);
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        const comments = await stub.getComments(repo, issueId);
        return c.json({ success: true, data: comments });
    });
    app.post('/api/repos/:user/:repo/issues/:id/comments', async (c) => {
        const { repo, id } = c.req.param();
        const issueId = parseInt(id);
        const { body } = await c.req.json();
        if (!body) return c.json({ success: false, error: 'Comment body is required' }, 400);
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        try {
            const newComment = await stub.addComment(repo, issueId, body);
            return c.json({ success: true, data: newComment }, 201);
        } catch (error: any) { // Explicitly type error as 'any' or 'unknown' for safer access
            return c.json({ success: false, error: error.message || 'An unknown error occurred' }, 400); // Return 400 for client error, provide a default message
        }
    });
    app.get('/api/repos/:user/:repo/contents/:path{.+}', async (c) => {
        const { repo, path } = c.req.param();
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        const content = await stub.getFileContent(repo, path);
        if (content) return c.json({ success: true, data: content });
        return c.json({ success: false, error: 'File not found' }, 404);
    });
    app.post('/api/repos/:user/:repo/contents/:path{.+}', async (c) => {
        const { repo, path } = c.req.param();
        const { content, message } = await c.req.json();
        if (content === undefined || !message) return c.json({ success: false, error: 'Content and message are required' }, 400);
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        try {
            const newCommit = await stub.updateFileContent(repo, path, content, message);
            return c.json({ success: true, data: newCommit }, 201);
        } catch (error: any) { // Explicitly type error as 'any' or 'unknown' for safer access
            return c.json({ success: false, error: error.message || 'An unknown error occurred' }, 500); // Return 500 for server error, provide a default message
        }
    });
    app.get('/api/repos/:user/:repo/commits', async (c) => {
        const { repo } = c.req.param();
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        const commits = await stub.getCommits(repo);
        return c.json({ success: true, data: commits });
    });
}