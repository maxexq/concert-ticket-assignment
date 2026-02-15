"use client";

import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import { X, Check, AlertTriangle, Info, type LucideIcon } from "lucide-react";
import { Button, type ButtonVariant } from "../atoms";

export type ModalType = "danger" | "success" | "warning" | "info";

interface IConfirmModalProps {
  open: boolean;
  type?: ModalType;
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: ButtonVariant;
  onClose: () => void;
  onConfirm: () => void;
}

const modalConfig: Record<ModalType, { icon: LucideIcon; color: string; variant: ButtonVariant }> = {
  danger: { icon: X, color: "#E84E4E", variant: "danger" },
  success: { icon: Check, color: "#16A34A", variant: "success" },
  warning: { icon: AlertTriangle, color: "#EAB308", variant: "warning" },
  info: { icon: Info, color: "#1692EC", variant: "info" },
};

const ConfirmModal = (props: IConfirmModalProps) => {
  const {
    open,
    type = "danger",
    icon,
    iconColor,
    title,
    message,
    cancelText = "Cancel",
    confirmText = "Confirm",
    confirmVariant,
    onClose,
    onConfirm,
  } = props;

  const config = modalConfig[type];
  const IconComponent = icon || config.icon;
  const bgColor = iconColor || config.color;
  const buttonVariant = confirmVariant || config.variant;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "8px",
          padding: "24px",
          minWidth: "320px",
        },
      }}
    >
      <DialogContent sx={{ padding: 0, textAlign: "center" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{ backgroundColor: bgColor }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-lg font-normal">{title}</p>
            {message && (
              <p className="text-lg font-semibold">&quot;{message}&quot;</p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              title={cancelText}
              variant="info"
              size="md"
              onClick={onClose}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #C2C2C2",
                color: "#5C5C5C",
              }}
            />
            <Button
              title={confirmText}
              variant={buttonVariant}
              size="md"
              onClick={onConfirm}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ConfirmModal);
