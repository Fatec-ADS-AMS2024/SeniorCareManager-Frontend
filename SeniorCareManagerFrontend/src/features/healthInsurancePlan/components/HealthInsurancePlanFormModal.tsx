import { SelectInput, TextInput } from '@/components/FormControls';
import FormModal from '@/components/Modal/FormModal';
import { FormModalProps } from '@/components/Modal/types';
import useFormData from '@/hooks/useFormData';
import { getHealthInsurancePlanTypeOptions } from '@/types/enums/HealthInsurancePlanType';
import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';

interface HIPFormModalProps extends Omit<FormModalProps, 'onSubmit'> {
  onSubmit: (data: HealthInsurancePlan) => void;
  initialData?: Partial<HealthInsurancePlan>;
  mode?: 'create' | 'edit';
}

export default function HealthInsurancePlanFormModal({
  onClose,
  onSubmit,
  isOpen,
}: HIPFormModalProps) {
  const { data, updateField } = useFormData<HealthInsurancePlan>(initialData);

  const handleSubmit = async () => {
    // Agora isso funciona corretamente com async/await
    // Ou pode ser uma função síncrona também
    onSubmit(data);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title='Cadastrar Plano de Saúde'
    >
      <div className='flex flex-col gap-4'>
        <TextInput<HealthInsurancePlan>
          name='name'
          label='Nome'
          onChange={updateField}
          value={data.name}
        />
        <TextInput<HealthInsurancePlan>
          name='abbreviation'
          label='Abreviação'
          onChange={updateField}
          value={data.abbreviation}
        />
        <SelectInput<HealthInsurancePlan>
          name='type'
          label='Tipo'
          onChange={updateField}
          value={data.type ? data.type : undefined}
          options={getHealthInsurancePlanTypeOptions()}
        />
      </div>
    </FormModal>
  );
}
