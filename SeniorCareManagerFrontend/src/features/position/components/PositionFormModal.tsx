import { TextInput } from '@/components/FormControls';
import FormModal from '@/components/Modal/FormModal';
import { ModalProps } from '@/components/Modal/types';
import useFormData from '@/hooks/useFormData';
import Position from '@/types/models/Position';
import { useEffect } from 'react';

interface PositionFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: Position) => Promise<void>;
  objectData?: Position;
}

export default function PositionFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: PositionFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<Position>({
    id: 0,
    name: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    if (objectData) {
      setData(objectData);
    } else {
      reset();
    }
  }, [isOpen, objectData, setData, reset]);

  const handleSubmit = async () => {
    await onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const title = objectData?.id ? 'Editar Cargo' : 'Cadastrar Cargo';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<Position>
          name='name'
          label='Nome'
          onChange={updateField}
          value={data.name}
          required
        />
      </div>
    </FormModal>
  );
}
