import { SelectInput, TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import {
  getHealthInsurancePlanTypeOptions,
  HealthInsurancePlanType,
} from '@/types/enums/HealthInsurancePlanType';
import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import { useEffect } from 'react';

interface HIPFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: HealthInsurancePlan) => Promise<void>;
  objectData?: HealthInsurancePlan;
}

export default function HealthInsurancePlanFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: HIPFormModalProps) {
  const { data, setData, updateField, reset } =
    useFormData<HealthInsurancePlan>({
      id: 0,
      name: '',
      abbreviation: '',
      type: HealthInsurancePlanType.PUBLIC,
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
    ? 'Editar Plano de Saúde'
    : 'Cadastrar Plano de Saúde';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<HealthInsurancePlan>
          name='name'
          label='Nome'
          onChange={updateField}
          value={data.name}
          required
        />
        <TextInput<HealthInsurancePlan>
          name='abbreviation'
          label='Abreviação'
          onChange={updateField}
          value={data.abbreviation}
          required
        />
        <SelectInput<HealthInsurancePlan>
          name='type'
          label='Tipo'
          onChange={updateField}
          value={data.type}
          options={getHealthInsurancePlanTypeOptions()}
          required
        />
      </div>
    </FormModal>
  );
}
