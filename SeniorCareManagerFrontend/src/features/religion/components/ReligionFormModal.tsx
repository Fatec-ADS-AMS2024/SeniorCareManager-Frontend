import { TextInput } from '@/components/FormControls';
import FormModal from '@/components/Modal/FormModal';
import { ModalProps } from '@/components/Modal/types';
import useFormData from '@/hooks/useFormData';
import Religion from '@/types/models/Religion';
import { useEffect } from 'react';

interface ReligionFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: Religion) => Promise<void>;
  objectData?: Religion;
}

export default function ReligionFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: ReligionFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<Religion>({
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

  const title = objectData?.id ? 'Editar Religião' : 'Cadastrar Religião';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<Religion>
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
