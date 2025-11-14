import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import { SelectInput, TextInput } from '@/components/FormControls';
import useAppRoutes from '@/hooks/useAppRoutes';
import useFormData from '@/hooks/useFormData';
import { AlertModal } from '@/components/Modal';
import PositionService from '@/features/technicalResponsibility/services/positionService';
import Position from '@/types/models/Position';
import EmployeeService from '@/features/technicalResponsibility/services/employeeService';
import Employee from '@/types/models/Employee';
import TechnicalResponsibility from '@/types/models/TechnicalResponsibility';
import TechnicalResponsibilityService from '../services/technicalResponsibilityService';

export default function TechnicalResponsibilityForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== '0';
  const routes = useAppRoutes();

  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>('info');

  const { data, reset, setData, updateField } = useFormData<TechnicalResponsibility>({
    id: 0,
    responsibleName: '',
    professionalRegistration: '',
    servicesResponsibility: '',
    startDate: '',
    endDate: '',
    positionId: 1,
    employeeId: 1,
  });

  const [originalData, setOriginalData] = useState<TechnicalResponsibility[]>([]);

  useEffect(() => {
    async function loadPositions() {
      const res = await PositionService.getAll();
      if (res && res.success && Array.isArray(res.data)) setPositions(res.data);
    }
    loadPositions();
  }, []);
  useEffect(() => {
    async function loadEmployees() {
      const res = await EmployeeService.getAll();
      if (res && res.success && Array.isArray(res.data)) setEmployees(res.data);
    }
    loadEmployees();
  }, []);

  const fetchTechnicalResponsibility = useCallback(
    async (technicalResponsibilityId: string) => {
      const res = await TechnicalResponsibilityService.getById(Number(technicalResponsibilityId));
      if (res.success && res.data) setData(res.data);
      else {
        showAlert('Responsabilidade técnica não encontrada!', 'error');
        navigate(routes.TECHNICAL_RESPONSIBILITY.path);
      }
    },
    [navigate, routes.TECHNICAL_RESPONSIBILITY.path, setData]
  );

  useEffect(() => {
    async function fetchAllTechnicalResponsibilitys() {
      const res = await TechnicalResponsibilityService.getAll();
      if (res.success && res.data) setOriginalData(res.data);
    }
    fetchAllTechnicalResponsibilitys();
  }, []);

  useEffect(() => {
    if (isEditing) fetchTechnicalResponsibility(id);
    else reset();
  }, [fetchTechnicalResponsibility, id, isEditing, reset]);

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) {
      return '';
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const validateTechnicalResponsibility = (
    technicalResponsibility: TechnicalResponsibility,
    originalData: TechnicalResponsibility[],
    idToIgnore?: number
  ): string | null => {
    const responsibleName = technicalResponsibility.responsibleName?.trim() || '';

    if (technicalResponsibility.responsibleName.length < 2 || technicalResponsibility.responsibleName.length > 100)
      return 'Nome deve ter entre 2 e 100 caracteres.';
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(responsibleName))
      return 'Nome deve conter apenas letras e espaços.';
    if (technicalResponsibility.professionalRegistration.length < 2 || technicalResponsibility.professionalRegistration.length > 50)
      return 'Registro profissional deve ter entre 2 e 50 caracteres.';
    if (technicalResponsibility.servicesResponsibility.length < 2 || technicalResponsibility.servicesResponsibility.length > 100)
      return 'Registro profissional deve ter entre 2 e 100 caracteres.';
    if (!technicalResponsibility.startDate) return 'Data de início obrigatória.';
    if (!technicalResponsibility.endDate) return 'Data de término obrigatória.';
    if (!technicalResponsibility.positionId) return 'Selecione um cargo.';
    if (!technicalResponsibility.employeeId) return 'Selecione um funcionário.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateTechnicalResponsibility(
      data,
      originalData,
      isEditing ? data.id : undefined
    );
    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }

    const res = isEditing
      ? await TechnicalResponsibilityService.update(data.id, data)
      : await TechnicalResponsibilityService.create(data);
    if (res.success) {
      showAlert(
        `Responsabilidade Técnica ${isEditing ? 'atualizada' : 'cadastrada'} com sucesso!`,
        'success'
      );
      navigate(routes.TECHNICAL_RESPONSIBILITY.path);
    } else {
      showAlert(res.message || 'Erro ao salvar responsabilidade técnica.', 'error');
    }
  };

function formatDatetimeForInput(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

  return (
    <div>
      <BreadcrumbPageTitle title='Responsabilidade Técnica' />
      <div className='w-full h-full flex flex-col items-center py-10'>
        <form
          className='w-[95%] h-full bg-white shadow-md p-8 flex flex-col justify-center items-center rounded-lg'
          onSubmit={handleSubmit}
        >
          <h1 className='text-textPrimary font-bold text-2xl w-full mb-6'>
            Responsabilidade Técnica
          </h1>

          <div className='w-full flex flex-row gap-4'>
            <div className='flex-1'>
              <TextInput<TechnicalResponsibility>
                label='Nome do Responsável Técnico'
                value={data.responsibleName}
                onChange={updateField}
                name='responsibleName'
                required
              />
            </div>
            <div className='flex-1'>
              <TextInput<TechnicalResponsibility>
                label='Registro Profissional'
                value={data.professionalRegistration}
                onChange={updateField}
                name='professionalRegistration'
                required
              />
            </div>
          </div>

          <div className='w-full mt-4 flex flex-row gap-4'>
            <div className='flex-1'>
              <SelectInput<TechnicalResponsibility>
                label='Cargo'
                value={data.positionId}
                onChange={updateField}
                options={positions.map(p => ({ value: p.id, label: p.name }))}
                name='positionId'
                required
              />
            </div>
            <div className='flex-1'>
              <SelectInput<TechnicalResponsibility>
                label='Funcionário'
                value={data.employeeId}
                onChange={updateField}
                options={employees.map(q => ({ value: q.id, label: q.name }))}
                name='employeeId'
                required
              />
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-8 mb-8'></div>

          <div className='w-full mt-4 flex flex-row gap-4'>
            <div className='flex-1'>
              <TextInput<TechnicalResponsibility>
                label='Responsabilidade do serviço'
                value={data.servicesResponsibility}
                onChange={updateField}
                name='servicesResponsibility'
                required
              />
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-8 mb-8'></div>

<div className='w-full flex flex-row gap-4'>
  <div className='flex-1'>
    <label
      htmlFor='startDate'
      className='block text-sm font-medium text-gray-700'
    >
      Data de Início*
    </label>
    <input
      type='datetime-local'
      id='startDate'
      name='startDate'
      value={formatDatetimeForInput(data.startDate)}
      onChange={(e) =>
        updateField('startDate', new Date(e.target.value).toISOString())
      }
      required
      className='mt-1 block w-full rounded px-3 py-1.5 border border-neutralDark shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none'
    />
  </div>

  <div className='flex-1'>
    <label
      htmlFor='endDate'
      className='block text-sm font-medium text-gray-700'
    >
      Data de Término*
    </label>
    <input
      type='datetime-local'
      id='endDate'
      name='endDate'
      value={formatDatetimeForInput(data.endDate)}
      onChange={(e) =>
        updateField('endDate', new Date(e.target.value).toISOString())
      }
      required
      className='mt-1 block w-full rounded px-3 py-1.5 border border-neutralDark shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none'
    />
  </div>
</div>

          <div className='w-full border border-neutralDarker mt-4 mb-8'></div>

          <div className='flex justify-end w-full gap-4'>
            <Button
              label={isEditing ? 'Salvar Alterações' : 'Cadastrar Responsabilidade Técnica'}
              color='primary'
              size='medium'
              type='submit'
            />
          </div>
        </form>
      </div>

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}