// ============================================================================
// PANDUAN EDIT ISI BUKU KENANGAN (VS CODE):
// 1. Foto-foto tersimpan di dalam folder `public/foto/`:
//    - `/foto/sampul.jpg`      (Foto Sampul Depan Buku)
//    - `/foto/awal-kenal.jpg`  (Foto Halaman 02 - Bab I)
//    - `/foto/first-date.jpg`  (Foto Halaman 03 - Bab II)
//    - `/foto/momen-1.jpg`     (Foto Halaman 05 - Bab III Kiri)
//    - `/foto/momen-2.jpg`     (Foto Halaman 06 - Bab III Kanan 1)
//    - `/foto/momen-3.jpg`     (Foto Halaman 06 - Bab III Kanan 2)
// 2. Untuk mengganti nama, tanggal, cerita tiap halaman, dan isi surat:
//    Cukup ubah teks di dalam tanda kutip ("...") di bawah ini lalu Save (Ctrl+S).
// ============================================================================

export const storyData = {
  // --------------------------------------------------------------------------
  // 0. DATA UTAMA, INTRO LOADING & SAMPUL BUKU
  // --------------------------------------------------------------------------
  pasangan: {
    namaKamu: 'Nabil',
    namaPacar: 'Octavia Nurrafendra Ramadhani',
    namaPanggilanPacar: 'Octavia',
    tanggalSpesial: '23 October 2026',
    judulBuku: 'Tentang Kita Berdua',
    subJudulCover: 'Jurnal Perjalanan, Kepingan Polaroid & Catatan Kecil',
    kutipanCover:
      'Siapa sangka pertemuan sebagai sesama saksi waktu Pemilihan Presiden bisa menjadi awal dari cerita paling indah di hidupku.',
    fotoSampul: '/foto/sampul.jpg',
    captionSampul: 'Pemandangan favoritku setiap kali duduk di depanmu.',
  },

  // --------------------------------------------------------------------------
  // LAGU LATAR OTOMATIS SAAT HALAMAN BUKU DIBUKA
  // --------------------------------------------------------------------------
  musik: {
    judulLagu: 'Kotak Musik Senja & Kita',
    urlMp3: '',
  },

  // --------------------------------------------------------------------------
  // LEMBAR 01 (HALAMAN 1 & 2) — BAB I: AWAL MULA KETEMU JADI SAKSI PILPRES
  // --------------------------------------------------------------------------
  babSatu: {
    labelBab: 'Bab I • Awal Mula',
    judul: 'Sama-Sama Jadi Saksi di Pemilihan Presiden',
    tanggalMomen: 'Momen Pemilihan Presiden',
    lokasi: 'Dari Rekan Saksi Jadi Dekat',
    paragrafSatu:
      'Siapa sangka tugas menjadi saksi di Pemilihan Presiden justru jadi hari paling beruntung buatku. Di tengah suasana sibuk dan lelah mengawal jalannya pemilihan, kehadiranmu di sana bikin waktu yang panjang terasa jauh lebih seru.',
    paragrafDua:
      'Dari situ aku mulai memberanikan diri buat mendekatimu dan mengajakmu bercanda. Tawa dan obrolan kita waktu sama-sama jadi saksi hari itu akhirnya memberiku keberanian buat minta Instagram-mu, sampai akhirnya kita lanjut bertukar nomor dan makin dekat.',
    tiketKenangan: {
      nomor: 'NO. 231026',
      judul: 'Arsip Pertemuan Pertama: Saksi Pilpres',
      keterangan: 'Mulai Bercanda • Minta IG • Tukar Nomor WA',
    },
    foto: '/foto/awal-kenal.jpg',
    captionFoto: 'Senyum hangat yang bikin aku berani minta IG waktu itu.',
    catatanBalikFoto:
      'Beruntung banget hari itu kita sama-sama ditugaskan jadi saksi. Kalau tidak, mungkin aku tidak akan seberuntung sekarang.',
    stickyNoteJudul: 'Catatan Kecil Waktu Jadi Saksi:',
    stickyNoteIsi:
      '"Niat awalnya datang buat jadi saksi Pemilihan Presiden, eh pulangnya malah dapat IG & nomor orang yang bikin senyum-senyum terus."',
  },

  // --------------------------------------------------------------------------
  // LEMBAR 02 (HALAMAN 3 & 4) — BAB II: FIRST DATE ANGKRINGAN & NONTON FILM
  // --------------------------------------------------------------------------
  babDua: {
    labelBab: 'Bab II • Pertemuan Pertama',
    judul: 'Malam di Angkringan & Nonton Film Bareng',
    tanggalMomen: 'Pertama Kali Jalan Berdua',
    lokasi: 'Angkringan & Bioskop',
    foto: '/foto/first-date.jpg',
    captionFoto: 'Teman makan, teman cerita, dan teman nonton terbaikku.',
    catatanBalikFoto:
      'Dari duduk santai di angkringan sampai makan di mana pun, yang paling bikin betah itu selalu kamu.',
    strukKenangan: {
      tempat: 'FIRST DATE: ANGKRINGAN & BIOSKOP',
      item: [
        { nama: 'Nongkrong Santai di Angkringan', nilai: '100% Nyaman' },
        { nama: '2x Tiket Nonton Film Bareng', nilai: 'Deg-degan Manis' },
        { nama: 'Lanjut Bercanda & Ngobrol', nilai: 'Nyambung Terus' },
        { nama: 'Keinginan Buat Ketemu Lagi', nilai: 'Selamanya' },
      ],
      total: 'TAK TERNILAI',
    },
    ceritaUtama:
      'Setelah makin akrab lewat chat sejak bertukar nomor waktu jadi saksi Pilpres, akhirnya tiba hari pertama kali kita ketemu di luar buat jalan berdua. Kita mulai dari duduk santai di angkringan sambil ngobrol panjang, lalu lanjut nonton film bareng.',
    tigaHalKecil: [
      {
        angka: '01',
        judul: 'Obrolan Hangat Waktu di Angkringan',
        isi: 'Sederhana tapi nyaman banget, bercandaannya langsung nyambung persis seperti waktu pertama kali kita ngobrol.',
      },
      {
        angka: '02',
        judul: 'Momen Nonton Film Bareng Pertama Kali',
        isi: 'Duduk berdampingan di bioskop sambil sesekali curi pandang dan senyum sendiri.',
      },
      {
        angka: '03',
        judul: 'Dari Saksi Pilpres Jadi Pasangan',
        isi: 'Pulang dari angkringan dan nonton hari itu, aku makin yakin kalau kamu adalah orang yang ingin terus aku jaga.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // LEMBAR 03 (HALAMAN 5 & 6) — BAB III: GALERI POLAROID KENANGAN
  // (Klik foto polaroid di buku untuk membalik foto dan membaca pesan rahasia!)
  // --------------------------------------------------------------------------
  babTiga: {
    labelBab: 'Bab III • Kepingan Memori',
    judulKiri: 'Potret Momen Favorit',
    subJudulKiri: 'Klik pada setiap foto Polaroid untuk membaca catatan di balik kertasnya.',
    judulKanan: 'Tingkah Manis & Serumu',
    subJudulKanan: 'Dua sisi dirimu yang selalu berhasil bikin hariku penuh warna.',
    polaroidUtamaKiri: {
      id: 'pol-1',
      foto: '/foto/momen-1.jpg',
      judul: 'Fokus Pilih Menu Favorit',
      tanggal: 'Kulineran Bareng',
      tapeStyle: 'washi-tape-rose',
      rotasi: '-rotate-1',
      pesanBalikFoto:
        'Dari angkringan sampai keliling cari shabu-shabu dan makanan enak lainnya, jangan pernah bosan kulineran bareng aku ya!',
    },
    catatanHalamanLima:
      'Setiap kali aku buka galeri HP dan lihat foto-fotomu, aku selalu senyum sendiri. Terima kasih sudah mengizinkanku mengabadikan banyak momen berharga bersamamu.',
    daftarPolaroidKanan: [
      {
        id: 'pol-2',
        foto: '/foto/momen-2.jpg',
        judul: 'Siap Makan!',
        tanggal: 'Momen Gemas',
        tapeStyle: 'washi-tape',
        rotasi: '-rotate-2',
        pesanBalikFoto:
          'Dari samping saja kelihatan manis banget. Suka sekali lihat ekspresi fokusmu yang satu ini.',
      },
      {
        id: 'pol-3',
        foto: '/foto/momen-3.jpg',
        judul: 'Konser Pribadi Kita',
        tanggal: 'Karaoke Seru',
        tapeStyle: 'washi-tape-sage',
        rotasi: 'rotate-2',
        pesanBalikFoto:
          'Penyanyi favoritku! Kalau sama kamu, kita bebas bercanda dan seru-seruan persis kayak awal kenal dulu.',
      },
    ],
    kutipanHalamanEnam:
      '"Dari bercanda waktu jadi saksi Pilpres, nongkrong di angkringan, sampai nonton dan nyanyi bareng — semuanya terasa indah karena sama kamu."',
  },

  // --------------------------------------------------------------------------
  // LEMBAR 04 (HALAMAN 7 & 8) — BAB IV: HAL YANG AKU SUKA & BUCKET LIST
  // --------------------------------------------------------------------------
  babEmpat: {
    labelBab: 'Bab IV • Tentang Dirimu',
    judulKiri: 'Hal-Hal Kecil yang Bikin Aku Sayang',
    alasanSayang: [
      {
        nomor: '01',
        judul: 'Asyik Diajak Bercanda Sejak Awal',
        isi: 'Sejak pertama kali kita ngobrol waktu jadi saksi Pilpres, kamu selalu nyambung diajak bercanda apa saja.',
      },
      {
        nomor: '02',
        judul: 'Sederhana & Tidak Pernah Pilih-Milih',
        isi: 'Mau diajak duduk di angkringan, nonton film, atau makan di mana saja, kamu selalu menghargai setiap momennya.',
      },
      {
        nomor: '03',
        judul: 'Tawa dan Ekspresi Jujurmu',
        isi: 'Saat kamu senang makan makanan enak atau antusias cerita sesuatu, matamu ikut berbinar.',
      },
      {
        nomor: '04',
        judul: 'Rasa Nyaman Saat di Dekatmu',
        isi: 'Bersamamu aku bisa jadi diriku sendiri sepenuhnya tanpa perlu berpura-pura.',
      },
    ],
    judulKanan: 'Daftar Perjalanan & Impian Kita',
    subJudulKanan: 'Bisa kamu centang satu per satu setiap kali berhasil kita wujudkan:',
    bucketList: [
      { id: 'bl-1', teks: 'Kenalan & bercanda waktu jadi saksi Pilpres sampai tukar IG & nomor WA', selesai: true },
      { id: 'bl-2', teks: 'Pertama kali jalan berdua ke angkringan & nonton film di bioskop', selesai: true },
      { id: 'bl-3', teks: 'Kulineran & karaokean seru berdua tanpa jaim', selesai: true },
      { id: 'bl-4', teks: 'Jalan-jalan santai berdua di pantai', selesai: true },
      { id: 'bl-5', teks: 'Merayakan lebih banyak tahun bersama dalam keadaan sehat & bahagia', selesai: true },
    ],
  },

  // --------------------------------------------------------------------------
  // LEMBAR 05 (HALAMAN 9 & 10) — BAB V: HARAPAN & AMPLOP SURAT CINTA
  // --------------------------------------------------------------------------
  babLima: {
    labelBab: 'Bab V • Halaman Terakhir',
    judulKiri: 'Untuk Hari Ini, Besok, dan Seterusnya',
    isiKiriSatu:
      'Buku kecil ini merangkum perjalanan kita yang berawal dari tempat yang tidak terduga: sama-sama menjadi saksi di Pemilihan Presiden, mulai saling melempar candaan, meminta Instagram, bertukar nomor, hingga malam pertama kita di angkringan dan bioskop.',
    isiKiriDua:
      'Terima kasih sudah menyambut langkahku sejak hari pertama itu, bertahan, dan memilih untuk terus berjalan di sampingku.',
    janjiKita: [
      'Tetap saling bercerita dan bercanda hangat seperti awal kita kenal',
      'Menyelesaikan masalah dengan kepala dingin dan saling mengerti',
      'Terus merayakan hal-hal sederhana bersama setiap harinya',
    ],
    amplop: {
      judulAmplop: 'Surat Khusus Untukmu',
      subJudulAmplop: 'Klik segel lilin merah di bawah untuk membuka lipatan surat',
      sapaanSurat: 'Untuk Octavia Nurrafendra Ramadhani,',
      isiSurat: [
        'Kalau mengingat kembali hari waktu kita sama-sama jadi saksi di Pemilihan Presiden, aku selalu bersyukur karena memberanikan diri buat mendekatimu, mengajakmu bercanda, sampai meminta Instagram dan nomor teleponmu.',
        'Dari pertemuan pertama kita di angkringan dan nonton film bareng sampai detik ini, kamu selalu menjadi tempat paling nyaman dan menyenangkan buatku pulang. Terima kasih sudah menerima aku apa adanya dan selalu bikin hariku lebih berwarna.',
        'Semoga langkah kita ke depan selalu dimudahkan, dijauhkan dari hal-hal yang merenggangkan, dan dipenuhi tawa hangat seperti halaman-halaman di buku ini.',
      ],
      penutupSurat: '23 October 2026 — Dengan sepenuh hati,',
      tandaTangan: 'Nabil',
    },
  },
};
