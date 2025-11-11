import { useEffect, useState } from 'react';
import { CompanyService } from '@/features/company';
import Company from '@/types/models/Company';
import Table from '@/components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import CompanyFormModal from '../components/CompanyFormModal';
import { TableColumn } from '@/components/Table/types';

export default function CompanyOverview() {
  const columns: TableColumn<Company>[] = [
    { label: 'Nome', attribute: 'companyName' },
    { label: 'Nome Fantasia', attribute: 'tradeName' },
    { label: 'CNPJ', attribute: 'cnpj' },
    { label: 'E-mail', attribute: 'email' },
  ];
  const [data, setData] = useState<Company[]>([]);
  const [originalData, setOriginalData] = useState<Company[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<
    Company | undefined
  >();

  const fetchData = async () => {
    const res = await CompanyService.getAll();

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
    const term = searchTerm.toLowerCase();
    const filteredData = originalData.filter((company) =>
      company.companyName.toLowerCase().includes(term) ||
      company.tradeName.toLowerCase().includes(term) ||
      company.cnpj.toLowerCase().includes(term) ||
      company.email.toLowerCase().includes(term) ||
      company.city.toLowerCase().includes(term) ||
      company.state.toLowerCase().includes(term)
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

  const validateCompany = (
    model: Company,
    idToIgnore?: number
  ): string | null => {
    const name = model.companyName?.trim() || '';
    const rawCnpj = model.cnpj?.trim() || '';
    const email = model.email?.trim() || '';
    const cnpjDigits = rawCnpj.replace(/\D/g, '');

    if (!name || name.length < 2 || name.length > 100)
      return 'Nome deve ter entre 2 e 100 caracteres.';
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name))
      return 'Nome deve conter apenas letras e espaços.';
    if (
      originalData.some(
        (p) => p.id !== idToIgnore && p.companyName.toLowerCase() === name.toLowerCase()
      )
    )
      return 'Já existe uma Empresa com esse nome.';

    if (!cnpjDigits || cnpjDigits.length !== 14)
      return 'CNPJ deve conter 14 dígitos.';
    if (
      originalData.some(
        (p) => p.id !== idToIgnore && p.cnpj.replace(/\D/g, '') === cnpjDigits
      )
    )
      return 'Já existe uma Empresa com esse CNPJ.';

    if (email && !/^\S+@\S+\.\S+$/.test(email))
      return 'E-mail inválido.';

    return null;
  };

  const handleSave = async (model: Company) => {
    if (currentId !== null) {
      await editCompany(currentId, model);
    } else {
      await registerCompany(model);
    }
  };

  const registerCompany = async (model: Company) => {
    const errorMessage = validateCompany(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const res = await CompanyService.create(model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Empresa "${res.data?.companyName}" criada com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar a Empresa.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const editCompany = async (
    id: number,
    model: Company
  ) => {
    const errorMessage = validateCompany(model, id);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const payload = { ...model, id };
    const res = await CompanyService.update(id, payload);

    if (res.success) {
      await fetchData();
      showAlert(
        `Empresa "${res.data?.companyName}" atualizada com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar a Empresa.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const deleteCompany = async () => {
    if (!currentId) return;

    const res = await CompanyService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName = data.find((item) => item.id === currentId)?.companyName || '';
      setCurrentId(null);
      await fetchData();
      showAlert(
        `Empresa "${itemName}" excluída com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir a Empresa.',
        'error'
      );
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openEditModal(id)}
        className='text-edit hover:text-hoverEdit'
        aria-label='Editar empresa'
        title='Editar empresa'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        onClick={() => openDeleteModal(id)}
        className='text-danger hover:text-hoverDanger'
        aria-label='Excluir empresa'
        title='Excluir empresa'
      >
        <Trash className='size-6' weight='fill' />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title='Empresas' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <CompanyFormModal
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
          onConfirm={deleteCompany}
          title='Deseja realmente excluir esta Empresa?'
          message='Ao excluir esta Empresa, ela será removida permanentemente do sistema.'
        />

        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          message={alertMessage}
          type={alertType}
        />
        <div className='flex items-center justify-between mb-4'>
          <SearchBar
            action={handleSearch}
            placeholder='Buscar empresa...'
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
        <Table<Company>
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}
