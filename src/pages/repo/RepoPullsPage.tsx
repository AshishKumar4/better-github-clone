import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getPullRequests } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { GitPullRequest, GitMerge, CircleX } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { PullRequest } from '@/lib/types';
const statusIcons: Record<PullRequest['status'], React.ReactNode> = {
  open: <GitPullRequest className="h-4 w-4 text-green-500" />,
  closed: <CircleX className="h-4 w-4 text-red-500" />,
  merged: <GitMerge className="h-4 w-4 text-purple-500" />,
};
export default function RepoPullsPage() {
  const { user, repo } = useParams<{ user: string; repo: string }>();
  const { data: pullRequests, isLoading } = useQuery({
    queryKey: ['pullRequests', user, repo],
    queryFn: () => getPullRequests(user!, repo!),
    enabled: !!user && !!repo,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pull Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 2 }).map((_, i) => <PullRequestRowSkeleton key={i} />)}
            {pullRequests?.map((pr: PullRequest) => (
              <TableRow key={pr.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {statusIcons[pr.status]}
                    <span className="font-medium">{pr.title}</span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{pr.status}</TableCell>
                <TableCell>{pr.author.username}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
function PullRequestRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
    </TableRow>
  );
}