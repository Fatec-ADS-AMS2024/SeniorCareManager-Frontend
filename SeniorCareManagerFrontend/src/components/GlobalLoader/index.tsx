import React, { useState, useEffect } from 'react';

const loaderStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  zIndex: 9999,
};

const spinnerStyles: React.CSSProperties = {
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #3498db',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
};

const textStyles: React.CSSProperties = {
  marginTop: '10px',
  color: '#333',
  fontSize: '16px',
  fontWeight: 500,
};

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoadingChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ isLoading: boolean }>;
      setIsLoading(customEvent.detail.isLoading);
    };

    window.addEventListener('api-loading', handleLoadingChange);
    return () => window.removeEventListener('api-loading', handleLoadingChange);
  }, []);

  if (!isLoading) return null;

  return (
    <div style={loaderStyles}>
      <div style={spinnerStyles} />
      <div style={textStyles}>Carregando...</div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
