import { useEffect, useState } from 'react';
import { getSetting, setSetting } from '../db/db';

export function usePersistentDisclosure(key: string, defaultOpen = true) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    let actif = true;
    setOpen(defaultOpen);
    getSetting<boolean>(key).then((saved) => {
      if (actif && typeof saved === 'boolean') setOpen(saved);
    });
    return () => {
      actif = false;
    };
  }, [defaultOpen, key]);

  const toggle = () => {
    setOpen((actuel) => {
      const suivant = !actuel;
      void setSetting(key, suivant);
      return suivant;
    });
  };

  return { open, toggle };
}
