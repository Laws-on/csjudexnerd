import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Shield, Zap } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'var(--hero-gradient)' }}
        />
        <nav className="container relative flex items-center justify-between py-5">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">Nerd Assistance</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/register')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </nav>

        <div className="container relative py-20 md:py-32 text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Your Academic Project,{' '}
            <span className="text-primary">Handled Right</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Streamline your student enrollment and project submission with our all-in-one platform. Fast, secure, and hassle-free.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/register')}>
              Start Registration
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-card">
        <div className="container max-w-5xl">
          <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Nerd Assistance?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Easy Enrollment',
                desc: 'Step-by-step guided registration process that captures all your academic details.',
              },
              {
                icon: Shield,
                title: 'Secure Documents',
                desc: 'Your files and personal information are encrypted and securely stored.',
              },
              {
                icon: Zap,
                title: 'Fast Processing',
                desc: 'Quick turnaround on project uploads and enrollment verification.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-background p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nerd Assistance. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
