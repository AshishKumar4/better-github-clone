import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getUser, getRepositories } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GitBranch, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
export default function UserProfilePage() {
  const { user: username } = useParams<{ user: string }>();
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username!),
    enabled: !!username,
  });
  // For this mock implementation, we fetch all repos and filter.
  // A real API would have an endpoint like /api/users/:username/repos
  const { data: allRepositories, isLoading: areReposLoading } = useQuery({
    queryKey: ['repositories'],
    queryFn: getRepositories,
  });
  const userRepositories = allRepositories?.filter(
    (repo) => repo.owner.username === username && !repo.isPrivate
  );
  return (
    <div className="container max-w-7xl py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          {isUserLoading ? (
            <UserProfileSkeleton />
          ) : user ? (
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Avatar className="h-48 w-48 mb-4">
                <AvatarImage src={user.avatarUrl} alt={`@${user.username}`} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-xl text-muted-foreground">@{user.username}</p>
            </div>
          ) : (
            <p>User not found.</p>
          )}
        </div>
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Public Repositories</h2>
          <div className="space-y-4">
            {areReposLoading && Array.from({ length: 2 }).map((_, i) => <RepoSkeleton key={i} />)}
            {userRepositories?.map((repo) => (
              <Card key={repo.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/${repo.owner.username}/${repo.name}`} className="text-xl font-bold text-primary hover:underline">
                        {repo.owner.username}/{repo.name}
                      </Link>
                      <CardDescription className="mt-1">{repo.description}</CardDescription>
                    </div>
                    {repo.isPrivate && <Badge variant="outline">Private</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Star className="w-4 h-4" /><span>{repo.stars}</span></div>
                  <div className="flex items-center gap-1"><GitBranch className="w-4 h-4" /><span>{repo.forks}</span></div>
                  <span>Updated {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}</span>
                </CardContent>
              </Card>
            ))}
            {userRepositories?.length === 0 && <p className="text-muted-foreground">No public repositories.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
function UserProfileSkeleton() {
  return (
    <div className="flex flex-col items-center md:items-start">
      <Skeleton className="h-48 w-48 rounded-full mb-4" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-6 w-24" />
    </div>
  );
}
function RepoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}