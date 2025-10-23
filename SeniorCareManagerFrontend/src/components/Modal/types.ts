export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
}

export interface FormModalProps extends ModalProps {
  onSubmit: () => void;
}
