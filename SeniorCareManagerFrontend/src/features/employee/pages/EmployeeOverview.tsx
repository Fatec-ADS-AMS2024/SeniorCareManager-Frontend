import { useCallback, useEffect, useState } from 'react';
import EmployeeService from '../services/employeeService';
import Employee from '@/types/models/Employee';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import useAppRoutes from '@/hooks/useAppRoutes';
import { useNavigate } from 'react-router-dom';
import { getStatusEmployeeLabel } from '@/types/enums/StatusEmployee';
import PositionService from '../services/positionService';
import Position from '@/types/models/Position';

export default function EmployeeOverview() {
  const [positions, setPositions] = useState<Position[]>([]);
  useEffect(() => {
    async function loadPositions() {
      const res = await PositionService.getAll();
      if (res && res.success && Array.isArray(res.data)) {
        setPositions(res.data);
      }
    }
  loadPositions();
  }, []);
  const columns: TableColumn<Employee>[] = [
    { label: 'Nome', attribute: 'name' },
    { label: 'Cargo', attribute: 'positionId', render: (value) => {
        const position = positions.find((p) => p.id === (value as number));
        return position ? position.name : '...'; 
      },
    },
    { label: 'Status', attribute: 'statusEmployee', render: (value) => getStatusEmployeeLabel(value as number) },
  ];
  const routes = useAppRoutes();
  const navigate = useNavigate();
  const [data, setData] = useState<Employee[]>([]);
  const [originalData, setOriginalData] = useState<Employee[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    const res = await EmployeeService.getAll();
    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]);
    } else {
      showAlert(`Erro ao buscar dados: ${res.message}`, 'error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData);
      return;
    }

    const filteredData = originalData.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const deleteEmployee = async () => {
    if (!currentId) return;

    const res = await EmployeeService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName =
        data.find((item) => item.id === currentId)?.name || '';
      setCurrentId(null);

      await fetchData();
      showAlert(`Funcionário "${itemName}" excluído com sucesso!`, 'success');
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir o funcionário.',
        'error'
      );
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() =>
          navigate(routes.EMPLOYEE_EDIT.path.replace(':id', `${id}`))
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
      <BreadcrumbPageTitle title='Cadastro de Funcionário' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar Funcionário...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={() => navigate(routes.EMPLOYEE_REGISTRATION.path)}
          />
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={deleteEmployee}
            title='Deseja realmente excluir este funcionário?'
            message='Ao excluir este funcionário, ele será removido permanentemente do sistema.'
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
