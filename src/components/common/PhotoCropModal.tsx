import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';
import { useLanguage } from '../../state/useLanguage';

// Recadrage carré léger, sans dépendance externe : l'image choisie est
// affichée en mode "cover" dans un viewport carré (cercle visuellement,
// via border-radius — même rendu que .avatar), déplaçable au pointeur et
// zoomable via un curseur. La validation dessine la zone visible sur un
// canvas hors-écran et exporte un JPEG compressé — c'est ce data URL qui
// est stocké sur Member.photo (voir types/roster.ts), rien ne quitte
// l'appareil.
const VIEWPORT = 240;
const SORTIE = 320;

type PhotoCropModalProps = {
  fichier: File;
  onConfirm: (dataUrl: string) => void;
  onCancel: () => void;
};

export function PhotoCropModal({ fichier, onConfirm, onCancel }: PhotoCropModalProps) {
  const { t } = useLanguage();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(fichier);
    setImgUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [fichier]);

  const baseScale = naturalSize.w && naturalSize.h ? Math.max(VIEWPORT / naturalSize.w, VIEWPORT / naturalSize.h) : 1;
  const scale = baseScale * zoom;
  const displayW = naturalSize.w * scale;
  const displayH = naturalSize.h * scale;

  const clamp = (x: number, y: number) => {
    const maxX = Math.max(0, (displayW - VIEWPORT) / 2);
    const maxY = Math.max(0, (displayH - VIEWPORT) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  };

  // Recentre/re-clampe l'offset chaque fois que le zoom ou la taille
  // naturelle changent (nouvelle image, ou zoom qui réduit la marge de
  // déplacement disponible).
  useEffect(() => {
    setOffset((o) => clamp(o.x, o.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, naturalSize.w, naturalSize.h]);

  const onImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const demarrerPan = (e: React.PointerEvent) => {
    e.preventDefault();
    const depart = { x: e.clientX, y: e.clientY, offX: offset.x, offY: offset.y };
    const onMove = (ev: PointerEvent) => {
      setOffset(clamp(depart.offX + (ev.clientX - depart.x), depart.offY + (ev.clientY - depart.y)));
    };
    const onFin = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onFin);
      window.removeEventListener('pointercancel', onFin);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onFin);
    window.addEventListener('pointercancel', onFin);
  };

  const confirmer = () => {
    const img = imgRef.current;
    if (!img || !naturalSize.w || !naturalSize.h) return;
    const canvas = document.createElement('canvas');
    canvas.width = SORTIE;
    canvas.height = SORTIE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const srcSize = VIEWPORT / scale;
    const srcX = naturalSize.w / 2 - (VIEWPORT / 2 + offset.x) / scale;
    const srcY = naturalSize.h / 2 - (VIEWPORT / 2 + offset.y) / scale;
    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, SORTIE, SORTIE);
    onConfirm(canvas.toDataURL('image/jpeg', 0.85));
  };

  return (
    <Modal onClose={onCancel}>
      <h3>{t('photoCrop.title')}</h3>
      <p className="text-sm text-muted" style={{ marginTop: '-0.4rem' }}>
        {t('photoCrop.hint')}
      </p>
      <div
        className="photo-crop__viewport"
        style={{ width: VIEWPORT, height: VIEWPORT }}
        onPointerDown={demarrerPan}
      >
        {imgUrl && (
          <img
            ref={imgRef}
            src={imgUrl}
            alt=""
            draggable={false}
            onLoad={onImgLoad}
            style={{
              width: displayW || undefined,
              height: displayH || undefined,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
            }}
          />
        )}
      </div>
      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        style={{ display: 'block', width: VIEWPORT, margin: '0.8rem auto 0' }}
      />
      <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={onCancel}>
          {t('photoCrop.cancel')}
        </button>
        <button className="btn btn--primary" onClick={confirmer}>
          {t('photoCrop.confirm')}
        </button>
      </div>
    </Modal>
  );
}
