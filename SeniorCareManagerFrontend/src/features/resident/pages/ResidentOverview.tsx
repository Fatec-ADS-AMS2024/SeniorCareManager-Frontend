import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import { getEthnicityLabel } from '@/types/enums/Ethnicity';
import { getSexLabel } from '@/types/enums/Sex';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import Resident from '@/types/models/Resident';
import ResidentService from '../services/residentService';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import useAppRoutes from '@/hooks/useAppRoutes';

export default function ResidentOverview() {
  const columns: TableColumn<Resident>[] = [
    { label: 'Nome social', attribute: 'socialName' },
    { label: 'Nome de registro', attribute: 'registeredName' },
    { label: 'CPF', attribute: 'cpf' },
    {
      label: 'Sexo',
      attribute: 'sex',
      render: (value) => getSexLabel(value as number),
    },
    { label: 'Idade', attribute: 'age' },
    {
      label: 'Etnia',
      attribute: 'ethnicity',
      render: (value) => (value ? getEthnicityLabel(value as number) : ''),
    },
  ];
  const routes = useAppRoutes();
  const navigate = useNavigate();
  const [data, setData] = useState<Resident[]>([]);
  const [originalData, setOriginalData] = useState<Resident[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchData = async () => {
    const res = await ResidentService.getAll();
    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]);
    } else {
      showAlert(`Erro ao buscar dados: ${res.message}`, 'error');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData);
      return;
    }

    const filteredData = originalData.filter(
      (resident) =>
        resident.registeredName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        resident.socialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.cpf?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
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

  const deleteResident = async () => {
    if (!currentId) return;

    const res = await ResidentService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName =
        data.find((item) => item.id === currentId)?.socialName || '';
      setCurrentId(null);

      await fetchData();
      showAlert(`Residente "${itemName}" excluído com sucesso!`, 'success');
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir o residente.',
        'error'
      );
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() =>
          navigate(routes.RESIDENT_EDIT.path.replace(':id', `${id}`))
        }
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
      <BreadcrumbPageTitle title='Residentes' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar residente...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={() => navigate(routes.RESIDENT_REGISTRATION.path)}
          />
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={deleteResident}
            title='Deseja realmente excluir esse residente?'
            message='Ao excluir este residente, ele será removido permanentemente do sistema. Todos os dados relacionados (familiares e alergias) também serão excluídos.'
          />
          <AlertModal
            isOpen={isAlertModalOpen}
            onClose={() => setIsAlertModalOpen(false)}
            message={alertMessage}
            type={alertType}
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
