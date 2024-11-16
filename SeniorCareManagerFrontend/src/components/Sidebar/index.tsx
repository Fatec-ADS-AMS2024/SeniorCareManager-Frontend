import { useState } from 'react';
import {
  HouseLine,
  UserCheck,
  Users,
  CalendarDots,
  HandHeart,
  UserCirclePlus,
  List,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

const buttons = [
  { id: 'home', label: 'Visão Geral', icon: <HouseLine className="size-8 shrink-0" weight="fill" />, route: '/' },
  { id: 'professionals', label: 'Profissionais', icon: <UserCheck className="size-8 shrink-0" weight="fill" />, route: '/professionals' },
  { id: 'elderly', label: 'Idosos', icon: <Users className="size-8 shrink-0" weight="fill" />, route: '/elderly' },
  { id: 'calendar', label: 'Calendário', icon: <CalendarDots className="size-8 shrink-0" weight="fill" />, route: '/calendar' },
  { id: 'careProvided', label: 'Cuidados Prestados', icon: <HandHeart className="size-8 shrink-0" weight="fill" />, route: '/careProvided' },
  { id: 'registrations', label: 'Cadastros', icon: <UserCirclePlus className="size-8 shrink-0" weight="fill" />, route: '/registrations' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col ${
        isOpen ? 'w-72' : 'w-16'
      } h-full bg-surface shadow-lg transition-all duration-300`}
    >
      {/* Botão de Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-16 text-primary hover:bg-secondary hover:text-surface"
      >
        <List className="size-8" />
      </button>

      {/* Botões do Sidebar */}
      <div className="flex flex-col mt-2">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => navigate(button.route)}
            className="flex items-center gap-2 px-4 py-3 text-primary hover:bg-secondary hover:text-surface whitespace-nowrap"
          >
            {button.icon}
            {isOpen && <span className="text-lg">{button.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
