import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import fotoLoginSistema from '@/assets/images/fotoLoginSistema.png';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className='flex bg-neutralWhite'>
      <div className='md:w-[40%] w-full h-full bg-neutralWhite flex flex-col justify-center items-center px-8'>
        <LoginForm />
      </div>
      <div className='hidden md:flex w-full h-full'>
        <img
          src={fotoLoginSistema}
          alt='Foto Login Sistema'
          className={`w-full object-cover ${
            theme === 'high-contrast' ? 'grayscale' : ''
          }`}
        />
      </div>
    </div>
  );
}
