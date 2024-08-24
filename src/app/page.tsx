import Link from 'next/link';

import Tasks from '@/app/_components/tasks/main';
import { getServerAuthSession } from '@/server/auth';

export default async function Home() {
  // const hello = await api.post.hello({ text: 'from tRPC' });
  const session = await getServerAuthSession();

  return (
    <div>
      <Link
        href={session ? '/api/auth/signout' : '/api/auth/signin'}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? 'Sign out' : 'Sign in'}
      </Link>
      <Tasks />
    </div>
  );
}
