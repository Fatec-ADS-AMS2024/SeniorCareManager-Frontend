import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';

// Definindo os tipos das props
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
}: BaseModalProps) => {
  // Efeito para lidar com a tecla "Esc" para fechar a modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      // Overlay
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div
        // Container da Modal
        className='relative bg-white transition-all rounded-[10px] shadow-lg w-full max-w-xl px-4 py-6 bg-neutralWhite'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className='flex items-center px-2 pb-1'>
          <h3 className='text-xl font-semibold text-textPrimary'>{title}</h3>
          {showCloseButton && (
            <button
              type='button'
              className='ml-auto h-6 w-6 flex items-center justify-center bg-transparent text-textSecondary'
              onClick={onClose}
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Separador */}
        <hr className='border-t border-neutralDark w-full mx-auto' />

        {/* Corpo do Modal */}
        <div className='px-3 py-4 text-textSecondary'>{children}</div>

        {/* Separador */}
        <hr className='border-t border-neutralDark w-full mx-auto' />

        {/* Rodapé do Modal */}
        <div className='flex justify-end gap-7 px-2 pt-4'></div>
      </div>
    </div>,
    document.body
  );
};
