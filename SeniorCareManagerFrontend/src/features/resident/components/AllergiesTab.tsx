import { useState } from 'react';
import Button from '@/components/Button';
import SelectInput from '@/components/FormControls/SelectInput';
import TextInput from '@/components/FormControls/TextInput';
import { FormModal } from '@/components/Modal';
import SearchBar from '@/components/SearchBar';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import ResidentAllergy from '@/types/models/ResidentAllergy';
import Allergy from '@/types/models/Allergy';
import { getAllergyTypeOptions } from '@/types/enums/AllergyType';
import { Pencil, Trash } from '@phosphor-icons/react';
import AllergyService from '@/features/allergy/services/allergyService';
import { DateTimeInput } from '@/components/FormControls';

interface AllergyFormData {
  tipo: string;
  nome: string;
  descricao: string;
  dataDeteccao: string;
  dataLiberacao: string;
}

interface PendingAllergy {
  allergyId: number;
  description?: string;
  detectionDate?: string;
  releasedDate?: string;
}

interface AllergiesTabProps {
  formData: AllergyFormData;
  allergies: Allergy[];
  residentAllergies: ResidentAllergy[];
  pendingAllergies: PendingAllergy[];
  currentResidentId: number | null;
  onUpdate: (field: string, value: string) => void;
  onAllergiesReload: (allergies: Allergy[]) => void;
  onResidentAllergiesReload: (residentAllergies: ResidentAllergy[]) => void;
  onPendingAllergiesUpdate: (allergies: PendingAllergy[]) => void;
  onShowAlert: (message: string, type: 'info' | 'success' | 'error') => void;
}

export default function AllergiesTab(props: AllergiesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ tipo: '', nomeAlergia: '' });
  const [editingAllergyId, setEditingAllergyId] = useState<number | null>(null);

  const filteredAllergies = props.formData.tipo
    ? props.allergies.filter((a) => a.type.toString() === props.formData.tipo)
    : props.allergies;

  const getAllAllergiesForDisplay = (): ResidentAllergy[] => {
    return props.pendingAllergies.map((pending, index) => ({
      id: -index - 1,
      residentId: props.currentResidentId || 0,
      allergyId: pending.allergyId,
      description: pending.description,
      detectionDate: pending.detectionDate,
      releasedDate: pending.releasedDate,
    }));
  };

  const handleOpenModal = () => {
    setModalData({ tipo: '', nomeAlergia: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData({ tipo: '', nomeAlergia: '' });
  };

  const handleSubmitModal = async () => {
    if (!modalData.tipo || !modalData.nomeAlergia.trim()) {
      alert('⚠️ Preencha todos os campos obrigatórios.');
      return;
    }

    const typeValue = Number(modalData.tipo);
    if (Number.isNaN(typeValue)) {
      alert('⚠️ Selecione um tipo válido.');
      return;
    }

    setLoading(true);
    try {
      const result = await AllergyService.create({
        id: 0,
        name: modalData.nomeAlergia.trim(),
        type: typeValue,
      });

      if (result.success) {
        const allergiesRes = await AllergyService.getAll();
        if (allergiesRes.success && allergiesRes.data) {
          props.onAllergiesReload(allergiesRes.data);
        }
        alert('✅ Alergia cadastrada com sucesso!');
        handleCloseModal();
      } else {
        alert(`❌ Erro: ${result.message}`);
      }
    } catch (err) {
      alert('❌ Erro ao cadastrar alergia.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllergy = () => {
    if (!props.formData.nome || !props.formData.tipo) {
      props.onShowAlert('Selecione uma alergia para adicionar.', 'error');
      return;
    }

    if (editingAllergyId) {
      setEditingAllergyId(null);
    }

    const allergyId = parseInt(props.formData.nome);

    if (!props.pendingAllergies.find((p) => p.allergyId === allergyId)) {
      props.onPendingAllergiesUpdate([
        ...props.pendingAllergies,
        {
          allergyId,
          description: props.formData.descricao || undefined,
          detectionDate: props.formData.dataDeteccao || undefined,
          releasedDate: props.formData.dataLiberacao || undefined,
        },
      ]);
      props.onUpdate('tipo', '');
      props.onUpdate('nome', '');
      props.onUpdate('descricao', '');
      props.onUpdate('dataDeteccao', '');
      props.onUpdate('dataLiberacao', '');
      props.onShowAlert('Alergia adicionada à lista!', 'success');
    } else {
      props.onShowAlert('Esta alergia já foi adicionada.', 'info');
    }
  };

  const handleEditClick = (allergyId: number) => {
    const allergy = props.allergies.find((a) => a.id === allergyId);
    const pending = props.pendingAllergies.find(
      (p) => p.allergyId === allergyId
    );
    if (allergy) {
      setEditingAllergyId(allergyId);
      props.onUpdate('tipo', allergy.type.toString());
      props.onUpdate('nome', allergy.id.toString());
      props.onUpdate('descricao', pending?.description || '');
      props.onUpdate('dataDeteccao', pending?.detectionDate || '');
      props.onUpdate('dataLiberacao', pending?.releasedDate || '');
    } else {
      props.onShowAlert(
        'Alergia não encontrada na lista de alergias disponíveis. Recarregue a página.',
        'error'
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingAllergyId(null);
    props.onUpdate('tipo', '');
    props.onUpdate('nome', '');
    props.onUpdate('descricao', '');
    props.onUpdate('dataDeteccao', '');
    props.onUpdate('dataLiberacao', '');
  };

  const handleUpdateAllergy = () => {
    if (!props.formData.nome || !props.formData.tipo) {
      props.onShowAlert('Selecione uma alergia para atualizar.', 'error');
      return;
    }

    if (!editingAllergyId) return;

    const newAllergyId = parseInt(props.formData.nome);

    if (
      newAllergyId !== editingAllergyId &&
      props.pendingAllergies.find((p) => p.allergyId === newAllergyId)
    ) {
      props.onShowAlert('Esta alergia já está na lista.', 'info');
      return;
    }

    props.onPendingAllergiesUpdate(
      props.pendingAllergies.map((p) =>
        p.allergyId === editingAllergyId
          ? {
              allergyId: newAllergyId,
              description: props.formData.descricao || undefined,
              detectionDate: props.formData.dataDeteccao || undefined,
              releasedDate: props.formData.dataLiberacao || undefined,
            }
          : p
      )
    );
    handleCancelEdit();
    props.onShowAlert('Alergia atualizada na lista!', 'success');
  };

  const handleRemoveClick = (allergyId: number) => {
    props.onPendingAllergiesUpdate(
      props.pendingAllergies.filter((p) => p.allergyId !== allergyId)
    );
    if (editingAllergyId === allergyId) handleCancelEdit();
    props.onShowAlert('Alergia removida da lista!', 'success');
  };

  const allergyColumns: TableColumn<ResidentAllergy>[] = [
    {
      label: 'Nome',
      attribute: 'allergyId',
      render: (value) =>
        props.allergies.find((a) => a.id === value)?.name || '',
    },
    {
      label: 'Tipo',
      attribute: 'allergyId',
      render: (value) => {
        const allergy = props.allergies.find((a) => a.id === value);
        if (!allergy) return '';
        return (
          getAllergyTypeOptions().find(
            (option) => option.value?.toString() === allergy.type.toString()
          )?.label || allergy.type
        );
      },
    },
    {
      label: 'Descrição',
      attribute: 'description',
    },
    {
      label: 'Data de Detecção',
      attribute: 'detectionDate',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '',
    },
    {
      label: 'Data de Liberação',
      attribute: 'releasedDate',
      render: (value) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '',
    },
  ];

  const allAllergies = getAllAllergiesForDisplay();

  return (
    <div>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <SelectInput
          label='Tipo:'
          name='tipo'
          value={props.formData.tipo}
          options={getAllergyTypeOptions()}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
        <SelectInput
          label='Nome:'
          name='nome'
          value={props.formData.nome}
          options={filteredAllergies.map((a) => ({
            label: a.name,
            value: a.id.toString(),
          }))}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
      </div>
      <div className='mb-4'>
        <TextInput
          label='Descrição:'
          name='descricao'
          value={props.formData.descricao}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
      </div>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <DateTimeInput
          label='Data de Detecção:'
          name='dataDeteccao'
          value={props.formData.dataDeteccao}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
        <DateTimeInput
          label='Data de Liberação:'
          name='dataLiberacao'
          value={props.formData.dataLiberacao}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
      </div>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <div />
        <div className='flex items-center gap-4'>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal();
            }}
            className='text-textSecondary underline hover:text-secondary text-sm font-medium'
          >
            Alergia não encontrada
          </a>
          <FormModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitModal}
            title='Cadastrar nova alergia'
          >
            <div className='flex flex-col gap-4'>
              <SelectInput
                label='Tipo:'
                name='tipo'
                value={modalData.tipo}
                options={getAllergyTypeOptions()}
                onChange={(key, value) =>
                  setModalData({
                    ...modalData,
                    [key as string]: value,
                  })
                }
                required
              />
              <TextInput
                label='Nome da alergia:'
                name='nomeAlergia'
                value={modalData.nomeAlergia}
                onChange={(key, value) =>
                  setModalData({
                    ...modalData,
                    [key as string]: value,
                  })
                }
                required
              />
            </div>
          </FormModal>
          {editingAllergyId ? (
            <>
              <Button
                label='Cancelar'
                onClick={handleCancelEdit}
                color='textSecondary'
                className='whitespace-nowrap'
                disabled={loading}
              />
              <Button
                label='Atualizar alergia'
                onClick={handleUpdateAllergy}
                color='success'
                className='whitespace-nowrap'
                disabled={loading}
              />
            </>
          ) : (
            <Button
              label='+ Adicionar alergia do residente'
              onClick={handleAddAllergy}
              color='success'
              className='whitespace-nowrap'
              disabled={loading}
            />
          )}
        </div>
      </div>
      <div className='relative -left-8 -right-8 w-[calc(100%+64px)] bg-background mt-12 shadow-sm'>
        <hr className='w-full border-t border-textPrimary mt-4' />
        <div className='w-full p-8'>
          <h1 className='text-textPrimary text-xl font-semibold mb-6'>
            Alergias do Residente
          </h1>
          <div className='mb-4'>
            <SearchBar placeholder='Buscar alergia...' />
          </div>
          {allAllergies.length === 0 ? (
            <p className='text-textSecondary text-center py-8'>
              Nenhuma alergia cadastrada para este residente.
            </p>
          ) : (
            <Table
              columns={allergyColumns}
              data={allAllergies}
              rowsPerPage={5}
              actions={(id) => {
                const allergy = allAllergies.find((a) => a.id === id);
                if (!allergy) return <></>;
                return (
                  <>
                    <button
                      onClick={() => handleEditClick(allergy.allergyId)}
                      className='text-edit hover:text-hoverEdit'
                    >
                      <Pencil className='size-6' weight='fill' />
                    </button>
                    <button
                      onClick={() => handleRemoveClick(allergy.allergyId)}
                      className='text-danger hover:text-hoverDanger'
                    >
                      <Trash className='size-6' weight='fill' />
                    </button>
                  </>
                );
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
