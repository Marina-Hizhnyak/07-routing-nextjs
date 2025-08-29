'use client';

import { useEffect, useMemo, useState } from 'react';
import css from './notes.module.css'; 
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import type { FetchNotesResponse } from '@/lib/api';
import { useDebounce } from 'use-debounce';
import type { NoteTag } from '@/types/note';

type Props = {
  initialSearch: string;
  initialPage: number;
  perPage: number;
  tag?: NoteTag; 
};

export default function NotesClient({ initialSearch, initialPage,  perPage, tag }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(initialSearch ?? '');
  const [currentPage, setCurrentPage] = useState<number>(initialPage ?? 1);
  const [debouncedSearch] = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () =>
      ['notes', { search: debouncedSearch, page: currentPage, perPage, tag: tag ?? null }] as const,
    [debouncedSearch, currentPage, perPage, tag],
  );

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse>({
    queryKey,
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
  });


  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);


  useEffect(() => {
    setCurrentPage(1);
  }, [tag]);


  const handleCreate = () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] });
    setIsModalOpen(false);
  };

  let body: React.ReactNode;
if (isLoading) {
  body = <p>Loading, please wait...</p>;
} else if (isError) {
  body = <p>Could not fetch the list of notes. {(error as Error).message}</p>;
} else if (!data || data.notes.length === 0) {
  body = <p>No notes found</p>;
} else {
  body = <NoteList notes={data.notes} />;
}

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
  
        <SearchBox value={search} onChange={setSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {body}
{/* 
      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Could not fetch the list of notes.</p>}

      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <p>No notes found</p>
      )} */}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} onCreate={handleCreate} />
        </Modal>
      )}
    </div>
  );
}
