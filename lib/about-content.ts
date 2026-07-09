// lib/about-content.ts

export interface GenerationEntry {
  key: string;
  years: string;
  name: string;
  role: string;
  pullQuote: string;
  narrative: string;
  illustration: "cart" | "shophouse" | "signage";
}

export const GENERATIONS: GenerationEntry[] = [
  {
    key: "kim-hok",
    years: "1968",
    name: "Tjoa Kim Hok",
    role: "Pendiri",
    pullQuote: "Dia nggak pernah nulis takarannya. Ukurannya kecepatan nuang.",
    narrative:
      "Berjualan kopi tubruk dari gerobak kayu di pinggir Pasar Turi, hanya dengan tiga menu: kopi, kopi susu, dan roti bakar yang dipanggang di atas arang dengan kompor portabel di atas peti susu. Pelanggannya kebanyakan kuli tekstil dan pemilik toko yang cari yang hangat sebelum pasar buka jam 5 pagi.",
    illustration: "cart",
  },
  {
    key: "mei-lan",
    years: "1989",
    name: "Tjoa Mei Lan",
    role: "Generasi kedua",
    pullQuote: "Mejanya bekas, tapi masih kokoh sampai sekarang.",
    narrative:
      "Memindahkan usaha ke ruko sungguhan setelah lutut ayahnya tidak kuat lagi berdiri lama. Dia yang menambahkan roti bakar srikaya dan kombo telur setengah matang, mengadaptasi resep kaya dari mertuanya yang jualan kueh dua jalan dari situ. Meja marmer bekas ruko yang tutup di Kembang Jepun masih yang sama sampai sekarang, bekas cincin gelasnya pun masih ada.",
    illustration: "shophouse",
  },
  {
    key: "wilson",
    years: "2015–sekarang",
    name: "Tjoa Wilson",
    role: "Generasi ketiga",
    pullQuote: "Kalau lewat WhatsApp, saya tahu siapa yang pesan.",
    narrative:
      "Mengambil alih operasional harian, menambahkan menu berbasis espresso, dan mengecat ulang papan nama depan, tetap mempertahankan blok karakter aslinya, 蔡記, yang dulu dilukis tangan oleh seniman kenalan kakeknya. Sempat menolak saran istrinya untuk pakai aplikasi delivery selama dua tahun, sebelum akhirnya mengalah. Pemesanan lewat WhatsApp tetap jadi jalur utama.",
    illustration: "signage",
  },
];

export interface ValueItem {
  key: string;
  title: string;
  description: string;
  icon: "scale" | "lineage" | "ledger" | "chat";
}

export const VALUES: ValueItem[] = [
  {
    key: "takaran",
    title: "Takaran yang Tidak Berubah",
    description:
      "Setiap resep diwariskan apa adanya dari gerobak pertama, tanpa disederhanakan demi bahan atau alat yang lebih modern.",
    icon: "scale",
  },
  {
    key: "keluarga",
    title: "Dikelola Keluarga, Bukan Waralaba",
    description:
      "Tiga generasi Tjoa turun langsung mengurus dapur dan meja kasir, bukan sistem yang dilepas ke pihak lain.",
    icon: "lineage",
  },
  {
    key: "harga",
    title: "Harga Terbuka di Depan",
    description:
      "Semua harga tercantum jelas di menu, tanpa biaya tersembunyi atau penyesuaian mendadak di kasir.",
    icon: "ledger",
  },
  {
    key: "pesan",
    title: "Pesan Tanpa Ribet",
    description:
      "Cukup pilih menu dan kirim pesan lewat WhatsApp, tanpa perlu unduh aplikasi atau membuat akun baru.",
    icon: "chat",
  },
];

export interface ProcessStep {
  key: string;
  step: string;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    key: "telusuri",
    step: "01",
    title: "Telusuri Menu",
    description:
      "Buka halaman menu, lihat kategori kopi dan roti bakar lengkap dengan harga.",
  },
  {
    key: "pilih",
    step: "02",
    title: "Pilih Varian & Tambahkan",
    description:
      "Tentukan varian yang diinginkan, masukkan ke keranjang pesanan.",
  },
  {
    key: "checkout",
    step: "03",
    title: "Checkout Lewat WhatsApp",
    description:
      "Ringkasan pesanan terkirim otomatis dalam format rapi ke nomor kasir.",
  },
];

export interface HighlightItem {
  key: string;
  title: string;
  description: string;
}

export const HIGHLIGHTS: HighlightItem[] = [
  {
    key: "ilustrasi",
    title: "Ilustrasi Tangan, Bukan Foto Template",
    description:
      "Setiap generasi digambarkan lewat garis woodblock-engraving asli, bukan foto stok atau gambar generik.",
  },
  {
    key: "harga",
    title: "Sistem Harga yang Bisa Dipercaya",
    description:
      "Leader-line putus-putus yang sama dipakai di menu dan halaman ini, karena harga seharusnya tidak perlu ditebak.",
  },
  {
    key: "order",
    title: "Order Tanpa Akun, Tanpa Aplikasi",
    description:
      "Alur checkout dirancang seringan mungkin, sesuai cara pelanggan UMKM biasa memesan lewat pesan singkat.",
  },
];
