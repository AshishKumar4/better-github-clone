import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getIssue, getIssueComments } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
export default function IssueDetailPage() {
  const { user, repo, issueId } = useParams<{ user: string; repo: string; issueId: string }>();
  const { data: issue, isLoading: isIssueLoading } = useQuery({
    queryKey: ['issue', user, repo, issueId],
    queryFn: () => getIssue(user!, repo!, issueId!),
    enabled: !!user && !!repo && !!issueId,
  });
  const { data: comments, isLoading: areCommentsLoading } = useQuery({
    queryKey: ['issueComments', user, repo, issueId],
    queryFn: () => getIssueComments(user!, repo!, issueId!),
    enabled: !!user && !!repo && !!issueId,
  });
  return (
    <div className="container max-w-5xl py-8">
      {isIssueLoading ? (
        <IssueHeaderSkeleton />
      ) : (
        issue && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{issue.title} <span className="text-3xl font-normal text-muted-foreground">#{issue.id}</span></h1>
            <p className="text-sm text-muted-foreground mt-2">
              Opened {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })} by {issue.author.username}
            </p>
          </div>
        )
      )}
      <div className="space-y-6">
        {isIssueLoading ? (
          <CommentSkeleton />
        ) : (
          issue && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
                <Avatar>
                  <AvatarImage src={issue.author.avatarUrl} />
                  <AvatarFallback>{issue.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold">{issue.author.username}</span>
                  <span className="text-sm text-muted-foreground"> commented {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p>{issue.body}</p>
              </CardContent>
            </Card>
          )
        )}
        {areCommentsLoading && Array.from({ length: 2 }).map((_, i) => <CommentSkeleton key={i} />)}
        {comments?.map(comment => (
          <Card key={comment.id}>
            <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
              <Avatar>
                <AvatarImage src={comment.author.avatarUrl} />
                <AvatarFallback>{comment.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold">{comment.author.username}</span>
                <span className="text-sm text-muted-foreground"> commented {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p>{comment.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
function IssueHeaderSkeleton() {
  return (
    <div className="mb-6">
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-5 w-1/4 mt-3" />
    </div>
  );
}
function CommentSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 bg-muted/50 p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}