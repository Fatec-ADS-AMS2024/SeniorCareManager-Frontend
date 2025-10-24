import { useEffect, useState } from 'react';
import ReligionService from '../services/religionService';
import Religion from '@/types/models/Religion';
import Table from '@/components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import ReligionFormModal from '@/features/religion/components/ReligionFormModal';

export default function ReligionOverview() {
  const columns = ['Nome'];
  const [data, setData] = useState<Religion[]>([]);
  const [originalData, setOriginalData] = useState<Religion[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Religion | undefined>();

  const fetchData = async () => {
    const res = await ReligionService.getAll();

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

  const validateReligion = (
    model: Religion,
    idToIgnore?: number
  ): string | null => {
    const name = model.name?.trim() || '';

    if (name.length < 3 || name.length > 100) {
      return 'Nome deve ter entre 3 e 100 caracteres.';
    }

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
      return 'Nome deve conter apenas letras e espaços.';
    }

    if (
      originalData.some(
        (r) =>
          r.id !== idToIgnore && r.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return 'Já existe uma religião com esse nome.';
    }

    return null;
  };

  const handleSave = async (model: Religion) => {
    if (currentId !== null) {
      await editReligion(currentId, model);
    } else {
      await registerReligion(model);
    }
  };

  const registerReligion = async (model: Religion) => {
    const errorMessage = validateReligion(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const res = await ReligionService.create(model);

    if (res.success) {
      await fetchData();
      showAlert(`Religião "${res.data?.name}" criada com sucesso!`, 'success');
    } else {
      showAlert(res.message || 'Erro inesperado ao criar a religião.', 'error');
      throw new Error(res.message);
    }
  };

  const editReligion = async (id: number, model: Religion) => {
    const errorMessage = validateReligion(model, id);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const res = await ReligionService.update(id, { ...model, id });
    if (res.success) {
      await fetchData();
      showAlert(
        `Religião "${res.data?.name}" atualizada com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar a religião.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const deleteReligion = async () => {
    if (!currentId) return;

    const res = await ReligionService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName = data.find((item) => item.id === currentId)?.name || '';
      setCurrentId(null);
      await fetchData();
      showAlert(`Religião "${itemName}" excluída com sucesso!`, 'success');
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir a Religião.',
        'error'
      );
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openEditModal(id)}
        className='text-edit hover:text-hoverEdit'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        onClick={() => openDeleteModal(id)}
        className='text-danger hover:text-hoverDanger'
      >
        <Trash className='size-6' weight='fill' />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title='Religiões' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <ReligionFormModal
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
          onConfirm={deleteReligion}
          title='Deseja realmente excluir essa Religião?'
          message='Ao excluir esta Religião, ela será removida permanentemente do sistema.'
        />

        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          message={alertMessage}
          type={alertType}
        />
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar religião...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
        </div>
        <Table
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}
