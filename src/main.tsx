import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RootLayout } from '@/components/layout/RootLayout'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
// Import pages
import DashboardPage from './pages/DashboardPage';
import RepoLayout from './pages/repo/RepoLayout';
import RepoCodePage from './pages/repo/RepoCodePage';
import RepoIssuesPage from './pages/repo/RepoIssuesPage';
import RepoPullsPage from './pages/repo/RepoPullsPage';
import IssueDetailPage from './pages/repo/IssueDetailPage';
import RepoCommitsPage from './pages/repo/RepoCommitsPage';
import NotFoundPage from './pages/NotFoundPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/:user/:repo",
        element: <RepoLayout />,
        children: [
          {
            index: true,
            element: <RepoCodePage />,
          },
          {
            path: "issues",
            element: <RepoIssuesPage />,
          },
          {
            path: "issues/:issueId",
            element: <IssueDetailPage />,
          },
          {
            path: "pulls",
            element: <RepoPullsPage />,
          },
          {
            path: "commits",
            element: <RepoCommitsPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ]
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)