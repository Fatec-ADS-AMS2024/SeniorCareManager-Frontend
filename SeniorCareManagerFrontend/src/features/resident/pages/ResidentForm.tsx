import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import SelectInput from '@/components/FormControls/SelectInput';
import TextInput from '@/components/FormControls/TextInput';
import { FormModal } from '@/components/Modal';
import SearchBar from '@/components/SearchBar';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import Resident from '@/types/models/Resident';
import { useState } from 'react';

export default function ResidentForm() {
  const [step, setStep] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitModal = (data?: unknown) => {
    // Lógica que será executada ao salvar a nova alergia
    console.log('Nova alergia cadastrada:', data);
    handleCloseModal();
  };

  // Modal de Plano de Saúde
  const [isModalPlanoOpen, setIsModalPlanoOpen] = useState(false);

  const handleOpenPlanoModal = () => setIsModalPlanoOpen(true);
  const handleClosePlanoModal = () => setIsModalPlanoOpen(false);

  const handleSubmitPlanoModal = (data?: unknown) => {
    console.log('Novo plano de saúde cadastrado:', data);
    handleClosePlanoModal();
  };

  const [formData, setFormData] = useState({
    residente: {
      nome: '',
      nomeSocial: '',
      cpf: '',
      pisPasep: '',
      rg: '',
      orgaoEmissor: '',
      estadoEmissor: '',
      dataNascimento: '',
      idade: '',
      sexo: '',
      etnia: '',
      altura: '',
      peso: '',
      religiao: '',
      escolaridade: '',
      nomePai: '',
      nomeMae: '',
      estadoCivil: '',
      nomeConjuge: '',
      cns: '',
      cartaoPrivado: '',
      celular: '',
      telefone: '',
    },
    alergias: { alergias: '' },
    planoSaude: { plano: '', numeroCarteirinha: '' },
    familiares: { nomeFamiliar: '', parentesco: '', telefone: '' },
  });

  const columns: TableColumn<Resident>[] = [
    {
      label: 'Nome', // Cabeçalho da coluna
      attribute: 'nome', // Atributo do dado
    },
    {
      label: 'Tipo',
      attribute: 'tipo',
    },
    {
      label: 'Descrição',
      attribute: 'descricao',
    },
    {
      label: 'Data de detecção',
      attribute: 'dataDeteccao',
    },
    {
      label: 'Data de liberação',
      attribute: 'dataLiberacao',
    },
  ];

  const tabLabels = [
    'Residente',
    'Alergias',
    'Plano de Saúde',
    'Familiares do Residente',
  ];

  const stepTitles = [
    'Dados do Residente',
    'Adicionar Alergia do Residente',
    'Dados do Plano de Saúde',
    'Adicionar Familiar do Residente',
  ];

  // Apagar apó integração
  const opcoesSexo = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
    { label: 'Outro', value: 'O' },
  ];

  // Apagar apó integração
  const opcoesEstadoCivil = [
    { label: 'Solteiro(a)', value: 'solteiro' },
    { label: 'Casado(a)', value: 'casado' },
    { label: 'Divorciado(a)', value: 'divorciado' },
    { label: 'Viúvo(a)', value: 'viuvo' },
  ];

  // Apagar apó integração
  const opcoesEtnia = [
    { label: 'Branca', value: 'branca' },
    { label: 'Preta', value: 'preta' },
    { label: 'Parda', value: 'parda' },
    { label: 'Amarela', value: 'amarela' },
    { label: 'Indígena', value: 'indigena' },
  ];

  const updateSection = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return (
          formData.residente.nome.trim() !== '' &&
          formData.residente.cpf.trim() !== '' &&
          formData.residente.dataNascimento.trim() !== '' &&
          formData.residente.sexo.trim() !== ''
        );
      case 1:
        return formData.alergias.alergias.trim() !== '';
      case 2:
        return formData.planoSaude.plano.trim() !== '';
      case 3:
        return formData.familiares.nomeFamiliar.trim() !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
    else alert('⚠️ Preencha todos os campos obrigatórios.');
  };
  const handleBack = () => setStep((prev) => prev - 1);
  const handleSubmit = () => {
    if (validateStep()) alert('✅ Cadastro finalizado!');
    else alert('⚠️ Preencha todos os campos.');
  };

  const isAlergiasOrParentesStep = step === 1 || step === 3;
  const titleClasses = `mb-6 ${
    isAlergiasOrParentesStep
      ? 'text-textSecondary text-sl font-medium'
      : 'text-textPrimary text-xl font-semibold'
  }`;

  return (
    <div>
      <BreadcrumbPageTitle title='Cadastro Residente' />
      <div className='flex flex-col p-12'>
        {/* Abas */}
        <div className='flex flex-row w-full mx-auto bg-white'>
          {tabLabels.map((label, index) => {
            const isActive = index === step;
            return (
              <button
                key={index}
                onClick={() => setStep(index)}
                className={`flex w-full items-center px-4 py-2 -mb-px border-b-2 transition-colors ${
                  isActive
                    ? 'border-secondary text-secondary font-medium'
                    : 'border text-textSecondary hover:text-secondary'
                }`}
              >
                <span
                  className={`w-4 h-4 mr-2 rounded-full border ${
                    isActive ? 'border-secondary' : 'border-textSecondary'
                  }`}
                ></span>
                {label}
              </button>
            );
          })}
        </div>

        <form className='bg-white shadow-lg p-8 relative'>
          {/* Título da aba */}
          <h2 className={titleClasses}>{stepTitles[step]}</h2>

          {/* Conteúdo das abas */}
          {step === 0 && (
            <div className='flex flex-col'>
              {/* 1ª LINHA DE CAMPOS (Nome e Nome Social) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Nome'
                  name='nome'
                  value={formData.residente.nome}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  required
                />
                <TextInput
                  label='Nome social'
                  name='nomeSocial'
                  value={formData.residente.nomeSocial}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              {/* 2ª LINHA DE CAMPOS (Documentos: CPF, PIS/PASEP) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='CPF'
                  name='cpf'
                  value={formData.residente.cpf}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  required
                />
                <TextInput
                  label='PIS/PASEP'
                  name='pisPasep'
                  value={formData.residente.pisPasep}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              {/* 3ª LINHA DE CAMPOS (Documentos: RG, Órgão e Estado Emissor) */}
              <div className='grid grid-cols-4 gap-4 mb-4'>
                {/* RG ocupa 2/4 da largura */}
                <div className='col-span-2'>
                  <TextInput
                    label='RG:'
                    name='rg'
                    value={formData.residente.rg}
                    onChange={(key, v) => updateSection('residente', key, v)}
                  />
                </div>
                {/* Órgão Emissor ocupa 1/4 da largura */}
                <TextInput
                  label='Órgão Emissor:'
                  name='orgaoEmissor'
                  value={formData.residente.orgaoEmissor}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                {/* Estado Emissor ocupa 1/4 da largura */}
                <TextInput
                  label='Estado Emissor:'
                  name='estadoEmissor'
                  value={formData.residente.estadoEmissor}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              {/* 4ª LINHA DE CAMPOS (Data Nascimento e Idade) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Data de nascimento:'
                  name='dataNascimento'
                  type='number'
                  value={formData.residente.dataNascimento}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  required
                />
                <TextInput
                  label='Idade:'
                  name='idade'
                  type='number'
                  value={formData.residente.idade}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              {/* 5ª LINHA DE CAMPOS (Sexo e Etnia) - USANDO SELECTINPUT */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <SelectInput
                  label='Sexo:'
                  name='sexo'
                  value={formData.residente.sexo}
                  options={opcoesSexo} // <-- Usando as opções definidas
                  onChange={(key, v) => updateSection('residente', key, v)}
                  required
                />
                <SelectInput
                  label='Etnia:'
                  name='etnia'
                  value={formData.residente.etnia}
                  options={opcoesEtnia} // <-- Usando as opções definidas
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              {/* 6ª LINHA DE CAMPOS (Altura e Peso) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Altura:'
                  name='altura'
                  type='number'
                  value={formData.residente.altura}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <TextInput
                  label='Peso:'
                  name='peso'
                  type='number'
                  value={formData.residente.peso}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              {/* 7ª LINHA DE CAMPOS (Religião e Escolaridade) - USANDO SELECTINPUT */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <SelectInput
                  label='Religião:'
                  name='religiao'
                  value={formData.residente.religiao}
                  options={[]} // <-- Adicione suas opções aqui
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <SelectInput
                  label='Escolaridade:'
                  name='escolaridade'
                  value={formData.residente.escolaridade}
                  options={[]} // <-- Adicione suas opções aqui
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              <hr className='w-full border-t border-textPrimary mt-4 mb-8' />

              {/* 8ª LINHA DE CAMPOS (Filiação) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Nome do pai:'
                  name='nomePai'
                  value={formData.residente.nomePai}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <TextInput
                  label='Nome da mãe:'
                  name='nomeMae'
                  value={formData.residente.nomeMae}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              {/* 9ª LINHA DE CAMPOS (Estado Civil e Cônjuge) - USANDO SELECTINPUT */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <SelectInput
                  label='Estado Civil:'
                  name='estadoCivil'
                  value={formData.residente.estadoCivil}
                  options={opcoesEstadoCivil} // <-- Usando as opções definidas
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <TextInput
                  label='Nome do cônjuge:'
                  name='nomeConjuge'
                  value={formData.residente.nomeConjuge}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              <hr className='w-full border-t border-textPrimary mt-4 mb-8' />

              {/* 10ª LINHA DE CAMPOS (Cartões de Saúde) */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <TextInput
                  label='Número do cartão de saúde nacional (CNS):'
                  name='cns'
                  value={formData.residente.cns}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <TextInput
                  label='Número do cartão de saúde privado:'
                  name='cartaoSaudePrivado'
                  value={formData.residente.cartaoPrivado}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              <hr className='w-full border-t border-textPrimary mt-4 mb-8' />

              {/* 11ª LINHA DE CAMPOS (Telefones) */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <TextInput
                  label='Número do celular:'
                  name='celular'
                  type='number'
                  value={formData.residente.celular}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <TextInput
                  label='Número do telefone residencial:'
                  name='telefoneResidencial'
                  type='number'
                  value={formData.residente.telefone}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              <hr className='w-full border-t border-textPrimary mt-4 mb-8' />
            </div>
          )}

          {step === 1 && (
            <div>
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <SelectInput
                  label='Tipo:'
                  name='tipo'
                  // value={formData.residente.religiao}
                  options={[]} // <-- Adicione suas opções aqui
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <SelectInput
                  label='Nome:'
                  name='nome'
                  // value={formData.residente.escolaridade}
                  options={[]} // <-- Adicione suas opções aqui
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Data de detecção'
                  name='cpf'
                  // value={formData.residente.cpf}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  required
                />
                <TextInput
                  label='Data de liberação'
                  name='pisPasep'
                  // value={formData.residente.pisPasep}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              <div className='flex items-end justify-between gap-4 mb-4'>
                {/* Campo de descrição ocupando metade da largura */}
                <div className='w-1/2'>
                  <TextInput
                    label='Descrição:'
                    name='descricao'
                    // value={formData.residente.cpf}
                    onChange={(key, v) => updateSection('residente', key, v)}
                    required
                  />
                </div>

                {/* Link e botão alinhados lado a lado à direita */}
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
                        options={[
                          { label: 'Alimentar', value: 'alimentar' },
                          { label: 'Medicamento', value: 'medicamento' },
                          { label: 'Outros', value: 'outros' },
                        ]}
                        onChange={() => {}}
                      />
                      <TextInput
                        label='Nome da alergia:'
                        name='nomeAlergia'
                        onChange={() => {}}
                      />
                    </div>
                  </FormModal>

                  <Button
                    label='+ Adicionar alergia do residente'
                    onClick={handleSubmit}
                    color='success'
                    className='whitespace-nowrap'
                  />
                </div>
              </div>
              <div className='relative -left-8 -right-8 w-[calc(100%+64px)] bg-background mt-12 shadow-sm'>
                <hr className='w-full border-t border-textPrimary mt-4' />
                <div className='w-full p-8'>
                  <h1 className='text-textPrimary text-xl font-semibold mb-6'>
                    Alergias do Residente
                  </h1>
                  <div className='mb-4'>
                    <SearchBar placeholder='Buscar alergia...'></SearchBar>
                  </div>
                  <Table
                    columns={columns} // Colunas configuradas
                    data={[]} // Dados da tabela
                    rowsPerPage={5} // Número de linhas por página

                    //actions={(id) => <Actions id={id} />} // Botões de ação
                  />
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className='grid grid-cols-2 gap-4'>
                <SelectInput
                  label='Tipo:'
                  name='tipo'
                  // value={formData.residente.religiao}
                  options={[
                    {
                      label: 'Nenhum',
                      value: undefined,
                    },
                  ]} // <-- Adicione suas opções aqui
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <SelectInput
                  label='Nome:'
                  name='nome'
                  // value={formData.residente.escolaridade}
                  options={[]} // <-- Adicione suas opções aqui
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>
              <div className='flex justify-end mt-6'>
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenPlanoModal();
                  }}
                  className='text-textSecondary underline hover:text-secondary text-sm font-medium mt-2'
                >
                  Plano de saúde não encontrado
                </a>

                <FormModal
                  isOpen={isModalPlanoOpen}
                  onClose={handleClosePlanoModal}
                  onSubmit={handleSubmitPlanoModal}
                  title='Cadastrar novo plano de saúde'
                >
                  <div className='flex flex-col gap-4'>
                    <SelectInput
                      label='Tipo:'
                      name='tipo'
                      options={[
                        { label: 'Privado', value: 'privado' },
                        { label: 'Público (SUS)', value: 'publico' },
                        { label: 'Outros', value: 'outros' },
                      ]}
                      onChange={() => {}}
                    />
                    <TextInput
                      label='Nome do plano:'
                      name='nomePlano'
                      onChange={() => {}}
                    />
                    <TextInput
                      label='Abreviação:'
                      name='abreviacao'
                      onChange={() => {}}
                    />
                  </div>
                </FormModal>
              </div>
              <hr className='w-full border-t border-textPrimary mt-4 mb-8' />
            </div>
          )}
          {step === 3 && (
            <div className='flex flex-col'>
              {/* Linha 1: Nome e Parentesco */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Nome'
                  name='nomeFamiliar'
                  value={formData.familiares.nomeFamiliar}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                  required
                />
                <SelectInput
                  label='Parentesco'
                  name='parentesco'
                  value={formData.familiares.parentesco}
                  options={[
                    { label: 'Pai', value: 'pai' },
                    { label: 'Mãe', value: 'mae' },
                    { label: 'Filho(a)', value: 'filho' },
                    { label: 'Irmão(ã)', value: 'irmao' },
                    { label: 'Outro', value: 'outro' },
                  ]}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
              </div>

              {/* Linha 2: RG, Órgão Emissor, Estado Emissor */}
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div className='col-span-2'>
                  <TextInput
                    label='RG'
                    name='rg'
                    value={formData.familiares.rg || ''}
                    onChange={(key, v) => updateSection('familiares', key, v)}
                  />
                </div>
                <TextInput
                  label='Órgão Emissor'
                  name='orgaoEmissor'
                  value={formData.familiares.orgaoEmissor || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
                <TextInput
                  label='Estado Emissor'
                  name='estadoEmissor'
                  value={formData.familiares.estadoEmissor || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
              </div>

              {/* Linha 3: CPF e E-mail */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='CPF'
                  name='cpf'
                  value={formData.familiares.cpf || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
                <TextInput
                  label='E-mail'
                  name='email'
                  value={formData.familiares.email || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
              </div>

              {/* Linha 4: Telefones */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Número de celular'
                  name='celular'
                  type='number'
                  value={formData.familiares.celular || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
                <TextInput
                  label='Número de telefone residencial'
                  name='telefoneResidencial'
                  type='number'
                  value={formData.familiares.telefoneResidencial || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
              </div>

              <hr className='w-full border-t border-textPrimary mt-4 mb-8' />

              {/* Linha 5: Endereço */}
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div className='col-span-2'>
                  <TextInput
                    label='Rua'
                    name='rua'
                    value={formData.familiares.rua || ''}
                    onChange={(key, v) => updateSection('familiares', key, v)}
                  />
                </div>
                <TextInput
                  label='Número'
                  name='numero'
                  value={formData.familiares.numero || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
                <TextInput
                  label='CEP'
                  name='cep'
                  value={formData.familiares.cep || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
              </div>

              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Bairro'
                  name='bairro'
                  value={formData.familiares.bairro || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
                <TextInput
                  label='Complemento (opcional)'
                  name='complemento'
                  value={formData.familiares.complemento || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
              </div>

              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div className='col-span-2'>
                  <TextInput
                    label='Cidade'
                    name='cidade'
                    value={formData.familiares.cidade || ''}
                    onChange={(key, v) => updateSection('familiares', key, v)}
                  />
                </div>
                <TextInput
                  label='Estado'
                  name='estado'
                  value={formData.familiares.estado || ''}
                  onChange={(key, v) => updateSection('familiares', key, v)}
                />
              </div>

              {/* Botão de adicionar familiar */}
              <div className='flex justify-end mt-6'>
                <Button
                  label='+ Adicionar familiar do residente'
                  onClick={() => alert('Familiar adicionado!')}
                  color='success'
                  size='medium'
                  className='font-medium'
                />
              </div>

              {/* Seção: Lista de familiares */}
              <div className='relative -left-8 -right-8 w-[calc(100%+64px)] bg-background mt-12 shadow-sm'>
                <hr className='w-full border-t border-textPrimary' />
                <div className='w-full p-8'>
                  <h2 className='text-textPrimary text-xl font-semibold mb-6'>
                    Familiares do Residente
                  </h2>
                  <div className='mb-4'>
                    <SearchBar placeholder='Buscar familiar...' />
                  </div>
                  <Table
                    columns={[
                      { label: 'Nome', attribute: 'nomeFamiliar' },
                      { label: 'Parentesco', attribute: 'parentesco' },
                    ]}
                    data={[]} // ← Aqui entram os familiares cadastrados
                    rowsPerPage={5}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div className='flex justify-end mt-8 gap-4'>
            {step > 0 && (
              <Button
                label='Voltar'
                onClick={handleBack}
                color='neutralLight'
                size='medium'
                className='hover:bg-neutralDark/10 text-textPrimary shadow-none'
              />
            )}

            {step < stepTitles.length - 1 ? (
              <Button
                label='Avançar'
                onClick={handleNext}
                color='primary'
                size='medium'
                className='font-medium'
              />
            ) : (
              <Button
                label='Finalizar cadastro de residente'
                onClick={handleSubmit}
                color='primary'
                size='medium'
                className='font-medium'
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
