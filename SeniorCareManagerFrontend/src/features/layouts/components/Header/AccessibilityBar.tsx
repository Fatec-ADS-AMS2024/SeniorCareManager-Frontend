import { useContext } from 'react';
import {
  CircleHalf,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
} from '@phosphor-icons/react';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function AccessibilityBar() {
  const { theme, fontSize, toggleTheme, changeFontSize } =
    useContext(ThemeContext);

  const changeTheme = () => {
    if (theme === 'light') {
      toggleTheme('high-contrast');
    } else {
      toggleTheme('light');
    }
  };

  const increaseFontSize = () => {
    changeFontSize(fontSize + 2);
  };
  const decreaseFontSize = () => {
    changeFontSize(fontSize - 2);
  };

  return (
    <div className='h-8 w-full flex gap-2 items-center justify-end text-primary text-base p-1 border-b-[1px]'>

      {/* 1. Botão de Aumento de Fonte */}
      <button onClick={increaseFontSize} aria-label="Aumentar tamanho da fonte">
        <MagnifyingGlassPlus weight='bold' />
      </button>

      {/* 2. Botão de Diminuição de Fonte */}
      <button onClick={decreaseFontSize} aria-label="Diminuir tamanho da fonte">
        <MagnifyingGlassMinus weight='bold' />
      </button>

      {/* 3. Botão de Alternância de Tema/Contraste */}
      <button onClick={changeTheme} aria-label="Alternar para tema de alto contraste">
        <CircleHalf weight='fill' />
      </button>

    </div>
  );
}
