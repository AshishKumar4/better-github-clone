import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { getFileTree, getFileContent } from '@/lib/api';
import { FileNode } from '@/lib/types';
import { File, Folder, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
export default function RepoCodePage() {
  const { user, repo } = useParams<{ user: string; repo: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activePath = searchParams.get('path') || 'README.md';
  const { data: fileTree, isLoading: isTreeLoading } = useQuery({
    queryKey: ['fileTree', user, repo],
    queryFn: () => getFileTree(user!, repo!),
    enabled: !!user && !!repo,
  });
  const { data: fileContent, isLoading: isContentLoading } = useQuery({
    queryKey: ['fileContent', user, repo, activePath],
    queryFn: () => getFileContent(user!, repo!, activePath),
    enabled: !!user && !!repo && !!activePath,
  });
  const handleFileClick = (path: string) => {
    setSearchParams({ path });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Files</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="p-2">
                {isTreeLoading ? (
                  <FileTreeSkeleton />
                ) : (
                  fileTree && <FileTreeView nodes={fileTree} onFileClick={handleFileClick} activePath={activePath} />
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{activePath}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 bg-muted rounded-md p-4">
              {isContentLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <pre className="text-sm whitespace-pre-wrap">{fileContent?.content}</pre>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function FileTreeView({ nodes, onFileClick, activePath }: { nodes: FileNode[], onFileClick: (path: string) => void, activePath: string }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src']));
  const toggleNode = (path: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };
  const renderNode = (node: FileNode, level: number) => {
    const isExpanded = expanded.has(node.path);
    return (
      <div key={node.path}>
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-accent",
            activePath === node.path && "bg-accent"
          )}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={() => (node.type === 'dir' ? toggleNode(node.path) : onFileClick(node.path))}
        >
          {node.type === 'dir' && <ChevronRight className={cn("h-4 w-4 mr-1 transition-transform", isExpanded && "rotate-90")} />}
          {node.type === 'dir' ? <Folder className="h-4 w-4 mr-2 text-blue-500" /> : <File className="h-4 w-4 mr-2" />}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'dir' && isExpanded && node.children?.map(child => renderNode(child, level + 1))}
      </div>
    );
  };
  return <div>{nodes.map(node => renderNode(node, 0))}</div>;
}
function FileTreeSkeleton() {
  return (
    <div className="space-y-2 p-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
}