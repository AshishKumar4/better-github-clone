import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const handleLogin = (userKey: string) => {
    const user = mockUsers[userKey];
    if (user) {
      login(user);
      navigate('/');
    }
  };
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Log in to CodePod</CardTitle>
          <CardDescription>Select a mock user to continue.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.keys(mockUsers).map((key) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={mockUsers[key].avatarUrl} alt={`@${mockUsers[key].username}`} />
                  <AvatarFallback>{mockUsers[key].name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{mockUsers[key].name}</p>
                  <p className="text-sm text-muted-foreground">@{mockUsers[key].username}</p>
                </div>
              </div>
              <Button onClick={() => handleLogin(key)}>Log in</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}