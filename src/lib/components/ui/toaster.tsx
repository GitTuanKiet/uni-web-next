"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@lib/components/ui/toast";
import { useToast } from "@lib/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, icon, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid space-y-2">
              <div className="flex space-x-2">
                {icon && icon}
                {title && <ToastTitle>{title}</ToastTitle>}
              </div>
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
