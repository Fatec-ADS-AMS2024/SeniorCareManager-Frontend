import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import SelectInput from '@/components/FormControls/SelectInput';
import TextInput from '@/components/FormControls/TextInput';
import { FormModal } from '@/components/Modal';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import AlertModal from '@/components/Modal/AlertModal';
import SearchBar from '@/components/SearchBar';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import ResidentAllergy from '@/types/models/ResidentAllergy';
import ResidentRelative from '@/types/models/ResidentRelative';
import Allergy from '@/types/models/Allergy';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResidentService, {
  ResidentDTO,
  ResidentRelativeDTO,
} from '../services/residentService';
import AllergyService from '@/features/allergy/services/allergyService';
import HealthInsurancePlanService from '@/features/healthInsurancePlan/services/healthInsurancePlanService';
import { getSexOptions } from '@/types/enums/Sex';
import { getMaritalStatusOptions } from '@/types/enums/MaritalStatus';
import { getEthnicityOptions } from '@/types/enums/Ethnicity';
import { getRelationshipOptions } from '@/types/enums/Relationship';
import { getAllergyTypeOptions } from '@/types/enums/AllergyType';
import { getHealthInsurancePlanTypeOptions, HealthPlanType } from '@/types/enums/HealthPlanType';
import { CheckCircle, Circle, Trash, Pencil } from '@phosphor-icons/react';

interface FormErrors {
  [key: string]: string;
}

export default function ResidentForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [currentResidentId, setCurrentResidentId] = useState<number | null>(
    id ? parseInt(id) : null
  );

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [residentAllergies, setResidentAllergies] = useState<ResidentAllergy[]>([]);
  const [pendingAllergies, setPendingAllergies] = useState<number[]>([]);
  const [healthPlans, setHealthPlans] = useState<any[]>([]);
  const [religions] = useState<any[]>([]);
  const [residentRelatives, setResidentRelatives] = useState<ResidentRelative[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPlanoOpen, setIsModalPlanoOpen] = useState(false);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>('info');
  
  const [isDeleteAllergyConfirmOpen, setIsDeleteAllergyConfirmOpen] = useState(false);
  const [deleteAllergyId, setDeleteAllergyId] = useState<number | null>(null);
  const [deleteAllergyResidentId, setDeleteAllergyResidentId] = useState<number | null>(null);
  
  const [editingAllergyId, setEditingAllergyId] = useState<number | null>(null);
  const [editingResidentAllergyId, setEditingResidentAllergyId] = useState<number | null>(null);
  
  const [editingRelativeId, setEditingRelativeId] = useState<number | null>(null);
  
  const [isDeleteRelativeConfirmOpen, setIsDeleteRelativeConfirmOpen] = useState(false);
  const [deleteRelativeId, setDeleteRelativeId] = useState<number | null>(null);
  const [deleteRelativeResidentId, setDeleteRelativeResidentId] = useState<number | null>(null);

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
  };

  const [modalAllergyData, setModalAllergyData] = useState({
    tipo: '',
    nomeAlergia: '',
  });
  const [modalPlanoData, setModalPlanoData] = useState({
    tipo: '',
    nomePlano: '',
    abreviacao: '',
  });

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
      nomePai: '',
      nomeMae: '',
      estadoCivil: '',
      nomeConjuge: '',
      cns: '',
      cartaoPrivado: '',
      celular: '',
      telefone: '',
      planoSaude: '',
    },
    alergia: {
      tipo: '',
      nome: '',
    },
    planoSaude: {
      plano: '',
      numeroCarteirinha: '',
    },
    familiar: {
      nomeFamiliar: '',
      parentesco: '',
      rg: '',
      orgaoEmissor: '',
      estadoEmissor: '',
      cpf: '',
      email: '',
      celular: '',
      telefoneResidencial: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
    },
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        try {
          const allergiesRes = await AllergyService.getAll();
          if (allergiesRes.success && allergiesRes.data) {
            setAllergies(allergiesRes.data);
          }
        } catch (error) {
          // Silenciosamente ignora erros do endpoint de alergias (pode não existir)
          // Não faz nada, apenas não carrega alergias
        }

        const plansRes = await HealthInsurancePlanService.getAll();
        if (plansRes.success && plansRes.data) {
          setHealthPlans(plansRes.data);
        }

        // Carregar religiões (se houver serviço)
        // const religionsRes = await ReligionService.getAll();
        // if (religionsRes.success && religionsRes.data) {
        //   setReligions(religionsRes.data);
        // }

        // Se estiver editando, carregar dados do residente
        if (currentResidentId) {
          const residentRes = await ResidentService.getById(currentResidentId);
          if (residentRes.success && residentRes.data) {
            const resident = residentRes.data;
            setFormData({
              residente: {
                nome: resident.registeredName || '',
                nomeSocial: resident.socialName || '',
                cpf: resident.cpf || '',
                pisPasep: resident.pisPasep || '',
                rg: resident.rg || '',
                orgaoEmissor: resident.issuingBody || '',
                estadoEmissor: resident.issuingState || '',
                dataNascimento: resident.dateOfBirth
                  ? new Date(resident.dateOfBirth).toISOString().split('T')[0]
                  : '',
                idade: resident.age || '',
                sexo: resident.sex?.toString() || '',
                etnia: resident.ethnicity?.toString() || '',
                altura: resident.height != null && !isNaN(Number(resident.height)) 
                  ? resident.height.toString() 
                  : '',
                peso: resident.weight != null && !isNaN(Number(resident.weight))
                  ? resident.weight.toString()
                  : '',
                religiao: resident.religionId?.toString() || '',
                nomePai: resident.fatherName || '',
                nomeMae: resident.motherName || '',
                estadoCivil: resident.maritalStatus?.toString() || '',
                nomeConjuge: resident.spouseName || '',
                cns: resident.nationalHealthCardNumber || '',
                cartaoPrivado: resident.privateHealthCardNumber || '',
                celular: resident.mobileNumber || '',
                telefone: resident.homePhoneNumber || '',
                planoSaude: resident.healthInsurancePlanId?.toString() || '',
              },
              alergia: { tipo: '', nome: '' },
    planoSaude: { plano: '', numeroCarteirinha: '' },
              familiar: {
                nomeFamiliar: '',
                parentesco: '',
                rg: '',
                orgaoEmissor: '',
                estadoEmissor: '',
                cpf: '',
                email: '',
                celular: '',
                telefoneResidencial: '',
                rua: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
              },
            });

            if (currentResidentId) {
              try {
                const allergiesRes = await ResidentService.getAllergies(currentResidentId);
                if (allergiesRes.success && allergiesRes.data) {
                  setResidentAllergies(allergiesRes.data);
                }
              } catch (error) {
                // Ignora erros 404
              }

              try {
                const relativesRes = await ResidentService.getRelatives(currentResidentId);
                if (relativesRes.success && relativesRes.data) {
                  setResidentRelatives(relativesRes.data);
                }
              } catch (error) {
                // Ignora erros 404
              }
            }
          }
        } else {
          setResidentAllergies([]);
          setResidentRelatives([]);
        }
      } catch (error) {
        // Erro ao carregar dados
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [currentResidentId]);

  const getValidNumberValue = (value: string | undefined | null): string => {
    if (!value || value.trim() === '') return '';
    const num = Number(value);
    if (isNaN(num)) return '';
    return value;
  };

  const calculateAge = (dateOfBirth: string): string => {
    if (!dateOfBirth || dateOfBirth.trim() === '') return '';
    
    let normalizedDate = dateOfBirth.trim();
    const brazilianDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (brazilianDateRegex.test(normalizedDate)) {
      const [, day, month, year] = normalizedDate.match(brazilianDateRegex) || [];
      normalizedDate = `${year}-${month}-${day}`;
    }
    
    const birthDate = new Date(normalizedDate + 'T00:00:00');
    
    if (isNaN(birthDate.getTime())) {
      return '';
    }
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (isNaN(age) || age < 0) {
      return '';
    }
    
    return age.toString();
  };

  const validateDateOfBirth = (dateString: string): string | null => {
    if (!dateString || dateString.trim() === '') {
      return 'Data de nascimento é obrigatória.';
    }

    let normalizedDate = dateString.trim();
    
    const brazilianDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (brazilianDateRegex.test(normalizedDate)) {
      const [, day, month, year] = normalizedDate.match(brazilianDateRegex) || [];
      normalizedDate = `${year}-${month}-${day}`;
    }

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!isoDateRegex.test(normalizedDate)) {
      return 'Data deve estar no formato DD/MM/AAAA ou AAAA-MM-DD.';
    }

    const date = new Date(normalizedDate + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return 'Data de nascimento inválida.';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      return 'Data de nascimento não pode ser futura.';
    }

    const minDate = new Date('1900-01-01T00:00:00');
    if (date < minDate) {
      return 'Data de nascimento deve ser a partir de 01/01/1900.';
    }

    const [year, month, day] = normalizedDate.split('-').map(Number);
    const dateCheck = new Date(year, month - 1, day);
    if (
      dateCheck.getFullYear() !== year ||
      dateCheck.getMonth() !== month - 1 ||
      dateCheck.getDate() !== day
    ) {
      return 'Data de nascimento inválida.';
    }

    return null;
  };

  // Função para validar CPF (verifica dígitos verificadores)
  const validateCPF = (cpf: string): boolean => {
    if (!cpf) return false;
    
    // Remove caracteres não numéricos
    const cpfClean = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpfClean.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais (CPFs inválidos como 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpfClean)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder;
    
    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfClean.substring(9, 10))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfClean.substring(10, 11))) return false;
    
    return true;
  };

  const updateSection = (
    section: 'residente' | 'alergia' | 'planoSaude' | 'familiar',
    field: string,
    value: string | number | undefined | null
  ) => {
    // Garantir que o valor seja sempre uma string válida
    const stringValue = value !== null && value !== undefined ? String(value) : '';
    
    setFormData((prev) => {
      const newData = {
        ...prev,
        [section]: { ...prev[section], [field]: stringValue },
      };
      
      // Se mudou a data de nascimento, calcular idade automaticamente
      if (section === 'residente' && field === 'dataNascimento') {
        const calculatedAge = calculateAge(stringValue);
        newData.residente.idade = calculatedAge;
      }
      
      return newData;
    });
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[`${section}.${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  // Função auxiliar para validar residente sem atualizar estado (usada durante renderização)
  const checkResidentValidation = useCallback((): boolean => {
    const r = formData.residente;

    // Campos obrigatórios conforme DTO do backend
    // Nome
    if (!r.nome || typeof r.nome !== 'string' || r.nome.trim() === '') {
      return false;
    }
    
    // Nome Social
    if (!r.nomeSocial || typeof r.nomeSocial !== 'string' || r.nomeSocial.trim() === '') {
      return false;
    }
    
    // CPF
    if (!r.cpf || typeof r.cpf !== 'string' || r.cpf.trim() === '') {
      return false;
    }
    if (!validateCPF(r.cpf)) {
      return false;
    }
    
    // RG
    if (!r.rg || typeof r.rg !== 'string' || r.rg.trim() === '') {
      return false;
    }
    
    // Órgão Emissor
    if (!r.orgaoEmissor || typeof r.orgaoEmissor !== 'string' || r.orgaoEmissor.trim() === '') {
      return false;
    }
    
    // Estado Emissor
    if (!r.estadoEmissor || typeof r.estadoEmissor !== 'string' || r.estadoEmissor.trim() === '') {
      return false;
    }
    
    // PIS/PASEP
    if (!r.pisPasep || typeof r.pisPasep !== 'string' || r.pisPasep.trim() === '') {
      return false;
    }
    
    // Data de Nascimento
    if (!r.dataNascimento || typeof r.dataNascimento !== 'string' || r.dataNascimento.trim() === '') {
      return false;
    }
    const dateError = validateDateOfBirth(r.dataNascimento);
    if (dateError !== null) {
      return false;
    }
    
    // Sexo (pode vir como número ou string - updateSection converte para string)
    const sexoValue = String(r.sexo || '').trim();
    if (!sexoValue || sexoValue === '' || sexoValue === '0' || sexoValue === 'undefined' || sexoValue === 'null') {
      return false;
    }
    // Verificar se é um número válido maior que 0
    const sexoNum = parseInt(sexoValue);
    if (isNaN(sexoNum) || sexoNum <= 0) {
      return false;
    }
    
    // Estado Civil (pode vir como número ou string)
    const estadoCivilValue = String(r.estadoCivil || '').trim();
    if (!estadoCivilValue || estadoCivilValue === '' || estadoCivilValue === '0' || estadoCivilValue === 'undefined' || estadoCivilValue === 'null') {
      return false;
    }
    // Verificar se é um número válido maior que 0
    const estadoCivilNum = parseInt(estadoCivilValue);
    if (isNaN(estadoCivilNum) || estadoCivilNum <= 0) {
      return false;
    }
    
    // Etnia (pode vir como número ou string)
    const etniaValue = String(r.etnia || '').trim();
    if (!etniaValue || etniaValue === '' || etniaValue === '0' || etniaValue === 'undefined' || etniaValue === 'null') {
      return false;
    }
    // Verificar se é um número válido maior que 0
    const etniaNum = parseInt(etniaValue);
    if (isNaN(etniaNum) || etniaNum <= 0) {
      return false;
    }
    
    // Nome do Pai
    if (!r.nomePai || typeof r.nomePai !== 'string' || r.nomePai.trim() === '') {
      return false;
    }
    
    // Nome da Mãe
    if (!r.nomeMae || typeof r.nomeMae !== 'string' || r.nomeMae.trim() === '') {
      return false;
    }

    // Validações opcionais - só valida se o campo estiver preenchido
    // CNS (Cartão Nacional de Saúde)
    if (r.cns && r.cns.trim() !== '') {
      const cnsClean = r.cns.replace(/\D/g, '');
      if (cnsClean.length !== 15) return false;
    }

    // Cartão Privado
    if (r.cartaoPrivado && r.cartaoPrivado.trim() !== '') {
      const cartaoClean = r.cartaoPrivado.replace(/\D/g, '');
      if (cartaoClean.length !== 15) return false;
    }

    // Altura
    if (r.altura && r.altura.trim() !== '') {
      const alturaNum = parseFloat(r.altura);
      if (isNaN(alturaNum) || alturaNum < 0 || alturaNum > 300) return false;
    }

    // Peso
    if (r.peso && r.peso.trim() !== '') {
      const pesoNum = parseFloat(r.peso);
      if (isNaN(pesoNum) || pesoNum < 0 || pesoNum > 1000) return false;
    }

    // Telefone Celular
    if (r.celular && r.celular.trim() !== '') {
      const celularClean = r.celular.replace(/\D/g, '');
      if (celularClean.length < 10 || celularClean.length > 11) return false;
    }

    // Telefone Residencial
    if (r.telefone && r.telefone.trim() !== '') {
      const telefoneClean = r.telefone.replace(/\D/g, '');
      if (telefoneClean.length < 10 || telefoneClean.length > 11) return false;
    }

    return true;
  }, [formData.residente]);

  // Validações baseadas nos DTOs do backend (atualiza estado de erros)
  const validateResident = (): string | null => {
    const r = formData.residente;
    const newErrors: FormErrors = {};

    // Campos obrigatórios conforme DTO do backend
    if (!r.nome || r.nome.trim() === '') {
      newErrors['residente.nome'] = 'Nome é obrigatório.';
    }

    if (!r.nomeSocial || r.nomeSocial.trim() === '') {
      newErrors['residente.nomeSocial'] = 'Nome social é obrigatório.';
    }

    if (!r.cpf || r.cpf.trim() === '') {
      newErrors['residente.cpf'] = 'CPF é obrigatório.';
    } else {
      const cpfClean = r.cpf.replace(/\D/g, '');
      if (cpfClean.length !== 11) {
        newErrors['residente.cpf'] = 'CPF deve ter 11 dígitos.';
      } else if (!validateCPF(r.cpf)) {
        newErrors['residente.cpf'] = 'CPF inválido. Verifique os dígitos.';
      }
    }

    if (!r.rg || r.rg.trim() === '') {
      newErrors['residente.rg'] = 'RG é obrigatório.';
    }

    if (!r.orgaoEmissor || r.orgaoEmissor.trim() === '') {
      newErrors['residente.orgaoEmissor'] = 'Órgão emissor é obrigatório.';
    }

    if (!r.estadoEmissor || r.estadoEmissor.trim() === '') {
      newErrors['residente.estadoEmissor'] = 'Estado emissor é obrigatório.';
    }

    if (!r.pisPasep || r.pisPasep.trim() === '') {
      newErrors['residente.pisPasep'] = 'PIS/PASEP é obrigatório.';
    }

    // Validação de data de nascimento
    const dateError = validateDateOfBirth(r.dataNascimento);
    if (dateError) {
      newErrors['residente.dataNascimento'] = dateError;
    }

    // Validação de selects (podem vir como número ou string)
    const sexoValue = r.sexo?.toString().trim() || '';
    if (!sexoValue || sexoValue === '' || sexoValue === '0') {
      newErrors['residente.sexo'] = 'Sexo é obrigatório.';
    }

    const estadoCivilValue = r.estadoCivil?.toString().trim() || '';
    if (!estadoCivilValue || estadoCivilValue === '' || estadoCivilValue === '0') {
      newErrors['residente.estadoCivil'] = 'Estado civil é obrigatório.';
    }

    const etniaValue = r.etnia?.toString().trim() || '';
    if (!etniaValue || etniaValue === '' || etniaValue === '0') {
      newErrors['residente.etnia'] = 'Etnia é obrigatória.';
    }

    if (!r.nomePai || r.nomePai.trim() === '') {
      newErrors['residente.nomePai'] = 'Nome do pai é obrigatório.';
    }

    if (!r.nomeMae || r.nomeMae.trim() === '') {
      newErrors['residente.nomeMae'] = 'Nome da mãe é obrigatório.';
    }

    // Idade é calculada automaticamente a partir da data de nascimento, não é obrigatória

    // Validações opcionais - só valida se o campo estiver preenchido
    // CNS (Cartão Nacional de Saúde)
    if (r.cns && r.cns.trim() !== '') {
      const cnsClean = r.cns.replace(/\D/g, '');
      if (cnsClean.length !== 15) {
        newErrors['residente.cns'] = 'CNS deve ter 15 caracteres.';
      }
    }

    // Cartão Privado
    if (r.cartaoPrivado && r.cartaoPrivado.trim() !== '') {
      const cartaoClean = r.cartaoPrivado.replace(/\D/g, '');
      if (cartaoClean.length !== 15) {
        newErrors['residente.cartaoPrivado'] = 'Cartão privado deve ter 15 caracteres.';
      }
    }

    // Altura
    if (r.altura && r.altura.trim() !== '') {
      const alturaNum = parseFloat(r.altura);
      if (isNaN(alturaNum)) {
        newErrors['residente.altura'] = 'Altura deve ser um número válido.';
      } else if (alturaNum < 0) {
        newErrors['residente.altura'] = 'Altura não pode ser negativa.';
      } else if (alturaNum > 300) {
        newErrors['residente.altura'] = 'Altura não pode ser maior que 300 cm.';
      }
    }

    // Peso
    if (r.peso && r.peso.trim() !== '') {
      const pesoNum = parseFloat(r.peso);
      if (isNaN(pesoNum)) {
        newErrors['residente.peso'] = 'Peso deve ser um número válido.';
      } else if (pesoNum < 0) {
        newErrors['residente.peso'] = 'Peso não pode ser negativo.';
      } else if (pesoNum > 1000) {
        newErrors['residente.peso'] = 'Peso não pode ser maior que 1000 kg.';
      }
    }

    // Telefone Celular
    if (r.celular && r.celular.trim() !== '') {
      const celularClean = r.celular.replace(/\D/g, '');
      if (celularClean.length < 10 || celularClean.length > 11) {
        newErrors['residente.celular'] = 'Celular deve ter 10 ou 11 dígitos.';
      }
    }

    // Telefone Residencial
    if (r.telefone && r.telefone.trim() !== '') {
      const telefoneClean = r.telefone.replace(/\D/g, '');
      if (telefoneClean.length < 10 || telefoneClean.length > 11) {
        newErrors['residente.telefone'] = 'Telefone deve ter 10 ou 11 dígitos.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length > 0 ? 'Erros de validação' : null;
  };

  // Verificar se os campos obrigatórios de cada aba estão preenchidos
  const isStepComplete = useCallback((stepIndex: number): boolean => {
    if (stepIndex === 0) {
      // Step 0 (Residente): só completa quando todos os campos obrigatórios estão preenchidos
      // E você já avançou para a próxima aba (step > 0)
      return checkResidentValidation() && step > 0;
    }
    
    // Para outras abas (1, 2, 3), só mostra check se você já passou por ela
    // Isso significa que você completou essa aba e avançou para a próxima
    return step > stepIndex;
  }, [checkResidentValidation, step]);

  // Verificar se pode navegar para um step específico
  const canNavigateToStep = useCallback((targetStep: number): boolean => {
    // Sempre pode voltar ou ficar na mesma aba
    if (targetStep <= step) return true;
    
    // Step 0 (Residente) é obrigatório - precisa estar completo para avançar
    if (step === 0 && targetStep === 1) {
      return isStepComplete(0);
    }
    
    // Se já passou do step 0, pode navegar livremente entre as abas opcionais
    // Steps 1, 2, 3 são opcionais (Alergias, Plano de Saúde, Familiares)
    if (step > 0) {
      return true;
    }
    
    // Para ir para steps mais à frente a partir do step 0, precisa ter completado o step 0
    if (step === 0 && targetStep > 1) {
      return isStepComplete(0);
    }
    
    return true;
  }, [step, isStepComplete]);

  const handleNext = () => {
    // Validar o step atual antes de avançar
    if (step === 0) {
      // Step 0 (Residente) é obrigatório - precisa estar completo
      const validationError = validateResident();
      if (validationError !== null) {
        // Não mostra alerta, apenas atualiza os erros que aparecem abaixo dos campos
        setStep(0); // Garante que está na primeira aba para mostrar os erros
        return;
      }
      
      // Verifica se está completo (sem atualizar erros)
      const isValid = checkResidentValidation();
      if (!isValid) {
        // Se não está válido mas não há erros, força validação novamente
        validateResident();
        return;
      }
      
      // Se passou em todas as validações, avançar para a próxima aba
      setStep(1);
      return;
    }
    
    // Para outros steps (1, 2, 3), são opcionais - pode avançar sem completar
    // Steps: 1 = Alergias, 2 = Plano de Saúde, 3 = Familiares
    const nextStep = step + 1;
    if (nextStep < 4) {
      // Pode avançar para a próxima aba (máximo é 3, então < 4)
      setStep(nextStep);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  // Função helper para limpar nomes removendo texto extra
  const cleanName = (name: string): string => {
    if (!name) return '';
    let cleaned = name.trim();
    
    // Remove padrões comuns de texto extra usando múltiplas abordagens
    // 1. Usando indexOf e substring para pegar apenas a primeira parte
    const patterns = [
      'Nome da Mãe:',
      'Nome da Mae:',
      'nome da mãe:',
      'nome da mae:',
      'Nome do Pai:',
      'nome do pai:',
      'Nome da Mãe',
      'Nome da Mae',
      'nome da mãe',
      'nome da mae',
      'Nome do Pai',
      'nome do pai',
    ];
    
    // Aplicar para cada padrão encontrado (case-insensitive)
    for (const pattern of patterns) {
      const lowerPattern = pattern.toLowerCase();
      const lowerCleaned = cleaned.toLowerCase();
      const index = lowerCleaned.indexOf(lowerPattern);
      if (index !== -1) {
        cleaned = cleaned.substring(0, index).trim();
      }
    }
    
    // 2. Usando regex como fallback para remover qualquer padrão restante
    cleaned = cleaned.replace(/\s*Nome\s+da\s+M[aeã]e\s*:.*/gi, '').trim();
    cleaned = cleaned.replace(/\s*Nome\s+do\s+Pai\s*:.*/gi, '').trim();
    cleaned = cleaned.replace(/\s+Nome\s+da\s+M[aeã]e.*/gi, '').trim();
    cleaned = cleaned.replace(/\s+Nome\s+do\s+Pai.*/gi, '').trim();
    
    return cleaned;
  };

  const handleSubmit = async () => {
    const validationResult = validateResident();
    if (validationResult !== null) {
      setStep(0);
      return;
    }

    setLoading(true);
    try {
      const r = formData.residente;
      // Calcular idade se não estiver preenchida mas a data de nascimento estiver
      let calculatedAge = r.idade?.trim() || '';
      if (!calculatedAge && r.dataNascimento) {
        calculatedAge = calculateAge(r.dataNascimento);
      }
      // Garantir que idade sempre tenha um valor válido
      if (!calculatedAge || calculatedAge === '') {
        calculatedAge = '0';
      }
      
      // Normalizar data de nascimento para formato ISO (YYYY-MM-DD)
      let normalizedDateOfBirth = r.dataNascimento || '';
      if (normalizedDateOfBirth) {
        const brazilianDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (brazilianDateRegex.test(normalizedDateOfBirth)) {
          const [, day, month, year] = normalizedDateOfBirth.match(brazilianDateRegex) || [];
          normalizedDateOfBirth = `${year}-${month}-${day}`;
        }
      }
      
      const residentDTO: ResidentDTO = {
        registeredName: r.nome.trim(),
        socialName: r.nomeSocial?.trim() || '', // Obrigatório
        dateOfBirth: normalizedDateOfBirth || new Date().toISOString().split('T')[0],
        age: calculatedAge,
        cpf: r.cpf.replace(/\D/g, ''),
        rg: r.rg?.trim() || '', // Obrigatório
        issuingBody: r.orgaoEmissor?.trim() || '', // Obrigatório
        issuingState: r.estadoEmissor?.trim() || '', // Obrigatório
        pisPasep: r.pisPasep?.trim() || '', // Obrigatório
        sex: r.sexo && !isNaN(parseInt(r.sexo)) ? parseInt(r.sexo) : 1,
        maritalStatus: r.estadoCivil && !isNaN(parseInt(r.estadoCivil)) ? parseInt(r.estadoCivil) : 1, // Obrigatório
        ethnicity: r.etnia && !isNaN(parseInt(r.etnia)) ? parseInt(r.etnia) : 1, // Obrigatório
        fatherName: cleanName(r.nomePai || '').trim() || '', // Obrigatório - remove texto extra se houver
        motherName: cleanName(r.nomeMae || '').trim() || '', // Obrigatório - remove texto extra se houver
        spouseName: r.nomeConjuge?.trim() || undefined,
        nationalHealthCardNumber: r.cns?.trim() || undefined,
        privateHealthCardNumber: r.cartaoPrivado?.trim() || undefined,
        mobileNumber: r.celular?.trim() || undefined,
        homePhoneNumber: r.telefone?.trim() || undefined,
        height: r.altura && r.altura.trim() !== '' && !isNaN(parseFloat(r.altura)) 
          ? parseFloat(r.altura) 
          : undefined,
        weight: r.peso && r.peso.trim() !== '' && !isNaN(parseFloat(r.peso))
          ? parseFloat(r.peso)
          : undefined,
        religionId: r.religiao && !isNaN(parseInt(r.religiao)) ? parseInt(r.religiao) : undefined,
        healthInsurancePlanId: r.planoSaude && !isNaN(parseInt(r.planoSaude)) ? parseInt(r.planoSaude) : undefined,
      };

      let result;
      if (isEditMode && currentResidentId) {
        residentDTO.id = currentResidentId;
        result = await ResidentService.update(currentResidentId, residentDTO);
      } else {
        result = await ResidentService.create(residentDTO);
      }

      if (result.success && result.data) {
        // Se foi criado um novo residente, atualizar o ID atual
        const newResidentId = result.data.id;
        if (!isEditMode && newResidentId) {
          setCurrentResidentId(newResidentId);
          
          // Salvar alergias pendentes
          if (pendingAllergies.length > 0) {
            try {
              for (const allergyId of pendingAllergies) {
                await ResidentService.addAllergy(newResidentId, allergyId);
              }
              // Recarregar alergias após salvar todas
              const allergiesRes = await ResidentService.getAllergies(newResidentId);
              if (allergiesRes.success && allergiesRes.data) {
                setResidentAllergies(allergiesRes.data);
              }
              setPendingAllergies([]);
            } catch (error) {
              // Erro ao salvar alergias pendentes
            }
          }
        }
        showAlert(`Residente ${isEditMode ? 'alterado' : 'cadastrado'} com sucesso!`, 'success');
      } else {
        // Tratar erros do backend
        if (result.errors && result.errors.length > 0) {
          const newErrors: FormErrors = {};
          const errorMessages: string[] = [];
          
          result.errors.forEach((err) => {
            if (err.field) {
              // Mapear campos do backend para campos do formulário
              const fieldMap: { [key: string]: string } = {
                'registeredName': 'residente.nome',
                'socialName': 'residente.nomeSocial',
                'cpf': 'residente.cpf',
                'rg': 'residente.rg',
                'issuingBody': 'residente.orgaoEmissor',
                'issuingState': 'residente.estadoEmissor',
                'pisPasep': 'residente.pisPasep',
                'dateOfBirth': 'residente.dataNascimento',
                'sex': 'residente.sexo',
                'maritalStatus': 'residente.estadoCivil',
                'ethnicity': 'residente.etnia',
                'fatherName': 'residente.nomePai',
                'motherName': 'residente.nomeMae',
              };
              const formField = fieldMap[err.field] || `residente.${err.field}`;
              newErrors[formField] = err.message || 'Erro de validação';
              errorMessages.push(`${err.field}: ${err.message || 'Erro de validação'}`);
            } else {
              errorMessages.push(err.message || 'Erro de validação');
            }
          });
          
          setErrors(newErrors);
          setStep(0); // Voltar para a primeira aba para mostrar os erros
          
          // Mostrar mensagem detalhada com todos os erros
          const errorList = errorMessages.join('\n');
          alert(`❌ Erro de validação:\n\n${errorList}\n\nVerifique os campos marcados no formulário.`);
        } else {
          alert(`❌ Erro: ${result.message || 'Não foi possível salvar o residente.'}`);
        }
      }
    } catch (error) {
      alert('❌ Erro ao salvar residente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllergy = async () => {
    if (!formData.alergia.nome || !formData.alergia.tipo) {
      showAlert('Selecione uma alergia para adicionar.', 'error');
      return;
    }

    // Se estava editando, cancelar a edição primeiro
    if (editingAllergyId) {
      setEditingAllergyId(null);
    }

    const allergyId = parseInt(formData.alergia.nome);

    // Se já tem residentId, salva diretamente
    if (currentResidentId) {
      setLoading(true);
      try {
        const result = await ResidentService.addAllergy(currentResidentId, allergyId);
        if (result.success) {
          // Recarregar a lista de alergias do residente
          const allergiesRes = await ResidentService.getAllergies(currentResidentId);
          if (allergiesRes.success && allergiesRes.data && allergiesRes.data.length > 0) {
            setResidentAllergies(allergiesRes.data);
          } else {
            // Se o GET retornou vazio, adicionar manualmente mantendo os dados existentes
            const newAllergy: ResidentAllergy = {
              id: result.data?.id || Date.now(),
              residentId: currentResidentId,
              allergyId: allergyId,
            };
            setResidentAllergies((prev) => {
              // Verificar se já não existe na lista
              const exists = prev.some(a => a.allergyId === allergyId && a.residentId === currentResidentId);
              if (exists) {
                return prev;
              }
              return [...prev, newAllergy];
            });
          }
          setFormData((prev) => ({
            ...prev,
            alergia: { tipo: '', nome: '' },
          }));
          showAlert('Alergia adicionada com sucesso!', 'success');
        } else {
          showAlert(`Erro: ${result.message}`, 'error');
        }
      } catch (error) {
        const newAllergy: ResidentAllergy = {
          id: Date.now(),
          residentId: currentResidentId,
          allergyId: allergyId,
        };
        setResidentAllergies((prev) => {
          const exists = prev.some(a => a.allergyId === allergyId && a.residentId === currentResidentId);
          if (exists) {
            return prev;
          }
          return [...prev, newAllergy];
        });
        showAlert('Alergia adicionada com sucesso!', 'success');
      } finally {
        setLoading(false);
      }
    } else {
      // Se não tem residentId, adiciona à lista pendente
      if (!pendingAllergies.includes(allergyId)) {
        setPendingAllergies((prev) => [...prev, allergyId]);
        setFormData((prev) => ({
          ...prev,
          alergia: { tipo: '', nome: '' },
        }));
        showAlert('Alergia adicionada! Ela será salva quando você salvar o residente.', 'success');
      } else {
        showAlert('Esta alergia já foi adicionada.', 'info');
      }
    }
  };

  const handleEditAllergyClick = (allergyId: number, residentAllergyId?: number) => {
    if (step !== 1) {
      setStep(1);
    }
    
    const allergy = allergies.find((a) => a.id === allergyId);
    
    if (allergy) {
      setEditingAllergyId(allergyId);
      setEditingResidentAllergyId(residentAllergyId || null);
      setFormData((prev) => ({
        ...prev,
        alergia: {
          tipo: allergy.type.toString(),
          nome: allergy.id.toString(),
        },
      }));
      
      setTimeout(() => {
        const allergyFormSection = document.querySelector('form');
        if (allergyFormSection) {
          allergyFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      showAlert('Alergia não encontrada na lista de alergias disponíveis. Recarregue a página.', 'error');
    }
  };

  const handleCancelEditAllergy = () => {
    setEditingAllergyId(null);
    setEditingResidentAllergyId(null);
    setFormData((prev) => ({
      ...prev,
      alergia: { tipo: '', nome: '' },
    }));
  };

  const handleUpdateAllergy = async () => {
    if (!formData.alergia.nome || !formData.alergia.tipo) {
      showAlert('Selecione uma alergia para atualizar.', 'error');
      return;
    }

    if (!editingAllergyId) return;

    const newAllergyId = parseInt(formData.alergia.nome);

    // Se já tem residentId, atualiza diretamente
    if (currentResidentId) {
      setLoading(true);
      try {
        if (editingResidentAllergyId) {
          await ResidentService.removeAllergy(currentResidentId, editingResidentAllergyId);
        } else {
          const residentAllergy = residentAllergies.find(ra => ra.allergyId === editingAllergyId);
          if (residentAllergy) {
            await ResidentService.removeAllergy(currentResidentId, residentAllergy.id);
          } else {
            setResidentAllergies((prev) => prev.filter(ra => ra.allergyId !== editingAllergyId));
          }
        }
        
        const result = await ResidentService.addAllergy(currentResidentId, newAllergyId);
        if (result.success) {
          const allergiesRes = await ResidentService.getAllergies(currentResidentId);
          if (allergiesRes.success && allergiesRes.data && allergiesRes.data.length > 0) {
            setResidentAllergies(allergiesRes.data);
          } else {
            // Se o GET retornou vazio, atualizar manualmente mantendo os dados existentes
            setResidentAllergies((prev) => {
              const filtered = prev.filter(ra => {
                if (editingResidentAllergyId) {
                  return ra.id !== editingResidentAllergyId;
                }
                return ra.allergyId !== editingAllergyId;
              });
              const newAllergy: ResidentAllergy = {
                id: result.data?.id || Date.now(),
                residentId: currentResidentId,
                allergyId: newAllergyId,
              };
              return [...filtered, newAllergy];
            });
          }
          setEditingAllergyId(null);
          setEditingResidentAllergyId(null);
          setFormData((prev) => ({
            ...prev,
            alergia: { tipo: '', nome: '' },
          }));
          showAlert('Alergia atualizada com sucesso!', 'success');
        } else {
          showAlert(`Erro: ${result.message}`, 'error');
        }
      } catch (error) {
        setResidentAllergies((prev) => {
          const filtered = prev.filter(ra => {
            if (editingResidentAllergyId) {
              return ra.id !== editingResidentAllergyId;
            }
            return ra.allergyId !== editingAllergyId;
          });
          const newAllergy: ResidentAllergy = {
            id: Date.now(),
            residentId: currentResidentId,
            allergyId: newAllergyId,
          };
          return [...filtered, newAllergy];
        });
        setEditingAllergyId(null);
        setEditingResidentAllergyId(null);
        setFormData((prev) => ({
          ...prev,
          alergia: { tipo: '', nome: '' },
        }));
        showAlert('Alergia atualizada com sucesso!', 'success');
      } finally {
        setLoading(false);
      }
    } else {
      setPendingAllergies((prev) => {
        const updated = prev.filter((aid) => aid !== editingAllergyId);
        if (!updated.includes(newAllergyId)) {
          updated.push(newAllergyId);
        }
        return updated;
      });
      setEditingAllergyId(null);
      setEditingResidentAllergyId(null);
      setFormData((prev) => ({
        ...prev,
        alergia: { tipo: '', nome: '' },
      }));
      showAlert('Alergia atualizada! Ela será salva quando você salvar o residente.', 'success');
    }
  };

  const handleRemoveAllergyClick = (allergyId: number, residentAllergyId?: number) => {
    if (!currentResidentId) return;
    setDeleteAllergyId(residentAllergyId || allergyId);
    setDeleteAllergyResidentId(currentResidentId);
    setIsDeleteAllergyConfirmOpen(true);
  };

  const handleConfirmRemoveAllergy = async () => {
    if (!deleteAllergyId || !deleteAllergyResidentId) return;
    
    setIsDeleteAllergyConfirmOpen(false);
    const residentAllergyId = deleteAllergyId;
    const resId = deleteAllergyResidentId;
    setDeleteAllergyId(null);
    setDeleteAllergyResidentId(null);

    setLoading(true);
    try {
      const result = await ResidentService.removeAllergy(resId, residentAllergyId);
      if (result.success) {
        const allergiesRes = await ResidentService.getAllergies(resId);
        if (allergiesRes.success && allergiesRes.data && allergiesRes.data.length > 0) {
          setResidentAllergies(allergiesRes.data);
        } else {
          // Se o GET retornou vazio, remover manualmente mantendo os dados existentes
          setResidentAllergies((prev) => prev.filter(a => a.id !== residentAllergyId));
        }
        showAlert('Alergia removida com sucesso!', 'success');
      } else {
        showAlert(`Erro: ${result.message}`, 'error');
      }
    } catch (error) {
      showAlert('Erro ao remover alergia.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Função para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar CEP
  const validateCEP = (cep: string): boolean => {
    const cepClean = cep.replace(/\D/g, '');
    return cepClean.length === 8;
  };

  const handleEditRelativeClick = (relativeId: number) => {
    const relative = residentRelatives.find((r) => r.id === relativeId);
    if (relative) {
      setEditingRelativeId(relativeId);
      setFormData((prev) => ({
        ...prev,
        familiar: {
          nomeFamiliar: relative.name || '',
          parentesco: relative.relationship || '',
          rg: '',
          orgaoEmissor: relative.issuingBody || '',
          estadoEmissor: relative.state || '',
          cpf: relative.citizenship || '',
          email: relative.email || '',
          celular: relative.mobileNumber || '',
          telefoneResidencial: relative.homePhoneNumber || '',
          rua: relative.street || '',
          numero: relative.number || '',
          complemento: relative.addressComplement || '',
          bairro: '',
          cidade: relative.city || '',
          estado: relative.state || '',
          cep: relative.postalCode || '',
        },
      }));
      
      setTimeout(() => {
        const relativeFormSection = document.querySelector('form');
        if (relativeFormSection) {
          relativeFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleCancelEditRelative = () => {
    setEditingRelativeId(null);
    setFormData((prev) => ({
      ...prev,
      familiar: {
        nomeFamiliar: '',
        parentesco: '',
        rg: '',
        orgaoEmissor: '',
        estadoEmissor: '',
        cpf: '',
        email: '',
        celular: '',
        telefoneResidencial: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
      },
    }));
  };

  const handleAddRelative = async () => {
    const f = formData.familiar;
    
    // Validação de campos obrigatórios
    if (!f.nomeFamiliar || f.nomeFamiliar.trim() === '') {
      alert('⚠️ Nome do familiar é obrigatório.');
      return;
    }

    if (!f.parentesco || f.parentesco.trim() === '') {
      alert('⚠️ Parentesco é obrigatório.');
      return;
    }

    if (!currentResidentId) {
      showAlert('Salve o residente primeiro antes de adicionar familiares.', 'error');
      return;
    }
    
    // Se estiver editando, atualizar em vez de adicionar
    if (editingRelativeId) {
      await handleUpdateRelative();
      return;
    }

    // Validações de campos opcionais
    if (f.email && f.email.trim() !== '' && !validateEmail(f.email.trim())) {
      alert('⚠️ Email inválido.');
      return;
    }

    if (f.celular && f.celular.trim() !== '') {
      const celularClean = f.celular.replace(/\D/g, '');
      if (celularClean.length < 10 || celularClean.length > 11) {
        alert('⚠️ Celular deve ter 10 ou 11 dígitos.');
        return;
      }
    }

    if (f.telefoneResidencial && f.telefoneResidencial.trim() !== '') {
      const telefoneClean = f.telefoneResidencial.replace(/\D/g, '');
      if (telefoneClean.length < 10 || telefoneClean.length > 11) {
        alert('⚠️ Telefone residencial deve ter 10 ou 11 dígitos.');
        return;
      }
    }

    if (f.cep && f.cep.trim() !== '' && !validateCEP(f.cep.trim())) {
      alert('⚠️ CEP deve ter 8 dígitos.');
      return;
    }

    if (f.cpf && f.cpf.trim() !== '') {
      const cpfClean = f.cpf.replace(/\D/g, '');
      if (cpfClean.length !== 11) {
        alert('⚠️ CPF deve ter 11 dígitos.');
        return;
      }
    }

    setLoading(true);
    try {
      const relativeDTO: ResidentRelativeDTO = {
        residentId: currentResidentId,
        name: f.nomeFamiliar.trim(),
        relationship: f.parentesco ? f.parentesco.trim() : '',
        citizenship: f.cpf?.trim() || undefined,
        mobileNumber: f.celular?.trim() || undefined,
        homePhoneNumber: f.telefoneResidencial?.trim() || undefined,
        email: f.email?.trim() || undefined,
        street: f.rua?.trim() || undefined,
        number: f.numero?.trim() || undefined,
        addressComplement: f.complemento?.trim() || undefined,
        city: f.cidade?.trim() || undefined,
        state: f.estado?.trim() || undefined,
        postalCode: f.cep?.trim() || undefined,
        issuingBody: f.orgaoEmissor?.trim() || undefined,
      };

      const result = await ResidentService.addRelative(currentResidentId, relativeDTO);
      if (result.success) {
        // Recarregar familiares
        const relativesRes = await ResidentService.getRelatives(currentResidentId);
        if (relativesRes.success && relativesRes.data && relativesRes.data.length > 0) {
          setResidentRelatives(relativesRes.data);
        } else {
          // Se o GET retornou vazio, adicionar manualmente mantendo os dados existentes
          if (result.data) {
            setResidentRelatives((prev) => [...prev, result.data!]);
          }
        }
        setFormData((prev) => ({
          ...prev,
          familiar: {
            nomeFamiliar: '',
            parentesco: '',
            rg: '',
            orgaoEmissor: '',
            estadoEmissor: '',
            cpf: '',
            email: '',
            celular: '',
            telefoneResidencial: '',
            rua: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: '',
          },
        }));
        showAlert('Familiar adicionado com sucesso!', 'success');
      } else {
        showAlert(`Erro: ${result.message}`, 'error');
      }
    } catch (error) {
      showAlert('Erro ao adicionar familiar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRelative = async () => {
    if (!editingRelativeId || !currentResidentId) return;
    
    const f = formData.familiar;
    
    if (!f.nomeFamiliar || f.nomeFamiliar.trim() === '') {
      alert('⚠️ Nome do familiar é obrigatório.');
      return;
    }

    if (!f.parentesco || f.parentesco.trim() === '') {
      alert('⚠️ Parentesco é obrigatório.');
      return;
    }

    if (f.email && f.email.trim() !== '' && !validateEmail(f.email.trim())) {
      alert('⚠️ Email inválido.');
      return;
    }

    if (f.celular && f.celular.trim() !== '') {
      const celularClean = f.celular.replace(/\D/g, '');
      if (celularClean.length < 10 || celularClean.length > 11) {
        alert('⚠️ Celular deve ter 10 ou 11 dígitos.');
        return;
      }
    }

    if (f.telefoneResidencial && f.telefoneResidencial.trim() !== '') {
      const telefoneClean = f.telefoneResidencial.replace(/\D/g, '');
      if (telefoneClean.length < 10 || telefoneClean.length > 11) {
        alert('⚠️ Telefone residencial deve ter 10 ou 11 dígitos.');
        return;
      }
    }

    if (f.cep && f.cep.trim() !== '' && !validateCEP(f.cep.trim())) {
      alert('⚠️ CEP deve ter 8 dígitos.');
      return;
    }

    if (f.cpf && f.cpf.trim() !== '') {
      const cpfClean = f.cpf.replace(/\D/g, '');
      if (cpfClean.length !== 11) {
        alert('⚠️ CPF deve ter 11 dígitos.');
        return;
      }
    }

    setLoading(true);
    try {
      const relativeDTO: ResidentRelativeDTO = {
        residentId: currentResidentId,
        name: f.nomeFamiliar.trim(),
        relationship: f.parentesco ? f.parentesco.trim() : '',
        citizenship: f.cpf?.trim() || undefined,
        mobileNumber: f.celular?.trim() || undefined,
        homePhoneNumber: f.telefoneResidencial?.trim() || undefined,
        email: f.email?.trim() || undefined,
        street: f.rua?.trim() || undefined,
        number: f.numero?.trim() || undefined,
        addressComplement: f.complemento?.trim() || undefined,
        city: f.cidade?.trim() || undefined,
        state: f.estado?.trim() || undefined,
        postalCode: f.cep?.trim() || undefined,
        issuingBody: f.orgaoEmissor?.trim() || undefined,
      };

      const result = await ResidentService.updateRelative(currentResidentId, editingRelativeId, relativeDTO);
      if (result.success) {
        const relativesRes = await ResidentService.getRelatives(currentResidentId);
        if (relativesRes.success && relativesRes.data && relativesRes.data.length > 0) {
          setResidentRelatives(relativesRes.data);
        } else {
          // Se o GET retornou vazio, atualizar manualmente mantendo os dados existentes
          setResidentRelatives((prev) => {
            const updated = prev.map(rel => {
              if (rel.id === editingRelativeId) {
                return {
                  ...rel,
                  ...relativeDTO,
                  id: editingRelativeId,
                };
              }
              return rel;
            });
            return updated;
          });
        }
        setEditingRelativeId(null);
        setFormData((prev) => ({
          ...prev,
          familiar: {
            nomeFamiliar: '',
            parentesco: '',
            rg: '',
            orgaoEmissor: '',
            estadoEmissor: '',
            cpf: '',
            email: '',
            celular: '',
            telefoneResidencial: '',
            rua: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: '',
          },
        }));
        showAlert('Familiar atualizado com sucesso!', 'success');
      } else {
        showAlert(`Erro: ${result.message}`, 'error');
      }
    } catch (error) {
      showAlert('Erro ao atualizar familiar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRelativeClick = (relativeId: number) => {
    if (!currentResidentId) return;
    setDeleteRelativeId(relativeId);
    setDeleteRelativeResidentId(currentResidentId);
    setIsDeleteRelativeConfirmOpen(true);
  };

  const handleConfirmRemoveRelative = async () => {
    if (!deleteRelativeId || !deleteRelativeResidentId) return;
    
    setIsDeleteRelativeConfirmOpen(false);
    const relativeId = deleteRelativeId;
    const resId = deleteRelativeResidentId;
    setDeleteRelativeId(null);
    setDeleteRelativeResidentId(null);

    setLoading(true);
    try {
      const result = await ResidentService.removeRelative(resId, relativeId);
      if (result.success) {
        const relativesRes = await ResidentService.getRelatives(resId);
        if (relativesRes.success && relativesRes.data && relativesRes.data.length > 0) {
          setResidentRelatives(relativesRes.data);
        } else {
          // Se o GET retornou vazio, remover manualmente mantendo os dados existentes
          setResidentRelatives((prev) => prev.filter(rel => rel.id !== relativeId));
        }
        if (editingRelativeId === relativeId) {
          handleCancelEditRelative();
        }
        showAlert('Familiar removido com sucesso!', 'success');
      } else {
        showAlert(`Erro: ${result.message}`, 'error');
      }
    } catch (error) {
      showAlert('Erro ao remover familiar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setModalAllergyData({ tipo: '', nomeAlergia: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalAllergyData({ tipo: '', nomeAlergia: '' });
  };

  const handleSubmitModal = async (_data?: unknown) => {
    if (!modalAllergyData.tipo || !modalAllergyData.nomeAlergia.trim()) {
      alert('⚠️ Preencha todos os campos obrigatórios.');
      return;
    }

    const typeValue = Number(modalAllergyData.tipo);
    if (Number.isNaN(typeValue)) {
      alert('⚠️ Selecione um tipo válido.');
      return;
    }

    setLoading(true);
    try {
      const result = await AllergyService.create({
        id: 0,
        name: modalAllergyData.nomeAlergia.trim(),
        type: typeValue,
      } as any);

      if (result.success) {
        const allergiesRes = await AllergyService.getAll();
        if (allergiesRes.success && allergiesRes.data) {
          setAllergies(allergiesRes.data);
        }
        alert('✅ Alergia cadastrada com sucesso!');
        handleCloseModal();
      } else {
        alert(`❌ Erro: ${result.message}`);
      }
    } catch (error) {
      alert('❌ Erro ao cadastrar alergia.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlanoModal = () => {
    setModalPlanoData({ tipo: '', nomePlano: '', abreviacao: '' });
    setIsModalPlanoOpen(true);
  };
  
  const handleClosePlanoModal = () => {
    setIsModalPlanoOpen(false);
    setModalPlanoData({ tipo: '', nomePlano: '', abreviacao: '' });
  };

  const handleSubmitPlanoModal = async (_data?: unknown) => {
    if (!modalPlanoData.tipo || !modalPlanoData.nomePlano.trim() || !modalPlanoData.abreviacao.trim()) {
      alert('⚠️ Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const newPlan = {
        name: modalPlanoData.nomePlano.trim(),
        type: parseInt(modalPlanoData.tipo) as HealthPlanType,
        abbreviation: modalPlanoData.abreviacao.trim(),
      };

      const result = await HealthInsurancePlanService.create(newPlan as any);
      if (result.success && result.data) {
        // Recarregar lista de planos
        const plansRes = await HealthInsurancePlanService.getAll();
        if (plansRes.success && plansRes.data) {
          setHealthPlans(plansRes.data);
          // Selecionar o plano recém-criado no formulário
          setFormData((prev) => ({
            ...prev,
            residente: {
              ...prev.residente,
              planoSaude: result.data?.id.toString() || '',
            },
          }));
        }
        alert('✅ Plano de saúde cadastrado com sucesso!');
        handleClosePlanoModal();
      } else {
        alert(`❌ Erro: ${result.message}`);
      }
    } catch (error) {
      alert('❌ Erro ao criar plano de saúde. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Combinar alergias salvas com pendentes para exibição
  const getAllAllergiesForDisplay = (): ResidentAllergy[] => {
    const savedAllergies = residentAllergies || [];
    const pendingAllergiesData = pendingAllergies.map((allergyId, index) => ({
      id: -index - 1, // IDs temporários negativos para pendentes
      residentId: currentResidentId || 0,
      allergyId: allergyId,
    }));
    return [...savedAllergies, ...pendingAllergiesData];
  };

  const allergyColumns: TableColumn<ResidentAllergy>[] = [
    {
      label: 'Nome',
      attribute: 'allergyId',
      render: (value) => {
        const allergy = allergies.find((a) => a.id === value);
        return allergy?.name || '';
      },
    },
    {
      label: 'Tipo',
      attribute: 'allergyId',
      render: (value) => {
        const allergy = allergies.find((a) => a.id === value);
        if (!allergy) return '';
        const tipoOption = getAllergyTypeOptions().find(
          (option) => option.value?.toString() === allergy.type.toString()
        );
        return tipoOption?.label || allergy.type;
      },
    },
  ];

  const relationshipOptions = getRelationshipOptions().map((option) => ({
    label: option.label,
    value: option.label,
  }));

  const filteredAllergies = formData.alergia.tipo
    ? allergies.filter((a) => a.type.toString() === formData.alergia.tipo)
    : allergies;

  const relativeColumns: TableColumn<ResidentRelative>[] = [
    {
      label: 'Nome',
      attribute: 'name',
    },
    {
      label: 'Parentesco',
      attribute: 'relationship',
    },
    {
      label: 'CPF',
      attribute: 'citizenship',
    },
    {
      label: 'E-mail',
      attribute: 'email',
    },
    {
      label: 'Telefone',
      attribute: 'mobileNumber',
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

  const isAlergiasOrParentesStep = step === 1 || step === 3;
  const titleClasses = `mb-6 ${
    isAlergiasOrParentesStep
      ? 'text-textSecondary text-sl font-medium'
      : 'text-textPrimary text-xl font-semibold'
  }`;

  if (loading && !formData.residente.nome) {
    return <div className='p-12'>Carregando...</div>;
  }

  return (
    <div>
      <BreadcrumbPageTitle
        title={isEditMode ? 'Editar Residente' : 'Cadastro Residente'}
      />
      <div className='flex flex-col p-12'>
        {/* Abas */}
        <div className='flex flex-row w-full mx-auto bg-white'>
          {tabLabels.map((label, index) => {
            const isActive = index === step;
            const isComplete = isStepComplete(index);
            const canAccess = canNavigateToStep(index);
            return (
              <button
                key={index}
                type='button'
                disabled={!canAccess}
                onClick={() => {
                  if (!canAccess) return;
                  setStep(index);
                }}
                className={`flex w-full items-center px-4 py-2 -mb-px border-b-4 transition-colors ${
                  isComplete && isActive
                    ? 'border-success text-success font-medium'
                    : isComplete
                    ? 'border-transparent text-success font-medium'
                    : isActive
                    ? 'border-secondary text-secondary font-medium'
                    : 'border-transparent text-textSecondary'
                } ${!canAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isComplete ? (
                  <CheckCircle
                    className='w-4 h-4 mr-2 text-success'
                    weight='regular'
                  />
                ) : (
                  <Circle
                    className={`w-4 h-4 mr-2 ${
                      isActive ? 'text-secondary' : 'text-textSecondary'
                    }`}
                    weight='regular'
                  />
                )}
                {label}
              </button>
            );
          })}
        </div>

        <form 
          className='bg-white shadow-lg p-8 relative'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        >
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
                  error={errors['residente.nome']}
                  required
                />
                <TextInput
                  label='Nome social'
                  name='nomeSocial'
                  value={formData.residente.nomeSocial}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.nomeSocial']}
                  required
                />
              </div>

              {/* 2ª LINHA DE CAMPOS (Documentos: CPF, PIS/PASEP) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='CPF'
                  name='cpf'
                  value={formData.residente.cpf}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.cpf']}
                  required
                />
                <TextInput
                  label='PIS/PASEP'
                  name='pisPasep'
                  value={formData.residente.pisPasep}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.pisPasep']}
                  required
                />
              </div>

              {/* 3ª LINHA DE CAMPOS (Documentos: RG, Órgão e Estado Emissor) */}
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div className='col-span-2'>
                  <TextInput
                    label='RG:'
                    name='rg'
                    value={formData.residente.rg}
                    onChange={(key, v) => updateSection('residente', key, v)}
                    error={errors['residente.rg']}
                    required
                  />
                </div>
                <TextInput
                  label='Órgão Emissor:'
                  name='orgaoEmissor'
                  value={formData.residente.orgaoEmissor}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.orgaoEmissor']}
                  required
                />
                <TextInput
                  label='Estado Emissor:'
                  name='estadoEmissor'
                  value={formData.residente.estadoEmissor}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.estadoEmissor']}
                  required
                />
              </div>

              {/* 4ª LINHA DE CAMPOS (Data Nascimento e Idade) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Data de nascimento:'
                  name='dataNascimento'
                  type='text'
                  value={formData.residente.dataNascimento}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.dataNascimento']}
                  required
                />
                <TextInput
                  label='Idade:'
                  name='idade'
                  type='number'
                  value={getValidNumberValue(formData.residente.idade)}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.idade']}
                  readOnly
                />
              </div>

              {/* 5ª LINHA DE CAMPOS (Sexo e Etnia) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <SelectInput
                  label='Sexo:'
                  name='sexo'
                  value={formData.residente.sexo}
                  options={getSexOptions()}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.sexo']}
                  required
                />
                <SelectInput
                  label='Etnia:'
                  name='etnia'
                  value={formData.residente.etnia}
                  options={getEthnicityOptions()}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.etnia']}
                  required
                />
              </div>

              {/* 6ª LINHA DE CAMPOS (Altura e Peso) */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Altura:'
                  name='altura'
                  type='number'
                  step='0.01'
                  min='0'
                  value={getValidNumberValue(formData.residente.altura)}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.altura']}
                />
                <TextInput
                  label='Peso:'
                  name='peso'
                  type='number'
                  step='0.01'
                  min='0'
                  value={getValidNumberValue(formData.residente.peso)}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.peso']}
                />
              </div>

              {/* 7ª LINHA DE CAMPOS (Religião e Escolaridade) */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <SelectInput
                  label='Religião:'
                  name='religiao'
                  value={formData.residente.religiao}
                  options={religions.map((r) => ({ label: r.name, value: r.id }))}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.religiao']}
                />
                <SelectInput
                  label='Plano de Saúde:'
                  name='planoSaude'
                  value={formData.residente.planoSaude}
                  options={healthPlans.map((p) => ({
                    label: p.name,
                    value: p.id,
                  }))}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.planoSaude']}
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
                  error={errors['residente.nomePai']}
                  required
                />
                <TextInput
                  label='Nome da mãe:'
                  name='nomeMae'
                  value={formData.residente.nomeMae}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.nomeMae']}
                  required
                />
              </div>

              {/* 9ª LINHA DE CAMPOS (Estado Civil e Cônjuge) */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <SelectInput
                  label='Estado Civil:'
                  name='estadoCivil'
                  value={formData.residente.estadoCivil}
                  options={getMaritalStatusOptions()}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.estadoCivil']}
                  required
                />
                <TextInput
                  label='Nome do cônjuge:'
                  name='nomeConjuge'
                  value={formData.residente.nomeConjuge}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.nomeConjuge']}
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
                  error={errors['residente.cns']}
                />
                <TextInput
                  label='Número do cartão de saúde privado:'
                  name='cartaoPrivado'
                  value={formData.residente.cartaoPrivado}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.cartaoPrivado']}
                />
              </div>

              <hr className='w-full border-t border-textPrimary mt-4 mb-8' />

              {/* 11ª LINHA DE CAMPOS (Telefones) */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <TextInput
                  label='Número do celular:'
                  name='celular'
                  type='text'
                  value={formData.residente.celular}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.celular']}
                />
                <TextInput
                  label='Número do telefone residencial:'
                  name='telefone'
                  type='text'
                  value={formData.residente.telefone}
                  onChange={(key, v) => updateSection('residente', key, v)}
                  error={errors['residente.telefone']}
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
                  value={formData.alergia.tipo}
                  options={getAllergyTypeOptions()}
                  onChange={(key, v) => updateSection('alergia', key, v)}
                />
                <SelectInput
                  label='Nome:'
                  name='nome'
                  value={formData.alergia.nome}
                  options={filteredAllergies.map((a) => ({
                    label: a.name,
                    value: a.id.toString(),
                  }))}
                  onChange={(key, v) => updateSection('alergia', key, v)}
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
                        value={modalAllergyData.tipo}
                        options={getAllergyTypeOptions()}
                        onChange={(key, value) =>
                          setModalAllergyData((prev) => ({
                            ...prev,
                            [key as string]: value,
                          }))
                        }
                        required
                      />
                      <TextInput
                        label='Nome da alergia:'
                        name='nomeAlergia'
                        value={modalAllergyData.nomeAlergia}
                        onChange={(key, value) =>
                          setModalAllergyData((prev) => ({
                            ...prev,
                            [key as string]: value,
                          }))
                        }
                        required
                      />
                    </div>
                  </FormModal>

                  {editingAllergyId ? (
                    <>
                      <Button
                        label='Cancelar'
                        onClick={handleCancelEditAllergy}
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
                  {(() => {
                    const allAllergies = getAllAllergiesForDisplay();
                    if (allAllergies.length === 0) {
                      return (
                        <p className='text-textSecondary text-center py-8'>
                          Nenhuma alergia cadastrada para este residente.
                        </p>
                      );
                    }
                    return (
                  <Table
                        columns={allergyColumns}
                        data={allAllergies}
                        rowsPerPage={5}
                        actions={(id) => {
                          const allergy = allAllergies.find(a => a.id === id);
                          if (!allergy) {
                            return <></>;
                          }
                          // Se for alergia pendente (ID negativo), permitir editar e remover da lista pendente
                          if (id < 0) {
                            return (
                              <>
                                <button
                                  onClick={() => handleEditAllergyClick(allergy.allergyId, undefined)}
                                  className='text-edit hover:text-hoverEdit'
                                >
                                  <Pencil className='size-6' weight='fill' />
                                </button>
                                <button
                                  onClick={() => {
                                    setPendingAllergies((prev) => 
                                      prev.filter((aid) => aid !== allergy.allergyId)
                                    );
                                    if (editingAllergyId === allergy.allergyId) {
                                      handleCancelEditAllergy();
                                    }
                                  }}
                                  className='text-danger hover:text-hoverDanger'
                                >
                                  <Trash className='size-6' weight='fill' />
                                </button>
                              </>
                            );
                          }
                          // Se for alergia salva, permitir editar e remover
                          if (currentResidentId) {
                            return (
                              <>
                                <button
                                  onClick={() => handleEditAllergyClick(allergy.allergyId, allergy.id)}
                                  className='text-edit hover:text-hoverEdit'
                                >
                                  <Pencil className='size-6' weight='fill' />
                                </button>
                                <button
                                  onClick={() => handleRemoveAllergyClick(allergy.allergyId, allergy.id)}
                                  className='text-danger hover:text-hoverDanger'
                                >
                                  <Trash className='size-6' weight='fill' />
                                </button>
                              </>
                            );
                          }
                          return <></>;
                        }}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className='grid grid-cols-2 gap-4'>
                <SelectInput
                  label='Plano de Saúde:'
                  name='plano'
                  value={formData.planoSaude.plano}
                  options={[
                    { label: 'Nenhum', value: '' },
                    ...healthPlans.map((p) => ({
                      label: p.name,
                      value: p.id.toString(),
                    })),
                  ]}
                  onChange={(key, v) => updateSection('planoSaude', key, v)}
                />
                <TextInput
                  label='Número da Carteirinha:'
                  name='numeroCarteirinha'
                  value={formData.planoSaude.numeroCarteirinha}
                  onChange={(key, v) => updateSection('planoSaude', key, v)}
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
                      value={modalPlanoData.tipo}
                      options={getHealthInsurancePlanTypeOptions()}
                      onChange={(key, value) =>
                        setModalPlanoData((prev) => ({
                          ...prev,
                          [key as string]: value,
                        }))
                      }
                      required
                    />
                    <TextInput
                      label='Nome do plano:'
                      name='nomePlano'
                      value={modalPlanoData.nomePlano}
                      onChange={(key, value) =>
                        setModalPlanoData((prev) => ({
                          ...prev,
                          [key as string]: value,
                        }))
                      }
                      required
                    />
                    <TextInput
                      label='Abreviação:'
                      name='abreviacao'
                      value={modalPlanoData.abreviacao}
                      onChange={(key, value) =>
                        setModalPlanoData((prev) => ({
                          ...prev,
                          [key as string]: value,
                        }))
                      }
                      required
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
                  value={formData.familiar.nomeFamiliar}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                  required
                />
                <SelectInput
                  label='Parentesco'
                  name='parentesco'
                  value={formData.familiar.parentesco}
                  options={relationshipOptions}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
              </div>

              {/* Linha 2: RG, Órgão Emissor, Estado Emissor */}
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div className='col-span-2'>
                  <TextInput
                    label='RG'
                    name='rg'
                    value={formData.familiar.rg}
                    onChange={(key, v) => updateSection('familiar', key, v)}
                  />
                </div>
                <TextInput
                  label='Órgão Emissor'
                  name='orgaoEmissor'
                  value={formData.familiar.orgaoEmissor}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
                <TextInput
                  label='Estado Emissor'
                  name='estadoEmissor'
                  value={formData.familiar.estadoEmissor}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
              </div>

              {/* Linha 3: CPF e E-mail */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='CPF'
                  name='cpf'
                  value={formData.familiar.cpf}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
                <TextInput
                  label='E-mail'
                  name='email'
                  type='email'
                  value={formData.familiar.email}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
              </div>

              {/* Linha 4: Telefones */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Número de celular'
                  name='celular'
                  type='text'
                  value={formData.familiar.celular}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
                <TextInput
                  label='Número de telefone residencial'
                  name='telefoneResidencial'
                  type='text'
                  value={formData.familiar.telefoneResidencial}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
              </div>

              <hr className='w-full border-t border-textPrimary mt-4 mb-8' />

              {/* Linha 5: Endereço */}
              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div className='col-span-2'>
                  <TextInput
                    label='Rua'
                    name='rua'
                    value={formData.familiar.rua}
                    onChange={(key, v) => updateSection('familiar', key, v)}
                  />
                </div>
                <TextInput
                  label='Número'
                  name='numero'
                  value={formData.familiar.numero}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
                <TextInput
                  label='CEP'
                  name='cep'
                  value={formData.familiar.cep}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
              </div>

              <div className='grid grid-cols-2 gap-4 mb-4'>
                <TextInput
                  label='Bairro'
                  name='bairro'
                  value={formData.familiar.bairro}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
                <TextInput
                  label='Complemento (opcional)'
                  name='complemento'
                  value={formData.familiar.complemento}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
              </div>

              <div className='grid grid-cols-4 gap-4 mb-4'>
                <div className='col-span-2'>
                  <TextInput
                    label='Cidade'
                    name='cidade'
                    value={formData.familiar.cidade}
                    onChange={(key, v) => updateSection('familiar', key, v)}
                  />
                </div>
                <TextInput
                  label='Estado'
                  name='estado'
                  value={formData.familiar.estado}
                  onChange={(key, v) => updateSection('familiar', key, v)}
                />
              </div>

              {/* Botão de adicionar/atualizar familiar */}
              <div className='flex justify-end mt-6 gap-4'>
                {editingRelativeId ? (
                  <>
                    <Button
                      label='Cancelar'
                      onClick={handleCancelEditRelative}
                      color='textSecondary'
                      className='whitespace-nowrap'
                      disabled={loading}
                    />
                    <Button
                      label='Atualizar familiar'
                      onClick={handleAddRelative}
                      color='success'
                      size='medium'
                      className='font-medium whitespace-nowrap'
                      disabled={loading}
                    />
                  </>
                ) : (
                  <Button
                    label='+ Adicionar familiar do residente'
                    onClick={handleAddRelative}
                    color='success'
                    size='medium'
                    className='font-medium'
                    disabled={loading}
                  />
                )}
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
                  {residentRelatives.length === 0 ? (
                    <p className='text-textSecondary text-center py-8'>
                      Nenhum familiar cadastrado para este residente.
                    </p>
                  ) : (
                    <Table
                      columns={relativeColumns}
                      data={residentRelatives}
                      rowsPerPage={5}
                      actions={(id) => {
                        if (!currentResidentId) return <></>;
                        return (
                          <>
                            <button
                              onClick={() => handleEditRelativeClick(id)}
                              className='text-edit hover:text-hoverEdit'
                            >
                              <Pencil className='size-6' weight='fill' />
                            </button>
                            <button
                              onClick={() => handleRemoveRelativeClick(id)}
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
          )}

          {/* Botões de navegação */}
          <div className='flex flex-col items-end mt-8 gap-2'>
            <div className='flex gap-4'>
            {step > 0 && (
              <Button
                  type='button'
                label='Voltar'
                onClick={handleBack}
                color='neutralLight'
                size='medium'
                className='hover:bg-neutralDark/10 text-textPrimary shadow-none'
                  disabled={loading}
              />
            )}

            {step < stepTitles.length - 1 ? (
              <Button
                  type='button'
                label='Avançar'
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext();
                  }}
                color='primary'
                size='medium'
                className='font-medium'
                  disabled={loading}
              />
            ) : (
              <Button
                type='button'
                label={isEditMode ? 'Atualizar cadastro' : 'Finalizar cadastro de residente'}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit();
                }}
                color='primary'
                size='medium'
                className='font-medium'
                disabled={loading}
              />
            )}
            </div>
          </div>
        </form>
      </div>

      {/* Modal de confirmação de exclusão de alergia */}
      <ConfirmModal
        isOpen={isDeleteAllergyConfirmOpen}
        onClose={() => {
          setIsDeleteAllergyConfirmOpen(false);
          setDeleteAllergyId(null);
          setDeleteAllergyResidentId(null);
        }}
        onConfirm={handleConfirmRemoveAllergy}
        title='Deseja realmente remover essa alergia?'
        message='Ao remover esta alergia, ela será removida permanentemente da lista.'
      />

      {/* Modal de confirmação de exclusão de familiar */}
      <ConfirmModal
        isOpen={isDeleteRelativeConfirmOpen}
        onClose={() => {
          setIsDeleteRelativeConfirmOpen(false);
          setDeleteRelativeId(null);
          setDeleteRelativeResidentId(null);
        }}
        onConfirm={handleConfirmRemoveRelative}
        title='Deseja realmente remover esse familiar?'
        message='Ao remover este familiar, ele será removido permanentemente da lista.'
      />

      {/* Modal de alerta (sucesso/erro) */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          // Se for sucesso ao salvar residente, navegar após fechar
          if (alertMessage.includes('Residente') && (alertMessage.includes('alterado') || alertMessage.includes('cadastrado'))) {
            navigate('/resident');
          }
        }}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}
