export interface DocumentFile {
  id: string
  name: string
  date: string
  owner: {
    name: string
    avatar: string
  }
  folderId: string | null // Allow null for root files
  content: {
    title: string
    author: string
    lastUpdate: string
    sections: {
      title: string
      content: string
    }[]
    pages?: number
  }
}

export interface Folder {
  id: string
  name: string
  files: DocumentFile[]
}

export const documentsData: {
  folders: Folder[]
  rootFiles: DocumentFile[] // Add root files
  allFiles: DocumentFile[]
} = {
  folders: [
    {
      id: "project-a",
      name: "My Project A",
      files: [
        {
          id: "laporan-analisis-kinerja",
          name: "laporan_analisis_kinerja_2023.pdf",
          date: "2 Apr 2025",
          owner: { name: "Surya Gama", avatar: "SG" },
          folderId: "project-a",
          content: {
            title: "Laporan Analisis Kinerja Karyawan 2023",
            author: "Surya Gama",
            lastUpdate: "2 April 2025",
            pages: 7,
            sections: [
              {
                title: "Ringkasan Eksekutif",
                content: `Laporan ini menyajikan analisis komprehensif terhadap kinerja karyawan PT Daya Dimensi Indonesia selama tahun 2023. Berdasarkan evaluasi yang dilakukan terhadap 150 karyawan di berbagai divisi, ditemukan bahwa tingkat produktivitas secara keseluruhan mengalami peningkatan sebesar 12% dibandingkan tahun sebelumnya.

Faktor-faktor yang berkontribusi terhadap peningkatan ini meliputi implementasi sistem manajemen kinerja yang lebih terstruktur, program pelatihan dan pengembangan yang intensif, serta perbaikan lingkungan kerja yang mendukung kolaborasi tim.

Namun demikian, masih terdapat beberapa area yang memerlukan perhatian khusus, terutama dalam hal keseimbangan beban kerja antar divisi dan optimalisasi penggunaan teknologi dalam proses kerja sehari-hari.`,
              },
              {
                title: "Metodologi Penilaian",
                content: `Penilaian kinerja dilakukan menggunakan pendekatan 360 derajat yang melibatkan evaluasi dari atasan langsung, rekan kerja, dan bawahan (jika ada). Kriteria penilaian mencakup:

1. Pencapaian target dan KPI yang telah ditetapkan
2. Kualitas hasil kerja dan tingkat akurasi
3. Kemampuan bekerja sama dalam tim
4. Inisiatif dan inovasi dalam menyelesaikan tugas
5. Kedisiplinan dan kepatuhan terhadap prosedur perusahaan

Setiap kriteria dinilai menggunakan skala 1-5, dengan bobot yang berbeda sesuai dengan posisi dan tanggung jawab masing-masing karyawan.`,
              },
            ],
          },
        },
        {
          id: "laporan-kegiatan-inovasi",
          name: "laporan_kegiatan_inovasi_terbaru.pdf",
          date: "12 Mar 2025",
          owner: { name: "Budi Atmajaya", avatar: "BA" },
          folderId: "project-a",
          content: {
            title: "Laporan Kegiatan Inovasi Terbaru",
            author: "Budi Atmajaya",
            lastUpdate: "12 Maret 2025",
            pages: 5,
            sections: [
              {
                title: "Program Inovasi 2025",
                content: `Program inovasi tahun 2025 telah berhasil menghasilkan 15 ide inovasi yang dapat diimplementasikan untuk meningkatkan efisiensi operasional perusahaan. Program ini melibatkan seluruh karyawan melalui platform digital yang memungkinkan setiap individu untuk menyampaikan ide dan saran perbaikan.

Dari 15 ide yang terpilih, 8 diantaranya telah memasuki tahap pilot project dan menunjukkan hasil yang sangat menjanjikan. Implementasi penuh direncanakan akan dilakukan secara bertahap sepanjang kuartal kedua dan ketiga tahun 2025.`,
              },
            ],
          },
        },
      ],
    },
    {
      id: "project-b",
      name: "My Project B",
      files: [
        {
          id: "laporan-studi-kelayakan",
          name: "laporan_studi_kelayakan_proyek.pdf",
          date: "30 Oct 2025",
          owner: { name: "Anita Nalika", avatar: "AN" },
          folderId: "project-b",
          content: {
            title: "Studi Kelayakan Proyek Ekspansi",
            author: "Anita Nalika",
            lastUpdate: "30 Oktober 2025",
            pages: 3,
            sections: [
              {
                title: "Halaman 1 - Latar Belakang Proyek",
                content: `STUDI KELAYAKAN PROYEK EKSPANSI
PT DAYA DIMENSI INDONESIA

Latar Belakang:
Seiring dengan pertumbuhan bisnis yang konsisten selama 5 tahun terakhir, PT Daya Dimensi Indonesia mempertimbangkan untuk melakukan ekspansi ke wilayah Jawa Tengah dan Jawa Timur. Ekspansi ini diharapkan dapat meningkatkan market share perusahaan dan memperluas jangkauan layanan kepada lebih banyak klien.

Tujuan Studi:
1. Menganalisis kelayakan finansial proyek ekspansi
2. Mengevaluasi potensi pasar di wilayah target
3. Mengidentifikasi risiko dan tantangan yang mungkin dihadapi
4. Menyusun strategi implementasi yang optimal

Ruang Lingkup:
Studi ini mencakup analisis mendalam terhadap aspek pasar, teknis, manajemen, hukum, lingkungan, dan finansial dari rencana ekspansi perusahaan.`,
              },
              {
                title: "Halaman 2 - Analisis Pasar",
                content: `ANALISIS PASAR

Potensi Pasar Jawa Tengah:
- Jumlah perusahaan target: 2,500 perusahaan
- Estimasi kebutuhan layanan: Rp 15 miliar per tahun
- Tingkat kompetisi: Sedang (5 kompetitor utama)
- Peluang pertumbuhan: 20% per tahun

Potensi Pasar Jawa Timur:
- Jumlah perusahaan target: 3,200 perusahaan  
- Estimasi kebutuhan layanan: Rp 22 miliar per tahun
- Tingkat kompetisi: Tinggi (8 kompetitor utama)
- Peluang pertumbuhan: 15% per tahun

Strategi Penetrasi Pasar:
1. Kemitraan strategis dengan perusahaan lokal
2. Perekrutan tenaga kerja lokal yang berpengalaman
3. Penyesuaian layanan dengan kebutuhan spesifik regional
4. Program promosi dan edukasi pasar yang intensif

Target Market Share:
Tahun 1: 5% (Jateng) dan 3% (Jatim)
Tahun 3: 12% (Jateng) dan 8% (Jatim)
Tahun 5: 20% (Jateng) dan 15% (Jatim)`,
              },
              {
                title: "Halaman 3 - Proyeksi Finansial",
                content: `PROYEKSI FINANSIAL

Investasi Awal:
- Pembukaan kantor cabang: Rp 2.5 miliar
- Perekrutan dan pelatihan SDM: Rp 1.2 miliar
- Pemasaran dan promosi: Rp 800 juta
- Modal kerja: Rp 1.5 miliar
Total Investasi: Rp 6 miliar

Proyeksi Pendapatan (5 Tahun):
Tahun 1: Rp 3.2 miliar
Tahun 2: Rp 5.8 miliar  
Tahun 3: Rp 8.5 miliar
Tahun 4: Rp 12.1 miliar
Tahun 5: Rp 16.3 miliar

Analisis Kelayakan:
- NPV (Net Present Value): Rp 8.2 miliar
- IRR (Internal Rate of Return): 28.5%
- Payback Period: 2.3 tahun
- ROI: 35.2%

Kesimpulan:
Berdasarkan analisis finansial, proyek ekspansi ini layak untuk dilaksanakan dengan tingkat pengembalian yang menarik dan risiko yang dapat dikelola dengan baik.

Rekomendasi:
Melanjutkan ke tahap perencanaan detail dan persiapan implementasi dengan target peluncuran pada kuartal ketiga 2025.`,
              },
            ],
          },
        },
      ],
    },
    {
      id: "project-c",
      name: "My Project C",
      files: [
        {
          id: "dokumen-referensi-engagement",
          name: "Dokumen_Referensi_Kegiatan_Engagement.pdf",
          date: "5 Jul 2025",
          owner: { name: "Budi Atmajaya", avatar: "BA" },
          folderId: "project-c",
          content: {
            title: "Dokumen Referensi Kegiatan Engagement",
            author: "Budi Atmajaya",
            lastUpdate: "5 Juli 2025",
            pages: 4,
            sections: [
              {
                title: "Panduan Kegiatan Employee Engagement",
                content: `Employee engagement merupakan salah satu faktor kunci dalam menciptakan lingkungan kerja yang produktif dan menyenangkan. Dokumen ini menyajikan berbagai referensi dan panduan untuk merancang kegiatan engagement yang efektif dan bermakna bagi seluruh karyawan.

Tujuan utama dari kegiatan engagement adalah untuk:
1. Meningkatkan rasa memiliki karyawan terhadap perusahaan
2. Memperkuat hubungan antar tim dan divisi
3. Menciptakan budaya kerja yang positif dan kolaboratif
4. Meningkatkan motivasi dan kepuasan kerja
5. Mengurangi tingkat turnover karyawan

Kegiatan engagement yang efektif harus dirancang dengan mempertimbangkan keberagaman karakteristik karyawan, budget yang tersedia, serta tujuan strategis perusahaan.`,
              },
            ],
          },
        },
      ],
    },
    {
      id: "project-d",
      name: "My Project D",
      files: [],
    },
  ],
  rootFiles: [
    {
      id: "company-policy-2025",
      name: "Company_Policy_2025.pdf",
      date: "15 Jan 2025",
      owner: { name: "HR Department", avatar: "HR" },
      folderId: null,
      content: {
        title: "Company Policy 2025",
        author: "HR Department",
        lastUpdate: "15 Januari 2025",
        pages: 12,
        sections: [
          {
            title: "General Policies",
            content: `This document outlines the general company policies for 2025, including work hours, dress code, and conduct guidelines.`,
          },
        ],
      },
    },
    {
      id: "annual-report-2024",
      name: "Annual_Report_2024.pdf",
      date: "31 Dec 2024",
      owner: { name: "Finance Team", avatar: "FT" },
      folderId: null,
      content: {
        title: "Annual Report 2024",
        author: "Finance Team",
        lastUpdate: "31 Desember 2024",
        pages: 25,
        sections: [
          {
            title: "Financial Summary",
            content: `This annual report provides a comprehensive overview of the company's financial performance in 2024.`,
          },
        ],
      },
    },
  ],
  allFiles: [],
}

// Flatten all files for the "All Files" section
documentsData.allFiles = [...documentsData.folders.flatMap((folder) => folder.files), ...documentsData.rootFiles]
