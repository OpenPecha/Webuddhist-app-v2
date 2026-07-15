import { useCallback, useState } from 'react';

export function useLoginDrawer() {
  const [visible, setVisible] = useState(false);
  const [session, setSession] = useState(0);

  const showLoginDrawer = useCallback(() => {
    setSession((current) => current + 1);
    setVisible(true);
  }, []);

  const hideLoginDrawer = useCallback(() => setVisible(false), []);

  return { visible, session, showLoginDrawer, hideLoginDrawer };
}
