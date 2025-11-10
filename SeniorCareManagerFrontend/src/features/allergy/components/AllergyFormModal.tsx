import { SelectInput, TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import {
  getAllergyTypeOptions,
  AllergyType,
} from '@/types/enums/AllergyType';
import Allergy from '@/types/models/Allergy';
import { useEffect } from 'react';

interface AllergyFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: Allergy) => Promise<void>;
  objectData?: Allergy;
}

export default function AllergyFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: AllergyFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<Allergy>({
    id: 0,
    name: '',
    type: AllergyType.OTHER,
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

  const title = objectData?.id ? 'Editar Alergia' : 'Cadastrar Alergia';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<Allergy>
          name='name'
          label='Nome'
          onChange={updateField}
          value={data.name}
          required
        />
        <SelectInput<Allergy>
          name='type'
          label='Tipo'
          onChange={updateField}
          value={data.type}
          options={getAllergyTypeOptions()}
          required
        />
      </div>
    </FormModal>
  );
}