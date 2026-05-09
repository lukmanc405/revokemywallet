import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#1A1A1A' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#1A1A1A' },
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
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  });

export const showWarning = (message: string) =>
  toast(message, {
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  });
