import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { TAGS, type NoteTag } from '@/types/note';

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseTag(slug?: string[]): NoteTag | undefined {
  const raw = slug?.[0];
  if (!raw || raw === 'All') return undefined; 
  const t = decodeURIComponent(raw) as NoteTag;
  if (TAGS.includes(t)) return t;
  notFound(); 
}

const toStr = (v: string | string[] | undefined, d = '') =>
  Array.isArray(v) ? v[0] ?? d : v ?? d;

const toNum = (v: string | string[] | undefined, d: number) => {
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : d;
};

export default async function FilteredNotesPage({ params, searchParams }: Props) {
 
  const { slug } = await params;
  const sp = await searchParams;

  const tag = parseTag(slug);
  const search = toStr(sp.search, '');
  const page = toNum(sp.page, 1);
  const perPage = toNum(sp.perPage, 12);

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['notes', { search, page, perPage, tag: tag ?? null }],
    queryFn: () => fetchNotes({ page, perPage, search, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient
        initialSearch={search}
        initialPage={page}
        perPage={perPage}
        tag={tag}
      />
    </HydrationBoundary>
  );
}
