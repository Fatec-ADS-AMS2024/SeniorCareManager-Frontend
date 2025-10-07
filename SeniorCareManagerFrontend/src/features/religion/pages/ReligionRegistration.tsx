import { useEffect, useState } from 'react';
import ReligionService from '../services/religionService';
import Religion from '@/types/models/Religion';
import Table from '@/components/Table';
import {
  CheckCircle,
  Pencil,
  Plus,
  Trash,
  XCircle,
} from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import Modal from '@/components/GenericModal';

const inputs: {
  label: string;
  attribute: keyof Religion;
  defaultValue: string;
}[] = [
  {
    label: 'Nome',
    attribute: 'name',
    defaultValue: '',
  },
];

export default function ReligionRegistration() {
  const columns = ['Nome'];
  const [data, setData] = useState<Religion[]>([]);
  const [originalData, setOriginalData] = useState<Religion[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [infoIcon, setInfoIcon] = useState<JSX.Element | undefined>(undefined);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await ReligionService.getAll();
      if (res.data) {
        setData([...res.data]);
        setOriginalData([...res.data]);
      } else {
        console.error('Erro ao buscar dados:', res.message);
      }
    } catch (error) {
      alert(error);
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

  const getRowValues = (id: number) => data.find((row) => row.id === id);

  const openCloseModalRegister = () => {
    setCurrentId(null);
    inputs.forEach((input) => (input.defaultValue = ''));
    setModalRegister(true);
  };

  const openCloseModalEdit = (id?: number) => {
    if (!id) {
      setModalEdit(false);
      setCurrentId(null);
      return;
    }
    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = String(rowValues[input.attribute]);
      });
      setCurrentId(id);
      setModalEdit(true);
    } else {
      showInfoModal('Registro não encontrado', 'error');
    }
  };

  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete(false);
      setCurrentId(null);
      return;
    }
    setCurrentId(id);
    setModalDelete(true);
  };

  const openCloseModalInfo = () => setModalInfo(false);

  const showInfoModal = (message: string, type: 'success' | 'error') => {
    setInfoMessage(message);
    setInfoIcon(
      type === 'success' ? (
        <CheckCircle size={90} className='text-success' weight='fill' />
      ) : (
        <XCircle size={90} className='text-danger' weight='fill' />
      )
    );
    setModalInfo(true);
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

  const handleSave = (model: Religion) => {
    if (currentId !== null) {
      editReligion(currentId, model);
    } else {
      registerReligion(model);
    }
  };

  const registerReligion = async (model: Religion) => {
    const errorMessage = validateReligion(model);

    if (errorMessage) {
      showInfoModal(errorMessage, 'error');
      return;
    }

    try {
      const res = await ReligionService.create(model);
      if (res.success) {
        setModalRegister(false);
        await fetchData();
        showInfoModal(
          `Religião "${res.data?.name}" criada com sucesso!`,
          'success'
        );
      } else {
        showInfoModal(
          res.message || 'Erro inesperado ao criar a religião.',
          'error'
        );
      }
    } catch (error) {
      alert(error);
    }
  };

  const editReligion = async (id: number, model: Religion) => {
    const errorMessage = validateReligion(model, id);

    if (errorMessage) {
      showInfoModal(errorMessage, 'error');
      return;
    }

    const res = await ReligionService.update(id, { ...model, id });
    if (res.success) {
      setModalEdit(false);
      await fetchData();
      showInfoModal(
        `Religião "${res.data?.name}" atualizada com sucesso!`,
        'success'
      );
    } else {
      showInfoModal(
        res.message || 'Erro inesperado ao atualizar a religião.',
        'error'
      );
    }
  };

  const deleteReligion = async (id: number) => {
    try {
      const res = await ReligionService.deleteById(id);
      if (res.success) {
        setModalDelete(false);
        setCurrentId(null);
        const itemName = data.find((item) => item.id === id)?.name || '';
        await fetchData();
        showInfoModal(
          `Religião "${itemName}" excluída com sucesso!`,
          'success'
        );
      } else {
        showInfoModal(
          res.message || 'Erro inesperado ao excluir a Religião.',
          'error'
        );
      }
    } catch {
      showInfoModal('Erro inesperado ao excluir a Religião.', 'error');
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openCloseModalEdit(id)}
        className='text-edit hover:text-hoverEdit'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        onClick={() => openCloseModalDelete(id)}
        className='text-danger hover:text-hoverDanger'
      >
        <Trash className='size-6' weight='fill' />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title='Cadastro de Religião' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <Modal<Religion>
          title='Cadastrar Religião'
          inputs={inputs}
          action={handleSave}
          statusModal={modalRegister}
          closeModal={() => setModalRegister(false)}
          type='create'
        />
        <Modal<Religion>
          type='update'
          title='Editar Religião'
          inputs={inputs}
          action={handleSave}
          statusModal={modalEdit}
          closeModal={() => openCloseModalEdit()}
        />
        <Modal<Religion>
          type='delete'
          title='Deseja realmente excluir essa Religião?'
          msgInformation='Ao excluir esta Religião, ela será removida permanentemente do sistema.'
          action={() => {
            if (currentId !== null) deleteReligion(currentId);
          }}
          statusModal={modalDelete}
          closeModal={() => openCloseModalDelete()}
          inputs={inputs}
        />
        <Modal<Religion>
          type='info'
          msgInformation={infoMessage}
          icon={infoIcon}
          statusModal={modalInfo}
          closeModal={openCloseModalInfo}
        />
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar religião...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCloseModalRegister}
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
