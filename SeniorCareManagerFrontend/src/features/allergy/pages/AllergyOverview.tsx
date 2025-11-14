import { useEffect, useState } from 'react';
import AllergyService from '../services/allergyService';
import Allergy from '@/types/models/Allergy';
import { getAllergyTypeLabel } from '@/types/enums/AllergyType';
import Table from '@/components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import AllergyFormModal from '@/features/allergy/components/AllergyFormModal';
import { TableColumn } from '@/components/Table/types';

export default function AllergyOverview() {
  const columns: TableColumn<Allergy>[] = [
    { label: 'Nome', attribute: 'name' },
    {
      label: 'Tipo',
      attribute: 'type',
      render: (value) => getAllergyTypeLabel(Number(value)),
    },
  ];
  const [data, setData] = useState<Allergy[]>([]);
  const [originalData, setOriginalData] = useState<Allergy[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Allergy | undefined>();

  const fetchData = async () => {
    const res = await AllergyService.getAll();

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

  const validateAllergy = (
    model: Allergy,
    idToIgnore?: number
  ): string | null => {
    const name = model.name?.trim() || '';

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
      return 'Já existe uma alergia com esse nome.';
    if (model.type === null || model.type === undefined)
      return 'Tipo é obrigatório.';
    
    return null;
  };

  const handleSave = async (model: Allergy) => {
    if (currentId !== null) {
      await editAllergy(currentId, model);
    } else {
      await registerAllergy(model);
    }
  };

  const registerAllergy = async (model: Allergy) => {
    const errorMessage = validateAllergy(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const payload = { ...model, type: Number(model.type) };
    const res = await AllergyService.create(payload);

    if (res.success) {
      await fetchData();
      showAlert(
        `Alergia "${res.data?.name}" criada com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar a Alergia.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const editAllergy = async (
    id: number,
    model: Allergy
  ) => {
    const errorMessage = validateAllergy(model, id);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const payload = { ...model, id, type: Number(model.type) };
    const res = await AllergyService.update(id, payload);

    if (res.success) {
      await fetchData();
      showAlert(
        `Alergia "${res.data?.name}" atualizada com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar a Alergia.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const deleteAllergy = async () => {
    if (!currentId) return;

    const res = await AllergyService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName = data.find((item) => item.id === currentId)?.name || '';
      setCurrentId(null);
      await fetchData();
      showAlert(`Alergia "${itemName}" excluída com sucesso!`, 'success');
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir a Alergia.',
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
      <BreadcrumbPageTitle title='Alergias' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <AllergyFormModal
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
          onConfirm={deleteAllergy}
          title='Deseja realmente excluir essa Alergia?'
          message='Ao excluir esta Alergia, ela será removida permanentemente do sistema.'
        />

        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          message={alertMessage}
          type={alertType}
        />
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar alergia...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
        </div>
        <Table<Allergy>
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}
