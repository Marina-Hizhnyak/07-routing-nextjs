'use client';
import { use } from 'react';  
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';

export default function NoteModalIntercepted(
  { params }: { params: Promise<{ id: string }> } 
) {
  const router = useRouter();
  const { id } = use(params);            

  const safeClose = () => {
    if (typeof window !== 'undefined' && window.history.length <= 1) {
      router.push('/notes/filter/All');
    } else {
      router.back();
    }
  };

  return (
    <Modal onClose={safeClose}>
      <NotePreview id={id} />
    </Modal>
  );
}
