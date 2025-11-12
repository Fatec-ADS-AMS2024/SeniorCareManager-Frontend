import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { GlobalLoader } from './components/GlobalLoader';

function App() {
  return (
    <ThemeProvider>
      <GlobalLoader />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;