import { useEffect, useState } from 'react';
import UserService from '../services/userService';
import User from '@/types/models/User';
import Table from '@/components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import UserFormModal from '@/features/user/components/UserFormModal';
import { TableColumn } from '@/components/Table/types';

export default function UserOverview() {
  const columns: TableColumn<User>[] = [
    { label: 'Email', attribute: 'email' },
    { label: 'Tipo de Usuário', attribute: 'userType' },
    { label: 'Status Usuário', attribute: 'userStatus' },
  ];
  const [data, setData] = useState<User[]>([]);
  const [originalData, setOriginalData] = useState<User[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<User | undefined>();

  const fetchData = async () => {
    const res = await UserService.getAll();

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
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const validateUser = (
    model: User,
    idToIgnore?: number
  ): string | null => {
    const name = model.email?.trim() || '';

    if (name.length < 3 || name.length > 100) {
      return 'Nome deve ter entre 3 e 100 caracteres.';
    }

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name)) {
      return 'Nome deve conter apenas letras e espaços.';
    }

    if (
      originalData.some(
        (r) =>
          r.id !== idToIgnore && r.email.toLowerCase() === name.toLowerCase()
      )
    ) {
      return 'Já existe um email com esse nome.';
    }

    return null;
  };

  const handleSave = async (model: User) => {
    if (currentId !== null) {
      await editUser(currentId, model);
    } else {
      await registerUser(model);
    }
  };

  const registerUser = async (model: User) => {
    const errorMessage = validateUser(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const res = await UserService.create(model);

    if (res.success) {
      await fetchData();
      showAlert(`Email "${res.data?.email}" criada com sucesso!`, 'success');
    } else {
      showAlert(res.message || 'Erro inesperado ao criar a email.', 'error');
      throw new Error(res.message);
    }
  };

  const editUser = async (id: number, model: User) => {
    const errorMessage = validateUser(model, id);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const res = await UserService.update(id, { ...model, id });
    if (res.success) {
      await fetchData();
      showAlert(
        `Email "${res.data?.email}" atualizada com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar a email.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const deleteUser = async () => {
    if (!currentId) return;

    const res = await UserService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName = data.find((item) => item.id === currentId)?.email || '';
      setCurrentId(null);
      await fetchData();
      showAlert(`Email "${itemName}" excluída com sucesso!`, 'success');
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir a Email.',
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
        <UserFormModal
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
          onConfirm={deleteUser}
          title='Deseja realmente excluir essa Email?'
          message='Ao excluir esta Email, ela será removida permanentemente do sistema.'
        />

        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          message={alertMessage}
          type={alertType}
        />
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar email...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
        </div>
        <Table<User>
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}
