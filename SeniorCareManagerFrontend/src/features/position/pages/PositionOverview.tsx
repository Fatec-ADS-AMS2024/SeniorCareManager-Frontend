import { useEffect, useState } from 'react';
import PositionService from '../services/positionService';
import Position from '@/types/models/Position';
import Table from '@/components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import PositionFormModal from '@/features/position/components/PositionFormModal';
import { TableColumn } from '@/components/Table/types';

export default function PositionOverview() {
  const columns: TableColumn<Position>[] = [
    { label: 'Nome', attribute: 'name' },
  ];
  const [data, setData] = useState<Position[]>([]);
  const [originalData, setOriginalData] = useState<Position[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Position | undefined>();

  const fetchData = async () => {
    const res = await PositionService.getAll();

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
    const filteredData = originalData.filter((r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const validatePosition = (
    model: Position,
    idToIgnore?: number
  ): string | null => {
    const name = model.name?.trim() || '';

    if (!name || name.length < 2 || name.length > 100)
      return 'Nome deve ter entre 2 e 100 caracteres.';
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name))
      return 'Nome deve conter apenas letras e espaços.';
    if (
      originalData.some(
        (r) =>
          r.id !== idToIgnore && r.name.toLowerCase() === name.toLowerCase()
      )
    )
      return 'Já existe um cargo com esse nome.';

    return null;
  };

  const handleSave = async (model: Position) => {
    if (currentId !== null) {
      await editPosition(currentId, model);
    } else {
      await registerPosition(model);
    }
  };

  const registerPosition = async (model: Position) => {
    const errorMessage = validatePosition(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const res = await PositionService.create(model);
    if (res.success) {
      await fetchData();
      showAlert(`Cargo "${res.data?.name}" criado com sucesso!`, 'success');
    } else {
      showAlert(res.message || 'Erro inesperado ao criar o cargo.', 'error');
      throw new Error(res.message);
    }
  };

  const editPosition = async (id: number, model: Position) => {
    const errorMessage = validatePosition(model, id);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const payload = { ...model, id };
    const res = await PositionService.update(id, payload);

    if (res.success) {
      await fetchData();
      showAlert(`Cargo "${res.data?.name}" atualizado com sucesso!`, 'success');
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar o cargo.',
        'error'
      );
    }
  };

  const deletePosition = async () => {
    if (!currentId) return;

    const res = await PositionService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName = data.find((item) => item.id === currentId)?.name || '';
      setCurrentId(null);
      await fetchData();
      showAlert(`Cargo "${itemName}" excluído com sucesso!`, 'success');
    } else {
      showAlert(res.message || 'Erro inesperado ao excluir o cargo.', 'error');
    }
  };

  const Actions = ({ id }: { id: number }) => {
    const itemName = data.find((item) => item.id === id)?.name || 'este cargo';
    return (
      <>
        {/* Botão de Edição */}
        <button
          onClick={() => openEditModal(id)}
          className='text-edit hover:text-hoverEdit'
          aria-label={`Editar cargo: ${itemName}`}
        >
          <Pencil className='size-6' weight='fill' aria-hidden='true' />
        </button>
        {/* Botão de Exclusão */}
        <button
          onClick={() => openDeleteModal(id)}
          className='text-danger hover:text-hoverDanger'
          aria-label={`Excluir cargo: ${itemName}`}
        >
          <Trash className='size-6' weight='fill' aria-hidden='true' />
        </button>
      </>
    );
  };

  return (
    <main role='main'>
      <BreadcrumbPageTitle title='Cargos' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        {/* 4. Modais (Assumindo que FormModal, ConfirmModal e AlertModal
            implementam o ARIA de modal: role="dialog", aria-modal="true", aria-labelledby, etc.) */}
        <PositionFormModal
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
          onConfirm={deletePosition}
          title='Deseja realmente excluir esse Cargo?'
          message='Ao excluir este Cargo, ele será removido permanentemente do sistema.'
        />

        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          message={alertMessage}
          type={alertType}
        />
        <div className='flex items-center justify-between mb-4'>
          {/* 5. SearchBar (Assumindo que o componente SearchBar
              usa aria-label ou label visível para o campo de busca) */}
          <SearchBar action={handleSearch} placeholder='Buscar cargo...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
        </div>
        {/* 6. Tabela (Assumindo que o componente Table usa caption/aria-label) */}
        <Table<Position>
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
          aria-label='Tabela de Cargos Cadastrados'
        />
      </div>
    </main>
  );
}
