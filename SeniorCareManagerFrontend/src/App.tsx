import { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { GlobalLoader } from './components/GlobalLoader';
import { AlertProvider, useAlert } from './contexts/AlertContext';
import { GlobalAlerts } from './components/GlobalAlerts';

const AlertBridge = () => {
  const { showAlert } = useAlert();

  useEffect(() => {
    window.GlobalAlerts.show = showAlert;

    return () => {
      delete window.GlobalAlerts.show;
    };
  }, [showAlert]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <AlertBridge /> 
        
        <GlobalLoader />
        <GlobalAlerts />
        <AppRoutes />
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;