import { useEffect } from 'react';
import { useAlert, AlertType, Alert } from '../../contexts/AlertContext';

const alertStyles: Record<AlertType, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  alert: 'bg-yellow-500 text-black',
};

const AlertItem = ({ id, message, type, onRemove }: { id: number, message: string, type: AlertType, onRemove: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={`p-4 mb-2 rounded-md shadow-lg flex justify-between items-center ${alertStyles[type]}`}
    >
      <span>{message}</span>
      <button onClick={() => onRemove(id)} className="ml-4 font-bold">
        X
      </button>
    </div>
  );
};

export const GlobalAlerts = () => {
  const { alerts, removeAlert } = useAlert();

  return (
    <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
      {alerts.map((alert: Alert) => (
        <AlertItem
          key={alert.id}
          id={alert.id}
          message={alert.message}
          type={alert.type}
          onRemove={removeAlert}
        />
      ))}
    </div>
  );
};