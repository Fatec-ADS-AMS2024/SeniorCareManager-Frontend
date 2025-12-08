import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className='flex flex-col text-text bg-background h-screen w-screen overflow-y-auto overflow-x-clip'>
      <Header />

      <div className='flex-1 flex flex-row'>
        <Sidebar />

        <AnimatePresence mode='wait'>
          <motion.main
            key={location.pathname}
            className='h-full w-full *:w-full *:h-full'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}