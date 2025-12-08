import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import AlertModal from '@/components/Modal/AlertModal';
import ResidentAllergy from '@/types/models/ResidentAllergy';
import ResidentRelative from '@/types/models/ResidentRelative';
import Allergy from '@/types/models/Allergy';
import ResidentDataTab from '../components/ResidentDataTab';
import AllergiesTab from '../components/AllergiesTab';
import HealthPlanTab from '../components/HealthPlanTab';
import RelativesTab from '../components/RelativesTab';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResidentService from '../services/residentService';
import AllergyService from '@/features/allergy/services/allergyService';
import HealthInsurancePlanService from '@/features/healthInsurancePlan/services/healthInsurancePlanService';
import { CheckCircle, Circle } from '@phosphor-icons/react';
import ResidentAllergyService from '../services/residentAllergyService';
import Resident from '@/types/models/Resident';
import HealthInsurancePlan from '@/types/models/HealthInsurancePlan';
import Religion from '@/types/models/Religion';

interface FormErrors {
  [key: string]: string;
}

interface PendingAllergy {
  allergyId: number;
  description?: string;
  detectionDate?: string;
  releasedDate?: string;
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
  const [residentAllergies, setResidentAllergies] = useState<ResidentAllergy[]>(
    []
  );
  const [pendingAllergies, setPendingAllergies] = useState<PendingAllergy[]>(
    []
  );
  const [healthPlans, setHealthPlans] = useState<HealthInsurancePlan[]>([]);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [residentRelatives, setResidentRelatives] = useState<
    ResidentRelative[]
  >([]);
  const [pendingRelatives, setPendingRelatives] = useState<ResidentRelative[]>(
    []
  );

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
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
      descricao: '',
      dataDeteccao: '',
      dataLiberacao: '',
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
      const allergiesRes = await AllergyService.getAll();
      if (allergiesRes.success && allergiesRes.data) {
        setAllergies(allergiesRes.data);
      }

      const plansRes = await HealthInsurancePlanService.getAll();
      if (plansRes.success && plansRes.data) {
        setHealthPlans(plansRes.data);
      }

      const { default: ReligionService } = await import(
        '@/features/religion/services/religionService'
      );
      const religionsRes = await ReligionService.getAll();
      if (religionsRes.success && religionsRes.data) {
        setReligions(religionsRes.data);
      }

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
              altura:
                resident.height != null && !isNaN(Number(resident.height))
                  ? resident.height.toString()
                  : '',
              peso:
                resident.weight != null && !isNaN(Number(resident.weight))
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
            alergia: {
              tipo: '',
              nome: '',
              descricao: '',
              dataDeteccao: '',
              dataLiberacao: '',
            },
            planoSaude: {
              plano: resident.healthInsurancePlanId?.toString() || '',
              numeroCarteirinha: resident.privateHealthCardNumber || '',
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

          if (currentResidentId) {
            const allergiesRes = await ResidentService.getAllergies(
              currentResidentId
            );
            if (allergiesRes.success && allergiesRes.data) {
              setResidentAllergies(allergiesRes.data);
              setPendingAllergies(
                allergiesRes.data.map((ra) => ({
                  allergyId: ra.allergyId,
                  description: ra.description,
                  detectionDate: ra.detectionDate
                    ? typeof ra.detectionDate === 'string'
                      ? ra.detectionDate.split('T')[0]
                      : ra.detectionDate.toISOString().split('T')[0]
                    : undefined,
                  releasedDate: ra.releasedDate
                    ? typeof ra.releasedDate === 'string'
                      ? ra.releasedDate.split('T')[0]
                      : ra.releasedDate.toISOString().split('T')[0]
                    : undefined,
                }))
              );
            }

            const relativesRes = await ResidentService.getRelatives(
              currentResidentId
            );
            if (relativesRes.success && relativesRes.data) {
              setResidentRelatives(relativesRes.data);
              setPendingRelatives(relativesRes.data);
            }
          }
        }
      } else {
        setResidentAllergies([]);
        setResidentRelatives([]);
        setPendingRelatives([]);
      }
      setLoading(false);
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
      const [, day, month, year] =
        normalizedDate.match(brazilianDateRegex) || [];
      normalizedDate = `${year}-${month}-${day}`;
    }

    const birthDate = new Date(normalizedDate + 'T00:00:00');

    if (isNaN(birthDate.getTime())) {
      return '';
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
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
      const [, day, month, year] =
        normalizedDate.match(brazilianDateRegex) || [];
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
    const stringValue =
      value !== null && value !== undefined ? String(value) : '';

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
    if (
      !r.nomeSocial ||
      typeof r.nomeSocial !== 'string' ||
      r.nomeSocial.trim() === ''
    ) {
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
    if (
      !r.orgaoEmissor ||
      typeof r.orgaoEmissor !== 'string' ||
      r.orgaoEmissor.trim() === ''
    ) {
      return false;
    }

    // Estado Emissor
    if (
      !r.estadoEmissor ||
      typeof r.estadoEmissor !== 'string' ||
      r.estadoEmissor.trim() === ''
    ) {
      return false;
    }

    // PIS/PASEP
    if (
      !r.pisPasep ||
      typeof r.pisPasep !== 'string' ||
      r.pisPasep.trim() === ''
    ) {
      return false;
    }

    // Data de Nascimento
    if (
      !r.dataNascimento ||
      typeof r.dataNascimento !== 'string' ||
      r.dataNascimento.trim() === ''
    ) {
      return false;
    }
    const dateError = validateDateOfBirth(r.dataNascimento);
    if (dateError !== null) {
      return false;
    }

    // Sexo (pode vir como número ou string - updateSection converte para string)
    const sexoValue = String(r.sexo || '').trim();
    if (
      !sexoValue ||
      sexoValue === '' ||
      sexoValue === '0' ||
      sexoValue === 'undefined' ||
      sexoValue === 'null'
    ) {
      return false;
    }
    // Verificar se é um número válido maior que 0
    const sexoNum = parseInt(sexoValue);
    if (isNaN(sexoNum) || sexoNum <= 0) {
      return false;
    }

    // Estado Civil (pode vir como número ou string)
    const estadoCivilValue = String(r.estadoCivil || '').trim();
    if (
      !estadoCivilValue ||
      estadoCivilValue === '' ||
      estadoCivilValue === '0' ||
      estadoCivilValue === 'undefined' ||
      estadoCivilValue === 'null'
    ) {
      return false;
    }
    // Verificar se é um número válido maior que 0
    const estadoCivilNum = parseInt(estadoCivilValue);
    if (isNaN(estadoCivilNum) || estadoCivilNum <= 0) {
      return false;
    }

    // Etnia (pode vir como número ou string)
    const etniaValue = String(r.etnia || '').trim();
    if (
      !etniaValue ||
      etniaValue === '' ||
      etniaValue === '0' ||
      etniaValue === 'undefined' ||
      etniaValue === 'null'
    ) {
      return false;
    }
    // Verificar se é um número válido maior que 0
    const etniaNum = parseInt(etniaValue);
    if (isNaN(etniaNum) || etniaNum <= 0) {
      return false;
    }

    // Nome do Pai
    if (
      !r.nomePai ||
      typeof r.nomePai !== 'string' ||
      r.nomePai.trim() === ''
    ) {
      return false;
    }

    // Nome da Mãe
    if (
      !r.nomeMae ||
      typeof r.nomeMae !== 'string' ||
      r.nomeMae.trim() === ''
    ) {
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
    if (
      !estadoCivilValue ||
      estadoCivilValue === '' ||
      estadoCivilValue === '0'
    ) {
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
        newErrors['residente.cartaoPrivado'] =
          'Cartão privado deve ter 15 caracteres.';
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
  const isStepComplete = useCallback(
    (stepIndex: number): boolean => {
      if (stepIndex === 0) {
        // Step 0 (Residente): só completa quando todos os campos obrigatórios estão preenchidos
        // E você já avançou para a próxima aba (step > 0)
        return checkResidentValidation() && step > 0;
      }

      // Para outras abas (1, 2, 3), só mostra check se você já passou por ela
      // Isso significa que você completou essa aba e avançou para a próxima
      return step > stepIndex;
    },
    [checkResidentValidation, step]
  );

  // Verificar se pode navegar para um step específico
  const canNavigateToStep = useCallback(
    (targetStep: number): boolean => {
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
    },
    [step, isStepComplete]
  );

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
          const [, day, month, year] =
            normalizedDateOfBirth.match(brazilianDateRegex) || [];
          normalizedDateOfBirth = `${year}-${month}-${day}`;
        }
      }

      const resident: Resident = {
        id: 0,
        registeredName: r.nome.trim(),
        socialName: r.nomeSocial?.trim() || '', // Obrigatório
        dateOfBirth:
          normalizedDateOfBirth || new Date().toISOString().split('T')[0],
        age: calculatedAge,
        cpf: r.cpf.replace(/\D/g, ''),
        rg: r.rg?.trim() || '', // Obrigatório
        issuingBody: r.orgaoEmissor?.trim() || '', // Obrigatório
        issuingState: r.estadoEmissor?.trim() || '', // Obrigatório
        pisPasep: r.pisPasep?.trim() || '', // Obrigatório
        sex: r.sexo && !isNaN(parseInt(r.sexo)) ? parseInt(r.sexo) : 1,
        maritalStatus:
          r.estadoCivil && !isNaN(parseInt(r.estadoCivil))
            ? parseInt(r.estadoCivil)
            : 1, // Obrigatório
        ethnicity: r.etnia && !isNaN(parseInt(r.etnia)) ? parseInt(r.etnia) : 1, // Obrigatório
        fatherName: cleanName(r.nomePai || '').trim() || '', // Obrigatório - remove texto extra se houver
        motherName: cleanName(r.nomeMae || '').trim() || '', // Obrigatório - remove texto extra se houver
        spouseName: r.nomeConjuge?.trim() || undefined,
        nationalHealthCardNumber: r.cns?.trim() || undefined,
        privateHealthCardNumber: r.cartaoPrivado?.trim() || undefined,
        mobileNumber: r.celular?.trim() || undefined,
        homePhoneNumber: r.telefone?.trim() || undefined,
        height:
          r.altura && r.altura.trim() !== '' && !isNaN(parseFloat(r.altura))
            ? parseFloat(r.altura)
            : 0,
        weight:
          r.peso && r.peso.trim() !== '' && !isNaN(parseFloat(r.peso))
            ? parseFloat(r.peso)
            : 0,
        religionId:
          r.religiao && !isNaN(parseInt(r.religiao))
            ? parseInt(r.religiao)
            : undefined,
        healthInsurancePlanId:
          r.planoSaude && !isNaN(parseInt(r.planoSaude))
            ? parseInt(r.planoSaude)
            : undefined,
      };

      let result;
      if (isEditMode && currentResidentId) {
        resident.id = currentResidentId;
        result = await ResidentService.update(currentResidentId, resident);
      } else {
        result = await ResidentService.create(resident);
      }

      if (result.success && result.data) {
        // Se foi criado um novo residente, atualizar o ID atual
        const newResidentId = result.data.id;
        if (newResidentId) {
          setCurrentResidentId(newResidentId);

          // Salvar/atualizar alergias
          if (isEditMode) {
            // Modo edição: comparar alergias antigas com novas
            const oldAllergyIds = residentAllergies.map((ra) => ra.allergyId);
            const newAllergyIds = pendingAllergies.map((p) => p.allergyId);

            // Remover alergias que não estão mais na lista
            for (const oldId of oldAllergyIds) {
              if (!newAllergyIds.includes(oldId)) {
                const ra = residentAllergies.find((r) => r.allergyId === oldId);
                if (ra?.id) await ResidentAllergyService.deleteById(ra.id);
              }
            }

            // Adicionar novas alergias e atualizar existentes
            for (const pending of pendingAllergies) {
              if (!oldAllergyIds.includes(pending.allergyId)) {
                await ResidentAllergyService.create({
                  id: 0,
                  residentId: newResidentId,
                  allergyId: pending.allergyId,
                  description: pending.description,
                  detectionDate: pending.detectionDate,
                  releasedDate: pending.releasedDate,
                });
              } else {
                const existingAllergy = residentAllergies.find(
                  (ra) => ra.allergyId === pending.allergyId
                );
                if (existingAllergy?.id) {
                  await ResidentAllergyService.update(existingAllergy.id, {
                    id: existingAllergy.id,
                    residentId: newResidentId,
                    allergyId: pending.allergyId,
                    description: pending.description,
                    detectionDate: pending.detectionDate,
                    releasedDate: pending.releasedDate,
                  });
                }
              }
            }
          } else {
            // Modo criação: adicionar todas as alergias
            for (const pending of pendingAllergies) {
              await ResidentAllergyService.create({
                id: 0,
                residentId: newResidentId,
                allergyId: pending.allergyId,
                description: pending.description,
                detectionDate: pending.detectionDate,
                releasedDate: pending.releasedDate,
              });
            }
          }

          // Recarregar alergias
          const allergiesRes = await ResidentService.getAllergies(
            newResidentId
          );
          if (allergiesRes.success && allergiesRes.data) {
            setResidentAllergies(allergiesRes.data);
            setPendingAllergies(
              allergiesRes.data.map((ra) => ({
                allergyId: ra.allergyId,
                description: ra.description,
                detectionDate: ra.detectionDate
                  ? typeof ra.detectionDate === 'string'
                    ? ra.detectionDate.split('T')[0]
                    : ra.detectionDate.toISOString().split('T')[0]
                  : undefined,
                releasedDate: ra.releasedDate
                  ? typeof ra.releasedDate === 'string'
                    ? ra.releasedDate.split('T')[0]
                    : ra.releasedDate.toISOString().split('T')[0]
                  : undefined,
              }))
            );
          }
        }
        showAlert(
          `Residente ${isEditMode ? 'alterado' : 'cadastrado'} com sucesso!`,
          'success'
        );
      } else {
        // Tratar erros do backend
        if (result.errors && result.errors.length > 0) {
          const newErrors: FormErrors = {};
          const errorMessages: string[] = [];

          result.errors.forEach((err) => {
            if (err.field) {
              // Mapear campos do backend para campos do formulário
              const fieldMap: { [key: string]: string } = {
                registeredName: 'residente.nome',
                socialName: 'residente.nomeSocial',
                cpf: 'residente.cpf',
                rg: 'residente.rg',
                issuingBody: 'residente.orgaoEmissor',
                issuingState: 'residente.estadoEmissor',
                pisPasep: 'residente.pisPasep',
                dateOfBirth: 'residente.dataNascimento',
                sex: 'residente.sexo',
                maritalStatus: 'residente.estadoCivil',
                ethnicity: 'residente.etnia',
                fatherName: 'residente.nomePai',
                motherName: 'residente.nomeMae',
              };
              const formField = fieldMap[err.field] || `residente.${err.field}`;
              newErrors[formField] = err.message || 'Erro de validação';
              errorMessages.push(
                `${err.field}: ${err.message || 'Erro de validação'}`
              );
            } else {
              errorMessages.push(err.message || 'Erro de validação');
            }
          });

          setErrors(newErrors);
          setStep(0); // Voltar para a primeira aba para mostrar os erros

          // Mostrar mensagem detalhada com todos os erros
          const errorList = errorMessages.join('\n');
          alert(
            `❌ Erro de validação:\n\n${errorList}\n\nVerifique os campos marcados no formulário.`
          );
        } else {
          alert(
            `❌ Erro: ${
              result.message || 'Não foi possível salvar o residente.'
            }`
          );
        }
      }
    } catch (error) {
      alert('❌ Erro ao salvar residente. Tente novamente.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className={titleClasses}>{stepTitles[step]}</h2>

          {step === 0 && (
            <ResidentDataTab
              formData={formData.residente}
              errors={errors}
              healthPlans={healthPlans}
              religions={religions}
              onUpdate={(field, value) =>
                updateSection('residente', field, value)
              }
              getValidNumberValue={getValidNumberValue}
            />
          )}

          {step === 1 && (
            <AllergiesTab
              formData={formData.alergia}
              allergies={allergies}
              residentAllergies={residentAllergies}
              pendingAllergies={pendingAllergies}
              currentResidentId={currentResidentId}
              onUpdate={(field, value) =>
                updateSection('alergia', field, value)
              }
              onAllergiesReload={setAllergies}
              onResidentAllergiesReload={setResidentAllergies}
              onPendingAllergiesUpdate={setPendingAllergies}
              onShowAlert={showAlert}
            />
          )}

          {step === 2 && (
            <HealthPlanTab
              formData={formData.planoSaude}
              healthPlans={healthPlans}
              onUpdate={(field, value) =>
                updateSection('planoSaude', field, value)
              }
              onHealthPlansReload={setHealthPlans}
              onSelectPlan={(planId) =>
                updateSection('residente', 'planoSaude', planId)
              }
            />
          )}

          {step === 3 && (
            <RelativesTab
              formData={formData.familiar}
              residentRelatives={residentRelatives}
              pendingRelatives={pendingRelatives}
              currentResidentId={currentResidentId}
              onUpdate={(field, value) =>
                updateSection('familiar', field, value)
              }
              onRelativesReload={setResidentRelatives}
              onPendingRelativesUpdate={setPendingRelatives}
              onShowAlert={showAlert}
              onClearForm={() =>
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
                }))
              }
            />
          )}

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
                  label={
                    isEditMode
                      ? 'Atualizar cadastro'
                      : 'Finalizar cadastro de residente'
                  }
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

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => {
          setIsAlertModalOpen(false);
          if (
            alertMessage.includes('Residente') &&
            (alertMessage.includes('alterado') ||
              alertMessage.includes('cadastrado'))
          ) {
            navigate('/resident');
          }
        }}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}
