import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

type Params = { params: Promise<{ id: string }> };

export default async function NoteDetailsPage({ params }: Params) {
  const { id } = await params;

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Invalid note id');
  }

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

