/**
 * ========================================================================
 * SIM-ELEKTROMEDIS - DATA & INVENTORY MANAGEMENT SYSTEM
 * Sistem Informasi & Inventaris Alat Elektromedis Rumah Sakit (10 Data Utama)
 * ========================================================================
 */

const ElektromedisApp = (function () {
    const STORAGE_KEY = 'sim_elektromedis_inventory_10_v2';

    // Data Master Awal Tepat 10 Alat Elektromedis Rumah Sakit
    const INITIAL_DATA = [
        {
            id: 'EM-2023-001',
            nama: 'Defibrillator Biphasic + Pacer',
            merk: 'Mindray',
            tipe: 'BeneHeart D3',
            noSeri: 'SN-D3-2023-8819',
            tahun: 2023,
            kategori: 'Life Support',
            ruangan: 'Instalasi Gawat Darurat (IGD)',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-08-10',
            tglKalibrasiBerikutnya: '2026-08-10',
            noSertifikat: 'BPFK-JKT/KAL/2025/08-1294',
            lembagaPenguji: 'BPFK Jakarta',
            pic: 'Ahmad Fauzi, A.Md.EM',
            suplier: 'PT. Mindray Medical Indonesia',
            harga: 'Rp 145.000.000',
            keterangan: 'Lengkap dengan paddles dewasa & anak, baterai cadangan prima.'
        },
        {
            id: 'EM-2023-002',
            nama: 'Elektrokardiograf (EKG 12-Lead)',
            merk: 'Nihon Kohden',
            tipe: 'Cardiofax M ECG-1350K',
            noSeri: 'SN-NK-2023-1102',
            tahun: 2023,
            kategori: 'Diagnostik',
            ruangan: 'Poli Jantung & Pembuluh Darah',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-06-14',
            tglKalibrasiBerikutnya: '2026-06-14',
            noSertifikat: 'BPFK-SBY/KAL/2025/06-0491',
            lembagaPenguji: 'BPFK Surabaya',
            pic: 'Bambang Irawan, S.Tr.EM',
            suplier: 'PT. Tawada Healthcare',
            harga: 'Rp 68.500.000',
            keterangan: 'Hasil interpretasi otomatis normal, kertas thermal cadangan 10 roll.'
        },
        {
            id: 'EM-2022-003',
            nama: 'Ventilator Mekanik ICU Adult & Pediatric',
            merk: 'Dräger',
            tipe: 'Savina 300 Select',
            noSeri: 'SN-DR-2022-4401',
            tahun: 2022,
            kategori: 'Life Support',
            ruangan: 'Intensive Care Unit (ICU)',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-10-05',
            tglKalibrasiBerikutnya: '2026-10-05',
            noSertifikat: 'BPFK-JKT/KAL/2025/10-2210',
            lembagaPenguji: 'BPFK Jakarta',
            pic: 'Ahmad Fauzi, A.Md.EM',
            suplier: 'PT. Draeger Medical Indonesia',
            harga: 'Rp 380.000.000',
            keterangan: 'Sensitivitas trigger baik, sensor O2 baru diganti Oktober 2025.'
        },
        {
            id: 'EM-2024-004',
            nama: 'Patient Monitor 5-Parameter',
            merk: 'Mindray',
            tipe: 'uMEC10 Vital Signs',
            noSeri: 'SN-MR-2024-9021',
            tahun: 2024,
            kategori: 'Diagnostik',
            ruangan: 'Intensive Care Unit (ICU)',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-09-12',
            tglKalibrasiBerikutnya: '2026-09-12',
            noSertifikat: 'BPFK-JKT/KAL/2025/09-1833',
            lembagaPenguji: 'BPFK Jakarta',
            pic: 'Bambang Irawan, S.Tr.EM',
            suplier: 'PT. Mindray Medical Indonesia',
            harga: 'Rp 42.000.000',
            keterangan: 'Parameter NIBP, SpO2, EKG, Temp, Resp bekerja optimal.'
        },
        {
            id: 'EM-2023-005',
            nama: 'Syringe Pump Micro & Macro',
            merk: 'Terumo',
            tipe: 'TE-SS700 Smart',
            noSeri: 'SN-TR-2023-6624',
            tahun: 2023,
            kategori: 'Terapeutik',
            ruangan: 'Intensive Care Unit (ICU)',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-07-20',
            tglKalibrasiBerikutnya: '2026-07-20',
            noSertifikat: 'BPFK-JKT/KAL/2025/07-1502',
            lembagaPenguji: 'BPFK Jakarta',
            pic: 'Ahmad Fauzi, A.Md.EM',
            suplier: 'PT. Terumo Indonesia',
            harga: 'Rp 28.500.000',
            keterangan: 'Presisi aliran tetesan tinggi, alarm oklusi bekerja normal.'
        },
        {
            id: 'EM-2024-006',
            nama: 'Infusion Pump Volumetric',
            merk: 'B. Braun',
            tipe: 'Infusomat Space',
            noSeri: 'SN-BB-2024-1189',
            tahun: 2024,
            kategori: 'Terapeutik',
            ruangan: 'Rawat Inap Melati (Lt. 3)',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-11-02',
            tglKalibrasiBerikutnya: '2026-11-02',
            noSertifikat: 'BPFK-JKT/KAL/2025/11-3012',
            lembagaPenguji: 'BPFK Jakarta',
            pic: 'Bambang Irawan, S.Tr.EM',
            suplier: 'PT. B. Braun Medical Indonesia',
            harga: 'Rp 32.000.000',
            keterangan: 'Baterai lithium tahan 6 jam, sensor udara dalam selang aktif.'
        },
        {
            id: 'EM-2022-007',
            nama: 'Ultrasonografi (USG) Doppler 4D',
            merk: 'GE Healthcare',
            tipe: 'Voluson E8 Expert',
            noSeri: 'SN-GE-2022-7715',
            tahun: 2022,
            kategori: 'Diagnostik',
            ruangan: 'Poli Kandungan & Kebidanan (Obgyn)',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-05-18',
            tglKalibrasiBerikutnya: '2026-05-18',
            noSertifikat: 'BPFK-JKT/KAL/2025/05-0914',
            lembagaPenguji: 'BPFK Jakarta',
            pic: 'Ahmad Fauzi, A.Md.EM',
            suplier: 'PT. GE Operations Indonesia',
            harga: 'Rp 750.000.000',
            keterangan: 'Probe konveks, linear, dan transvaginal dalam kondisi prima.'
        },
        {
            id: 'EM-2021-008',
            nama: 'Mobile X-Ray C-Arm Fluoroscopy',
            merk: 'Siemens Healthineers',
            tipe: 'Cios Select',
            noSeri: 'SN-SM-2021-3042',
            tahun: 2021,
            kategori: 'Radiologi & Imaging',
            ruangan: 'Kamar Operasi (OK Bedah)',
            kondisi: 'Perlu Kalibrasi',
            tglKalibrasiTerakhir: '2024-11-15',
            tglKalibrasiBerikutnya: '2025-11-15',
            noSertifikat: 'BPFK-JKT/KAL/2024/11-1022',
            lembagaPenguji: 'BPFK Jakarta',
            pic: 'Ahmad Fauzi, A.Md.EM',
            suplier: 'PT. Siemens Healthineers Indonesia',
            harga: 'Rp 1.200.000.000',
            keterangan: 'Masa berlaku kalibrasi BAPETEN & BPFK habis, sudah diajukan jadwal uji berkala.'
        },
        {
            id: 'EM-2020-009',
            nama: 'Stationary Digital Radiography (X-Ray)',
            merk: 'Philips',
            tipe: 'DuraDiagnost Compact',
            noSeri: 'SN-PH-2020-5591',
            tahun: 2020,
            kategori: 'Radiologi & Imaging',
            ruangan: 'Instalasi Radiologi Ruang 1',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-04-10',
            tglKalibrasiBerikutnya: '2026-04-10',
            noSertifikat: 'BAPETEN-BPFK/2025/04-0012',
            lembagaPenguji: 'BPFK Jakarta & BAPETEN',
            pic: 'Bambang Irawan, S.Tr.EM',
            suplier: 'PT. Philips Indonesia',
            harga: 'Rp 1.850.000.000',
            keterangan: 'Keluaran radiasi dan akurasi kV/mAs sesuai toleransi Permenkes.'
        },
        {
            id: 'EM-2022-010',
            nama: 'Infant Incubator Perawatan Intensif',
            merk: 'Atom Medical',
            tipe: 'Dual Incu i (Model 100)',
            noSeri: 'SN-AT-2022-2290',
            tahun: 2022,
            kategori: 'Life Support',
            ruangan: 'Neonatal ICU (NICU)',
            kondisi: 'Laik Pakai',
            tglKalibrasiTerakhir: '2025-08-25',
            tglKalibrasiBerikutnya: '2026-08-25',
            noSertifikat: 'BPFK-JKT/KAL/2025/08-1644',
            lembagaPenguji: 'BPFK Jakarta',
            pic: 'Ahmad Fauzi, A.Md.EM',
            suplier: 'PT. Sometec Medika',
            harga: 'Rp 210.000.000',
            keterangan: 'Kontrol suhu kulit, kelembaban, dan matras pemanas stabil.'
        }
    ];

    /**
     * Dapatkan semua data dari LocalStorage atau inisialisasi default
     */
    function getAll() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return [...INITIAL_DATA];
        }
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return [...INITIAL_DATA];
        } catch (e) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return [...INITIAL_DATA];
        }
    }

    /**
     * Simpan data ke LocalStorage
     */
    function saveAll(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    /**
     * Cari alat berdasarkan ID
     */
    function getById(id) {
        const items = getAll();
        return items.find(item => item.id === id) || null;
    }

    /**
     * Tambah alat baru
     */
    function add(item) {
        const items = getAll();
        if (!item.id) {
            const year = item.tahun || new Date().getFullYear();
            const seq = String(items.length + 1).padStart(3, '0');
            item.id = `EM-${year}-${seq}`;
        }
        items.unshift(item);
        saveAll(items);
        return item;
    }

    /**
     * Update alat
     */
    function update(id, updatedFields) {
        const items = getAll();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;

        items[index] = { ...items[index], ...updatedFields };
        saveAll(items);
        return items[index];
    }

    /**
     * Hapus alat
     */
    function deleteItem(id) {
        let items = getAll();
        const initialLen = items.length;
        items = items.filter(item => item.id !== id);
        if (items.length !== initialLen) {
            saveAll(items);
            return true;
        }
        return false;
    }

    /**
     * Kembalikan ke data default (10 alat)
     */
    function resetToDefault() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        return [...INITIAL_DATA];
    }

    /**
     * Hitung statistik inventaris
     */
    function getStats() {
        const items = getAll();
        const total = items.length;
        const laik = items.filter(i => i.kondisi === 'Laik Pakai').length;
        const kalibrasi = items.filter(i => i.kondisi === 'Perlu Kalibrasi').length;
        const perbaikan = items.filter(i => i.kondisi === 'Dalam Perbaikan').length;

        // Distribusi ruangan
        const rooms = {};
        items.forEach(i => {
            const r = i.ruangan || 'Lainnya';
            rooms[r] = (rooms[r] || 0) + 1;
        });

        // Distribusi kategori
        const categories = {};
        items.forEach(i => {
            const c = i.kategori || 'Umum';
            categories[c] = (categories[c] || 0) + 1;
        });

        return {
            total,
            laik,
            laikPercent: total > 0 ? Math.round((laik / total) * 100) : 0,
            kalibrasi,
            kalibrasiPercent: total > 0 ? Math.round((kalibrasi / total) * 100) : 0,
            perbaikan,
            perbaikanPercent: total > 0 ? Math.round((perbaikan / total) * 100) : 0,
            rooms,
            categories
        };
    }

    /**
     * Ekspor data ke CSV
     */
    function exportCSV() {
        const items = getAll();
        if (!items.length) {
            alert('Tidak ada data untuk diekspor!');
            return;
        }

        const headers = [
            'ID Inventaris',
            'Nama Alat',
            'Merk',
            'Tipe / Model',
            'No. Seri',
            'Tahun',
            'Kategori',
            'Ruangan / Lokasi',
            'Status Kelaikan',
            'Tgl Kalibrasi Terakhir',
            'Tgl Kalibrasi Berikutnya',
            'No. Sertifikat Kalibrasi',
            'Lembaga Penguji',
            'PIC Teknisi',
            'Harga Pengadaan',
            'Keterangan'
        ];

        const rows = items.map(i => [
            `"${i.id}"`,
            `"${i.nama}"`,
            `"${i.merk}"`,
            `"${i.tipe}"`,
            `"${i.noSeri}"`,
            `"${i.tahun}"`,
            `"${i.kategori}"`,
            `"${i.ruangan}"`,
            `"${i.kondisi}"`,
            `"${i.tglKalibrasiTerakhir}"`,
            `"${i.tglKalibrasiBerikutnya}"`,
            `"${i.noSertifikat || '-'}"`,
            `"${i.lembagaPenguji || '-'}"`,
            `"${i.pic || '-'}"`,
            `"${i.harga || '-'}"`,
            `"${(i.keterangan || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Inventaris_Alat_Elektromedis_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        getAll,
        saveAll,
        getById,
        add,
        update,
        deleteItem,
        resetToDefault,
        getStats,
        exportCSV,
        INITIAL_DATA
    };
})();
