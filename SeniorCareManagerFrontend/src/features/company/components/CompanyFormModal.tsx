import { TextInput, FileInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import Company from '@/types/models/Company';
import { useEffect } from 'react';

interface HIPFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: Company) => Promise<void>;
  objectData?: Company;
}

export default function CompanyFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: HIPFormModalProps) {
  const { data, setData, updateField, reset } =
    useFormData<Company>({
      id: 0,
      companyName: '',
      tradeName: '',
      cnpj: '',
      email: '',
      street: '',
      number: '',
      district: '',
      addreesComplement: '',
      city: '',
      state: '',
      postaCode: '',
      companyLogo: '',
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

  const title = objectData?.id
    ? 'Editar Empresa'
    : 'Cadastrar Empresa';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<Company>
          name='companyName'
          label='Nome'
          onChange={updateField}
          value={data.companyName}
          required
        />
        <TextInput<Company>
          name='tradeName'
          label='Troca'
          onChange={updateField}
          value={data.tradeName}
          required
        />
        <TextInput<Company>
          name='cnpj'
          label='Cnpj'
          onChange={updateField}
          value={data.cnpj}
          required
        />
        <TextInput<Company>
          name='email'
          label='Email'
          onChange={updateField}
          value={data.email}
          required
        />
        <TextInput<Company>
          name='street'
          label='Street'
          onChange={updateField}
          value={data.street}
          required
        />
         <TextInput<Company>
          name='number'
          label='Numero'
          onChange={updateField}
          value={data.number}
          required
        />
         <TextInput<Company>
          name='district'
          label='Bairro'
          onChange={updateField}
          value={data.district}
          required
        />
        <TextInput<Company>
          name='addreesComplement'
          label='Complemento de endereço'
          onChange={updateField}
          value={data.addreesComplement}
        />
        <TextInput<Company>
          name='city'
          label='Cidade'
          onChange={updateField}
          value={data.city}
          required
        />
        <TextInput<Company>
          name='state'
          label='Estado'
          onChange={updateField}
          value={data.state}
          required
        />
        <TextInput<Company>
          name='postaCode'
          label='Codigo Postal'
          onChange={updateField}
          value={data.postaCode}
          required
        />
        <FileInput<Company>
          name='companyLogo'
          label='Logo da empresa'
          onChange={updateField}
          required
        />
      </div>
    </FormModal>
  );
}
