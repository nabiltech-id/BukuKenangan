import React, { useState, useRef } from 'react';

export default function PolaroidPhoto({
  src,
  caption,
  dateTag,
  backNote,
  tapeClass = 'washi-tape',
  rotationClass = '-rotate-1',
  aspectClass = 'aspect-[4/3.6]',
  compact = false,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const audioCtxRef = useRef(null);

  // Suara gesekan kertas halus saat foto Polaroid dibalik
  const playCardFlipSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const duration = 0.16;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1150, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + duration);
    } catch {}
  };

  const handleFlipPolaroid = (e) => {
    e.stopPropagation();
    if (backNote) {
      playCardFlipSound();
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div
      className={`polaroid-3d-scene relative group cursor-pointer select-none transition-transform duration-500 ${rotationClass} hover:rotate-0`}
      onClick={handleFlipPolaroid}
      title={backNote ? 'Klik untuk membalik kertas foto' : caption}
    >
      {/* Strip Selotip Kertas Lukis */}
      <div
        className={`${
          compact ? 'w-16 h-4 -top-2' : 'w-24 h-5 -top-2.5'
        } ${tapeClass} absolute left-1/2 -translate-x-1/2 -rotate-2 z-30 pointer-events-none transition-opacity duration-500 ${
          isFlipped ? 'opacity-65' : 'opacity-100'
        }`}
      />

      {/* Kontainer 3D Flip Mulus (Sisi Depan & Sisi Belakang) */}
      <div className={`polaroid-3d-inner ${isFlipped ? 'is-flipped' : ''}`}>
        {/* SISI DEPAN LUKISAN / POLAROID */}
        <div
          className={`polaroid-face-front polaroid-card ${
            compact ? 'p-2 pb-2.5' : 'p-2.5 pb-3'
          } rounded-[3px]`}
        >
          <div
            className={`relative w-full ${aspectClass} overflow-hidden bg-[#2C221B] border border-[#D8CBB3]`}
          >
            <img
              src={src}
              alt={caption}
              className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          <div className="pt-2 px-0.5 flex items-baseline justify-between gap-1.5">
            <p
              className={`font-hand ${
                compact ? 'text-base' : 'text-lg'
              } text-[#2D221A] leading-tight`}
            >
              {caption}
            </p>
            {backNote && (
              <span className="font-serif italic text-[10px] text-[#8A7256] group-hover:text-[#5C2822] flex-shrink-0">
                (balik)
              </span>
            )}
          </div>
        </div>

        {/* SISI BELAKANG KERTAS FOTO (TULISAN TANGAN) */}
        <div
          className={`polaroid-face-back polaroid-card ${
            compact ? 'p-2.5' : 'p-3.5'
          } rounded-[3px] bg-[#F6EFE0] border border-[#D6C6AA] flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between border-b border-dashed border-[#C9B799] pb-1 font-serif italic text-[10px] text-[#7D664C]">
            <span>{dateTag || 'Catatan di balik lukisan'}</span>
            <span>(tutup)</span>
          </div>

          <div className="py-1 px-1 my-auto text-center overflow-hidden">
            <p
              className={`font-hand ${
                compact ? 'text-[15px] leading-snug' : 'text-lg leading-snug'
              } text-[#36271C]`}
            >
              &ldquo;{backNote}&rdquo;
            </p>
          </div>

          <div className="text-center font-serif italic text-[10px] text-[#8A7256] border-t border-[#E2D5BE] pt-1">
            <span>~</span>
          </div>
        </div>
      </div>
    </div>
  );
}
