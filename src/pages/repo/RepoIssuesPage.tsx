import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getIssues } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, CircleDot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Issue, IssueStatus } from '@/lib/types';
const statusIcons: Record<IssueStatus, React.ReactNode> = {
  open: <AlertCircle className="h-4 w-4 text-green-500" />,
  closed: <CheckCircle className="h-4 w-4 text-red-500" />,
  in_progress: <CircleDot className="h-4 w-4 text-blue-500" />,
};
export default function RepoIssuesPage() {
  const { user, repo } = useParams<{ user: string; repo: string }>();
  const { data: issues, isLoading } = useQuery({
    queryKey: ['issues', user, repo],
    queryFn: () => getIssues(user!, repo!),
    enabled: !!user && !!repo,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues</CardTitle>
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
            {isLoading && Array.from({ length: 3 }).map((_, i) => <IssueRowSkeleton key={i} />)}
            {issues?.map((issue: Issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {statusIcons[issue.status]}
                    <Link to={`/${user}/${repo}/issues/${issue.id}`} className="font-medium hover:underline">
                      {issue.title}
                    </Link>
                    {issue.labels.map(label => (
                      <Badge
                        key={label.id}
                        variant="outline"
                        className="border-none text-white"
                        style={{ backgroundColor: label.color.startsWith('bg-') ? label.color.split('-')[1] : label.color }}
                      >
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{issue.status.replace('_', ' ')}</TableCell>
                <TableCell>{issue.author.username}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
function IssueRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
    </TableRow>
  );
}