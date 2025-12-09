import TextInput from '@/components/FormControls/TextInput';
import SelectInput from '@/components/FormControls/SelectInput';
import { getSexOptions } from '@/types/enums/Sex';
import { getMaritalStatusOptions } from '@/types/enums/MaritalStatus';
import { getEthnicityOptions } from '@/types/enums/Ethnicity';
import { DateTimeInput } from '@/components/FormControls';
import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import Religion from '@/types/models/Religion';

interface ResidentFormData {
  nome: string;
  nomeSocial: string;
  cpf: string;
  pisPasep: string;
  rg: string;
  orgaoEmissor: string;
  estadoEmissor: string;
  dataNascimento: string;
  idade: string;
  sexo: string;
  etnia: string;
  altura: string;
  peso: string;
  religiao: string;
  nomePai: string;
  nomeMae: string;
  estadoCivil: string;
  nomeConjuge: string;
  cns: string;
  cartaoPrivado: string;
  celular: string;
  telefone: string;
  planoSaude: string;
}

interface ResidentDataTabProps {
  formData: ResidentFormData;
  errors: Record<string, string>;
  healthPlans: HealthInsurancePlan[];
  religions: Religion[];
  onUpdate: (field: string, value: string | number | undefined | null) => void;
  getValidNumberValue: (value: string | undefined | null) => string;
}

export default function ResidentDataTab({
  formData,
  errors,
  healthPlans,
  religions,
  onUpdate,
  getValidNumberValue,
}: ResidentDataTabProps) {
  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <TextInput
          label='Nome'
          name='nome'
          value={formData.nome}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.nome']}
          required
        />
        <TextInput
          label='Nome social'
          name='nomeSocial'
          value={formData.nomeSocial}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.nomeSocial']}
          required
        />
      </div>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <TextInput
          label='CPF'
          name='cpf'
          value={formData.cpf}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.cpf']}
          required
        />
        <TextInput
          label='PIS/PASEP'
          name='pisPasep'
          value={formData.pisPasep}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.pisPasep']}
          required
        />
      </div>
      <div className='grid grid-cols-4 gap-4 mb-4'>
        <div className='col-span-2'>
          <TextInput
            label='RG'
            name='rg'
            value={formData.rg}
            onChange={(key, v) => onUpdate(key, v)}
            error={errors['residente.rg']}
            required
          />
        </div>
        <TextInput
          label='Órgão Emissor'
          name='orgaoEmissor'
          value={formData.orgaoEmissor}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.orgaoEmissor']}
          required
        />
        <TextInput
          label='Estado Emissor'
          name='estadoEmissor'
          value={formData.estadoEmissor}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.estadoEmissor']}
          required
        />
      </div>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <DateTimeInput
          label='Data de nascimento'
          name='dataNascimento'
          value={formData.dataNascimento}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.dataNascimento']}
          required
        />
        <TextInput
          label='Idade'
          name='idade'
          type='number'
          value={getValidNumberValue(formData.idade)}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.idade']}
          readOnly
        />
      </div>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <SelectInput
          label='Sexo'
          name='sexo'
          value={formData.sexo}
          options={getSexOptions()}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.sexo']}
          required
        />
        <SelectInput
          label='Etnia'
          name='etnia'
          value={formData.etnia}
          options={getEthnicityOptions()}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.etnia']}
          required
        />
      </div>
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <TextInput
          label='Altura'
          name='altura'
          type='number'
          step='0.01'
          min='0'
          value={getValidNumberValue(formData.altura)}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.altura']}
        />
        <TextInput
          label='Peso'
          name='peso'
          type='number'
          step='0.01'
          min='0'
          value={getValidNumberValue(formData.peso)}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.peso']}
        />
      </div>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <SelectInput
          label='Religião'
          name='religiao'
          value={formData.religiao}
          options={religions.map((r) => ({ label: r.name, value: r.id }))}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.religiao']}
        />
        <SelectInput
          label='Plano de Saúde'
          name='planoSaude'
          value={formData.planoSaude}
          options={healthPlans.map((p) => ({ label: p.name, value: p.id }))}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.planoSaude']}
        />
      </div>
      <hr className='w-full border-t border-textPrimary mt-4 mb-8' />
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <TextInput
          label='Nome do pai'
          name='nomePai'
          value={formData.nomePai}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.nomePai']}
          required
        />
        <TextInput
          label='Nome da mãe'
          name='nomeMae'
          value={formData.nomeMae}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.nomeMae']}
          required
        />
      </div>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <SelectInput
          label='Estado Civil'
          name='estadoCivil'
          value={formData.estadoCivil}
          options={getMaritalStatusOptions()}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.estadoCivil']}
          required
        />
        <TextInput
          label='Nome do cônjuge'
          name='nomeConjuge'
          value={formData.nomeConjuge}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.nomeConjuge']}
        />
      </div>
      <hr className='w-full border-t border-textPrimary mt-4 mb-8' />
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <TextInput
          label='Número do cartão de saúde nacional (CNS)'
          name='cns'
          value={formData.cns}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.cns']}
        />
        <TextInput
          label='Número do cartão de saúde privado'
          name='cartaoPrivado'
          value={formData.cartaoPrivado}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.cartaoPrivado']}
        />
      </div>
      <hr className='w-full border-t border-textPrimary mt-4 mb-8' />
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <TextInput
          label='Número do celular'
          name='celular'
          type='text'
          value={formData.celular}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.celular']}
        />
        <TextInput
          label='Número do telefone residencial'
          name='telefone'
          type='text'
          value={formData.telefone}
          onChange={(key, v) => onUpdate(key, v)}
          error={errors['residente.telefone']}
        />
      </div>
      <hr className='w-full border-t border-textPrimary mt-4 mb-8' />
    </div>
  );
}
