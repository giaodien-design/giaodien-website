'use client';

import { useState, useTransition } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="space-y-8">
      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full"
            />
            <p className="text-xs text-neutral-500">
              Note: Changing your email will update your login email.
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Save Button */}
        <Button
          type="submit"
          disabled={isPending || !hasChanges}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="border-t border-neutral-200" />

      {/* Logout Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-700">Account Actions</h3>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full sm:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}

