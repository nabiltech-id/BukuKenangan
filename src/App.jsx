import React, { useState, useEffect, useRef, useCallback } from 'react';
import { storyData } from './data/storyData';
import BookSpread from './components/BookSpread';

// Melodi Waltz 3/4 Kotak Musik & Celesta bergaya Studio Ghibli (Joe Hisaishi Waltz)
const GHIBLI_WALTZ_STEPS = [
  { mel: 392.00, bass: 196.00 },
  { mel: 493.88, acc: 293.66 },
  { mel: 587.33, acc: 392.00 },
  { mel: 659.25, bass: 164.81 },
  { mel: 587.33, acc: 329.63 },
  { mel: 493.88, acc: 392.00 },
  { mel: 523.25, bass: 261.63 },
  { mel: 587.33, acc: 329.63 },
  { mel: 659.25, acc: 392.00 },
  { mel: 587.33, bass: 146.83 },
  { mel: 493.88, acc: 293.66 },
  { mel: 440.00, acc: 369.99 },
  { mel: 493.88, bass: 246.94 },
  { mel: 587.33, acc: 369.99 },
  { mel: 783.99, acc: 493.88 },
  { mel: 739.99, bass: 164.81 },
  { mel: 659.25, acc: 329.63 },
  { mel: 587.33, acc: 392.00 },
  { mel: 523.25, bass: 220.00 },
  { mel: 493.88, acc: 329.63 },
  { mel: 440.00, acc: 293.66 },
  { mel: 392.00, bass: 196.00 },
  { mel: 493.88, acc: 293.66 },
  { mel: 587.33, acc: 392.00 },
];

export default function App() {
  const [introStage, setIntroStage] = useState('showing');
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const [bucketItems, setBucketItems] = useState(() => {
    try {
      const saved = localStorage.getItem('buku_kenangan_bucket_v4');
      return saved ? JSON.parse(saved) : storyData.babEmpat.bucketList;
    } catch {
      return storyData.babEmpat.bucketList;
    }
  });

  const audioCtxRef = useRef(null);
  const musicTimerRef = useRef(null);
  const noteIdxRef = useRef(0);
  const mp3AudioRef = useRef(null);
  const flipTimerRef = useRef(null);

  // Timer animasi loading pembuka (Octavia Nurrafendra Ramadhani — 23 October 2026)
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStage('fading'), 2600);
    const t2 = setTimeout(() => setIntroStage('done'), 3300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'buku_kenangan_bucket_v4',
        JSON.stringify(bucketItems)
      );
    } catch {}
  }, [bucketItems]);

  const handleToggleBucket = (id) => {
    setBucketItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selesai: !item.selesai } : item
      )
    );
  };

  const playCelestaTone = (ctx, freq, volume = 0.04, duration = 1.45) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.0008, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(volume * 0.22, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.55);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration);
    overtone.stop(now + duration);
  };

  const startMusicBox = useCallback(() => {
    if (storyData.musik?.urlMp3) {
      if (!mp3AudioRef.current) {
        mp3AudioRef.current = new Audio(storyData.musik.urlMp3);
        mp3AudioRef.current.loop = true;
        mp3AudioRef.current.volume = 0.45;
      }
      mp3AudioRef.current.play().catch(() => {});
      setIsMusicPlaying(true);
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (musicTimerRef.current) {
      clearInterval(musicTimerRef.current);
    }

    const playStep = () => {
      if (!audioCtxRef.current) return;
      const step =
        GHIBLI_WALTZ_STEPS[noteIdxRef.current % GHIBLI_WALTZ_STEPS.length];
      noteIdxRef.current += 1;

      if (step.mel) {
        playCelestaTone(ctx, step.mel, 0.042, 1.5);
      }
      if (step.bass) {
        playCelestaTone(ctx, step.bass, 0.026, 1.7);
      }
      if (step.acc) {
        playCelestaTone(ctx, step.acc, 0.02, 1.1);
      }
    };

    playStep();
    musicTimerRef.current = setInterval(playStep, 440);
    setIsMusicPlaying(true);
  }, []);

  const stopMusicBox = useCallback(() => {
    if (mp3AudioRef.current) {
      mp3AudioRef.current.pause();
      mp3AudioRef.current.currentTime = 0;
    }
    if (musicTimerRef.current) {
      clearInterval(musicTimerRef.current);
      musicTimerRef.current = null;
    }
    noteIdxRef.current = 0;
    setIsMusicPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (musicTimerRef.current) clearInterval(musicTimerRef.current);
      if (mp3AudioRef.current) mp3AudioRef.current.pause();
      if (flipTimerRef.current) clearInterval(flipTimerRef.current);
    };
  }, []);

  // Musik otomatis menyala saat halaman buku dibuka, mati saat kembali ke sampul depan
  useEffect(() => {
    if (spreadIndex > 0 && !isMusicPlaying) {
      startMusicBox();
    } else if (spreadIndex === 0 && isMusicPlaying) {
      stopMusicBox();
    }
  }, [spreadIndex, isMusicPlaying, startMusicBox, stopMusicBox]);

  const goToSpreadSmooth = useCallback((targetIdx) => {
    const clampedTarget = Math.max(0, Math.min(6, targetIdx));
    if (flipTimerRef.current) {
      clearInterval(flipTimerRef.current);
      flipTimerRef.current = null;
    }

    setSpreadIndex((current) => {
      if (current === clampedTarget) return current;
      const diff = Math.abs(clampedTarget - current);
      if (diff === 1) {
        return clampedTarget;
      }

      const step = clampedTarget > current ? 1 : -1;
      let nextVal = current + step;

      flipTimerRef.current = setInterval(() => {
        nextVal += step;
        setSpreadIndex(nextVal);
        if (nextVal === clampedTarget) {
          clearInterval(flipTimerRef.current);
          flipTimerRef.current = null;
        }
      }, 170);

      return nextVal;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (introStage !== 'done') return;
      if (e.key === 'ArrowRight') {
        goToSpreadSmooth(Math.min(6, spreadIndex + 1));
      } else if (e.key === 'ArrowLeft') {
        goToSpreadSmooth(Math.max(0, spreadIndex - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spreadIndex, goToSpreadSmooth, introStage]);

  return (
    <div className="min-h-screen desk-canvas flex flex-col justify-center items-center relative overflow-hidden">
      {/* KARTU KERTAS PEMBUKA (Octavia Nurrafendra Ramadhani — 23 October 2026) */}
      {introStage !== 'done' && (
        <div
          onClick={() => setIntroStage('done')}
          className={`fixed inset-0 z-50 desk-canvas flex flex-col items-center justify-center px-6 text-center transition-opacity duration-700 cursor-pointer ${
            introStage === 'fading'
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100'
          }`}
        >
          <div className="bg-[#FBF6E8]/95 border-2 border-[#C8B28E] px-8 py-9 sm:px-12 sm:py-11 rounded-[4px] shadow-[0_24px_60px_rgba(24,14,8,0.65)] max-w-lg w-full relative">
            <div className="border border-[#DBC8A8] p-6 sm:p-8 space-y-5">
              {/* Ornamen Tangkai Daun Lukis Tangan */}
              <div className="animate-intro-fade-1 flex justify-center">
                <svg
                  viewBox="0 0 180 14"
                  className="w-36 h-3.5 text-[#7A5C3E]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                >
                  <path d="M4 7H76" />
                  <path d="M104 7H176" />
                  <path d="M90 2C86 5 86 9 90 12C94 9 94 5 90 2Z" fill="currentColor" fillOpacity="0.3" />
                  <path d="M82 7C79 4 75 4 73 7C75 10 79 10 82 7Z" />
                  <path d="M98 7C101 4 105 4 107 7C105 10 101 10 98 7Z" />
                </svg>
              </div>

              {/* Nama Lengkap: Octavia Nurrafendra Ramadhani */}
              <div className="space-y-2">
                <h1 className="animate-intro-fade-1 font-serif text-2xl sm:text-3xl font-bold text-[#2D2118] tracking-wide leading-snug">
                  Octavia Nurrafendra Ramadhani
                </h1>

                {/* Tanggal: 23 October 2026 */}
                <p className="animate-intro-fade-2 font-serif italic text-base sm:text-lg text-[#6E2E26]">
                  23 October 2026
                </p>
              </div>

              {/* Garis Tinta Pembuka */}
              <div className="animate-intro-fade-3 max-w-[180px] mx-auto pt-1 space-y-2">
                <div className="h-[2px] w-full bg-[#E2D4BC] overflow-hidden">
                  <div className="h-full bg-[#6E2E26] animate-intro-progress" />
                </div>
                <span className="font-serif italic text-xs text-[#7D664C] block">
                  Membuka lembar cerita...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANGGUNG UTAMA BUKU 3D DI ATAS MEJA KAYU STUDIO GHIBLI */}
      <main
        className={`w-full flex items-center justify-center py-2 px-2 sm:px-4 relative z-10 ${
          introStage === 'done' ? 'animate-book-enter' : 'opacity-0'
        }`}
      >
        <BookSpread
          spreadIndex={spreadIndex}
          onGoToSpread={goToSpreadSmooth}
          data={storyData}
          bucketItems={bucketItems}
          onToggleBucket={handleToggleBucket}
        />
      </main>
    </div>
  );
}
