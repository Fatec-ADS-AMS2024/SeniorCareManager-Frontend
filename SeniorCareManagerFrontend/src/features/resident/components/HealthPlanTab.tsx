import { useState } from 'react';
import SelectInput from '@/components/FormControls/SelectInput';
import TextInput from '@/components/FormControls/TextInput';
import { FormModal } from '@/components/Modal';
import {
  getHealthPlanTypeOptions,
  HealthPlanType,
} from '@/types/enums/HealthPlanType';
import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import HealthInsurancePlanService from '@/features/healthInsurancePlan/services/healthInsurancePlanService';

interface HealthPlanFormData {
  plano: string;
  numeroCarteirinha: string;
}

interface HealthPlanTabProps {
  formData: HealthPlanFormData;
  healthPlans: HealthInsurancePlan[];
  onUpdate: (field: string, value: string) => void;
  onHealthPlansReload: (plans: HealthInsurancePlan[]) => void;
  onSelectPlan: (planId: string) => void;
}

export default function HealthPlanTab(props: HealthPlanTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    tipo: '',
    nomePlano: '',
    abreviacao: '',
  });

  const handleOpenModal = () => {
    setModalData({ tipo: '', nomePlano: '', abreviacao: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({ tipo: '', nomePlano: '', abreviacao: '' });
  };

  const handleSubmitModal = async () => {
    if (
      !modalData.tipo ||
      !modalData.nomePlano.trim() ||
      !modalData.abreviacao.trim()
    ) {
      alert('⚠️ Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const newPlan = {
        id: 0,
        name: modalData.nomePlano.trim(),
        type: parseInt(modalData.tipo) as HealthPlanType,
        abbreviation: modalData.abreviacao.trim(),
      };

      const result = await HealthInsurancePlanService.create(newPlan);
      if (result.success && result.data) {
        const plansRes = await HealthInsurancePlanService.getAll();
        if (plansRes.success && plansRes.data) {
          props.onHealthPlansReload(plansRes.data);
          props.onSelectPlan(result.data.id.toString());
        }
        alert('✅ Plano de saúde cadastrado com sucesso!');
        handleCloseModal();
      } else {
        alert(`❌ Erro: ${result.message}`);
      }
    } catch (error) {
      alert('❌ Erro ao criar plano de saúde. Tente novamente.');
      console.log(error);
    }
  };

  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>
        <SelectInput
          label='Plano de Saúde:'
          name='plano'
          value={props.formData.plano}
          options={[
            { label: 'Nenhum', value: '' },
            ...props.healthPlans.map((p) => ({
              label: p.name,
              value: p.id.toString(),
            })),
          ]}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
        <TextInput
          label='Número da Carteirinha:'
          name='numeroCarteirinha'
          value={props.formData.numeroCarteirinha}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
      </div>
      <div className='flex justify-end mt-6'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            handleOpenModal();
          }}
          className='text-textSecondary underline hover:text-secondary text-sm font-medium mt-2'
        >
          Plano de saúde não encontrado
        </a>
        <FormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
          title='Cadastrar novo plano de saúde'
        >
          <div className='flex flex-col gap-4'>
            <SelectInput
              label='Tipo:'
              name='tipo'
              value={modalData.tipo}
              options={getHealthPlanTypeOptions()}
              onChange={(key, value) =>
                setModalData({
                  ...modalData,
                  [key as string]: value,
                })
              }
              required
            />
            <TextInput
              label='Nome do plano:'
              name='nomePlano'
              value={modalData.nomePlano}
              onChange={(key, value) =>
                setModalData({
                  ...modalData,
                  [key as string]: value,
                })
              }
              required
            />
            <TextInput
              label='Abreviação:'
              name='abreviacao'
              value={modalData.abreviacao}
              onChange={(key, value) =>
                setModalData({
                  ...modalData,
                  [key as string]: value,
                })
              }
              required
            />
          </div>
        </FormModal>
      </div>
      <hr className='w-full border-t border-textPrimary mt-4 mb-8' />
    </div>
  );
}
