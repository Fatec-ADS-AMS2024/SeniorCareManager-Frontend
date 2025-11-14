import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Employee from '@/types/models/Employee';
import Button from '@/components/Button';
import { SelectInput, TextInput } from '@/components/FormControls';
import EmployeeService from '../services/employeeService';
import useAppRoutes from '@/hooks/useAppRoutes';
import useFormData from '@/hooks/useFormData';
import { AlertModal } from '@/components/Modal';
import {
  getStatusEmployeeOptions,
  StatusEmployee,
} from '@/types/enums/StatusEmployee';
import PositionService from '@/features/employee/services/positionService';
import Position from '@/types/models/Position';

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== '0';
  const routes = useAppRoutes();

  const [positions, setPositions] = useState<Position[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>('info');

  const { data, reset, setData, updateField } = useFormData<Employee>({
    id: 0,
    name: '',
    cpf: '',
    phone: '',
    email: '',
    hireDate: '',
    state: '',
    city: '',
    street: '',
    cep: '',
    number: '',
    neighborhood: '',
    statusEmployee: StatusEmployee.ACTIVE,
    positionId: 1,
  });

  const [originalData, setOriginalData] = useState<Employee[]>([]);

  useEffect(() => {
    async function loadPositions() {
      const res = await PositionService.getAll();
      if (res && res.success && Array.isArray(res.data)) setPositions(res.data);
    }
    loadPositions();
  }, []);

  const fetchEmployee = useCallback(
    async (employeeId: string) => {
      const res = await EmployeeService.getById(Number(employeeId));
      if (res.success && res.data) setData(res.data);
      else {
        showAlert('Funcionário não encontrado!', 'error');
        navigate(routes.EMPLOYEE.path);
      }
    },
    [navigate, routes.EMPLOYEE.path, setData]
  );

  useEffect(() => {
    async function fetchAllEmployees() {
      const res = await EmployeeService.getAll();
      if (res.success && res.data) setOriginalData(res.data);
    }
    fetchAllEmployees();
  }, []);

  useEffect(() => {
    if (isEditing) fetchEmployee(id);
    else reset();
  }, [fetchEmployee, id, isEditing, reset]);

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
  };

  const isValidCpf = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    const multiplicador1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    const multiplicador2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    let tempCpf = cpf.substring(0, 9);
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(tempCpf[i]) * multiplicador1[i];
    let resto = soma % 11;
    resto = resto < 2 ? 0 : 11 - resto;
    let digito = resto.toString();
    tempCpf += digito;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(tempCpf[i]) * multiplicador2[i];
    resto = soma % 11;
    resto = resto < 2 ? 0 : 11 - resto;
    digito += resto.toString();
    return cpf.endsWith(digito);
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

  const validateEmployee = (
    employee: Employee,
    originalData: Employee[],
    idToIgnore?: number
  ): string | null => {
    const name = employee.name?.trim() || '';
    const cpf = employee.cpf?.replace(/\D/g, '') || '';
    const email = employee.email?.trim() || '';
    const phone = employee.phone?.trim() || '';
    const street = employee.street?.trim() || '';
    const number = employee.number?.trim() || '';
    const neighborhood = employee.neighborhood?.trim() || '';
    const city = employee.city?.trim() || '';
    const state = employee.state?.trim() || '';
    const cep = employee.cep?.trim() || '';

    if (name.length < 2 || name.length > 100)
      return 'Nome deve ter entre 2 e 100 caracteres.';
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name))
      return 'Nome deve conter apenas letras e espaços.';
    if (!isValidCpf(cpf)) return 'CPF inválido.';
    if (
      originalData.some(
        e => e.id !== idToIgnore && e.cpf.replace(/\D/g, '') === cpf
      )
    )
      return 'Já existe um funcionário com esse CPF.';
    if (email.length < 5 || email.length > 100) return 'Email inválido.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email inválido.';
    if (
      originalData.some(
        e => e.id !== idToIgnore && e.email.toLowerCase() === email.toLowerCase()
      )
    )
      return 'Já existe um funcionário com esse email.';
    if (phone.length < 8 || phone.length > 15) return 'Telefone inválido.';
    if (street.length < 3 || street.length > 100) return 'Rua inválida.';
    if (!number) return 'Número inválido.';
    if (neighborhood.length < 2 || neighborhood.length > 100)
      return 'Bairro inválido.';
    if (city.length < 2 || city.length > 100) return 'Cidade inválida.';
    if (state.length !== 2) return 'Estado deve ter 2 caracteres.';
    if (cep.length < 8 || cep.length > 9) return 'CEP inválido.';
    if (!employee.hireDate) return 'Data de contratação obrigatória.';
    if (!employee.positionId) return 'Selecione um cargo.';
    if (!employee.statusEmployee) return 'Selecione o status do funcionário.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateEmployee(
      data,
      originalData,
      isEditing ? data.id : undefined
    );
    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }
    const res = isEditing
      ? await EmployeeService.update(data.id, data)
      : await EmployeeService.create(data);
    if (res.success) {
      showAlert(
        `Funcionário ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        'success'
      );
      navigate(routes.EMPLOYEE.path);
    } else {
      showAlert(res.message || 'Erro ao salvar funcionário.', 'error');
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
      <BreadcrumbPageTitle title='Funcionário' />
      <div className='w-full h-full flex flex-col items-center py-10'>
        <form
          className='w-[95%] h-full bg-white shadow-md p-8 flex flex-col justify-center items-center rounded-lg'
          onSubmit={handleSubmit}
        >
          <h1 className='text-textPrimary font-bold text-2xl w-full mb-6'>
            Funcionário
          </h1>

          <div className='w-full flex flex-row gap-4'>
            <div className='flex-1'>
              <TextInput<Employee>
                label='Nome'
                value={data.name}
                onChange={updateField}
                name='name'
                required
              />
            </div>
          </div>

          <div className='w-full mt-4 flex flex-row gap-4'>
            <div className='flex-1'>
              <TextInput<Employee>
                label='CPF'
                value={data.cpf}
                onChange={updateField}
                name='cpf'
                required
              />
            </div>
            <div className='flex-1'>
              <SelectInput<Employee>
                label='Cargo'
                value={data.positionId}
                onChange={updateField}
                options={positions.map(p => ({ value: p.id, label: p.name }))}
                name='positionId'
                required
              />
            </div>
            <div className='flex-1'>
              <TextInput<Employee>
                label='Email'
                type='email'
                value={data.email}
                onChange={updateField}
                name='email'
                required
              />
            </div>
          </div>

          <div className='w-full mt-4 flex flex-row gap-4'>
            <div className='flex-1'>
              <TextInput<Employee>
                label='Telefone'
                value={data.phone}
                onChange={updateField}
                name='phone'
                required
              />
            </div>
            <div className='flex-1'>
              <TextInput<Employee>
                label='CEP'
                value={data.cep}
                onChange={updateField}
                name='cep'
                required
              />
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-8 mb-8'></div>

          <div className='w-full flex flex-row gap-4'>
            <div className='flex-1'>
              <TextInput<Employee>
                label='Rua/Avenida'
                value={data.street}
                onChange={updateField}
                name='street'
                required
              />
            </div>
            <div className='flex-1'>
              <TextInput<Employee>
                label='Número'
                value={data.number}
                onChange={updateField}
                name='number'
                required
              />
            </div>
          </div>

          <div className='w-full mt-4 flex flex-row gap-4'>
            <div className='flex-1'>
              <TextInput<Employee>
                label='Bairro'
                value={data.neighborhood}
                onChange={updateField}
                name='neighborhood'
                required
              />
            </div>
            <div className='flex-1'>
              <TextInput<Employee>
                label='Cidade'
                value={data.city}
                onChange={updateField}
                name='city'
                required
              />
            </div>
            <div className='flex-1'>
              <TextInput<Employee>
                label='Estado'
                value={data.state}
                onChange={updateField}
                name='state'
                required
              />
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-8 mb-8'></div>

<div className='w-full flex flex-row gap-4'>
  <div className='flex-1'>
    <SelectInput<Employee>
      label='Status'
      value={data.statusEmployee}
      onChange={updateField}
      name='statusEmployee'
      options={getStatusEmployeeOptions()}
      required
    />
  </div>

  <div className='flex-1'>
    <label
      htmlFor='hireDate'
      className='block text-sm font-medium text-gray-700'
    >
      Data de Contratação*
    </label>
    <input
      type='datetime-local'
      id='hireDate'
      name='hireDate'
      value={formatDatetimeForInput(data.hireDate)}
      onChange={(e) =>
        updateField('hireDate', new Date(e.target.value).toISOString())
      }
      required
      className='mt-1 block w-full rounded px-3 py-1.5 border border-neutralDark shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none'
    />
  </div>
</div>
  
          <div className='w-full border border-neutralDarker mt-4 mb-8'></div>

          <div className='flex justify-end w-full gap-4'>
            <Button
              label={isEditing ? 'Salvar Alterações' : 'Cadastrar Funcionário'}
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
