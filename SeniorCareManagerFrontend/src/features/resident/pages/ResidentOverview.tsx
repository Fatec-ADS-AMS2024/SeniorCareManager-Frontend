import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import { getEthnicityLabel } from '@/types/enums/Ethnicity';
import { getSexLabel } from '@/types/enums/Sex';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import Resident from '@/types/models/Resident';
import ResidentService from '../services/residentService';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import AlertModal from '@/components/Modal/AlertModal';

// Definição das colunas da tabela
const columns: TableColumn<Resident>[] = [
  {
    label: 'Nome social',
    attribute: 'socialName',
  },
  {
    label: 'Nome de registro',
    attribute: 'registeredName',
  },
  {
    label: 'CPF',
    attribute: 'cpf',
  },
  {
    label: 'Sexo',
    attribute: 'sex',
    render: (value) => getSexLabel(value as number),
  },
  {
    label: 'Idade',
    attribute: 'age',
  },
  {
    label: 'Etnia',
    attribute: 'ethnicity',
    render: (value) => (value ? getEthnicityLabel(value as number) : ''),
  },
];

// Componente principal que renderiza a tabela
export default function ResidentOverview() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modais
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>('info');
  const [deleteResidentId, setDeleteResidentId] = useState<number | null>(null);

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, residents]);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const result = await ResidentService.getAll();
      if (result.success && result.data) {
        setResidents(result.data);
        setFilteredResidents(result.data);
      }
    } catch (error) {
      // Erro ao buscar residentes
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setFilteredResidents(residents);
      return;
    }

    const searchLower = term.toLowerCase();
    const filtered = residents.filter(
      (resident) =>
        resident.registeredName?.toLowerCase().includes(searchLower) ||
        resident.socialName?.toLowerCase().includes(searchLower) ||
        resident.cpf?.toLowerCase().includes(searchLower)
    );
    setFilteredResidents(filtered);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteResidentId(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteResidentId) return;
    
    setIsDeleteConfirmOpen(false);
    const id = deleteResidentId;
    setDeleteResidentId(null);

    try {
      // Tenta excluir o residente diretamente
      // O backend deve lidar com a exclusão em cascata dos relacionamentos
      const result = await ResidentService.deleteById(id);
      
      if (result.success) {
        await fetchResidents();
        showAlert('Residente removido com sucesso!', 'success');
      } else {
        // Verifica se é erro de chave estrangeira (relacionamentos)
        let errorMessage = 'Não foi possível excluir o residente.';
        
        if (result.data && typeof result.data === 'object') {
          const errorData = result.data as any;
          const internalError = errorData.errO_INTERNO || errorData.errO_REAL || '';
          const errorString = String(internalError).toLowerCase();
          
          // Se for erro de chave estrangeira, informa que há dados relacionados
          if (errorString.includes('viola restrição de chave estrangeira') || 
              errorString.includes('foreign key constraint') ||
              errorString.includes('23503')) {
            errorMessage = 'Não é possível excluir este residente pois ele possui dados relacionados cadastrados.';
          }
        }
        
        showAlert(errorMessage, 'error');
      }
    } catch (error) {
      showAlert('Erro ao excluir residente.', 'error');
    }
  };

  // Funções de ação (editar/excluir)
  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => navigate(`/resident/edit/${id}`)}
        className='text-edit hover:text-hoverEdit'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        onClick={() => handleDeleteClick(id)}
        className='text-danger hover:text-hoverDanger'
      >
        <Trash className='size-6' weight='fill' />
      </button>
    </>
  );

  if (loading) {
    return (
      <div>
        <BreadcrumbPageTitle title='Residentes' />
        <div className='p-12'>Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbPageTitle title='Residentes' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex w-full max-w-2xl'>
            <input
              type='text'
              placeholder='Buscar residente...'
              className='w-full py-2 pl-4 text-sm text-textPrimary rounded border border-neutralDark bg-neutralWhite focus:outline-none focus:border-neutralDarker'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={() => navigate('/resident/registration')}
          />
        </div>
        <Table
          columns={columns}
          data={filteredResidents}
          rowsPerPage={5}
          actions={(id) => <Actions id={id} />}
        />
      </div>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setDeleteResidentId(null);
        }}
        onConfirm={handleConfirmDelete}
        title='Deseja remover esse residente?'
        message='Ao remover este residente, ele será removido permanentemente da lista. Todos os dados relacionados (familiares e alergias) também serão excluídos.'
      />

      {/* Modal de alerta (sucesso/erro) */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}
