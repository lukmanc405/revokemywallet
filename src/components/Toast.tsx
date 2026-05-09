import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1E1E1E',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          fontSize: '13px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: '500',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#1E1E1E' },
        },
        error: {
          iconTheme: { primary: '#FF3B30', secondary: '#1E1E1E' },
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
