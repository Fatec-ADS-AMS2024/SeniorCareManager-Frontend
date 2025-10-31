import { useNavigate } from 'react-router-dom';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import { Ethnicity, getEthnicityLabel } from '@/types/enums/Ethnicity';
import { Sex, getSexLabel } from '@/types/enums/Sex';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';

// Tipo de dados esperado em cada linha da tabela
interface Resident {
  id: number;
  socialName: string;
  registeredName: string;
  cpf: string;
  sex: number;
  age: number;
  ethnicity: number;
}

// Dados fictícios (exemplo)
const residents: Resident[] = [
  {
    id: 1,
    socialName: 'João Silva',
    registeredName: 'João Pedro da Silva',
    cpf: '123.456.789-00',
    sex: Sex.MALE,
    age: 72,
    ethnicity: Ethnicity.WHITE,
  },
  {
    id: 2,
    socialName: 'Maria Souza',
    registeredName: 'Maria de Lourdes Souza',
    cpf: '987.654.321-00',
    sex: Sex.FEMALE,
    age: 68,
    ethnicity: Ethnicity.MIXED,
  },
];

// Definição das colunas da tabela
const columns: TableColumn<Resident>[] = [
  {
    label: 'Nome social', // Cabeçalho da coluna
    attribute: 'socialName', // Atributo do objeto Resident
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
    // O campo "sex" é um enum, então é convertido para rótulo
    render: (value) => getSexLabel(value as number),
  },
  {
    label: 'Idade',
    attribute: 'age',
  },
  {
    label: 'Etnia',
    attribute: 'ethnicity',
    // O campo "ethnicity" também é um enum
    render: (value) => getEthnicityLabel(value as number),
  },
];

// Componente principal que renderiza a tabela
export default function ResidentTable() {

  const navigate = useNavigate();

  // Funções de ação (editar/excluir)
  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        // onClick={() => openEditModal(id)}
        className='text-edit hover:text-hoverEdit'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        // onClick={() => openDeleteModal(id)}
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
        <div className='flex items-center justify-between mb-4'>
          <SearchBar placeholder='Buscar religião...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={() => navigate('/ResidentForm')}
          />
        </div>
        <Table
          columns={columns} // Colunas configuradas
          data={residents} // Dados da tabela
          rowsPerPage={5} // Número de linhas por página
          actions={(id) => <Actions id={id} />} // Botões de ação
        />
      </div>
    </div>
  );
}
