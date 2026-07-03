'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from './ui';

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
interface ConfirmOptions {
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface UXContext {
  toast: (message: string, type?: ToastType) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const Ctx = createContext<UXContext | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be used within AdminUXProvider');
  return c.toast;
}
export function useConfirm() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useConfirm must be used within AdminUXProvider');
  return c.confirm;
}

const TOAST_ICON = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-sky-500" />,
};

export function AdminUXProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const [confirmState, setConfirmState] = useState<(ConfirmOptions & { resolve: (b: boolean) => void }) | null>(null);
  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setConfirmState({ ...options, resolve })),
    [],
  );
  const settle = (value: boolean) => {
    confirmState?.resolve(value);
    setConfirmState(null);
  };

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <Ctx.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg"
            role="status"
          >
            {TOAST_ICON[t.type]}
            <p className="text-sm text-slate-700">{t.message}</p>
          </div>
        ))}
      </div>

      {confirmState && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              {confirmState.danger && <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />}
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{confirmState.title}</h2>
                {confirmState.body && <p className="mt-1.5 text-sm text-slate-500">{confirmState.body}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => settle(false)}>
                {confirmState.cancelLabel ?? 'Cancel'}
              </Button>
              <Button variant={confirmState.danger ? 'primary' : 'secondary'} onClick={() => settle(true)}>
                {confirmState.confirmLabel ?? 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
