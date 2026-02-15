"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import { CircleCheck, CircleX, CircleAlert, Info, X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const toastStyles = `
  .Toastify__toast {
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 400;
    min-height: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
  }

  .Toastify__toast-body {
    padding: 0;
    margin: 0;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .Toastify__toast-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }

  .Toastify__close-button {
    color: #5C5C5C;
    opacity: 1;
    align-self: center;
    margin-left: auto;
    padding-left: 12px;
  }

  .Toastify__close-button > svg {
    display: none;
  }

  .Toastify__toast--success {
    background-color: #D0E7D2;
    color: #1E1E1E;
  }

  .Toastify__toast--error {
    background-color: #FEE2E2;
    color: #1E1E1E;
  }

  .Toastify__toast--warning {
    background-color: #FEF3C7;
    color: #1E1E1E;
  }

  .Toastify__toast--info {
    background-color: #DBEAFE;
    color: #1E1E1E;
  }
`;

const CloseButton = ({ closeToast }: { closeToast: () => void }) => (
  <button onClick={closeToast} className="flex items-center justify-center">
    <X className="w-5 h-5 text-[#5C5C5C]" />
  </button>
);

const SuccessIcon = () => <CircleCheck className="w-5 h-5 text-[#16A34A]" />;
const ErrorIcon = () => <CircleX className="w-5 h-5 text-[#DC2626]" />;
const WarningIcon = () => <CircleAlert className="w-5 h-5 text-[#D97706]" />;
const InfoIcon = () => <Info className="w-5 h-5 text-[#2563EB]" />;

const ToastProvider = () => {
  return (
    <>
      <style>{toastStyles}</style>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton={CloseButton}
        icon={({ type }) => {
          switch (type) {
            case "success":
              return <SuccessIcon />;
            case "error":
              return <ErrorIcon />;
            case "warning":
              return <WarningIcon />;
            case "info":
              return <InfoIcon />;
            default:
              return null;
          }
        }}
      />
    </>
  );
};

export default React.memo(ToastProvider);
