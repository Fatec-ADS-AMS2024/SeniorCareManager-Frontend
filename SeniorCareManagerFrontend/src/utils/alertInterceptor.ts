type InterceptedAlertType = 'success' | 'error' | 'alert';

interface GlobalAlertBridge {
  show: (message: string, type: InterceptedAlertType) => void;
}

declare global {
  interface Window {
    GlobalAlerts: Partial<GlobalAlertBridge>;
    _originalAlert?: (message?: any) => void;
  }
}

export function initializeAlertInterceptor() {
  if (window._originalAlert) {
    return;
  }

  window._originalAlert = window.alert;
  
  window.GlobalAlerts = {};

  window.alert = (message: string) => {
    
    if (window.GlobalAlerts.show) {
      window.GlobalAlerts.show(message, 'alert');
    } else {
      console.warn("GlobalAlerts.show não está pronto. Usando o alert original.");
      window._originalAlert?.(message);
    }
  };
}