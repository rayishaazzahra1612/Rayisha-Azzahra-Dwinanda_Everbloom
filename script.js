document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // VARIABEL UTAMA (KERANJANG & PRODUK)
    // =============================================
    const keranjangBtn = document.getElementById('keranjang-btn');
    const keranjangSidebar = document.getElementById('keranjang-sidebar');
    const keranjangList = document.getElementById('keranjang-list');
    const keranjangTotalSpan = document.getElementById('keranjang-total');
    const tambahKeranjangBtns = document.querySelectorAll('.tambah-keranjang');
    const closeCartBtn = document.getElementById('close-cart-btn');
    
    // Variabel untuk Produk & Tampilan
    const searchInput = document.getElementById('search-input');
    const produkItems = document.querySelectorAll('.produk-item');
    const produkTitle = document.getElementById('produk-title');
    const popularLink = document.getElementById('popular-link');
    const homeLink = document.getElementById('home-link');
    const shopNowBtn = document.getElementById('shop-now-btn');
    const searchBtn = document.getElementById('search-btn');
    
    // Data Keranjang
    let keranjang = []; 

    // =============================================
    // VARIABEL & LOGIKA AUTENTIKASI (LOGIN/SIGNUP)
    // =============================================
    const authBtn = document.getElementById('auth-btn');
    const userProfileIcon = document.getElementById('user-profile-icon');
    const authModal = document.getElementById('auth-modal');
    const modalContent = document.querySelector('.modal-content');
    
    // STATUS LOGIN & DATA PENGGUNA
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let userData = JSON.parse(localStorage.getItem('userData')) || {
        name: '',
        email: '',
        address: '', 
        phone: ''    
    };
    
    // --- DEFINISI HTML UNTUK MODAL (Sisi Kiri & Form) ---
    
    // TAMBAHAN: Tombol Tutup (X) ditambahkan di sini
    const modalLeftHTML = `
        <button id="close-auth-modal" class="close-btn" aria-label="Tutup Modal">X</button>
        <div class="modal-background-blur" id="modal-blur-bg">
            <div class="welcome-text-bubble">
                <h2 class="welcome-text-h2">Selamat Datang di Everbloom</h2>
            </div>
        </div>
    `;

    // SUDAH DIREVISI DI JAWABAN SEBELUMNYA (Menghapus opsi Google)
    const loginFormHTML = `
        <div class="modal-right auth-form" id="login-form">
            <h2>Masuk ke Akun Anda</h2>
            <p style="color:#888; margin-top:-10px; margin-bottom: 25px;">Masukkan detail Anda untuk melanjutkan berbelanja.</p>
            <form>
                <div class="form-group">
                    <label for="login-email">Alamat Email</label>
                    <input type="email" id="login-email" placeholder="Masukkan email Anda" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Kata Sandi</label>
                    <input type="password" id="login-password" placeholder="Masukkan kata sandi" required>
                </div>
                <button type="submit" class="login-btn">Login</button>
            </form>
            <p class="switch-form-text">Belum punya akun? <a href="#" id="switch-to-register">Daftar di sini</a></p>
        </div>
    `;

    // SUDAH DIREVISI DI JAWABAN SEBELUMNYA (Menghapus opsi Google)
    const registerFormHTML = `
        <div class="modal-right auth-form hidden" id="register-form">
            <h2>Buat Akun Baru</h2>
            <p style="color:#888; margin-top:-10px; margin-bottom: 25px;">Daftar untuk menikmati semua koleksi Everbloom.</p>
            <form>
                <div class="form-group">
                    <label for="register-name">Nama Lengkap</label>
                    <input type="text" id="register-name" placeholder="Masukkan nama lengkap Anda" required>
                </div>
                <div class="form-group">
                    <label for="register-email">Alamat Email</label>
                    <input type="email" id="register-email" placeholder="Masukkan email Anda" required>
                </div>
                <div class="form-group">
                    <label for="register-password">Kata Sandi</label>
                    <input type="password" id="register-password" placeholder="Buat kata sandi" required>
                </div>
                <button type="submit" class="register-btn">Sign Up</button>
            </form>
            <p class="switch-form-text">Sudah punya akun? <a href="#" id="switch-to-login">Masuk di sini</a></p>
        </div>
    `;
    
    // Fungsi Helper untuk render formulir login/register ke dalam wrapper
    function renderAuthForms() {
        modalContent.innerHTML = `
            <div class="modal-inner-wrapper">
                ${modalLeftHTML}
                ${loginFormHTML}
                ${registerFormHTML}
            </div>
        `;
        setupAuthFormListeners();
    }
    
    // Gabungkan HTML Awal ke dalam modal
    renderAuthForms();

    // --- FUNGSI UTILITY AUTENTIKASI ---

    function showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
    }

    function showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
    }

    function updateHeaderAuthUI() {
        if (isLoggedIn) {
            authBtn.style.display = 'none'; 
            userProfileIcon.style.display = 'block'; 
        } else {
            authBtn.style.display = 'block'; 
            userProfileIcon.style.display = 'none'; 
        }
    }
    
    function handleLogout() {
        // 1. Reset Status dan Data
        isLoggedIn = false;
        userData = { name: '', email: '', address: '', phone: '' }; 
        
        // 2. Hapus data dari penyimpanan lokal
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userData');
        
        // 3. Update UI Header
        updateHeaderAuthUI();
        
        // 4. Tutup modal/navigasi yang mungkin terbuka
        authModal.classList.remove('active');

        // 5. Beri notifikasi dan refresh halaman untuk memastikan state bersih
        alert('Anda telah log out dari Everbloom.');
        window.location.reload(); 
    }
    
    // Fungsi untuk menampilkan Modal Profil
    function showProfileModal() {
        // Render ulang konten modal dengan form profil (nilai harus dinamis)
        modalContent.innerHTML = `
            <div class="modal-inner-wrapper">
                ${modalLeftHTML} 
                <div class="modal-right auth-form" id="profile-form">
                    <h2 style="margin-bottom: 5px;">Profil Pengguna</h2>
                    <p style="color:#888; margin-top:0px; margin-bottom: 25px;">Perbarui data diri Anda sebelum Checkout.</p>
                    <form id="save-profile-form">
                        <div class="form-group">
                            <label for="profile-name">Nama Lengkap</label>
                            <input type="text" id="profile-name" value="${userData.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="profile-email">Email</label>
                            <input type="email" id="profile-email" value="${userData.email}" disabled style="background-color: #f0f0f0;">
                        </div>
                        <div class="form-group">
                            <label for="profile-phone">Nomor Telepon</label>
                            <input type="tel" id="profile-phone" placeholder="Cth: 081234567890" value="${userData.phone || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="profile-address">Alamat Lengkap</label>
                            <textarea id="profile-address" placeholder="Masukkan alamat pengiriman Anda" rows="3" required>${userData.address || ''}</textarea>
                        </div>
                        
                        <button type="submit" class="login-btn" id="save-profile-btn">Simpan Profil</button>
                        
                        <button type="button" class="google-login-btn" id="logout-from-profile" style="margin-top: 15px;">Logout</button>
                    </form>
                </div>
            </div>
        `;

        // Tambahkan event listeners untuk form profil
        const saveProfileForm = document.getElementById('save-profile-form');
        if (saveProfileForm) {
            saveProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Update userData object
                userData.name = document.getElementById('profile-name').value.trim();
                userData.phone = document.getElementById('profile-phone').value.trim();
                userData.address = document.getElementById('profile-address').value.trim();
                
                // Simpan data terbaru ke localStorage
                localStorage.setItem('userData', JSON.stringify(userData));
                
                alert('Data Profil berhasil disimpan!');
                authModal.classList.remove('active');
                
                // Render ulang konten original dan pasang kembali listener auth
                renderAuthForms();
            });
        }
        
        // Tambahkan event listener untuk tombol logout di dalam form profil
        const logoutFromProfileBtn = document.getElementById('logout-from-profile');
        if (logoutFromProfileBtn) {
            logoutFromProfileBtn.addEventListener('click', () => {
                // Perintah logout utama
                handleLogout(); 
            });
        }

        authModal.classList.add('active');
    }
    
    // Fungsi untuk memasang kembali semua Event Listeners Form Auth
    function setupAuthFormListeners() {
        // Ambil elemen form yang sudah ditambahkan ke DOM
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const switchToRegisterLink = document.getElementById('switch-to-register');
        const switchToLoginLink = document.getElementById('switch-to-login');
        const loginEmailInput = document.getElementById('login-email');
        // ... (variabel registerNameInput tidak digunakan di sini, tapi di form submit)

        // Tombol Switch (Login <-> Sign Up)
        if (switchToRegisterLink) {
            switchToRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                showRegisterForm();
            });
        }

        if (switchToLoginLink) {
            switchToLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                showLoginForm();
            });
        }

        // Handle Submit Form (Simulasi Login)
        if (loginForm) {
            loginForm.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = loginEmailInput.value.toLowerCase();
                
                // --- BAGIAN YANG DIREVISI UNTUK PESAN ALERT ---
                let namePart = email.split('@')[0];
                let name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                
                isLoggedIn = true;
                userData.name = name;
                userData.email = email;
                
                // Simpan status dan data ke localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', JSON.stringify(userData));

                // PESAN ALERT SESUAI PERMINTAAN: Menghapus "Simulasi:"
                alert(`Login berhasil! Selamat datang kembali, ${name}`);
                
                authModal.classList.remove('active');
                updateHeaderAuthUI(); 
                
                loginEmailInput.value = '';
                document.getElementById('login-password').value = '';
                
                // Render ulang konten original dan pasang kembali listener auth
                renderAuthForms();
            });
        }

        // Handle Submit Form (Simulasi Register)
        if (registerForm) {
            registerForm.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('register-name').value.trim();
                const email = document.getElementById('register-email').value.toLowerCase();

                if (name) {
                    isLoggedIn = true; 
                    userData.name = name;
                    userData.email = email;
                    userData.address = ''; 
                    userData.phone = ''; 
                    
                    // Simpan status dan data ke localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userData', JSON.stringify(userData));

                    // REVISI PESAN REGISTER JUGA (Menghapus "Simulasi:")
                    alert(`Pendaftaran berhasil! Selamat datang, ${userData.name}. Mohon lengkapi data diri Anda.`);
                    authModal.classList.remove('active');
                    updateHeaderAuthUI(); 
                    
                    // Tampilkan modal profil setelah registrasi
                    showProfileModal(); 
                } else {
                    // REVISI PESAN REGISTER (Menghapus "Simulasi:")
                    alert('Pendaftaran berhasil! Silakan login.');
                    authModal.classList.remove('active');
                    showLoginForm();
                }
                
                // Reset form inputs
                document.getElementById('register-name').value = '';
                document.getElementById('register-email').value = '';
                document.getElementById('register-password').value = '';
            });
        }
    }


    // --- EVENT LISTENERS AUTENTIKASI ---
    
    // Tampilkan Modal Auth saat tombol Login/Sign Up di klik
    authBtn.addEventListener('click', () => {
        // Pastikan konten modal adalah form auth dan pasang listener
        renderAuthForms();
        authModal.classList.add('active');
        showLoginForm(); 
    });
    
    // Tampilkan Modal Profil saat ikon profil di klik
    userProfileIcon.addEventListener('click', () => {
        if (isLoggedIn) {
             showProfileModal();
        }
    });
    
    // Sembunyikan Modal saat klik di luar form (modal-overlay)
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
            // Pastikan konten original di-render ulang jika modal ditutup dari luar
            renderAuthForms();
        }
    });
    
    // TAMBAHAN: Listener untuk tombol tutup (X)
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'close-auth-modal') {
            authModal.classList.remove('active');
            // Pastikan konten original di-render ulang jika modal ditutup
            renderAuthForms();
        }
    });


    // =============================================
    // FUNGSI UTILITY (KERANJANG)
    // =============================================
    
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }
    
    function updateKeranjangUI() {
        keranjangList.innerHTML = ''; 
        let total = 0;
        let totalItemUnik = keranjang.length; 
        
        const currentCartCountSpan = document.getElementById('keranjang-count');
        if (currentCartCountSpan) currentCartCountSpan.textContent = totalItemUnik;
        keranjangBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> (<span id="keranjang-count">${totalItemUnik}</span>)`;

        keranjang.forEach((item, index) => { 
            const subtotal = item.harga * item.jumlah;
            total += subtotal;

            const li = document.createElement('li');
            
            const catatanDisplay = item.catatan ? 
                `<br><small style="color: #777;">Catatan: ${item.catatan}</small>` : 
                '';
            
            li.innerHTML = `
                <div>
                    <span class="item-info">${item.nama} (${item.jumlah}x) - ${formatRupiah(subtotal)}</span>
                    ${catatanDisplay}
                </div>
                <button class="remove-btn" data-index="${index}">Hapus</button> 
            `;
            keranjangList.appendChild(li);
        });

        keranjangTotalSpan.textContent = formatRupiah(total);
        
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemIndex = parseInt(e.target.getAttribute('data-index'));
                if (itemIndex > -1 && itemIndex < keranjang.length) {
                    keranjang.splice(itemIndex, 1);
                    updateKeranjangUI();
                }
            });
        });
    }

    // =============================================
    // EVENT LISTENERS KERANJANG
    // =============================================
    
    keranjangBtn.addEventListener('click', () => {
        keranjangSidebar.classList.add('open');
    });
    
    closeCartBtn.addEventListener('click', () => {
        keranjangSidebar.classList.remove('open');
    });

    tambahKeranjangBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemElement = event.target.closest('.produk-item');
            const nama = itemElement.getAttribute('data-nama');
            const harga = parseInt(itemElement.getAttribute('data-harga'));
            
            const notesElement = itemElement.querySelector('.product-notes');
            const catatan = notesElement ? notesElement.value.trim() : ''; 
            
            const existingItem = keranjang.find(item => item.nama === nama && item.catatan === catatan);

            if (existingItem) {
                existingItem.jumlah++;
            } else {
                keranjang.push({ nama, harga, jumlah: 1, catatan }); 
            }

            updateKeranjangUI();
            alert(`${nama} ditambahkan ke keranjang!${catatan ? ' (dengan catatan)' : ''}`);
            
            if (notesElement) notesElement.value = ''; 
            
            keranjangSidebar.classList.add('open'); 
        });
    });

    // =============================================
    // LOGIKA CHECKOUT
    // =============================================
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (keranjang.length > 0) {
            
            // 1. Cek status login
            if (!isLoggedIn) {
                alert("Anda harus login terlebih dahulu sebelum melakukan Checkout.");
                keranjangSidebar.classList.remove('open');
                
                // Render form auth dan pasang listener
                renderAuthForms();
                authModal.classList.add('active'); 
                showLoginForm();
                return; 
            }
            
            // 2. Cek data diri (alamat atau telepon tidak boleh kosong/falsey)
            if (!userData.address || userData.address.trim() === '' || !userData.phone || userData.phone.trim() === '') {
                alert(`Data diri (Alamat & Nomor Telepon) belum lengkap. Silakan lengkapi di halaman Profil Anda untuk melanjutkan Checkout.`);
                keranjangSidebar.classList.remove('open');
                showProfileModal(); 
                return; 
            }
            
            // JIKA SUDAH LOGIN DAN DATA LENGKAP, LANJUTKAN PROSES CHECKOUT
            const totalBayar = keranjangTotalSpan.textContent;
            
            alert(`
                Pesanan atas nama ${userData.name} telah diterima!
                
                Rincian Pengiriman:
                Alamat: ${userData.address}
                Nomor HP: ${userData.phone}
                
                Total yang harus dibayar: ${totalBayar}
            `);
            
            // Kosongkan keranjang
            keranjang = []; 
            updateKeranjangUI();
            keranjangSidebar.classList.remove('open');
        } else {
            alert("Keranjang belanja Anda masih kosong. Silakan tambahkan bunga favorit Anda.");
        }
    });
    // =============================================
    
    // =============================================
    // FUNGSI TAMPILAN PRODUK (SEARCH & FILTER)
    // =============================================
    
    function showAllProducts(event) {
        if (event) event.preventDefault(); 
        produkItems.forEach(item => {
            item.style.display = 'block';
        });
        produkTitle.textContent = 'Everbloom\'s Collection';
        document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
    }
    
    function showPopularProducts(event) {
        if (event) event.preventDefault(); 
        produkItems.forEach(item => {
            item.style.display = 'none';
        });
        for (let i = 0; i < 10 && i < produkItems.length; i++) {
            produkItems[i].style.display = 'block';
        }
        produkTitle.textContent = '10 Bunga Paling Populer 🏆';
        document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
    }
    
    function searchProducts() {
        const searchText = searchInput.value.toLowerCase(); 
        let count = 0;
        produkItems.forEach(item => {
            const namaBunga = item.getAttribute('data-nama').toLowerCase();
            if (namaBunga.includes(searchText)) {
                item.style.display = 'block';
                count++;
            } else {
                item.style.display = 'none';
            }
        });
        produkTitle.textContent = searchText === '' ? 'Everbloom\'s Collection' : `Hasil Pencarian (${count} Item)`;
        
        if (count > 0 || searchText.length > 0) {
            document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // =============================================
    // EVENT LISTENERS TAMPILAN
    // =============================================
    homeLink.addEventListener('click', showAllProducts);
    shopNowBtn.addEventListener('click', showAllProducts);
    popularLink.addEventListener('click', showPopularProducts);
    searchBtn.addEventListener('click', searchProducts);
    searchInput.addEventListener('input', searchProducts); 
    
    // Inisialisasi: Pasang listener auth dan update UI
    setupAuthFormListeners(); 
    updateHeaderAuthUI(); 
    showAllProducts(); 
    updateKeranjangUI(); 
});