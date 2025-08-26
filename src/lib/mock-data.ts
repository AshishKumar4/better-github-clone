import { User, Repository, FileNode, FileContent, Issue, Comment, PullRequest, Label } from './types';
export const mockUser: User = {
  id: 'user-1',
  name: 'Ada Lovelace',
  username: 'ada',
  avatarUrl: 'https://i.pravatar.cc/150?u=ada',
};
export const mockUsers: Record<string, User> = {
  'ada': mockUser,
  'grace': {
    id: 'user-2',
    name: 'Grace Hopper',
    username: 'grace',
    avatarUrl: 'https://i.pravatar.cc/150?u=grace',
  },
  'alan': {
    id: 'user-3',
    name: 'Alan Turing',
    username: 'alan',
    avatarUrl: 'https://i.pravatar.cc/150?u=alan',
  },
};
export const mockRepositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'codepod',
    owner: mockUser,
    description: 'A full-featured, collaborative Git platform for modern development, built on the Cloudflare edge.',
    stars: 1024,
    forks: 256,
    updatedAt: '2024-08-15T10:00:00Z',
    isPrivate: false,
  },
  {
    id: 'repo-2',
    name: 'edge-runtime',
    owner: mockUser,
    description: 'A high-performance runtime for serverless applications.',
    stars: 512,
    forks: 64,
    updatedAt: '2024-08-14T12:30:00Z',
    isPrivate: false,
  },
  {
    id: 'repo-3',
    name: 'dotfiles',
    owner: mockUser,
    description: 'My personal configuration files.',
    stars: 128,
    forks: 16,
    updatedAt: '2024-08-12T08:00:00Z',
    isPrivate: true,
  },
];
export const mockFileTree: FileNode[] = [
  { type: 'dir', name: 'src', path: 'src', children: [
    { type: 'dir', name: 'components', path: 'src/components', children: [
      { type: 'file', name: 'Button.tsx', path: 'src/components/Button.tsx' },
      { type: 'file', name: 'Card.tsx', path: 'src/components/Card.tsx' },
    ]},
    { type: 'file', name: 'App.tsx', path: 'src/App.tsx' },
    { type: 'file', name: 'index.css', path: 'src/index.css' },
  ]},
  { type: 'file', name: 'README.md', path: 'README.md' },
  { type: 'file', name: 'package.json', path: 'package.json' },
];
export const mockFileContents: Record<string, FileContent> = {
  'README.md': {
    path: 'README.md',
    content: '# CodePod\n\nA full-featured, collaborative Git platform for modern development, built on the Cloudflare edge.',
  },
  'package.json': {
    path: 'package.json',
    content: JSON.stringify({
      name: "codepod",
      version: "0.0.1",
      dependencies: {
        react: "^18.3.1"
      }
    }, null, 2),
  },
  'src/App.tsx': {
    path: 'src/App.tsx',
    content: `import React from 'react';\n\nfunction App() {\n  return <h1>Hello, CodePod!</h1>;\n}\n\nexport default App;`,
  },
  'src/components/Button.tsx': {
    path: 'src/components/Button.tsx',
    content: `import React from 'react';\n\nexport const Button = () => <button>Click me</button>;`,
  },
  'src/components/Card.tsx': {
    path: 'src/components/Card.tsx',
    content: `import React from 'react';\n\nexport const Card = ({ children }) => <div>{children}</div>;`,
  },
  'src/index.css': {
    path: 'src/index.css',
    content: `body { margin: 0; }`,
  },
};
export const mockLabels: Record<string, Label> = {
  'bug': { id: 'label-1', name: 'bug', color: 'bg-red-500' },
  'feature': { id: 'label-2', name: 'feature', color: 'bg-blue-500' },
  'docs': { id: 'label-3', name: 'documentation', color: 'bg-green-500' },
};
export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Fix button alignment on mobile',
    author: mockUsers['grace'],
    status: 'open',
    createdAt: '2024-08-15T11:00:00Z',
    commentsCount: 3,
    labels: [mockLabels['bug']],
    body: 'The main action button is misaligned on screen widths below 480px. It should be centered.'
  },
  {
    id: '2',
    title: 'Implement dark mode',
    author: mockUsers['alan'],
    status: 'in_progress',
    createdAt: '2024-08-14T09:20:00Z',
    commentsCount: 5,
    labels: [mockLabels['feature']],
    body: 'Add a theme toggle to switch between light and dark modes. The theme should be persisted in local storage.'
  },
  {
    id: '3',
    title: 'Update README with setup instructions',
    author: mockUsers['ada'],
    status: 'closed',
    createdAt: '2024-08-12T15:00:00Z',
    commentsCount: 1,
    labels: [mockLabels['docs']],
    body: 'The README.md file is missing instructions on how to set up the project locally.'
  },
];
export const mockComments: Record<string, Comment[]> = {
  '1': [
    { id: 'comment-1-1', author: mockUsers['ada'], createdAt: '2024-08-15T11:05:00Z', body: 'I can take a look at this.' },
    { id: 'comment-1-2', author: mockUsers['grace'], createdAt: '2024-08-15T11:10:00Z', body: 'Thanks @ada! Let me know if you need any help.' },
    { id: 'comment-1-3', author: mockUsers['ada'], createdAt: '2024-08-15T14:00:00Z', body: 'I have a fix ready. Will open a PR shortly.' },
  ],
  '2': [],
};
export const mockPullRequests: PullRequest[] = [
    { id: '1', title: 'feat: Add user authentication', author: mockUsers['grace'], status: 'open', createdAt: '2024-08-15T18:00:00Z', branch: 'feat/auth' },
    { id: '2', title: 'fix: Correct responsive layout issues', author: mockUsers['alan'], status: 'merged', createdAt: '2024-08-14T10:00:00Z', branch: 'fix/responsive' },
];