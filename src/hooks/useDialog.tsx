import { ChoiceDialog } from '@/components/ui/ChoiceDialog';
import { DestructiveConfirmDialog } from '@/components/ui/DestructiveConfirmDialog';
import { useCallback, useRef, useState } from 'react';

interface DestructiveOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

interface ChoiceOptions {
  title: string;
  message: string;
  secondaryLabel: string;
  primaryLabel: string;
}

type DialogState =
  | { type: 'destructive'; options: DestructiveOptions; resolve: (v: boolean) => void }
  | { type: 'choice'; options: ChoiceOptions; resolve: (v: 'primary' | 'secondary' | false) => void }
  | null;

export function useDialog() {
  const [state, setState] = useState<DialogState>(null);
  const stateRef = useRef<DialogState>(null);

  const close = useCallback(() => {
    setState(null);
    stateRef.current = null;
  }, []);

  const confirmDestructive = useCallback((options: DestructiveOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const next: DialogState = {
        type: 'destructive',
        options,
        resolve: (v) => {
          resolve(v);
          close();
        },
      };
      stateRef.current = next;
      setState(next);
    });
  }, [close]);

  const confirmChoice = useCallback(
    (options: ChoiceOptions): Promise<'primary' | 'secondary' | false> => {
      return new Promise((resolve) => {
        const next: DialogState = {
          type: 'choice',
          options,
          resolve: (v) => {
            resolve(v);
            close();
          },
        };
        stateRef.current = next;
        setState(next);
      });
    },
    [close],
  );

  const dialog =
    state?.type === 'destructive' ? (
      <DestructiveConfirmDialog
        visible
        title={state.options.title}
        message={state.options.message}
        confirmLabel={state.options.confirmLabel}
        cancelLabel={state.options.cancelLabel}
        onConfirm={() => state.resolve(true)}
        onClose={() => state.resolve(false)}
      />
    ) : state?.type === 'choice' ? (
      <ChoiceDialog
        visible
        title={state.options.title}
        message={state.options.message}
        secondaryLabel={state.options.secondaryLabel}
        primaryLabel={state.options.primaryLabel}
        onSecondary={() => state.resolve('secondary')}
        onPrimary={() => state.resolve('primary')}
        onClose={() => state.resolve(false)}
      />
    ) : null;

  return { dialog, confirmDestructive, confirmChoice };
}
