import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import SelectInput from '@/components/FormControls/SelectInput';
import TextInput from '@/components/FormControls/TextInput';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import Resident from '@/types/models/Resident';
import { Plus } from '@phosphor-icons/react';
import { useState } from 'react';

export default function ResidentForm() {
  const [step, setStep] = useState(0);

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
    // render: (value) => getSexLabel(value as number),
  },
  {
    label: 'Idade',
    attribute: 'age',
  },
  {
    label: 'Etnia',
    attribute: 'ethnicity',
    // O campo "ethnicity" também é um enum
    // render: (value) => getEthnicityLabel(value as number),
  },
];

  const stepsData = [
    'Residente',
    'Alergias do Residente',
    'Plano de Saúde',
    'Familiares do Residente',
  ];

  const opcoesSexo = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
    { label: 'Outro', value: 'O' },
  ];

  const opcoesEstadoCivil = [
    { label: 'Solteiro(a)', value: 'solteiro' },
    { label: 'Casado(a)', value: 'casado' },
    { label: 'Divorciado(a)', value: 'divorciado' },
    { label: 'Viúvo(a)', value: 'viuvo' },
  ];

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

  return (
    <div>
      <BreadcrumbPageTitle title='Cadastro Residente' />
      <div className='flex flex-col p-12'>
        {/* Abas */}
        <div className='flex flex-row w-full mx-auto bg-white'>
          {stepsData.map((label, index) => {
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

        <form className='bg-white shadow-lg p-8 relative' >
          {/* Título da aba */}
          <h2 className='text-xl font-semibold text-textPrimary mb-6'>
            {stepsData[step]}
          </h2>

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
                  value={formData.residente.religiao}
                  options={[]} // <-- Adicione suas opções aqui
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
                <SelectInput
                  label='Nome:'
                  name='nome'
                  value={formData.residente.escolaridade}
                  options={[]} // <-- Adicione suas opções aqui
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Data de detecção'
                  name='cpf'
                  value={formData.residente.cpf}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  required
                />
                <TextInput
                  label='Data de liberação'
                  name='pisPasep'
                  value={formData.residente.pisPasep}
                  onChange={(key, v) => updateSection('residente', key, v)}
                />
              </div>

              <div className='flex items-end justify-between gap-4 mb-4'>
                {/* Campo de descrição ocupando metade da largura */}
                <div className='w-1/2'>
                  <TextInput
                    label='Descrição:'
                    name='descricao'
                    value={formData.residente.cpf}
                    onChange={(key, v) => updateSection('residente', key, v)}
                    required
                  />
                </div>

                {/* Link e botão alinhados lado a lado à direita */}
                <div className='flex items-center gap-4'>
                  <a
                    href='#'
                    className='text-textSecondary underline hover:text-secondary text-sm font-medium'
                  >
                    Alergia não encontrada
                  </a>

                  <Button
                    label='+ Adicionar alergia do residente'
                    onClick={handleSubmit}
                    color='success'
                    className='whitespace-nowrap'
                  />
                </div>
              </div>
              <div className='relative -left-8 -right-8 w-[calc(100%+64px)] px-8 bg-red-400'>
                <div className='w-full'>
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
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Plano de saúde'
                value={formData.planoSaude.plano}
                onChange={(v) => updateSection('planoSaude', 'plano', v)}
                required
              />
              <Input
                label='Número da carteirinha'
                value={formData.planoSaude.numeroCarteirinha}
                onChange={(v) =>
                  updateSection('planoSaude', 'numeroCarteirinha', v)
                }
              />
            </div>
          )}
          {step === 3 && (
            <div className='grid grid-cols-2 gap-4'>
              <Input
                label='Nome do familiar'
                value={formData.familiares.nomeFamiliar}
                onChange={(v) => updateSection('familiares', 'nomeFamiliar', v)}
                required
              />
              <Input
                label='Parentesco'
                value={formData.familiares.parentesco}
                onChange={(v) => updateSection('familiares', 'parentesco', v)}
              />
              <Input
                label='Telefone'
                value={formData.familiares.telefone}
                onChange={(v) => updateSection('familiares', 'telefone', v)}
              />
            </div>
          )}

          {/* Botões de navegação */}
          <div className='flex justify-between mt-8'>
            {step > 0 ? (
              <Button
                label='Voltar'
                onClick={handleBack}
                color='neutralLight'
                className='border border-gray-300 hover:bg-gray-100 shadow-none'
              />
            ) : (
              <div />
            )}

            {step < stepsData.length - 1 ? (
              <Button label='Avançar' onClick={handleNext} color='primary' />
            ) : (
              <Button
                label='Finalizar'
                onClick={handleSubmit}
                color='success'
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/* Input Genérico */
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}
function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: InputProps) {
  return (
    <div className='flex flex-col'>
      <label className='text-sm font-medium text-gray-700 mb-1'>
        {label} {required && <span className='text-red-500'>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
      />
    </div>
  );
}
