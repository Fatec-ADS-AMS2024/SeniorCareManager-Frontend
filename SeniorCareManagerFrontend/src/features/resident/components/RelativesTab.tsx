import { useState } from 'react';
import Button from '@/components/Button';
import TextInput from '@/components/FormControls/TextInput';
import SelectInput from '@/components/FormControls/SelectInput';
import SearchBar from '@/components/SearchBar';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import ResidentRelative from '@/types/models/ResidentRelative';
import { getRelationshipOptions } from '@/types/enums/Relationship';
import { Pencil, Trash } from '@phosphor-icons/react';

interface RelativeFormData {
  nomeFamiliar: string;
  parentesco: string;
  rg: string;
  orgaoEmissor: string;
  estadoEmissor: string;
  cpf: string;
  email: string;
  celular: string;
  telefoneResidencial: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface RelativesTabProps {
  formData: RelativeFormData;
  residentRelatives: ResidentRelative[];
  pendingRelatives: ResidentRelative[];
  currentResidentId: number | null;
  onUpdate: (field: string, value: string) => void;
  onRelativesReload: (relatives: ResidentRelative[]) => void;
  onPendingRelativesUpdate: (relatives: ResidentRelative[]) => void;
  onShowAlert: (message: string, type: 'info' | 'success' | 'error') => void;
  onClearForm: () => void;
}

export default function RelativesTab(props: RelativesTabProps) {
  const [editingRelativeIndex, setEditingRelativeIndex] = useState<
    number | null
  >(null);

  const getAllRelativesForDisplay = (): ResidentRelative[] => {
    return props.pendingRelatives.map((relative, index) => ({
      ...relative,
      id: relative.id || -index - 1,
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCEP = (cep: string): boolean => {
    const cepClean = cep.replace(/\D/g, '');
    return cepClean.length === 8;
  };

  const handleEditClick = (index: number) => {
    const relative = props.pendingRelatives[index];
    if (relative) {
      setEditingRelativeIndex(index);
      props.onUpdate('nomeFamiliar', relative.name || '');
      props.onUpdate('parentesco', String(relative.relationship) || '');
      props.onUpdate('rg', relative.rg || '');
      props.onUpdate('orgaoEmissor', relative.issuingBody || '');
      props.onUpdate('estadoEmissor', relative.issuingState || '');
      props.onUpdate('cpf', relative.cpf || '');
      props.onUpdate('email', relative.email || '');
      props.onUpdate('celular', relative.mobileNumber || '');
      props.onUpdate('telefoneResidencial', relative.homePhoneNumber || '');
      props.onUpdate('rua', relative.street || '');
      props.onUpdate('numero', relative.number || '');
      props.onUpdate('complemento', relative.addressComplement || '');
      props.onUpdate('bairro', relative.district || '');
      props.onUpdate('cidade', relative.city || '');
      props.onUpdate('estado', relative.state || '');
      props.onUpdate('cep', relative.postalCode || '');
    }
  };

  const handleCancelEdit = () => {
    setEditingRelativeIndex(null);
    props.onClearForm();
  };

  const handleAddOrUpdate = () => {
    const f = props.formData;

    if (!f.nomeFamiliar || f.nomeFamiliar.trim() === '') {
      props.onShowAlert('Nome do familiar é obrigatório.', 'error');
      return;
    }

    if (!f.parentesco || f.parentesco.trim() === '') {
      props.onShowAlert('Parentesco é obrigatório.', 'error');
      return;
    }

    if (!f.rg || f.rg.trim() === '') {
      props.onShowAlert('RG é obrigatório.', 'error');
      return;
    }

    if (!f.estadoEmissor || f.estadoEmissor.trim() === '') {
      props.onShowAlert('Estado emissor é obrigatório.', 'error');
      return;
    }

    if (!f.cpf || f.cpf.trim() === '') {
      props.onShowAlert('CPF é obrigatório.', 'error');
      return;
    }

    if (!f.celular || f.celular.trim() === '') {
      props.onShowAlert('Celular é obrigatório.', 'error');
      return;
    }

    if (!f.rua || f.rua.trim() === '') {
      props.onShowAlert('Rua é obrigatória.', 'error');
      return;
    }

    if (!f.numero || f.numero.trim() === '') {
      props.onShowAlert('Número é obrigatório.', 'error');
      return;
    }

    if (!f.bairro || f.bairro.trim() === '') {
      props.onShowAlert('Bairro é obrigatório.', 'error');
      return;
    }

    if (!f.cidade || f.cidade.trim() === '') {
      props.onShowAlert('Cidade é obrigatória.', 'error');
      return;
    }

    if (!f.estado || f.estado.trim() === '') {
      props.onShowAlert('Estado é obrigatório.', 'error');
      return;
    }

    if (!f.cep || f.cep.trim() === '') {
      props.onShowAlert('CEP é obrigatório.', 'error');
      return;
    }

    if (f.email && f.email.trim() !== '' && !validateEmail(f.email.trim())) {
      props.onShowAlert('Email inválido.', 'error');
      return;
    }

    if (f.celular && f.celular.trim() !== '') {
      const celularClean = f.celular.replace(/\D/g, '');
      if (celularClean.length < 10 || celularClean.length > 11) {
        props.onShowAlert('Celular deve ter 10 ou 11 dígitos.', 'error');
        return;
      }
    }

    if (f.telefoneResidencial && f.telefoneResidencial.trim() !== '') {
      const telefoneClean = f.telefoneResidencial.replace(/\D/g, '');
      if (telefoneClean.length < 10 || telefoneClean.length > 11) {
        props.onShowAlert(
          'Telefone residencial deve ter 10 ou 11 dígitos.',
          'error'
        );
        return;
      }
    }

    if (f.cep && f.cep.trim() !== '' && !validateCEP(f.cep.trim())) {
      props.onShowAlert('CEP deve ter 8 dígitos.', 'error');
      return;
    }

    if (f.cpf && f.cpf.trim() !== '') {
      const cpfClean = f.cpf.replace(/\D/g, '');
      if (cpfClean.length !== 11) {
        props.onShowAlert('CPF deve ter 11 dígitos.', 'error');
        return;
      }
    }

    const relativeDTO: ResidentRelative = {
      id:
        editingRelativeIndex !== null
          ? props.pendingRelatives[editingRelativeIndex]?.id
          : 0,
      residentId: props.currentResidentId || 0,
      name: f.nomeFamiliar.trim(),
      relationship: Number(f.parentesco.trim()),
      cpf: f.cpf?.trim() || '',
      rg: f.rg?.trim() || '',
      issuingBody: f.orgaoEmissor?.trim(),
      issuingState: f.estadoEmissor?.trim() || '',
      citizenship: f.cpf?.trim(),
      mobileNumber: f.celular?.trim() || '',
      homePhoneNumber: f.telefoneResidencial?.trim(),
      email: f.email?.trim(),
      street: f.rua?.trim() || '',
      number: f.numero?.trim() || '',
      district: f.bairro?.trim() || '',
      addressComplement: f.complemento?.trim(),
      city: f.cidade?.trim() || '',
      state: f.estado?.trim() || '',
      postalCode: f.cep?.trim() || '',
    };

    if (editingRelativeIndex !== null) {
      props.onPendingRelativesUpdate(
        props.pendingRelatives.map((rel, idx) =>
          idx === editingRelativeIndex ? relativeDTO : rel
        )
      );
      props.onShowAlert('Familiar atualizado na lista!', 'success');
    } else {
      props.onPendingRelativesUpdate([...props.pendingRelatives, relativeDTO]);
      props.onShowAlert('Familiar adicionado à lista!', 'success');
    }

    handleCancelEdit();
  };

  const handleRemoveClick = (index: number) => {
    props.onPendingRelativesUpdate(
      props.pendingRelatives.filter((_, idx) => idx !== index)
    );
    if (editingRelativeIndex === index) handleCancelEdit();
    props.onShowAlert('Familiar removido da lista!', 'success');
  };

  const relationshipOptions = getRelationshipOptions().map((option) => ({
    label: option.label,
    value: option.label,
  }));

  const relativeColumns: TableColumn<ResidentRelative>[] = [
    { label: 'Nome', attribute: 'name' },
    {
      label: 'Parentesco',
      attribute: 'relationship',
      render: (value) => {
        const option = getRelationshipOptions().find(
          (opt) => opt.value === value
        );
        return option?.label || value || '';
      },
    },
    { label: 'CPF', attribute: 'cpf' },
    { label: 'E-mail', attribute: 'email' },
    { label: 'Telefone', attribute: 'mobileNumber' },
  ];

  const allRelatives = getAllRelativesForDisplay();

  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <TextInput
          label='Nome'
          name='nomeFamiliar'
          value={props.formData.nomeFamiliar}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
        <SelectInput
          label='Parentesco'
          name='parentesco'
          value={props.formData.parentesco}
          options={relationshipOptions}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
      </div>

      <div className='grid grid-cols-4 gap-4 mb-4'>
        <div className='col-span-2'>
          <TextInput
            label='RG'
            name='rg'
            value={props.formData.rg}
            onChange={(key, v) => props.onUpdate(key, v)}
            required
          />
        </div>
        <TextInput
          label='Órgão Emissor'
          name='orgaoEmissor'
          value={props.formData.orgaoEmissor}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
        <TextInput
          label='Estado Emissor'
          name='estadoEmissor'
          value={props.formData.estadoEmissor}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <TextInput
          label='CPF'
          name='cpf'
          value={props.formData.cpf}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
        <TextInput
          label='E-mail'
          name='email'
          type='email'
          value={props.formData.email}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <TextInput
          label='Número de celular'
          name='celular'
          type='text'
          value={props.formData.celular}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
        <TextInput
          label='Número de telefone residencial'
          name='telefoneResidencial'
          type='text'
          value={props.formData.telefoneResidencial}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
      </div>

      <hr className='w-full border-t border-textPrimary mt-4 mb-8' />

      <div className='grid grid-cols-4 gap-4 mb-4'>
        <div className='col-span-2'>
          <TextInput
            label='Rua'
            name='rua'
            value={props.formData.rua}
            onChange={(key, v) => props.onUpdate(key, v)}
            required
          />
        </div>
        <TextInput
          label='Número'
          name='numero'
          value={props.formData.numero}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
        <TextInput
          label='CEP'
          name='cep'
          value={props.formData.cep}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <TextInput
          label='Bairro'
          name='bairro'
          value={props.formData.bairro}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
        <TextInput
          label='Complemento (opcional)'
          name='complemento'
          value={props.formData.complemento}
          onChange={(key, v) => props.onUpdate(key, v)}
        />
      </div>

      <div className='grid grid-cols-4 gap-4 mb-4'>
        <div className='col-span-2'>
          <TextInput
            label='Cidade'
            name='cidade'
            value={props.formData.cidade}
            onChange={(key, v) => props.onUpdate(key, v)}
            required
          />
        </div>
        <TextInput
          label='Estado'
          name='estado'
          value={props.formData.estado}
          onChange={(key, v) => props.onUpdate(key, v)}
          required
        />
      </div>

      <div className='flex justify-end mt-6 gap-4'>
        {editingRelativeIndex !== null ? (
          <>
            <Button
              label='Cancelar'
              onClick={handleCancelEdit}
              color='textSecondary'
              className='whitespace-nowrap'
            />
            <Button
              label='Atualizar familiar'
              onClick={handleAddOrUpdate}
              color='success'
              size='medium'
              className='font-medium whitespace-nowrap'
            />
          </>
        ) : (
          <Button
            label='+ Adicionar familiar do residente'
            onClick={handleAddOrUpdate}
            color='success'
            size='medium'
            className='font-medium'
          />
        )}
      </div>

      <div className='relative -left-8 -right-8 w-[calc(100%+64px)] bg-background mt-12 shadow-sm'>
        <hr className='w-full border-t border-textPrimary' />
        <div className='w-full p-8'>
          <h2 className='text-textPrimary text-xl font-semibold mb-6'>
            Familiares do Residente
          </h2>
          <div className='mb-4'>
            <SearchBar placeholder='Buscar familiar...' />
          </div>
          {allRelatives.length === 0 ? (
            <p className='text-textSecondary text-center py-8'>
              Nenhum familiar cadastrado para este residente.
            </p>
          ) : (
            <Table
              columns={relativeColumns}
              data={allRelatives}
              rowsPerPage={5}
              actions={(id) => {
                const index = allRelatives.findIndex((r) => r.id === id);
                if (index === -1) return <></>;
                return (
                  <>
                    <button
                      onClick={() => handleEditClick(index)}
                      className='text-edit hover:text-hoverEdit'
                    >
                      <Pencil className='size-6' weight='fill' />
                    </button>
                    <button
                      onClick={() => handleRemoveClick(index)}
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
