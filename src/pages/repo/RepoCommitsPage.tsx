import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getCommits } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Commit } from '@/lib/types';
export default function RepoCommitsPage() {
  const { user, repo } = useParams<{ user: string; repo: string }>();
  const { data: commits, isLoading } = useQuery({
    queryKey: ['commits', user, repo],
    queryFn: () => getCommits(user!, repo!),
    enabled: !!user && !!repo,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <CommitSkeleton key={i} />)}
          {commits?.map((commit: Commit) => (
            <div key={commit.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">{commit.message}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={commit.author.avatarUrl} />
                    <AvatarFallback>{commit.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{commit.author.username}</span>
                  <span>committed {formatDistanceToNow(new Date(commit.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="text-sm font-mono text-muted-foreground">
                {commit.id.slice(0, 7)}
              </div>
            </div>
          ))}
          {commits?.length === 0 && <p className="text-muted-foreground">No commits yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
function CommitSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="space-y-2">
        <Skeleton className="h-5 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  );
}