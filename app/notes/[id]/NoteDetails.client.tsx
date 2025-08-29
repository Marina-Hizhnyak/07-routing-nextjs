'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.client.module.css';

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>(); 

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: typeof id === 'string' && id.length > 0,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  const created = new Date(note.createdAt).toLocaleString();

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{created}</p>
      </div>
    </div>
  );
}

