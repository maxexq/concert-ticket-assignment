import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...defaultOptions, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, { ...defaultOptions, ...options });
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      pending: string;
      success: string;
      error: string;
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, messages, { ...defaultOptions, ...options });
  },
};
