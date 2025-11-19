import * as Modal from './BaseModal';
import { ModalProps } from './types';
import { Info, CheckCircle, XCircle } from '@phosphor-icons/react';
import Button from '../Button';

interface AlertModalProps extends Omit<ModalProps, 'children'> {
  type?: 'info' | 'success' | 'error';
  message: string;
}

// Objeto para mapear tipos a classes do Tailwind e ícones (SVG)
const icons = {
  info: {
    color: 'text-secondary',
    icon: <Info weight='regular' />,
  },
  success: {
    color: 'text-success',
    icon: <CheckCircle weight='regular' style={{ color: '#009F55' }} />,
  },
  error: {
    color: 'text-danger',
    icon: <XCircle weight='regular' />,
  },
};

export default function AlertModal({
  isOpen,
  onClose,
  message,
  type = 'info',
  ...props
}: AlertModalProps) {
  const styles = icons[type];

  return (
    <Modal.ModalRoot isOpen={isOpen} onClose={onClose} {...props}>
      <Modal.ModalContent>
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className={`${styles.color} flex items-center justify-center`} style={{ fontSize: '64px' }}>
            {styles.icon}
          </div>
          <p className='text-textSecondary text-xl font-semibold text-center'>
            {message}
          </p>
        </div>
      </Modal.ModalContent>
      <Modal.ModalFooter>
        <Button
          label='OK'
          onClick={onClose}
          color={type === 'error' ? 'danger' : type === 'success' ? 'success' : 'secondary'}
          className='font-semibold'
          size='medium'
        />
      </Modal.ModalFooter>
    </Modal.ModalRoot>
  );
}
