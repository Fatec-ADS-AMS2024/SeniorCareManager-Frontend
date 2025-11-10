import { SelectInput, TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import { getUserStatusOptions } from '@/types/enums/UserStatus';
import { getUserTypeOptions, UserType } from '@/types/enums/UserType';
import Employee from '@/types/models/Employee';
import User from '@/types/models/User';
import { useEffect, useState } from 'react';

interface UserFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: User) => Promise<void>;
  objectData?: User;
}

export default function UserFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: UserFormModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { data, setData, updateField, reset } = useFormData<User>({
    id: 0,
    email: '',
    password: '',
    userType: 1,
    userStatus: 1,
    employeeId: 0,
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
          name='email'
          label='Email'
          onChange={updateField}
          value={data.email}
          required
        />
      </div>
      <div className='flex flex-col gap-4'>
        {/* Tipo de TextInput alterado para User */}
        <TextInput<User>
          name='password'
          label='Password'
          onChange={updateField}
          value={data.password}
          required
        />
      </div>
      <div className='flex flex-col gap-4'>
        {/* Tipo de TextInput alterado para User */}
        <SelectInput<User>
          name='userType'
          label='UserType'
          onChange={updateField}
          value={data.userType}
          options={getUserTypeOptions()}
          required
        />
      </div>
      <div className='flex flex-col gap-4'>
        {/* Tipo de TextInput alterado para User */}
        <SelectInput<User>
          name='userStatus'
          label='UserStatus'
          onChange={updateField}
          value={data.userStatus}
          options={getUserStatusOptions()}
          required
        />
      </div>
      <div className='flex flex-col gap-4'>
        {/* Tipo de TextInput alterado para User */}
        <SelectInput<User>
          name='employeeId'
          label='Funcionário'
          onChange={updateField}
          value={data.employeeId}
          options={employees.map((employee) => ({
            label: employee.name,
            value: employee.id,
          }))}
          required
        />
      </div>
    </FormModal>
  );
}
