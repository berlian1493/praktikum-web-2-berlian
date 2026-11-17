/**
 * ========================================================================
 * SIM-ELEKTROMEDIS - AUTHENTICATION & SESSION MANAGEMENT
 * Sistem Informasi & Inventaris Alat Elektromedis Rumah Sakit
 * ========================================================================
 */

const Auth = (function () {
    const STORAGE_KEY = 'sim_elektromedis_session';
    const REMEMBER_KEY = 'sim_elektromedis_remember';

    // Akun default sistem
    const DEFAULT_USERS = [
        {
            username: 'admin',
            password: 'admin123',
            name: 'Ahmad Fauzi, A.Md.EM',
            role: 'Kepala Instalasi IPSRS / Elektromedis',
            email: 'ahmad.fauzi@rs-medika.id',
            nip: '19920815 201803 1 002',
            avatar: 'assets/images/avatar.png'
        },
        {
            username: 'teknisi',
            password: 'teknisi123',
            name: 'Bambang Irawan, S.Tr.EM',
            role: 'Teknisi Elektromedis Ahli Pertama',
            email: 'bambang.em@rs-medika.id',
            nip: '19950412 202012 1 003',
            avatar: 'assets/images/user_2.jpg'
        }
    ];

    /**
     * Cek apakah pengguna sudah login
     */
    function isLoggedIn() {
        const session = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        if (!session) return false;
        try {
            const data = JSON.parse(session);
            return !!(data && data.username);
        } catch (e) {
            return false;
        }
    }

    /**
     * Dapatkan data pengguna saat ini
     */
    function getCurrentUser() {
        const session = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        if (!session) return null;
        try {
            return JSON.parse(session);
        } catch (e) {
            return null;
        }
    }

    /**
     * Proses Login
     */
    function login(username, password, rememberMe = true) {
        const cleanUser = (username || '').trim().toLowerCase();
        const cleanPass = (password || '').trim();

        // Cari di default users
        const matchedUser = DEFAULT_USERS.find(
            u => u.username.toLowerCase() === cleanUser && u.password === cleanPass
        );

        if (matchedUser) {
            const sessionData = {
                username: matchedUser.username,
                name: matchedUser.name,
                role: matchedUser.role,
                email: matchedUser.email,
                nip: matchedUser.nip,
                avatar: matchedUser.avatar,
                loginTime: new Date().toISOString()
            };

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

            if (rememberMe) {
                localStorage.setItem(REMEMBER_KEY, matchedUser.username);
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }

            return { success: true, user: sessionData };
        }

        // Jika username & password diisi (minimal 3 karakter)
        if (cleanUser && cleanPass.length >= 3) {
            if (cleanUser === 'admin' && cleanPass !== 'admin123') {
                return { success: false, message: 'Password salah untuk akun admin! Gunakan password: admin123' };
            }

            const customUser = {
                username: cleanUser,
                name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1) + ' (Teknisi)',
                role: 'Staf Elektromedis / IPSRS',
                email: cleanUser + '@rs-medika.id',
                nip: '19960101 202201 1 005',
                avatar: 'assets/images/avatar.png',
                loginTime: new Date().toISOString()
            };

            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem(STORAGE_KEY, JSON.stringify(customUser));
            return { success: true, user: customUser };
        }

        return {
            success: false,
            message: 'Username dan Password tidak boleh kosong! (Minimal 3 karakter)'
        };
    }

    /**
     * Proses Logout
     */
    function logout() {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);

        const loginSection = document.getElementById('section-login');
        const dashboardSection = document.getElementById('section-dashboard');

        if (loginSection && dashboardSection) {
            dashboardSection.style.display = 'none';
            loginSection.style.display = 'flex';
            document.body.classList.add('is-login-mode');
            const pass = document.getElementById('password');
            if (pass) pass.value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.location.href = 'index.html';
        }
    }

    /**
     * Sinkronisasi tampilan antara Login dan Dashboard pada halaman utama
     */
    function applyViewState() {
        const loginSection = document.getElementById('section-login');
        const dashboardSection = document.getElementById('section-dashboard');

        if (!loginSection || !dashboardSection) return;

        if (isLoggedIn()) {
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            document.body.classList.remove('is-login-mode');
            syncUserProfile();
            if (window.refreshAllViews) {
                window.refreshAllViews();
            }
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        } else {
            loginSection.style.display = 'flex';
            dashboardSection.style.display = 'none';
            document.body.classList.add('is-login-mode');
        }
    }

    /**
     * Sinkronisasi data user ke komponen navbar dan sidebar
     */
    function syncUserProfile() {
        const user = getCurrentUser();
        if (!user) return;

        document.querySelectorAll('.sidebar-profile-name, .navbar-profile-name, .user-name-display').forEach(el => {
            el.textContent = user.name;
        });

        document.querySelectorAll('.sidebar-profile-email, .user-email-display').forEach(el => {
            el.textContent = user.email || user.role;
        });

        if (user.avatar) {
            document.querySelectorAll('.sidebar-profile-img, .navbar-profile-img, .user-avatar-display').forEach(img => {
                if (img.tagName === 'IMG') {
                    img.src = user.avatar;
                }
            });
        }
    }

    return {
        isLoggedIn,
        getCurrentUser,
        login,
        logout,
        applyViewState,
        syncUserProfile,
        DEFAULT_USERS
    };
})();

// Inisialisasi event listener saat DOM siap
document.addEventListener('DOMContentLoaded', function () {
    // 1. Password Visibility Toggle
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            if (type === 'text') {
                if (icon) {
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                }
                this.setAttribute('aria-label', 'Sembunyikan password');
            } else {
                if (icon) {
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
                this.setAttribute('aria-label', 'Tampilkan password');
            }
        });
    }

    // 2. Tombol Logout Global
    document.querySelectorAll('[data-action="logout"], .btn-logout-action').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin keluar dari sistem inventaris?')) {
                Auth.logout();
            }
        });
    });

    // 3. Terapkan view state (Login vs Dashboard)
    Auth.applyViewState();
});
