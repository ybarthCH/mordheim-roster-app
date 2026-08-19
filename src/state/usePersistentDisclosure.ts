import { useEffect, useRef, useState } from 'react';
import { getSetting, setSetting } from '../db/db';

export function usePersistentDisclosure(key: string, defaultOpen = true) {
  const [open, setOpen] = useState(defaultOpen);
  // Un clic sur le toggle avant la fin de la lecture IndexedDB (montage
  // rapide, appareil lent) ne doit pas être écrasé par la valeur persistée
  // une fois cette lecture terminée — même motif que GameRulesContext.
  // Réinitialisé à chaque changement de `key` : chaque clé correspond à un
  // réglage distinct, avec sa propre lecture en attente.
  const modifiedBeforeLoad = useRef(false);

  useEffect(() => {
    let actif = true;
    modifiedBeforeLoad.current = false;
    setOpen(defaultOpen);
    getSetting<boolean>(key).then((saved) => {
      if (actif && !modifiedBeforeLoad.current && typeof saved === 'boolean') setOpen(saved);
    });
    return () => {
      actif = false;
    };
  }, [defaultOpen, key]);

  const toggle = () => {
    modifiedBeforeLoad.current = true;
    setOpen((actuel) => {
      const suivant = !actuel;
      void setSetting(key, suivant);
      return suivant;
    });
  };

  return { open, toggle };
}
