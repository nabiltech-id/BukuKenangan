import React, { useState, useRef, useEffect } from 'react';
import PolaroidPhoto from './PolaroidPhoto';

const TOTAL_SHEETS = 6;
const BOOK_WIDTH = 920;
const BOOK_HEIGHT = 580;

// Ornamen Garis Tangkai Daun Ghibli (Hand-drawn Ink Botanical Divider)
function BotanicalDivider() {
  return (
    <svg
      viewBox="0 0 180 14"
      className="w-36 h-3.5 text-[#8A6D4B] opacity-75 my-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M4 7H76" />
      <path d="M104 7H176" />
      <path d="M90 2C86 5 86 9 90 12C94 9 94 5 90 2Z" fill="currentColor" fillOpacity="0.25" />
      <path d="M82 7C79 4 75 4 73 7C75 10 79 10 82 7Z" />
      <path d="M98 7C101 4 105 4 107 7C105 10 101 10 98 7Z" />
    </svg>
  );
}

export default function BookSpread({
  spreadIndex,
  onGoToSpread,
  data,
  bucketItems,
  onToggleBucket,
}) {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const stageContainerRef = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      if (!stageContainerRef.current) return;
      const parentWidth = stageContainerRef.current.clientWidth;
      const viewportHeight = window.innerHeight;

      const scaleX = (parentWidth - 16) / BOOK_WIDTH;
      const scaleY = (viewportHeight - 40) / BOOK_HEIGHT;
      const nextScale = Math.min(1, scaleX, scaleY);
      setScale(Math.max(0.38, nextScale));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    const observer = new ResizeObserver(updateScale);
    if (stageContainerRef.current) {
      observer.observe(stageContainerRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      observer.disconnect();
    };
  }, []);

  // Suara gesekan kertas halus saat halaman dibalik
  const playPageRustle = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const duration = 0.22;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0005, ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(ctx.currentTime);
      whiteNoise.stop(ctx.currentTime + duration);
    } catch {}
  };

  const flipTo = (target) => {
    const clamped = Math.max(0, Math.min(TOTAL_SHEETS, target));
    if (clamped !== spreadIndex) {
      playPageRustle();
      onGoToSpread(clamped);
    }
  };

  const { pasangan, babSatu, babDua, babTiga, babEmpat, babLima } = data;

  const wrapperTranslateClass =
    spreadIndex === 0
      ? '-translate-x-[25%]'
      : spreadIndex === TOTAL_SHEETS
      ? 'translate-x-[25%]'
      : 'translate-x-0';

  const getSheetStyle = (sheetIdx) => {
    const isFlipped = sheetIdx < spreadIndex;
    const zIndex = isFlipped
      ? (sheetIdx + 1) * 2
      : (TOTAL_SHEETS - sheetIdx) * 2;
    return {
      zIndex,
      transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
    };
  };

  return (
    <div
      ref={stageContainerRef}
      className="w-full flex items-center justify-center select-none overflow-visible"
      style={{
        height: `${Math.round(BOOK_HEIGHT * scale)}px`,
      }}
    >
      <div
        className="book-stage-perspective flex-shrink-0"
        style={{
          width: `${BOOK_WIDTH}px`,
          height: `${BOOK_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div
          className={`book-3d-wrapper relative w-[920px] h-[580px] ${wrapperTranslateClass}`}
        >
          {/* PAPAN ALAS BUKU KIRI */}
          <div
            className={`absolute top-1.5 bottom-1.5 left-0 w-1/2 book-base-left transition-opacity duration-500 pointer-events-none ${
              spreadIndex > 0 ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* PAPAN ALAS BUKU KANAN */}
          <div
            className={`absolute top-1.5 bottom-1.5 left-1/2 w-1/2 book-base-right transition-opacity duration-500 pointer-events-none ${
              spreadIndex < TOTAL_SHEETS ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* PITA PEMBATAS BUKU KAIN */}
          <div
            className={`absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-12 bg-[#7A241E] z-40 shadow-md pointer-events-none transition-opacity duration-500 ${
              spreadIndex > 0 && spreadIndex < TOTAL_SHEETS
                ? 'opacity-100'
                : 'opacity-0'
            }`}
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
            }}
          />

          {/* ==================================================================
              LEMBAR KERTAS FISIK 0 (DEPAN: SAMPUL DEPAN | BELAKANG: HAL. 01)
             ================================================================== */}
          <div
            style={getSheetStyle(0)}
            className={`book-sheet ${
              spreadIndex > 0 ? 'sheet-flipped' : 'sheet-unflipped'
            }`}
          >
            {/* SISI DEPAN LEMBAR 0: SAMPUL DEPAN BUKU CERITA STUDIO GHIBLI */}
            <div
              onClick={() => flipTo(1)}
              className="sheet-face sheet-face-front hardcover-surface rounded-r-[14px] rounded-l-[3px] border-2 border-[#753830] flex overflow-hidden cursor-pointer"
            >
              {/* Punggung Buku Kulit di Kiri */}
              <div className="book-spine-strip w-8 flex-shrink-0 border-r border-[#240D0A] flex flex-col justify-between py-9 items-center">
                <div className="w-full border-t border-b border-[#E5C278]/40 h-1.5" />
                <div className="w-full border-t border-b border-[#E5C278]/40 h-1.5" />
                <div className="w-full border-t border-b border-[#E5C278]/40 h-1.5" />
                <div className="w-full border-t border-b border-[#E5C278]/40 h-1.5" />
              </div>

              {/* Bingkai Emas Klasik Sampul Buku */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="border border-[#E5C278]/65 p-1 h-full">
                  <div className="border border-[#E5C278]/35 px-5 py-4 h-full relative flex flex-col items-center justify-between text-center bg-[#32120E]/35">
                    {/* Ornamen Sudut Ukiran Tinta Emas */}
                    <svg className="w-5 h-5 text-[#E5C278]/80 absolute top-2 left-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 14V2H14" />
                      <path d="M2 2L10 10" />
                    </svg>
                    <svg className="w-5 h-5 text-[#E5C278]/80 absolute top-2 right-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 14V2H10" />
                      <path d="M22 2L14 10" />
                    </svg>
                    <svg className="w-5 h-5 text-[#E5C278]/80 absolute bottom-2 left-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 10V22H14" />
                      <path d="M2 22L10 14" />
                    </svg>
                    <svg className="w-5 h-5 text-[#E5C278]/80 absolute bottom-2 right-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 10V22H10" />
                      <path d="M22 22L14 14" />
                    </svg>

                    {/* Judul Buku Emboss Emas */}
                    <div className="space-y-0.5 pt-1">
                      <p className="font-serif italic text-xs text-[#E8C988] tracking-widest">
                        {pasangan.tanggalSpesial}
                      </p>
                      <h1 className="font-serif text-2xl font-bold text-[#FBF3E0] tracking-wide">
                        {pasangan.judulBuku}
                      </h1>
                    </div>

                    {/* Bingkai Lukisan Oval/Arched Bookplate (Foto 1: sampul.jpg) */}
                    <div className="w-[205px] my-1">
                      <div className="bg-[#FAF3E1] p-2 pb-2.5 rounded-t-[90px] rounded-b-[4px] shadow-2xl border-2 border-[#D9B972]">
                        <div className="aspect-[4/4.1] rounded-t-[82px] rounded-b-[2px] overflow-hidden border border-[#B89858]">
                          <img
                            src={pasangan.fotoSampul}
                            alt={pasangan.namaPacar}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <p className="font-hand text-[15px] text-[#3A2618] mt-1.5 leading-tight">
                          {pasangan.captionSampul}
                        </p>
                      </div>
                    </div>

                    {/* Nama & Petunjuk Buka */}
                    <div className="space-y-1.5 pb-0.5">
                      <p className="font-serif text-sm font-semibold text-[#F6E6C4] tracking-wide">
                        {pasangan.namaPacar}
                      </p>
                      <p className="font-serif italic text-[11px] text-[#DFC082]/90">
                        &mdash; klik sampul untuk membuka halaman pertama &mdash;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SISI BELAKANG LEMBAR 0: HALAMAN 01 (BAB I KIRI) */}
            <div
              onClick={() => flipTo(0)}
              className="sheet-face sheet-face-back journal-page-left p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="text-center border-b border-[#DCCDB4] pb-2.5 flex flex-col items-center">
                  <span className="font-serif italic text-xs text-[#7D6347]">
                    {babSatu.labelBab}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2D2118] leading-snug mt-0.5">
                    {babSatu.judul}
                  </h2>
                  <BotanicalDivider />
                  <p className="font-hand text-base text-[#6E563D]">
                    {babSatu.tanggalMomen} &bull; {babSatu.lokasi}
                  </p>
                </div>

                <div className="space-y-2.5 text-[12.5px] text-[#33261C] leading-[1.75] font-serif">
                  <p className="first-letter:font-serif first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-[#6E2E26]">
                    {babSatu.paragrafSatu}
                  </p>
                  <p>{babSatu.paragrafDua}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Potongan Kertas Catatan Tanda Saksi */}
                <div className="kraft-note px-3.5 py-2.5 rounded-[3px] flex items-center justify-between gap-2">
                  <div>
                    <span className="font-serif italic text-[11px] text-[#6E563D] block">
                      {babSatu.tiketKenangan.judul}
                    </span>
                    <p className="font-hand text-lg text-[#2D2118] leading-tight">
                      {babSatu.tiketKenangan.keterangan}
                    </p>
                  </div>
                  <div className="border-l border-dashed border-[#C2AE8B] pl-3 text-right flex-shrink-0">
                    <span className="font-serif italic text-[10px] text-[#7D6347] block">
                      Catatan
                    </span>
                    <span className="font-serif text-xs font-bold text-[#5C2822]">
                      {babSatu.tiketKenangan.nomor}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C] pt-1">
                  <span>&larr; tutup sampul</span>
                  <span>~ 1 ~</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================================
              LEMBAR KERTAS FISIK 1 (DEPAN: HAL. 02 | BELAKANG: HAL. 03)
             ================================================================== */}
          <div
            style={getSheetStyle(1)}
            className={`book-sheet ${
              spreadIndex > 1 ? 'sheet-flipped' : 'sheet-unflipped'
            }`}
          >
            {/* SISI DEPAN LEMBAR 1: HALAMAN 02 (FOTO 2: awal-kenal.jpg) */}
            <div
              onClick={() => flipTo(2)}
              className="sheet-face sheet-face-front journal-page-right p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3.5 my-auto">
                <div className="w-[235px] mx-auto">
                  <PolaroidPhoto
                    src={babSatu.foto}
                    caption={babSatu.captionFoto}
                    dateTag="Kenangan Awal Kenal"
                    backNote={babSatu.catatanBalikFoto}
                    tapeClass="washi-tape"
                    rotationClass="rotate-1"
                    aspectClass="aspect-[4/3.5]"
                  />
                </div>

                <div className="kraft-note p-3 rounded-[3px] relative -rotate-1 max-w-sm mx-auto">
                  <div className="w-16 h-4 washi-tape-rose absolute -top-2 right-6 rotate-2" />
                  <span className="font-serif italic text-[11px] text-[#6E563D] block mb-0.5">
                    {babSatu.stickyNoteJudul}
                  </span>
                  <p className="font-hand text-lg text-[#2D2118] leading-snug">
                    {babSatu.stickyNoteIsi}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>~ 2 ~</span>
                <span>halaman berikutnya &rarr;</span>
              </div>
            </div>

            {/* SISI BELAKANG LEMBAR 1: HALAMAN 03 (FOTO 3: first-date.jpg) */}
            <div
              onClick={() => flipTo(1)}
              className="sheet-face sheet-face-back journal-page-left p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3 my-auto">
                <div className="w-[230px] mx-auto">
                  <PolaroidPhoto
                    src={babDua.foto}
                    caption={babDua.captionFoto}
                    dateTag="Pertemuan Pertama"
                    backNote={babDua.catatanBalikFoto}
                    tapeClass="washi-tape-sage"
                    rotationClass="-rotate-1"
                    aspectClass="aspect-[4/3.3]"
                  />
                </div>

                {/* Catatan Kertas Pertemuan Pertama */}
                <div className="bg-[#FAF3E3] border border-[#D4C3A3] p-3 rounded-[3px] shadow-sm max-w-xs mx-auto text-[#33261C] space-y-1">
                  <div className="text-center border-b border-dashed border-[#C7B491] pb-1">
                    <p className="font-serif italic text-xs font-bold text-[#5C2822]">
                      {babDua.strukKenangan.tempat}
                    </p>
                  </div>
                  <div className="space-y-0.5 font-hand text-base">
                    {babDua.strukKenangan.item.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.nama}</span>
                        <span className="font-semibold text-[#5C2822]">{it.nilai}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-[#C7B491] pt-1 flex justify-between font-serif italic text-[11px] font-bold">
                    <span>Kesan Malam Itu</span>
                    <span className="text-[#5C2822]">
                      {babDua.strukKenangan.total}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>&larr; halaman sebelumnya</span>
                <span>~ 3 ~</span>
              </div>
            </div>
          </div>

          {/* ==================================================================
              LEMBAR KERTAS FISIK 2 (DEPAN: HAL. 04 | BELAKANG: HAL. 05)
             ================================================================== */}
          <div
            style={getSheetStyle(2)}
            className={`book-sheet ${
              spreadIndex > 2 ? 'sheet-flipped' : 'sheet-unflipped'
            }`}
          >
            {/* SISI DEPAN LEMBAR 2: HALAMAN 04 (BAB II KANAN) */}
            <div
              onClick={() => flipTo(3)}
              className="sheet-face sheet-face-front journal-page-right p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="text-center border-b border-[#DCCDB4] pb-2 flex flex-col items-center">
                  <span className="font-serif italic text-xs text-[#7D6347]">
                    {babDua.labelBab}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2D2118] leading-snug">
                    {babDua.judul}
                  </h2>
                  <BotanicalDivider />
                </div>

                <p className="text-[12.5px] font-serif text-[#33261C] leading-[1.65]">
                  {babDua.ceritaUtama}
                </p>

                {/* Tulisan Catatan Bergaris Buku Harian */}
                <div className="space-y-2 pt-1">
                  {babDua.tigaHalKecil.map((item, idx) => (
                    <div
                      key={item.angka}
                      className="border-b border-dashed border-[#D6C5A9] pb-2 flex items-baseline gap-2.5"
                    >
                      <span className="font-serif italic font-bold text-sm text-[#6E2E26] flex-shrink-0">
                        {idx === 0 ? 'I.' : idx === 1 ? 'II.' : 'III.'}
                      </span>
                      <div>
                        <h3 className="font-serif text-xs font-bold text-[#2D2118]">
                          {item.judul}
                        </h3>
                        <p className="font-hand text-base text-[#4A3828] leading-snug">
                          {item.isi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>~ 4 ~</span>
                <span>halaman berikutnya &rarr;</span>
              </div>
            </div>

            {/* SISI BELAKANG LEMBAR 2: HALAMAN 05 (FOTO 4: momen-1.jpg) */}
            <div
              onClick={() => flipTo(2)}
              className="sheet-face sheet-face-back journal-page-left p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="text-center border-b border-[#DCCDB4] pb-2 flex flex-col items-center">
                  <span className="font-serif italic text-xs text-[#7D6347]">
                    {babTiga.labelBab}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2D2118]">
                    {babTiga.judulKiri}
                  </h2>
                </div>

                <div className="w-[230px] mx-auto">
                  <PolaroidPhoto
                    src={babTiga.polaroidUtamaKiri.foto}
                    caption={babTiga.polaroidUtamaKiri.judul}
                    dateTag={babTiga.polaroidUtamaKiri.tanggal}
                    backNote={babTiga.polaroidUtamaKiri.pesanBalikFoto}
                    tapeClass={babTiga.polaroidUtamaKiri.tapeStyle}
                    rotationClass={babTiga.polaroidUtamaKiri.rotasi}
                    aspectClass="aspect-[4/3.3]"
                  />
                </div>

                <div className="kraft-note p-3 rounded-[3px] max-w-sm mx-auto">
                  <p className="font-hand text-lg text-[#33261C] leading-snug text-center">
                    &ldquo;{babTiga.catatanHalamanLima}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>&larr; halaman sebelumnya</span>
                <span>~ 5 ~</span>
              </div>
            </div>
          </div>

          {/* ==================================================================
              LEMBAR KERTAS FISIK 3 (DEPAN: HAL. 06 | BELAKANG: HAL. 07)
             ================================================================== */}
          <div
            style={getSheetStyle(3)}
            className={`book-sheet ${
              spreadIndex > 3 ? 'sheet-flipped' : 'sheet-unflipped'
            }`}
          >
            {/* SISI DEPAN LEMBAR 3: HALAMAN 06 (FOTO 5 & 6: momen-2.jpg & momen-3.jpg) */}
            <div
              onClick={() => flipTo(4)}
              className="sheet-face sheet-face-front journal-page-right p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3.5">
                <div className="text-center border-b border-[#DCCDB4] pb-2 flex flex-col items-center">
                  <span className="font-serif italic text-xs text-[#7D6347]">
                    Sketsa Keseharian
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2D2118]">
                    {babTiga.judulKanan}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-1 items-start">
                  {babTiga.daftarPolaroidKanan.map((pol) => (
                    <PolaroidPhoto
                      key={pol.id}
                      src={pol.foto}
                      caption={pol.judul}
                      dateTag={pol.tanggal}
                      backNote={pol.pesanBalikFoto}
                      tapeClass={pol.tapeStyle}
                      rotationClass={pol.rotasi}
                      aspectClass="aspect-[4/4]"
                      compact
                    />
                  ))}
                </div>

                <div className="kraft-note p-3 rounded-[3px] text-center">
                  <p className="font-hand text-lg text-[#33261C] leading-snug">
                    {babTiga.kutipanHalamanEnam}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>~ 6 ~</span>
                <span>halaman berikutnya &rarr;</span>
              </div>
            </div>

            {/* SISI BELAKANG LEMBAR 3: HALAMAN 07 (BAB IV KIRI) */}
            <div
              onClick={() => flipTo(3)}
              className="sheet-face sheet-face-back journal-page-left p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="text-center border-b border-[#DCCDB4] pb-2 flex flex-col items-center">
                  <span className="font-serif italic text-xs text-[#7D6347]">
                    {babEmpat.labelBab}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2D2118]">
                    {babEmpat.judulKiri}
                  </h2>
                  <BotanicalDivider />
                </div>

                <div className="space-y-3 pt-1">
                  {babEmpat.alasanSayang.map((alasan) => (
                    <div
                      key={alasan.nomor}
                      className="border-b border-dashed border-[#D6C5A9] pb-2.5 flex items-baseline gap-3"
                    >
                      <span className="font-serif italic text-sm font-bold text-[#6E2E26] flex-shrink-0">
                        {alasan.nomor}.
                      </span>
                      <div>
                        <h3 className="font-serif text-xs font-bold text-[#2D2118]">
                          {alasan.judul}
                        </h3>
                        <p className="font-hand text-base text-[#4A3828] leading-snug mt-0.5">
                          {alasan.isi}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>&larr; halaman sebelumnya</span>
                <span>~ 7 ~</span>
              </div>
            </div>
          </div>

          {/* ==================================================================
              LEMBAR KERTAS FISIK 4 (DEPAN: HAL. 08 | BELAKANG: HAL. 09)
             ================================================================== */}
          <div
            style={getSheetStyle(4)}
            className={`book-sheet ${
              spreadIndex > 4 ? 'sheet-flipped' : 'sheet-unflipped'
            }`}
          >
            {/* SISI DEPAN LEMBAR 4: HALAMAN 08 (BAB IV KANAN - BUCKET LIST BUKU HARIAN) */}
            <div
              onClick={() => flipTo(5)}
              className="sheet-face sheet-face-front journal-page-right p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="text-center border-b border-[#DCCDB4] pb-2 flex flex-col items-center">
                  <span className="font-serif italic text-xs text-[#7D6347]">
                    Catatan Perjalanan
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2D2118]">
                    {babEmpat.judulKanan}
                  </h2>
                  <BotanicalDivider />
                </div>

                <div className="space-y-2.5 pt-1">
                  {bucketItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBucket(item.id);
                      }}
                      className="w-full text-left py-2 px-1 border-b border-dashed border-[#D2C0A2] flex items-center gap-3 group"
                    >
                      <span className="w-5 h-5 rounded-[2px] border border-[#8A6D4B] bg-[#FAF3E3] flex items-center justify-center flex-shrink-0">
                        {item.selesai && (
                          <svg
                            viewBox="0 0 16 16"
                            className="w-4 h-4 text-[#6E2E26]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 8.5L6.5 12L13.5 4" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`font-hand text-lg leading-snug ${
                          item.selesai
                            ? 'text-[#5A4736] decoration-[#8A6D4B]/60 line-through'
                            : 'text-[#2D2118]'
                        }`}
                      >
                        {item.teks}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>~ 8 ~</span>
                <span>halaman berikutnya &rarr;</span>
              </div>
            </div>

            {/* SISI BELAKANG LEMBAR 4: HALAMAN 09 (BAB V KIRI) */}
            <div
              onClick={() => flipTo(4)}
              className="sheet-face sheet-face-back journal-page-left p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3.5">
                <div className="text-center border-b border-[#DCCDB4] pb-2 flex flex-col items-center">
                  <span className="font-serif italic text-xs text-[#7D6347]">
                    {babLima.labelBab}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2D2118]">
                    {babLima.judulKiri}
                  </h2>
                  <BotanicalDivider />
                </div>

                <div className="space-y-2.5 text-[12.5px] font-serif text-[#33261C] leading-[1.7]">
                  <p>{babLima.isiKiriSatu}</p>
                  <p>{babLima.isiKiriDua}</p>
                </div>

                <div className="kraft-note p-3.5 rounded-[3px] space-y-1.5">
                  <span className="font-serif italic text-xs font-bold text-[#5C2822] block">
                    Janji Kecil Kita ke Depan:
                  </span>
                  <ul className="space-y-1 font-hand text-lg text-[#33261C]">
                    {babLima.janjiKita.map((janji, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#6E2E26]">&ndash;</span>
                        <span>{janji}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>&larr; halaman sebelumnya</span>
                <span>~ 9 ~</span>
              </div>
            </div>
          </div>

          {/* ==================================================================
              LEMBAR KERTAS FISIK 5 (DEPAN: HAL. 10 SURAT | BELAKANG: SAMPUL BELAKANG)
             ================================================================== */}
          <div
            style={getSheetStyle(5)}
            className={`book-sheet ${
              spreadIndex > 5 ? 'sheet-flipped' : 'sheet-unflipped'
            }`}
          >
            {/* SISI DEPAN LEMBAR 5: HALAMAN 10 (AMPLOP SURAT CINTA — 3D FLIP) */}
            <div
              onClick={() => flipTo(6)}
              className="sheet-face sheet-face-front journal-page-right p-7 flex flex-col justify-between cursor-pointer"
            >
              <div className="my-auto">
                <div
                  className="polaroid-3d-scene w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    playPageRustle();
                    setIsLetterOpen((prev) => !prev);
                  }}
                >
                  <div
                    className={`polaroid-3d-inner ${
                      isLetterOpen ? 'is-flipped' : ''
                    }`}
                  >
                    {/* SISI DEPAN: AMPLOP KERTAS KLASIK DENGAN SEGEL LILIN MERAH */}
                    <div className="polaroid-face-front bg-[#FAF5E8] border border-[#D4C3A3] rounded-[3px] p-5 shadow-md flex flex-col justify-between min-h-[375px]">
                      <div className="text-center space-y-0.5">
                        <span className="font-serif italic text-xs text-[#7D6347]">
                          Halaman Terakhir
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#2D2118]">
                          {babLima.amplop.judulAmplop}
                        </h3>
                      </div>

                      <div className="group bg-[#EFE3C8] border border-[#C9B38C] rounded-[4px] p-6 shadow-md relative overflow-hidden my-auto">
                        <div
                          className="absolute inset-x-0 top-0 h-24 bg-[#E4D4B4] border-b border-[#C2AC84]"
                          style={{
                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                          }}
                        />

                        <div className="relative z-10 pt-8 pb-1 flex flex-col items-center text-center">
                          <div className="w-14 h-14 rounded-full bg-[#7E231D] group-hover:bg-[#912922] text-[#F7E5C8] border-2 border-[#591612] shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
                            <span className="font-serif italic text-[11px] tracking-wider">
                              Buka
                            </span>
                          </div>

                          <p className="font-hand text-2xl text-[#2D2118] mt-3">
                            Untuk: {pasangan.namaPacar}
                          </p>
                          <span className="font-serif italic text-[11px] text-[#7D6347] mt-0.5">
                            (klik segel lilin untuk membalik &amp; membuka surat)
                          </span>
                        </div>
                      </div>

                      <div className="text-center font-serif italic text-[10px] text-[#8A7256]">
                        <span>~</span>
                      </div>
                    </div>

                    {/* SISI BELAKANG: ISI SURAT TULISAN TANGAN */}
                    <div className="polaroid-face-back bg-[#FAF5E8] border border-[#D4C3A3] rounded-[3px] p-4 shadow-md flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-dashed border-[#D4C3A3] pb-1.5">
                        <span className="font-serif italic text-xs font-bold text-[#5C2822]">
                          {babLima.amplop.sapaanSurat}
                        </span>
                        <span className="font-serif italic text-[11px] text-[#7D6347] hover:text-[#2D2118]">
                          (balik ke amplop)
                        </span>
                      </div>

                      <div className="space-y-2 text-[11.5px] font-serif text-[#33261C] leading-[1.62] my-auto">
                        {babLima.amplop.isiSurat.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>

                      <div className="pt-1.5 border-t border-dashed border-[#DFD1B8] flex items-end justify-between">
                        <div>
                          <span className="text-[10px] italic font-serif text-[#7D6347] block">
                            {babLima.amplop.penutupSurat}
                          </span>
                          <span className="font-hand text-2xl text-[#5C2822] block leading-none mt-1">
                            {babLima.amplop.tandaTangan}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-serif italic text-[#7D664C]">
                <span>~ 10 ~</span>
                <button
                  type="button"
                  onClick={() => flipTo(6)}
                  className="hover:underline text-[#5C2822]"
                >
                  tutup buku &rarr;
                </button>
              </div>
            </div>

            {/* SISI BELAKANG LEMBAR 5: SAMPUL BELAKANG HARDCOVER */}
            <div
              onClick={() => flipTo(0)}
              className="sheet-face sheet-face-back hardcover-surface rounded-l-[14px] rounded-r-[3px] border-2 border-[#753830] flex overflow-hidden cursor-pointer"
            >
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="border border-[#E5C278]/65 p-1 h-full">
                  <div className="border border-[#E5C278]/35 p-6 h-full flex flex-col items-center justify-center text-center space-y-5 bg-[#32120E]/35">
                    <BotanicalDivider />

                    <div className="space-y-1.5">
                      <span className="font-serif italic text-xs text-[#E8C988] block">
                        {pasangan.tanggalSpesial}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#FBF3E0]">
                        {pasangan.namaPacar}
                      </h3>
                      <p className="text-xs italic font-serif text-[#E6D2AE] max-w-xs pt-1">
                        &ldquo;Dan cerita kita masih akan terus berlanjut ke halaman-halaman berikutnya.&rdquo;
                      </p>
                    </div>

                    <BotanicalDivider />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        flipTo(0);
                      }}
                      className="font-serif italic text-xs text-[#E8C988] hover:text-[#FBF3E0] underline underline-offset-4 pt-2"
                    >
                      &larr; kembali ke sampul depan
                    </button>
                  </div>
                </div>
              </div>

              <div className="book-spine-strip w-8 flex-shrink-0 border-l border-[#240D0A]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
