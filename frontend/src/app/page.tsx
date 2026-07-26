import { redirect } from 'next/navigation';

/**
 * Root route — redirects immediately to the learning path.
 * This keeps /learn as the canonical home page.
 */
export default function RootPage() {
  redirect('/learn');
}
