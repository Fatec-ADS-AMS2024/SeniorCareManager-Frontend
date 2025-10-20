import { FormModalProps } from '@/components/Modal/types';
import FormModal from '@/components/Modal/FormModal';
import { SelectInput, TextInput } from '@/components/FormControls';
import useFormData from '@/hooks/useFormData';
import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import { getHealthInsurancePlanTypeOptions } from '@/types/enums/HealthInsurancePlanType';

interface HIPFormModalProps extends FormModalProps {
  onSubmit: () => void;
  initialData?: Partial<HealthInsurancePlan>;
  // TODO Tipo do form (create, edit)
  // TODO Atualizar tipo do onSubmit
}

export default function HealthInsurancePlanFormModal({
  onClose,
  onSubmit,
  isOpen,
  initialData,
}: HIPFormModalProps) {
  const { data, updateField } = useFormData<HealthInsurancePlan>({
    id: 0,
    name: '',
    abbreviation: '',
    type: 0,
    ...initialData,
  });

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title='Cadastrar Plano de Saúde'
    >
      <div className='flex flex-col gap-2'>
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
