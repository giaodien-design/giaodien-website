'use client';

import { useState, useTransition } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { updateProfile } from '@/lib/actions';

interface ProfileFormProps {
  userId: string;
  initialName: string;
  initialEmail: string;
}

export function ProfileForm({ userId, initialName, initialEmail }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await updateProfile({ userId, name, email });

        if (result.success) {
          setMessage({ type: 'success', text: 'Profile updated successfully!' });
          router.refresh();
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
        }
      } catch {
        setMessage({ type: 'error', text: 'An unexpected error occurred' });
      }
    });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const hasChanges = name !== initialName || email !== initialEmail;

  return (
    <div className="space-y-10">
      {/* Profile Section */}
      <section>
        <div className="space-y-1 mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="max-w-md"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              Changing your email will update your login credentials.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`max-w-md rounded-lg px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Save Button */}
          <Button type="submit" disabled={isPending || !hasChanges}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </form>
      </section>

      <Separator />

      {/* Danger Zone */}
      <section>
        <div className="space-y-1 mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Irreversible and destructive actions.
          </p>
        </div>

        <div className="flex items-center justify-between max-w-md rounded-lg border border-red-200 bg-red-50/50 p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-neutral-900">Log out of your account</p>
            <p className="text-xs text-muted-foreground">
              You will be redirected to the homepage.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </section>
    </div>
  );
}
