import { useEffect, useState } from 'react';
import { HealthInsurancePlanService } from '@/features/healthInsurancePlan';
import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import {
  getHealthInsurancePlanTypeLabel,
  getHealthInsurancePlanTypeOptions,
} from '@/types/enums/HealthInsurancePlanType';
import Table from '@/components/Table';
import {
  CheckCircle,
  Pencil,
  Plus,
  Trash,
  XCircle,
} from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import Modal from '@/components/GenericModal';

const inputs: {
  label: string;
  attribute: keyof HealthInsurancePlan;
  defaultValue: string;
  options?: { label: string; value: number }[];
}[] = [
  {
    label: 'Tipo',
    attribute: 'type',
    defaultValue: '',
    options: getHealthInsurancePlanTypeOptions(),
  },
  {
    label: 'Nome do plano de saúde',
    attribute: 'name',
    defaultValue: '',
  },
  {
    label: 'Abreviação',
    attribute: 'abbreviation',
    defaultValue: '',
  },
];

export default function HealthInsurancePlanRegistration() {
  const columns = ['Nome', 'Tipo', 'Abreviação'];
  const [data, setData] = useState<HealthInsurancePlan[]>([]);
  const [originalData, setOriginalData] = useState<HealthInsurancePlan[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [infoIcon, setInfoIcon] = useState<JSX.Element | undefined>(undefined);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchData = async () => {
    const healthInsurancePlanService = new HealthInsurancePlanService();
    const res = await healthInsurancePlanService.getAll();
    if (res.code === 200 && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]);
    } else {
      console.error('Erro ao buscar dados:', res.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData);
      return;
    }
    const filteredData = originalData.filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getHealthInsurancePlanTypeLabel(plan.type)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const getRowValues = (id: number) => data.find((row) => row.id === id);

  const openCloseModalRegister = () => {
    setCurrentId(null);
    inputs.forEach((input) => (input.defaultValue = ''));
    setModalRegister(true);
  };

  const openCloseModalEdit = (id?: number) => {
    if (!id) {
      setModalEdit(false);
      setCurrentId(null);
      return;
    }
    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = String(
          rowValues[input.attribute as keyof HealthInsurancePlan]
        );
      });
      setCurrentId(id);
      setModalEdit(true);
    } else {
      showInfoModal('Registro não encontrado', 'error');
    }
  };

  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete(false);
      setCurrentId(null);
      return;
    }
    setCurrentId(id);
    setModalDelete(true);
  };

  const openCloseModalInfo = () => setModalInfo(false);

  const showInfoModal = (message: string, type: 'success' | 'error') => {
    setInfoMessage(message);
    setInfoIcon(
      type === 'success' ? (
        <CheckCircle size={90} className='text-success' weight='fill' />
      ) : (
        <XCircle size={90} className='text-danger' weight='fill' />
      )
    );
    setModalInfo(true);
  };

  const validateHealthInsurancePlan = (
    model: HealthInsurancePlan,
    idToIgnore?: number
  ): string | null => {
    const name = model.name?.trim() || '';
    const abbreviation = model.abbreviation?.trim() || '';

    if (!name || name.length < 2 || name.length > 100)
      return 'Nome deve ter entre 2 e 100 caracteres.';
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name))
      return 'Nome deve conter apenas letras e espaços.';
    if (
      originalData.some(
        (p) =>
          p.id !== idToIgnore && p.name.toLowerCase() === name.toLowerCase()
      )
    )
      return 'Já existe um Plano de Saúde com esse nome.';
    if (model.type === null || model.type === undefined)
      return 'Tipo é obrigatório.';
    if (!abbreviation || abbreviation.length === 0 || abbreviation.length > 5)
      return 'Abreviação é obrigatória e deve ter no máximo 5 caracteres.';
    if (
      originalData.some(
        (p) =>
          p.id !== idToIgnore &&
          p.abbreviation.toLowerCase() === abbreviation.toLowerCase()
      )
    )
      return 'Já existe um Plano de Saúde com essa abreviação.';

    return null;
  };

  const handleSave = (model: HealthInsurancePlan) => {
    if (currentId !== null) {
      editHealthInsurancePlan(currentId, model);
    } else {
      registerHealthInsurancePlan(model);
    }
  };

  const registerHealthInsurancePlan = async (model: HealthInsurancePlan) => {
    const healthInsurancePlanService = new HealthInsurancePlanService();
    const errorMessage = validateHealthInsurancePlan(model);

    if (errorMessage) {
      showInfoModal(errorMessage, 'error');
      return;
    }

    const payload = { ...model, type: Number(model.type) };
    const res = await healthInsurancePlanService.create(payload);

    if (res.code >= 200 && res.code < 300) {
      setModalRegister(false);
      await fetchData();
      showInfoModal(
        `Plano de Saúde "${res.data?.name}" criado com sucesso!`,
        'success'
      );
    } else {
      showInfoModal(
        res.message || 'Erro inesperado ao criar o Plano de Saúde.',
        'error'
      );
    }
  };

  const editHealthInsurancePlan = async (
    id: number,
    model: HealthInsurancePlan
  ) => {
    const healthInsurancePlanService = new HealthInsurancePlanService();
    const errorMessage = validateHealthInsurancePlan(model, id);

    if (errorMessage) {
      showInfoModal(errorMessage, 'error');
      return;
    }

    const payload = { ...model, id, type: Number(model.type) };
    const res = await healthInsurancePlanService.update(id, payload);

    if (res.code >= 200 && res.code < 300) {
      setModalEdit(false);
      await fetchData();
      showInfoModal(
        `Plano de Saúde "${res.data?.name}" atualizado com sucesso!`,
        'success'
      );
    } else {
      showInfoModal(
        res.message || 'Erro inesperado ao atualizar o Plano de Saúde.',
        'error'
      );
    }
  };

  const deleteHealthInsurancePlan = async (id: number) => {
    const healthInsurancePlanService = new HealthInsurancePlanService();
    try {
      const res = await healthInsurancePlanService.delete(id);
      if (res.code >= 200 && res.code < 300) {
        setModalDelete(false);
        setCurrentId(null);
        const itemName = data.find((item) => item.id === id)?.name || '';
        await fetchData();
        showInfoModal(
          `Plano de Saúde "${itemName}" excluído com sucesso!`,
          'success'
        );
      } else {
        showInfoModal(
          res.message || 'Erro inesperado ao excluir o Plano de Saúde.',
          'error'
        );
      }
    } catch {
      showInfoModal('Erro inesperado ao excluir o Plano de Saúde.', 'error');
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openCloseModalEdit(id)}
        className='text-edit hover:text-hoverEdit'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        onClick={() => openCloseModalDelete(id)}
        className='text-danger hover:text-hoverDanger'
      >
        <Trash className='size-6' weight='fill' />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title='Cadastro de Plano de Saúde' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <Modal<HealthInsurancePlan>
          title='Cadastrar Plano de Saúde'
          inputs={inputs}
          action={handleSave}
          statusModal={modalRegister}
          closeModal={() => setModalRegister(false)}
          type='create'
        />
        <Modal<HealthInsurancePlan>
          type='update'
          title='Editar Plano de Saúde'
          inputs={inputs}
          action={handleSave}
          statusModal={modalEdit}
          closeModal={() => openCloseModalEdit()}
        />
        <Modal<HealthInsurancePlan>
          type='delete'
          title='Deseja realmente excluir esse Plano de Saúde?'
          msgInformation='Ao excluir este Plano de Saúde, ele será removido permanentemente do sistema.'
          action={() => {
            if (currentId !== null) deleteHealthInsurancePlan(currentId);
          }}
          statusModal={modalDelete}
          closeModal={() => openCloseModalDelete()}
          inputs={inputs}
        />
        <Modal<HealthInsurancePlan>
          type='info'
          msgInformation={infoMessage}
          icon={infoIcon}
          statusModal={modalInfo}
          closeModal={openCloseModalInfo}
        />
        <div className='flex items-center justify-between mb-4'>
          <SearchBar
            action={handleSearch}
            placeholder='Buscar plano de saúde...'
          />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCloseModalRegister}
          />
        </div>
        <Table
          columns={columns}
          data={data.map((plan) => {
            let finalAbbreviation = plan.abbreviation;
            if (plan.name === plan.abbreviation) {
              finalAbbreviation += '\u200B';
            }
            return {
              id: plan.id,
              name: plan.name,
              type: getHealthInsurancePlanTypeLabel(plan.type),
              abbreviation: finalAbbreviation,
            };
          })}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}
