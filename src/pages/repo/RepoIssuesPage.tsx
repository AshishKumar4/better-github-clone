import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getIssues, createIssue } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, CircleDot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Issue, IssueStatus } from '@/lib/types';
import { NewIssueDialog } from '@/components/NewIssueDialog';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
const statusIcons: Record<IssueStatus, React.ReactNode> = {
  open: <AlertCircle className="h-4 w-4 text-green-500" />,
  closed: <CheckCircle className="h-4 w-4 text-red-500" />,
  in_progress: <CircleDot className="h-4 w-4 text-blue-500" />,
};
export default function RepoIssuesPage() {
  const { user, repo } = useParams<{ user: string; repo: string }>();
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: issues, isLoading } = useQuery({
    queryKey: ['issues', user, repo],
    queryFn: () => getIssues(user!, repo!),
    enabled: !!user && !!repo,
  });
  const mutation = useMutation({
    mutationFn: (newIssue: { title: string; body: string; authorId: string }) => createIssue(user!, repo!, newIssue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', user, repo] });
      toast.success('Issue created successfully!');
      setIsDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to create issue.');
    },
  });
  const handleCreateIssue = (values: { title: string; body: string }) => {
    if (!currentUser) {
      toast.error('You must be logged in to create an issue.');
      return;
    }
    mutation.mutate({ ...values, authorId: currentUser.id });
  };
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Issues</CardTitle>
          <Button onClick={() => setIsDialogOpen(true)}>New Issue</Button>
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
      <NewIssueDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateIssue}
        isSubmitting={mutation.isPending}
      />
    </>
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