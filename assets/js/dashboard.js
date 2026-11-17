/**
 * ========================================================================
 * SIM-ELEKTROMEDIS - DASHBOARD & INVENTORY CONTROLLER
 * Sistem Informasi & Inventaris Alat Elektromedis Rumah Sakit
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // -----------------------------------------------------------------
    // 0. Autentikasi & Sinkronisasi Profil Pengguna
    // -----------------------------------------------------------------
    const hasDualSection = document.getElementById('section-login') && document.getElementById('section-dashboard');
    if (typeof Auth !== 'undefined') {
        if (!hasDualSection && !Auth.isLoggedIn()) {
            window.location.replace('index.html');
            return;
        }
        Auth.syncUserProfile();
    }

    // State pagination dan filter (menampilkan 10 data alat langsung)
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredData = [];
    let donutChartInstance = null;
    let barChartInstance = null;

    // -----------------------------------------------------------------
    // 1. Mobile Sidebar Toggle & Desktop Sidebar Toggle
    // -----------------------------------------------------------------
    const sidebar = document.querySelector('.sidebar-wrapper');
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    
    // Backdrop overlay untuk mobile
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show', sidebar.classList.contains('show'));
        });

        overlay.addEventListener('click', function () {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        });
    }

    const desktopToggleBtn = document.querySelector('#desktop-sidebar-toggle');
    if (desktopToggleBtn) {
        desktopToggleBtn.addEventListener('click', function () {
            document.body.classList.toggle('sidebar-minimized');
            const icon = desktopToggleBtn.querySelector('i');
            if (icon) {
                if (document.body.classList.contains('sidebar-minimized')) {
                    icon.className = 'bi bi-chevron-bar-right';
                } else {
                    icon.className = 'bi bi-chevron-bar-left';
                }
            }
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 300);
        });
    }

    // -----------------------------------------------------------------
    // 2. Fullscreen Toggle
    // -----------------------------------------------------------------
    const fullscreenBtn = document.querySelector('#btn-fullscreen');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function () {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error('Fullscreen error:', err);
                });
            } else {
                document.exitFullscreen().catch(err => {
                    console.error('Exit fullscreen error:', err);
                });
            }
        });
    }

    // -----------------------------------------------------------------
    // 3. Render Status Kelaikan (Donut Chart)
    // -----------------------------------------------------------------
    function initOrUpdateDonutChart(stats) {
        const viewsChartEl = document.querySelector('#views-chart');
        if (!viewsChartEl) return;

        // Series: [Laik Pakai, Perlu Kalibrasi, Dalam Perbaikan]
        const seriesData = [
            stats.laik || 0,
            stats.kalibrasi || 0,
            stats.perbaikan || 0
        ];

        // Update teks legend
        const legLaik = document.getElementById('legend-laik-count');
        const legKal = document.getElementById('legend-kalibrasi-count');
        const legPer = document.getElementById('legend-perbaikan-count');
        if (legLaik) legLaik.textContent = stats.laik || 0;
        if (legKal) legKal.textContent = stats.kalibrasi || 0;
        if (legPer) legPer.textContent = stats.perbaikan || 0;

        if (donutChartInstance) {
            donutChartInstance.updateSeries(seriesData);
            return;
        }

        const options = {
            series: seriesData,
            chart: {
                type: 'donut',
                height: 250,
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            labels: ['Laik Pakai', 'Perlu Kalibrasi', 'Dalam Perbaikan'],
            colors: ['#B4F105', '#F97316', '#EF4444'], // Lime, Orange, Red
            legend: {
                show: false
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '72%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#6C7E75',
                                offsetY: -6
                            },
                            value: {
                                show: true,
                                fontSize: '24px',
                                fontWeight: 800,
                                color: '#0B130F',
                                offsetY: 6,
                                formatter: function (val) {
                                    return val + " Unit";
                                }
                            },
                            total: {
                                show: true,
                                label: 'Total Unit',
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#6C7E75',
                                formatter: function () {
                                    return (stats.total || 0) + ' Unit';
                                }
                            }
                        }
                    }
                }
            },
            tooltip: {
                theme: 'dark'
            }
        };

        donutChartInstance = new ApexCharts(viewsChartEl, options);
        donutChartInstance.render();
    }

    // -----------------------------------------------------------------
    // 4. Render Distribusi Populasi Alat per Ruangan (Bar Chart)
    // -----------------------------------------------------------------
    function initOrUpdateBarChart(stats) {
        const revenueChartEl = document.querySelector('#revenue-chart');
        if (!revenueChartEl) return;

        // Ambil data ruangan dari stats
        const roomKeys = Object.keys(stats.rooms || {});
        // Sederhanakan nama ruangan jika terlalu panjang
        const categories = roomKeys.length > 0 ? roomKeys.map(r => {
            return r.replace('Instalasi ', '')
                    .replace('Intensive Care Unit ', '')
                    .replace('Central Sterile Supply Dept ', '');
        }) : ['ICU', 'IGD', 'OK', 'Poli Jantung', 'Radiologi', 'NICU', 'Hemodialisa', 'Rawat Inap'];

        const dataSeries = roomKeys.length > 0 ? roomKeys.map(r => stats.rooms[r]) : [4, 3, 3, 2, 2, 1, 1, 1];

        if (barChartInstance) {
            barChartInstance.updateOptions({
                xaxis: { categories: categories }
            });
            barChartInstance.updateSeries([{
                name: 'Jumlah Unit Alat',
                data: dataSeries
            }]);
            return;
        }

        const options = {
            series: [{
                name: 'Jumlah Unit Alat',
                data: dataSeries
            }],
            chart: {
                type: 'bar',
                height: 240,
                toolbar: { show: false },
                zoom: { enabled: false },
                fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
            colors: ['#072F1F'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '42%',
                    borderRadius: 6
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '11px',
                    fontWeight: 700,
                    colors: ['#FFFFFF']
                },
                offsetY: 2
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            grid: {
                borderColor: '#E9EFEF',
                strokeDashArray: 4
            },
            xaxis: {
                categories: categories,
                labels: {
                    style: {
                        colors: '#6C7E75',
                        fontSize: '11px',
                        fontWeight: 600
                    },
                    rotate: -20
                },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                title: { text: 'Unit' },
                labels: {
                    style: { colors: '#6C7E75', fontSize: '11px' }
                }
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        return val + " Unit Alat Medis";
                    }
                }
            }
        };

        barChartInstance = new ApexCharts(revenueChartEl, options);
        barChartInstance.render();
    }

    // -----------------------------------------------------------------
    // 5. Sparkline Charts
    // -----------------------------------------------------------------
    function initSparklines() {
        const incomeSparkEl = document.querySelector('#income-sparkline');
        if (incomeSparkEl && !incomeSparkEl.hasChildNodes()) {
            new ApexCharts(incomeSparkEl, {
                series: [{ name: 'Alat Aktif', data: [12, 14, 15, 15, 16, 17, 18, 18] }],
                chart: { type: 'area', height: 45, sparkline: { enabled: true } },
                stroke: { curve: 'smooth', width: 2 },
                fill: { opacity: 0.15, type: 'solid' },
                colors: ['#22C55E']
            }).render();
        }

        const returnSparkEl = document.querySelector('#return-sparkline');
        if (returnSparkEl && !returnSparkEl.hasChildNodes()) {
            new ApexCharts(returnSparkEl, {
                series: [{ name: 'Kelaikan (%)', data: [80, 82, 85, 84, 88, 86, 89, 89] }],
                chart: { type: 'area', height: 45, sparkline: { enabled: true } },
                stroke: { curve: 'smooth', width: 2 },
                fill: { opacity: 0.15, type: 'solid' },
                colors: ['#B4F105']
            }).render();
        }
    }

    // -----------------------------------------------------------------
    // 6. Sinkronisasi KPI Stats
    // -----------------------------------------------------------------
    function updateKPIStats() {
        if (typeof ElektromedisApp === 'undefined') return;
        const stats = ElektromedisApp.getStats();

        // Total
        const totalEl = document.getElementById('stat-total-devices');
        if (totalEl) totalEl.textContent = `${stats.total} Unit`;

        // Laik Pakai
        const laikCountEl = document.getElementById('stat-laik-count');
        if (laikCountEl) laikCountEl.textContent = `${stats.laik} Laik Pakai`;

        const laikPercentEl = document.getElementById('stat-laik-percent');
        if (laikPercentEl) laikPercentEl.textContent = `${stats.laikPercent}% Siap Dioperasikan`;

        // Ruangan aktif
        const roomCount = Object.keys(stats.rooms || {}).length;
        const activeRoomsEl = document.getElementById('stat-active-rooms');
        if (activeRoomsEl) activeRoomsEl.textContent = `Tersebar di ${roomCount} Ruangan & Instalasi`;

        // Alert text
        const alertTextEl = document.getElementById('stat-alert-text');
        if (alertTextEl) {
            alertTextEl.textContent = `Kelaikan Alat Rumah Sakit: ${stats.laikPercent}% (${stats.laik}/${stats.total} Unit)`;
        }

        // Kategori breakdown counters
        const catLife = document.getElementById('cat-count-life');
        if (catLife) catLife.textContent = `${stats.categories['Life Support'] || 0} Unit`;

        const catDiag = document.getElementById('cat-count-diag');
        if (catDiag) catDiag.textContent = `${stats.categories['Diagnostik'] || 0} Unit`;

        const catTerapi = document.getElementById('cat-count-terapi');
        if (catTerapi) catTerapi.textContent = `${stats.categories['Terapeutik'] || 0} Unit`;

        const catRadio = document.getElementById('cat-count-radio');
        if (catRadio) {
            const sumRadio = (stats.categories['Radiologi & Imaging'] || 0) + 
                             (stats.categories['Bedah & OK'] || 0) + 
                             (stats.categories['Sterilisasi & CSSD'] || 0);
            catRadio.textContent = `${sumRadio} Unit`;
        }

        // Charts
        initOrUpdateDonutChart(stats);
        initOrUpdateBarChart(stats);
    }

    // -----------------------------------------------------------------
    // 7. Tabel Render & Logika Interaksi Alat Elektromedis
    // -----------------------------------------------------------------
    function getDeviceIcon(kategori) {
        switch (kategori) {
            case 'Life Support':
                return 'bi-heart-pulse';
            case 'Diagnostik':
                return 'bi-activity';
            case 'Terapeutik':
                return 'bi-droplet-half';
            case 'Bedah & OK':
                return 'bi-scissors';
            case 'Radiologi & Imaging':
                return 'bi-broadcast-pin';
            case 'Sterilisasi & CSSD':
                return 'bi-shield-check';
            default:
                return 'bi-cpu';
        }
    }

    function getKondisiBadge(kondisi) {
        switch (kondisi) {
            case 'Laik Pakai':
                return '<span class="badge-table success"><i class="bi bi-check-circle-fill"></i> Laik Pakai</span>';
            case 'Perlu Kalibrasi':
                return '<span class="badge-table pending"><i class="bi bi-clock-history"></i> Perlu Kalibrasi</span>';
            case 'Dalam Perbaikan':
                return '<span class="badge-table failed"><i class="bi bi-wrench"></i> Dalam Perbaikan</span>';
            default:
                return `<span class="badge-table info">${kondisi}</span>`;
        }
    }

    function filterAndRenderTable() {
        if (typeof ElektromedisApp === 'undefined') return;
        const allItems = ElektromedisApp.getAll();

        const searchKeyword = (document.getElementById('tableSearchInput')?.value || '').toLowerCase().trim();
        const selectedRuangan = document.getElementById('filterRuanganSelect')?.value || '';
        const selectedStatus = document.getElementById('filterStatusSelect')?.value || '';
        const selectedTahun = document.getElementById('filterTahunSelect')?.value || '';

        // Filter logika
        filteredData = allItems.filter(item => {
            const matchSearch = !searchKeyword ||
                (item.nama && item.nama.toLowerCase().includes(searchKeyword)) ||
                (item.merk && item.merk.toLowerCase().includes(searchKeyword)) ||
                (item.tipe && item.tipe.toLowerCase().includes(searchKeyword)) ||
                (item.noSeri && item.noSeri.toLowerCase().includes(searchKeyword)) ||
                (item.id && item.id.toLowerCase().includes(searchKeyword)) ||
                (item.ruangan && item.ruangan.toLowerCase().includes(searchKeyword));

            const matchRuangan = !selectedRuangan || (item.ruangan && item.ruangan.toLowerCase().includes(selectedRuangan.toLowerCase()));
            const matchStatus = !selectedStatus || item.kondisi === selectedStatus;
            const matchTahun = !selectedTahun || String(item.tahun) === String(selectedTahun);

            return matchSearch && matchRuangan && matchStatus && matchTahun;
        });

        // Hitung pagination
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageItems = filteredData.slice(startIndex, endIndex);

        // Render baris tabel
        const tbody = document.getElementById('tableBodyAlat');
        if (!tbody) return;

        if (pageItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-5">
                        <i class="bi bi-search text-muted" style="font-size: 2.5rem;"></i>
                        <p class="text-muted fw-bold mt-2 mb-1">Data Alat Elektromedis Tidak Ditemukan</p>
                        <span class="small text-muted">Coba ubah kata kunci pencarian atau sesuaikan filter.</span>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = pageItems.map(item => {
                const iconClass = getDeviceIcon(item.kategori);
                const badge = getKondisiBadge(item.kondisi);

                return `
                    <tr>
                        <td class="table-order-id">
                            <span class="fw-bold">${item.id}</span>
                            <div class="text-muted small" style="font-size: 0.72rem;">${item.noSeri || '-'}</div>
                        </td>
                        <td>
                            <div class="d-flex align-items-center gap-3">
                                <div class="table-device-icon">
                                    <i class="bi ${iconClass}"></i>
                                </div>
                                <div>
                                    <div class="table-user-name">${item.nama}</div>
                                    <div class="table-user-sub"><span class="badge bg-light text-dark border">${item.kategori || 'Medis'}</span></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="fw-bold text-main">${item.merk}</div>
                            <div class="text-muted-green small">${item.tipe || '-'}</div>
                        </td>
                        <td>
                            <span class="badge bg-forest-light text-lime px-2 py-1">${item.tahun}</span>
                        </td>
                        <td>
                            <div class="d-flex align-items-center gap-1 small text-main fw-semibold">
                                <i class="bi bi-geo-alt-fill text-muted-green"></i>
                                <span>${item.ruangan}</span>
                            </div>
                        </td>
                        <td>
                            ${badge}
                        </td>
                        <td>
                            <div class="small fw-semibold text-main">
                                <i class="bi bi-calendar-event me-1 text-muted-green"></i>
                                ${item.tglKalibrasiBerikutnya || '-'}
                            </div>
                            <div class="text-muted small" style="font-size: 0.72rem;">Uji: ${item.tglKalibrasiTerakhir || '-'}</div>
                        </td>
                        <td>
                            <div class="d-flex justify-content-center gap-1">
                                <button class="btn btn-sm btn-light border py-1 px-2" title="Detail Alat" onclick="openDetailModal('${item.id}')">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-sm btn-light border py-1 px-2" title="Edit Alat" onclick="openEditModal('${item.id}')">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-light border text-danger py-1 px-2" title="Hapus Alat" onclick="openDeleteModal('${item.id}', '${item.nama.replace(/'/g, "\\'")}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        // Update info pagination
        const infoEl = document.getElementById('tablePaginationInfo');
        if (infoEl) {
            infoEl.textContent = totalItems > 0 
                ? `Menampilkan ${startIndex + 1} s/d ${endIndex} dari ${totalItems} alat elektromedis`
                : 'Tidak ada data alat yang ditampilkan';
        }

        const pageNumEl = document.getElementById('currentPageNumber');
        if (pageNumEl) pageNumEl.textContent = `Hal ${currentPage} dari ${totalPages}`;

        const prevBtn = document.getElementById('btnPrevPage');
        const nextBtn = document.getElementById('btnNextPage');
        if (prevBtn) prevBtn.disabled = currentPage <= 1;
        if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    }

    // Event filter & search
    document.getElementById('tableSearchInput')?.addEventListener('input', function () {
        currentPage = 1;
        filterAndRenderTable();
    });

    document.getElementById('main-search')?.addEventListener('input', function () {
        const val = this.value;
        const tableInput = document.getElementById('tableSearchInput');
        if (tableInput) {
            tableInput.value = val;
            currentPage = 1;
            filterAndRenderTable();
        }
    });

    document.getElementById('filterRuanganSelect')?.addEventListener('change', function () {
        currentPage = 1;
        filterAndRenderTable();
    });

    document.getElementById('filterStatusSelect')?.addEventListener('change', function () {
        currentPage = 1;
        filterAndRenderTable();
    });

    document.getElementById('filterTahunSelect')?.addEventListener('change', function () {
        currentPage = 1;
        filterAndRenderTable();
    });

    document.getElementById('btnResetFilter')?.addEventListener('click', function () {
        const searchInput = document.getElementById('tableSearchInput');
        const ruangSelect = document.getElementById('filterRuanganSelect');
        const statusSelect = document.getElementById('filterStatusSelect');
        const tahunSelect = document.getElementById('filterTahunSelect');
        if (searchInput) searchInput.value = '';
        if (ruangSelect) ruangSelect.value = '';
        if (statusSelect) statusSelect.value = '';
        if (tahunSelect) tahunSelect.value = '';
        currentPage = 1;
        filterAndRenderTable();
    });

    document.getElementById('btnFilterPerluKalibrasi')?.addEventListener('click', function () {
        const statusSelect = document.getElementById('filterStatusSelect');
        if (statusSelect) {
            statusSelect.value = 'Perlu Kalibrasi';
            currentPage = 1;
            filterAndRenderTable();
            // Scroll ke tabel
            document.querySelector('.table-card-custom')?.scrollIntoView({ behavior: 'smooth' });
        }
    });

    document.getElementById('btnPrevPage')?.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            filterAndRenderTable();
        }
    });

    document.getElementById('btnNextPage')?.addEventListener('click', function () {
        currentPage++;
        filterAndRenderTable();
    });

    // -----------------------------------------------------------------
    // 8. Modal Detail, Edit, Hapus Handlers
    // -----------------------------------------------------------------
    window.openDetailModal = function (id) {
        const item = ElektromedisApp.getById(id);
        if (!item) return;

        const bodyEl = document.getElementById('detailModalBody');
        const idDisplay = document.getElementById('detailIdDisplay');
        if (idDisplay) idDisplay.textContent = `Nomor Aset: ${item.id} | S/N: ${item.noSeri || '-'}`;

        if (bodyEl) {
            const badge = getKondisiBadge(item.kondisi);
            bodyEl.innerHTML = `
                <div class="row g-4">
                    <div class="col-md-7 border-end">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="table-device-icon" style="width: 50px; height: 50px; font-size: 1.5rem;">
                                <i class="bi ${getDeviceIcon(item.kategori)}"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold text-main mb-0">${item.nama}</h5>
                                <span class="badge bg-forest-light text-lime small">${item.kategori || 'Medis'}</span>
                            </div>
                        </div>

                        <div class="row g-3">
                            <div class="col-sm-6">
                                <div class="detail-item-label">Merk / Brand</div>
                                <div class="detail-item-value">${item.merk}</div>
                            </div>
                            <div class="col-sm-6">
                                <div class="detail-item-label">Tipe / Model</div>
                                <div class="detail-item-value">${item.tipe || '-'}</div>
                            </div>
                            <div class="col-sm-6">
                                <div class="detail-item-label">Nomor Seri (S/N)</div>
                                <div class="detail-item-value"><code>${item.noSeri || '-'}</code></div>
                            </div>
                            <div class="col-sm-6">
                                <div class="detail-item-label">Tahun Pengadaan</div>
                                <div class="detail-item-value">${item.tahun}</div>
                            </div>
                            <div class="col-sm-6">
                                <div class="detail-item-label">Lokasi Ruangan</div>
                                <div class="detail-item-value text-success fw-bold">
                                    <i class="bi bi-geo-alt-fill me-1"></i> ${item.ruangan}
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="detail-item-label">Status Kelaikan</div>
                                <div>${badge}</div>
                            </div>
                        </div>

                        <div class="mt-4 p-3 bg-light rounded-3">
                            <div class="detail-item-label mb-1">Catatan Teknis / Kondisi Fisik:</div>
                            <p class="small mb-0 text-muted">${item.keterangan || 'Tidak ada catatan khusus.'}</p>
                        </div>
                    </div>

                    <div class="col-md-5">
                        <h6 class="fw-bold mb-3 text-forest-medium">
                            <i class="bi bi-patch-check-fill text-success me-1"></i> Status Uji & Kalibrasi BPFK
                        </h6>

                        <div class="mb-3">
                            <div class="detail-item-label">Kalibrasi Terakhir:</div>
                            <div class="fw-bold text-main">${item.tglKalibrasiTerakhir || '-'}</div>
                        </div>

                        <div class="mb-3">
                            <div class="detail-item-label">Masa Berlaku / Kalibrasi Ulang:</div>
                            <div class="fw-bold text-danger">${item.tglKalibrasiBerikutnya || '-'}</div>
                        </div>

                        <div class="mb-3">
                            <div class="detail-item-label">Nomor Sertifikat:</div>
                            <div class="small fw-bold text-primary">${item.noSertifikat || '-'}</div>
                        </div>

                        <div class="mb-3">
                            <div class="detail-item-label">Lembaga Penguji:</div>
                            <div class="small fw-semibold text-main">${item.lembagaPenguji || 'BPFK'}</div>
                        </div>

                        <div class="mb-3">
                            <div class="detail-item-label">Teknisi PIC (IPSRS):</div>
                            <div class="small fw-bold text-main">${item.pic || '-'}</div>
                        </div>

                        <div class="mb-0">
                            <div class="detail-item-label">Nilai Pengadaan / Aset:</div>
                            <div class="small fw-bold text-success">${item.harga || '-'}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        const modal = new bootstrap.Modal(document.getElementById('modalDetailAlat'));
        modal.show();
    };

    window.openEditModal = function (id) {
        const item = ElektromedisApp.getById(id);
        if (!item) return;

        document.getElementById('editId').value = item.id;
        document.getElementById('editNamaAlat').value = item.nama;
        document.getElementById('editMerk').value = item.merk;
        document.getElementById('editTipe').value = item.tipe || '';
        document.getElementById('editNoSeri').value = item.noSeri || '';
        document.getElementById('editTahun').value = item.tahun;
        document.getElementById('editKategori').value = item.kategori || 'Diagnostik';
        document.getElementById('editRuangan').value = item.ruangan;
        document.getElementById('editKondisi').value = item.kondisi;
        document.getElementById('editTglKalibrasiTerakhir').value = item.tglKalibrasiTerakhir || '';
        document.getElementById('editTglKalibrasiBerikutnya').value = item.tglKalibrasiBerikutnya || '';
        document.getElementById('editNoSertifikat').value = item.noSertifikat || '';
        document.getElementById('editPIC').value = item.pic || '';
        document.getElementById('editKeterangan').value = item.keterangan || '';

        const modal = new bootstrap.Modal(document.getElementById('modalEditAlat'));
        modal.show();
    };

    window.openDeleteModal = function (id, nama) {
        document.getElementById('hapusIdAlat').value = id;
        document.getElementById('hapusNamaAlat').textContent = nama;
        const modal = new bootstrap.Modal(document.getElementById('modalHapusAlat'));
        modal.show();
    };

    // Form Tambah Alat Submit
    document.getElementById('formTambahAlat')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const newItem = {
            nama: document.getElementById('inputNamaAlat').value.trim(),
            merk: document.getElementById('inputMerk').value.trim(),
            tipe: document.getElementById('inputTipe').value.trim(),
            noSeri: document.getElementById('inputNoSeri').value.trim(),
            tahun: parseInt(document.getElementById('inputTahun').value, 10),
            kategori: document.getElementById('inputKategori').value,
            ruangan: document.getElementById('inputRuangan').value.trim(),
            kondisi: document.getElementById('inputKondisi').value,
            tglKalibrasiTerakhir: document.getElementById('inputTglKalibrasiTerakhir').value,
            tglKalibrasiBerikutnya: document.getElementById('inputTglKalibrasiBerikutnya').value,
            noSertifikat: document.getElementById('inputNoSertifikat').value.trim(),
            lembagaPenguji: document.getElementById('inputLembagaPenguji').value.trim(),
            pic: document.getElementById('inputPIC').value.trim(),
            harga: document.getElementById('inputHarga').value.trim(),
            keterangan: document.getElementById('inputKeterangan').value.trim()
        };

        ElektromedisApp.add(newItem);
        this.reset();

        // Sembunyikan modal
        const modalEl = document.getElementById('modalTambahAlat');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        refreshAllViews();
        alert('Data alat elektromedis berhasil disimpan ke inventaris!');
    });

    // Form Edit Alat Submit
    document.getElementById('formEditAlat')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const updated = {
            nama: document.getElementById('editNamaAlat').value.trim(),
            merk: document.getElementById('editMerk').value.trim(),
            tipe: document.getElementById('editTipe').value.trim(),
            noSeri: document.getElementById('editNoSeri').value.trim(),
            tahun: parseInt(document.getElementById('editTahun').value, 10),
            kategori: document.getElementById('editKategori').value,
            ruangan: document.getElementById('editRuangan').value.trim(),
            kondisi: document.getElementById('editKondisi').value,
            tglKalibrasiTerakhir: document.getElementById('editTglKalibrasiTerakhir').value,
            tglKalibrasiBerikutnya: document.getElementById('editTglKalibrasiBerikutnya').value,
            noSertifikat: document.getElementById('editNoSertifikat').value.trim(),
            pic: document.getElementById('editPIC').value.trim(),
            keterangan: document.getElementById('editKeterangan').value.trim()
        };

        ElektromedisApp.update(id, updated);

        const modalEl = document.getElementById('modalEditAlat');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        refreshAllViews();
        alert('Data alat elektromedis berhasil diperbarui!');
    });

    // Konfirmasi Hapus Action
    document.getElementById('btnKonfirmasiHapus')?.addEventListener('click', function () {
        const id = document.getElementById('hapusIdAlat').value;
        if (id) {
            ElektromedisApp.deleteItem(id);
            const modalEl = document.getElementById('modalHapusAlat');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();

            refreshAllViews();
        }
    });

    // Reset Data Default
    document.getElementById('btnResetDataPrompt')?.addEventListener('click', function () {
        if (confirm('Apakah Anda yakin ingin mereset seluruh data inventaris ke data bawaan awal rumah sakit?')) {
            ElektromedisApp.resetToDefault();
            refreshAllViews();
            alert('Data inventaris berhasil direset ke data default awal!');
        }
    });

    // Ekspor CSV Triggers
    const exportHandler = function () {
        ElektromedisApp.exportCSV();
    };
    document.getElementById('navExportCSV')?.addEventListener('click', exportHandler);
    document.getElementById('btnExportCSVTop')?.addEventListener('click', exportHandler);
    document.getElementById('btnExportCSVTable')?.addEventListener('click', exportHandler);

    // Refresh All Data & UI
    window.refreshAllViews = function () {
        updateKPIStats();
        filterAndRenderTable();
    };

    // Jalankan inisialisasi awal hanya jika user sudah login atau bukan dual section
    if (typeof Auth === 'undefined' || Auth.isLoggedIn() || !hasDualSection) {
        initSparklines();
        refreshAllViews();
    }
});
