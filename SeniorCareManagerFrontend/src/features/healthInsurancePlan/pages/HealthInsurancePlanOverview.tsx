import { useEffect, useState } from 'react';
import { HealthInsurancePlanService } from '@/features/healthInsurancePlan';
import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import { getHealthInsurancePlanTypeLabel } from '@/types/enums/HealthInsurancePlanType';
import Table from '@/components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import HealthInsurancePlanFormModal from '../components/HealthInsurancePlanFormModal';
import { TableColumn } from '@/components/Table/types';

export default function HealthInsurancePlanOverview() {
  const columns: TableColumn<HealthInsurancePlan>[] = [
    { label: 'Nome', attribute: 'name' },
    {
      label: 'Tipo',
      attribute: 'type',
      render: (value) => getHealthInsurancePlanTypeLabel(Number(value)),
    },
    { label: 'Abreviação', attribute: 'abbreviation' },
  ];
  const [data, setData] = useState<HealthInsurancePlan[]>([]);
  const [originalData, setOriginalData] = useState<HealthInsurancePlan[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<
    HealthInsurancePlan | undefined
  >();

  const fetchData = async () => {
    const res = await HealthInsurancePlanService.getAll();

    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]);
    } else {
      alert(res.message);
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

  const openCreateModal = () => {
    setEditingItem(undefined);
    setCurrentId(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (id: number) => {
    const item = data.find((row) => row.id === id);
    if (item) {
      setEditingItem(item);
      setCurrentId(id);
      setIsFormModalOpen(true);
    } else {
      showAlert('Registro não encontrado', 'error');
    }
  };

  const openDeleteModal = (id: number) => {
    setCurrentId(id);
    setIsDeleteModalOpen(true);
  };

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
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

  const handleSave = async (model: HealthInsurancePlan) => {
    if (currentId !== null) {
      await editHealthInsurancePlan(currentId, model);
    } else {
      await registerHealthInsurancePlan(model);
    }
  };

  const registerHealthInsurancePlan = async (model: HealthInsurancePlan) => {
    const errorMessage = validateHealthInsurancePlan(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const payload = { ...model, type: Number(model.type) };
    const res = await HealthInsurancePlanService.create(payload);

    if (res.success) {
      await fetchData();
      showAlert(
        `Plano de Saúde "${res.data?.name}" criado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar o Plano de Saúde.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const editHealthInsurancePlan = async (
    id: number,
    model: HealthInsurancePlan
  ) => {
    const errorMessage = validateHealthInsurancePlan(model, id);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const payload = { ...model, id, type: Number(model.type) };
    const res = await HealthInsurancePlanService.update(id, payload);

    if (res.success) {
      await fetchData();
      showAlert(
        `Plano de Saúde "${res.data?.name}" atualizado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar o Plano de Saúde.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const deleteHealthInsurancePlan = async () => {
    if (!currentId) return;

    const res = await HealthInsurancePlanService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName = data.find((item) => item.id === currentId)?.name || '';
      setCurrentId(null);
      await fetchData();
      showAlert(
        `Plano de Saúde "${itemName}" excluído com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir o Plano de Saúde.',
        'error'
      );
    }
  };

  // --- MODIFICAÇÃO ARIA AQUI ---
  const Actions = ({ id }: { id: number }) => {
    const itemName = data.find((item) => item.id === id)?.name || `ID ${id}`;

    return (
      <>
        {/* Botão de Edição (apenas ícone) */}
        <button
          onClick={() => openEditModal(id)}
          className='text-edit hover:text-hoverEdit'
          aria-label={`Editar plano ${itemName}`}
        >
          <Pencil className='size-6' weight='fill' />
        </button>
        {/* Botão de Exclusão (apenas ícone) */}
        <button
          onClick={() => openDeleteModal(id)}
          className='text-danger hover:text-hoverDanger'
          aria-label={`Excluir plano ${itemName}`}
        >
          <Trash className='size-6' weight='fill' />
        </button>
      </>
    );
  };

  return (
    <div>
      <BreadcrumbPageTitle title='Planos de Saúde' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <HealthInsurancePlanFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingItem(undefined);
          }}
          onSubmit={handleSave}
          objectData={editingItem}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={deleteHealthInsurancePlan}
          title='Deseja realmente excluir esse Plano de Saúde?'
          message='Ao excluir este Plano de Saúde, ele será removido permanentemente do sistema.'
        />

        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          message={alertMessage}
          type={alertType}
        />
        <div className='flex items-center justify-between mb-4'>
          {/* O SearchBar e o Button já devem ter ARIA implementado internamente */}
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
            onClick={openCreateModal}
          />
        </div>
        <Table<HealthInsurancePlan>
          columns={columns}
          data={data.map((plan) => ({
            ...plan,
            abbreviation:
              plan.name === plan.abbreviation
                ? plan.abbreviation + '\u200B'
                : plan.abbreviation,
          }))}
          actions={(id) => <Actions id={id} />}
          aria-label='Tabela de Planos de Saúde'
        />
      </div>
    </div>
  );
}
