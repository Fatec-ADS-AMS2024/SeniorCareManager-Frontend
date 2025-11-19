import { useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import Button from '../Button';

// Parametros da barra de pesquisa
interface SearchBarProps {
  placeholder?: string;
  action?: (searchTerm: string) => void;
}

// Componente de barra de pesquisa
export default function SearchBar({ placeholder, action }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Função para lidar com a ação de pesquisa
  const handleSearch = () => {
    if (action) action(searchTerm);
  };

  // Função para lidar com Enter no input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className='flex w-full '>
      {/* Search bar */}
      {/* Formulário de pesquisa - usando div para evitar form aninhado */}
      <div className='flex w-full max-w-2xl shadow-md'>
        {/* Input para entrada de dados com atualização do termo da pesquisa */}
        <input
          type='text'
          placeholder={placeholder ? placeholder : 'Digite aqui...'}
          className='w-full py-2 pl-4 text-sm text-textPrimary rounded-l border-2 border-neutralWhite bg-neutralWhite focus:outline-none focus:border-neutralDarker'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {/* Botão pra envio do formulário com a ação de pesquisa */}
        <Button
          label=''
          icon={<MagnifyingGlass size={20} />}
          color='neutralLight'
          type='button'
          onClick={handleSearch}
        />
      </div>
    </div>
  );
}
