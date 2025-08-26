import { useQuery } from '@tanstack/react-query';
import { getRepository } from '@/lib/api';
import { useParams, Outlet, NavLink, useLocation } from 'react-router-dom';
import { GitBranch, Star, Code, AlertCircle, GitPullRequest, History } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
const navItems = [
  { name: 'Code', href: '', icon: Code, value: 'code' },
  { name: 'Issues', href: '/issues', icon: AlertCircle, value: 'issues' },
  { name: 'Pull Requests', href: '/pulls', icon: GitPullRequest, value: 'pulls' },
  { name: 'Commits', href: '/commits', icon: History, value: 'commits' },
];
export default function RepoLayout() {
  const { user, repo } = useParams<{ user: string; repo: string }>();
  const location = useLocation();
  const { data: repository, isLoading } = useQuery({
    queryKey: ['repository', user, repo],
    queryFn: () => getRepository(user!, repo!),
    enabled: !!user && !!repo,
  });
  const basePath = `/${user}/${repo}`;
  const activeTab = navItems.find(item => location.pathname.startsWith(basePath + item.href) && (item.href !== '' || location.pathname === basePath))?.value || 'code';
  return (
    <div>
      <div className="border-b">
        <div className="container max-w-7xl py-6">
          {isLoading ? (
            <RepoHeaderSkeleton />
          ) : (
            repository && (
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-primary">
                  <NavLink to={`/${user}`} className="hover:underline">{user}</NavLink> / <NavLink to={basePath} className="hover:underline">{repo}</NavLink>
                </h1>
                <p className="text-muted-foreground">{repository.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{repository.stars} stars</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-4 h-4" />
                    <span>{repository.forks} forks</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="border-b">
        <div className="container max-w-7xl">
          <Tabs value={activeTab} className="relative">
            <TabsList>
              {navItems.map(item => (
                <TabsTrigger value={item.value} key={item.name} asChild>
                  <NavLink to={`${basePath}${item.href}`} end={item.href === ''} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div className="container max-w-7xl py-8">
        <Outlet />
      </div>
    </div>
  );
}
function RepoHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-5 w-2/3" />
      <div className="flex items-center gap-4 mt-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}