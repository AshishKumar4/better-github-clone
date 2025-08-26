import { Link, useNavigate } from 'react-router-dom';
import { GitBranch, Search, Bell, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
export function Header() {
  const { currentUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <GitBranch className="h-6 w-6 text-primary" />
            <span className="font-bold">CodePod</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Pull Requests
            </Link>
            <Link to="#" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Issues
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]" />
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={currentUser.avatarUrl} alt={`@${currentUser.username}`} />
                  <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Signed in as <strong>{currentUser.username}</strong></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to={`/${currentUser.username}`}>Your profile</Link></DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}