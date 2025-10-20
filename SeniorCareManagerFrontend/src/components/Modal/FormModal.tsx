import { FormModalProps } from './types';
import * as Modal from './BaseModal';
import { FormEvent, useState } from 'react';
import Button from '../Button';
import { Plus, X } from '@phosphor-icons/react';

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(() => onSubmit());
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal.ModalRoot isOpen={isOpen} onClose={onClose} closeOnBackdropClick={false}>
      <form onSubmit={handleSubmit}>
        <Modal.ModalHeader
          onClose={onClose}
          showCloseButton={false}
          title={title}
        />
        <Modal.ModalContent>{children}</Modal.ModalContent>
        <Modal.ModalFooter>
          <Button
            type='button'
            onClick={onClose}
            label='Cancelar'
            color='danger'
            icon={<X weight='bold' />}
            disabled={isSubmitting}
          />
          <Button
            type='submit'
            label={isSubmitting ? 'Salvando...' : 'Salvar'}
            color='success'
            icon={<Plus weight='bold' />}
            disabled={isSubmitting}
          />
        </Modal.ModalFooter>
      </form>
    </Modal.ModalRoot>
  );
}
