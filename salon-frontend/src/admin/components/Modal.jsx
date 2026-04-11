import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-overlay-dark backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`${sizeClasses[size]} w-full bg-bg-main rounded-2xl shadow-strong border border-border-soft animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft shrink-0">
          <h2 className="text-[15px] font-semibold text-text-heading">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-bg-soft text-text-muted hover:text-text-body transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
};

// ─── Confirm Dialog (delete / cancel actions) ─────────
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", variant = "danger" }) => {
  const colors = {
    danger: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
    warning: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
    success: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-[13px] text-text-body leading-relaxed mb-6">{message}</p>
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-[13px] font-medium text-text-body bg-bg-soft hover:bg-bg-panel transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 rounded-xl text-[13px] font-medium text-text-invert ${colors[variant]} shadow-sm transition-all duration-200`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
