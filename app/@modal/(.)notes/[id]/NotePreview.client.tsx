'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api';
import css from './NotePreview.client.module.css';

export default function NotePreviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: 'always',
  });

  const close = () => {

    if (typeof window !== 'undefined' && window.history.length <= 1) {
      router.push('/notes/filter/All');
    } else {
      router.back();
    }
  };

  return (
    <Modal onClose={close}>
      {isLoading && <p className={css.status}>Loading...</p>}
      {isError && <p className={css.status}>Error: {(error as Error).message}</p>}
      {data && (
        <div className={css.wrapper}>
          <button type="button" className={css.backBtn} onClick={close} aria-label="Close">
            ×
          </button>

          <h2 className={css.title}>{data.title}</h2>
          <p className={css.tag}>{data.tag}</p>
          <div className={css.body}>{data.content}</div>
        </div>
      )}
    </Modal>
  );
}
