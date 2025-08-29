'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NotePreview.module.css';

export default function NotePreview({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p className={css.status}>Loading...</p>;
  if (isError)   return <p className={css.status}>Error: {(error as Error).message}</p>;
  if (!data)     return null;

  return (
    <div className={css.wrapper}>
      <h2 className={css.title}>{data.title}</h2>
      <p className={css.tag}>{data.tag}</p>
      <div className={css.body}>{data.content}</div>
    </div>
  );
}