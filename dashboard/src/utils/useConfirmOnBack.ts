// useConfirmOnBack.ts
import { useEffect, useRef } from 'react';

export default function useConfirmOnBack({
  enabled,
  message = 'Do you want to leave and lose this session?',
  onConfirm, // e.g. cleanup, navigate to landing
}: {
  enabled: boolean;
  message?: string;
  onConfirm?: () => void;
}) {
  const armedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // push a guard state only once per enable cycle
    if (!armedRef.current) {
      history.pushState({ __guard: true }, '', window.location.href);
      armedRef.current = true;
    }

    const onPopState = () => {
      // prompt once per back press
      const ok = window.confirm(message);

      if (ok) {
        window.removeEventListener('popstate', onPopState);
        window.removeEventListener('beforeunload', onBeforeUnload);
        armedRef.current = false;
        onConfirm?.();
        history.back(); 
      } else {
        // user canceled → re-arm by pushing a new guard state
        history.replaceState({ __guard: true }, '', window.location.href);
      }
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      // warn on refresh/close
      e.preventDefault();
      e.returnValue = ''; // required for some browsers
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', onBeforeUnload);
      armedRef.current = false;
    };
  }, [enabled, message, onConfirm]);
}
