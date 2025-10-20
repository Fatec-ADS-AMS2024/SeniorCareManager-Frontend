export interface ModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  closeOnBackdropClick?: boolean;
}

export interface FormModalProps extends ModalRootProps {
  onSubmit: () => void;
}
