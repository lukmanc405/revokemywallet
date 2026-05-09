import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#16161A',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          fontSize: '13px',
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          fontWeight: '600',
          padding: '12px 16px',
          letterSpacing: '-0.01em',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#16161A' },
        },
        error: {
          iconTheme: { primary: '#FF3B30', secondary: '#16161A' },
        },
      }}
    />
  );
}

export const showSuccess = (message: string) =>
  toast.success(message, {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  });

export const showError = (message: string) =>
  toast.error(message, {
    icon: <XCircle className="w-5 h-5 text-brand-red" />,
  });

export const showWarning = (message: string) =>
  toast(message, {
    icon: <AlertTriangle className="w-5 h-5 text-brand-yellow" />,
  });
