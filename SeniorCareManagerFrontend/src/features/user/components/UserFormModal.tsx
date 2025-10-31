import { TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import { UserType } from '@/types/enums/UserType';
import User from '@/types/models/User'; // Tipo alterado
import { useEffect } from 'react';

// Interface do componente alterada para User
interface UserFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: User) => Promise<void>;
  objectData?: User;
}

// Nome da função e componente alterados
export default function UserFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: UserFormModalProps) {
  // Uso do tipo User para o hook de dados
  const { data, setData, updateField, reset } = useFormData<User>({
    id: 0,
    email: '',
    password: '',
    userType: 1,
    userStatus: 2
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

  // Título alterado para refletir 'Usuário'
  const title = objectData?.id ? 'Editar Usuário' : 'Cadastrar Usuário';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        {/* Tipo de TextInput alterado para User */}
        <TextInput<User>
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
