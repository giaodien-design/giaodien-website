import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ProfileForm } from './ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  // Redirect to home if not logged in
  if (!session?.user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-900 to-neutral-800 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-4">
              {/* Large Avatar */}
              <div className="relative">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-20 w-20 rounded-full border-4 border-white/20 object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-neutral-700 text-2xl font-semibold text-white shadow-lg">
                    {session.user.name
                      ? session.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'U'}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-semibold text-white sm:text-2xl">
                  {session.user.name || 'User'}
                </h1>
                <p className="truncate text-sm text-neutral-300">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <ProfileForm
              userId={session.user.id}
              initialName={session.user.name || ''}
              initialEmail={session.user.email || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

