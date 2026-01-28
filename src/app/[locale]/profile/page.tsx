import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProfileForm } from './ProfileForm';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function ProfilePage() {
  const session = await auth();

  // Redirect to home if not logged in
  if (!session?.user) {
    redirect('/');
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <Header />

      <main className="flex-1">
        <div className="container max-w-3xl py-10 px-4 sm:px-6">
          {/* Page Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Avatar Section */}
          <div className="flex items-center gap-4 mb-10">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
              <AvatarFallback className="text-xl font-semibold bg-neutral-100 text-neutral-700">
                {getInitials(session.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-neutral-900 truncate">
                {session.user.name || 'User'}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <ProfileForm
            userId={session.user.id}
            initialName={session.user.name || ''}
            initialEmail={session.user.email || ''}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
