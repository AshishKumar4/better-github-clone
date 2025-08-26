import { useQuery } from '@tanstack/react-query';
import { getRepositories } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GitBranch, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
export default function DashboardPage() {
  const { data: repositories, isLoading, isError } = useQuery({
    queryKey: ['repositories'],
    queryFn: getRepositories,
  });
  return (
    <div className="container max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Repositories</h2>
          <div className="space-y-4">
            {isLoading && Array.from({ length: 3 }).map((_, i) => <RepoSkeleton key={i} />)}
            {isError && <p className="text-destructive">Failed to load repositories.</p>}
            {repositories?.map((repo) => (
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
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-4 h-4" />
                    <span>{repo.forks}</span>
                  </div>
                  <span>Updated {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">No recent activity.</p>
            </CardContent>
          </Card>
        </div>
      </div>
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