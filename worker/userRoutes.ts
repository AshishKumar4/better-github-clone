import { Hono } from "hono";
import { Env } from './core-utils';
import { mockRepositories, mockFileTree, mockFileContents, mockPullRequests } from '../src/lib/mock-data';
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
    app.get('/api/repos/:user/:repo/contents/:path{.+}', (c) => {
        const { path } = c.req.param();
        const content = mockFileContents[path];
        if (content) {
            return c.json({ success: true, data: content });
        }
        return c.json({ success: false, error: 'File not found' }, 404);
    });
    app.get('/api/repos/:user/:repo/pulls', (c) => {
        return c.json({ success: true, data: mockPullRequests });
    });
    // Durable Object routes for Issues and Comments
    app.get('/api/repos/:user/:repo/issues', async (c) => {
        const { repo } = c.req.param();
        const id = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(id);
        const issues = await stub.getIssues();
        return c.json({ success: true, data: issues });
    });
    app.post('/api/repos/:user/:repo/issues', async (c) => {
        const { repo } = c.req.param();
        const { title, body } = await c.req.json();
        if (!title || !body) {
            return c.json({ success: false, error: 'Title and body are required' }, 400);
        }
        const id = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(id);
        const newIssue = await stub.createIssue(title, body);
        return c.json({ success: true, data: newIssue }, 201);
    });
    app.get('/api/repos/:user/:repo/issues/:id', async (c) => {
        const { repo, id } = c.req.param();
        const issueId = parseInt(id);
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        const issue = await stub.getIssue(issueId);
        if (issue) {
            return c.json({ success: true, data: issue });
        }
        return c.json({ success: false, error: 'Issue not found' }, 404);
    });
    app.get('/api/repos/:user/:repo/issues/:id/comments', async (c) => {
        const { repo, id } = c.req.param();
        const issueId = parseInt(id);
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        const comments = await stub.getComments(issueId);
        return c.json({ success: true, data: comments });
    });
    app.post('/api/repos/:user/:repo/issues/:id/comments', async (c) => {
        const { repo, id } = c.req.param();
        const issueId = parseInt(id);
        const { body } = await c.req.json();
        if (!body) {
            return c.json({ success: false, error: 'Comment body is required' }, 400);
        }
        const doId = c.env.GlobalDurableObject.idFromName(repo);
        const stub = c.env.GlobalDurableObject.get(doId);
        try {
            const newComment = await stub.addComment(issueId, body);
            return c.json({ success: true, data: newComment }, 201);
        } catch (error) {
            return c.json({ success: false, error: (error as Error).message }, 404);
        }
    });
}