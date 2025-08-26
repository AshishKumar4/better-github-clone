import { Hono } from "hono";
import { Env } from './core-utils';
import { mockRepositories, mockFileTree, mockFileContents, mockIssues, mockComments, mockPullRequests } from '../src/lib/mock-data';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // Mock API for CodePod
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
    app.get('/api/repos/:user/:repo/issues', (c) => {
        return c.json({ success: true, data: mockIssues });
    });
    app.get('/api/repos/:user/:repo/issues/:id', (c) => {
        const { id } = c.req.param();
        const issue = mockIssues.find(i => i.id === parseInt(id));
        if (issue) {
            return c.json({ success: true, data: issue });
        }
        return c.json({ success: false, error: 'Issue not found' }, 404);
    });
    app.get('/api/repos/:user/:repo/issues/:id/comments', (c) => {
        const { id } = c.req.param();
        const comments = mockComments[parseInt(id)] || [];
        return c.json({ success: true, data: comments });
    });
    app.get('/api/repos/:user/:repo/pulls', (c) => {
        return c.json({ success: true, data: mockPullRequests });
    });
}