import { useCallback, useEffect, useState } from "react";

interface UseSelfClosingOverlayProps {
  onClose?: () => void;
  timeout?: number;
}
export const useSelfClosingOverlay = (props?: UseSelfClosingOverlayProps) => {
  const { onClose, timeout = 5000 } = props ?? {};

  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);

  const close = useCallback(() => {
    setIsOpen(false);

    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(() => {
      if (isOpen) {
        close();
      }
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [isOpen, close, timeout]);

  return {
    isOpen,
    open,
    close,
  };
};
