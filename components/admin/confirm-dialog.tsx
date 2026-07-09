"use client";

import { useEffect, useRef } from "react";
import { AdminButton } from "./admin-button";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Replaces window.confirm(). Native browser dialogs are visually jarring
 * and block the JS thread; this also lets us default focus to the SAFE
 * action (Cancel), per "protect users from slips" — an accidental Enter
 * press should never cancel a paying customer's order.
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Batal",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-kopi-ink/40 px-6"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        onClick={(e) => e.stopPropagation()}
        className="ledger-entry w-full max-w-sm bg-kopi-bg p-6 shadow-(--shadow-stamp-md)"
      >
        <h2
          id="confirm-title"
          className="font-display text-lg text-kopi-ink mb-2"
        >
          {title}
        </h2>
        <p
          id="confirm-desc"
          className="font-body text-sm text-kopi-ink-soft mb-6"
        >
          {description}
        </p>
        <div className="flex justify-end gap-3">
          <AdminButton
            ref={cancelRef}
            variant="neutral"
            size="md"
            onClick={onCancel}
          >
            {cancelLabel}
          </AdminButton>
          <AdminButton variant="danger" size="md" onClick={onConfirm}>
            {confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
