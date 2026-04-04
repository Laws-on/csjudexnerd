import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface StageAuthProps {
  onNext: () => void;
}

const validatePassword = (pw: string): string | null => {
  if (pw.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(pw)) return 'Password must include an uppercase letter';
  if (!/[a-z]/.test(pw)) return 'Password must include a lowercase letter';
  if (!/[0-9]/.test(pw)) return 'Password must include a number';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must include a special character (!@#$%...)';
  return null;
};

const StageAuth: React.FC<StageAuthProps> = ({ onNext }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      const pwError = validatePassword(password);
      if (pwError) {
        setPasswordError(pwError);
        return;
      }
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
      } else {
        navigate('/dashboard');
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email and click the verification link to activate your account.',
        });
      }
    }
    setLoading(false);
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl">{isLogin ? 'Welcome Back' : 'Create Your Account'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Sign in to continue your registration'
            : 'Enter your email and password to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 chars, upper, lower, number, special"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
                className="pl-10 pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && !isLogin && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default StageAuth;
