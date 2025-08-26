import { Hono } from "hono";
import { Env } from './core-utils';
import { mockRepositories, mockFileTree, mockUsers } from '../src/lib/mock-data';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Static data routes
    app.get('/api/user/repos', (c) => {
        return c.json({ success: true, data: mockRepositories });
    });
    app.get('/api/users/:username', (c) => {
        const { username } = c.req.param();
        const user = mockUsers[username];
        if (user) {
            return c.json({ success: true, data: user });
        }
        return c.json({ success: false, error: 'User not found' }, 404);
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
        const { title, body, authorId } = await c.req.json();
        if (!title || !body || !authorId) return c.json({ success: false, error: 'Title, body, and authorId are required' }, 400);
        const id = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(id);
        const { user } = c.req.param(); // Extract the user (owner) from the path
        const newIssue = await stub.createIssue(user, repo, title, body, authorId);
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
        const { body, authorId } = await c.req.json();
        if (!body || !authorId) return c.json({ success: false, error: 'Comment body and authorId are required' }, 400);
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        try {
            const { user } = c.req.param(); // Extract the user (owner) from the path
            const newComment = await stub.addComment(user, repo, issueId, body, authorId);
            return c.json({ success: true, data: newComment }, 201);
        } catch (error: any) {
            return c.json({ success: false, error: error.message || 'An unknown error occurred' }, 400);
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
        const { content, message, authorId } = await c.req.json();
        if (content === undefined || !message || !authorId) return c.json({ success: false, error: 'Content, message, and authorId are required' }, 400);
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        try {
            const { user } = c.req.param(); // Extract the user (owner) from the path
            const newCommit = await stub.updateFileContent(user, repo, path, content, message, authorId);
            return c.json({ success: true, data: newCommit }, 201);
        } catch (error: any) {
            return c.json({ success: false, error: error.message || 'An unknown error occurred' }, 500);
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