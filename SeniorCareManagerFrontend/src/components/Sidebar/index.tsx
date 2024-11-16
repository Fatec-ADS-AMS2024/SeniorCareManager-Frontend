import { useState } from 'react';
import {
  HouseLine,
  UserCheck,
  Users,
  CalendarDots,
  HandHeart,
  UserCirclePlus,
  X,
  List,
} from '@phosphor-icons/react';
import { useNavigate, useLocation } from 'react-router-dom';

const buttons = [
  { id: 'home', label: 'Visão Geral', icon: <HouseLine className="size-7 shrink-0" weight="fill" />, route: '/generalAdministrator' },
  { id: 'professionals', label: 'Profissionais', icon: <UserCheck className="size-7 shrink-0" weight="fill" />, route: '/professionals' },
  { id: 'elderly', label: 'Idosos', icon: <Users className="size-7 shrink-0" weight="fill" />, route: '/elderly' },
  { id: 'calendar', label: 'Calendário', icon: <CalendarDots className="size-7 shrink-0" weight="fill" />, route: '/calendar' },
  { id: 'careProvided', label: 'Cuidados Prestados', icon: <HandHeart className="size-7 shrink-0" weight="fill" />, route: '/careProvided' },
  { id: 'registrations', label: 'Cadastros', icon: <UserCirclePlus className="size-7 shrink-0" weight="fill" />, route: '/registrations' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Obtém a rota atual

  return (
    <div
      className={`flex flex-col ${
        isOpen ? 'w-72' : 'w-16'
      } h-full bg-surface shadow-lg transition-all duration-500`}
    >
      {/* Botão de Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-center h-16 text-primary hover:bg-secondary hover:text-surface relative "
      >
        {isOpen ? <X className="size-6 absolute right-4" /> : <List className="size-7" />}
      </button>

      {/* Botões do Sidebar */}
      <div className="flex flex-col mt-2">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => navigate(button.route)}
            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-r-transparent ${
              location.pathname === button.route
                ? 'bg-secondary text-surface border-r-primary border-r-4' // Estilo para a página ativa
                : 'text-primary hover:bg-secondary hover:text-surface hover:border-r-primary hover:border-r-4'
            }`}
          >
            {button.icon}
            {isOpen && <span className="text-lg">{button.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
