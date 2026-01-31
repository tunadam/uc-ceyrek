// CONFIG - WhatsApp ve telefon numarası (sayfa özel)
const CONFIG = {
  whatsapp: '905431071993', // Varsayılan (Tesisat)
  phone: '+905431071993'    // Varsayılan (Tesisat)
};

// Sayfa adına göre numaraları ayarla
function setPhoneNumberByPage() {
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  if (currentPage === 'mobilya.html') {
    CONFIG.whatsapp = '905070955961';
    CONFIG.phone = '+905070955961';
  } else if (currentPage === 'klima.html') {
    CONFIG.whatsapp = '905375516092';
    CONFIG.phone = '+905375516092';
  } else if (currentPage === 'tesisat.html') {
    CONFIG.whatsapp = '905431071993';
    CONFIG.phone = '+905431071993';
  }
}

// Ortak header/footer'ı yükle (static sitede tekrarları azaltmak için)
// Not: fetch çalışması için siteyi bir local server ile açman önerilir (VS Code Live Server gibi).
async function loadPartials() {
  const headerMount = document.getElementById('site-header');
  const footerMount = document.getElementById('site-footer');

  const tasks = [];

  if (headerMount) {
    tasks.push(
      fetch('partials/header.html')
        .then(r => (r.ok ? r.text() : ''))
        .then(html => {
          if (html) headerMount.outerHTML = html;
        })
        .catch(() => {})
    );
  }

  if (footerMount) {
    tasks.push(
      fetch('partials/footer.html')
        .then(r => (r.ok ? r.text() : ''))
        .then(html => {
          if (html) footerMount.outerHTML = html;
        })
        .catch(() => {})
    );
  }

  await Promise.all(tasks);
}

// Navbar aktif menü vurgusu
function highlightActiveNavLink() {
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Galeri Lightbox
function setupGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (!lightbox) return; // Galeri sayfası değilse devam etme

  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (!img) return;
      lightboxImage.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', function (e) {
    if (e.target === this) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// İletişim Formu WhatsApp Entegrasyonu
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return; // İletişim sayfası değilse devam etme

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    if (!name || !email || !message) {
      alert('Lütfen tüm alanları doldurunuz!');
      return;
    }

    const whatsappMessage = `Merhaba, adım: ${name}\nE-mail: ${email}\nMesaj: ${message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${CONFIG.whatsapp}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank', 'noopener');
    form.reset();
    alert("WhatsApp'a yönlendiriliyorsunuz...");
  });
}

// Floating + Quick buttons (WhatsApp / Telefon)
function setFloatingAndQuickButtons() {
  const whatsappBtn = document.querySelectorAll('.whatsapp-btn');
  const callBtn = document.querySelectorAll('.call-btn');

  whatsappBtn.forEach(el => {
    el.href = `https://wa.me/${CONFIG.whatsapp}`;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  callBtn.forEach(el => {
    const cleanPhone = CONFIG.phone.replace(/\D/g, '');
    el.href = `tel:+${cleanPhone}`;
  });

  // Quick buttons in contact cards (if present)
  const whatsappQuick = document.querySelectorAll('.whatsapp-quick');
  whatsappQuick.forEach(el => {
    el.href = `https://wa.me/${CONFIG.whatsapp}`;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  const callQuick = document.querySelectorAll('.call-quick');
  callQuick.forEach(el => {
    const cleanPhone = CONFIG.phone.replace(/\D/g, '');
    el.href = `tel:+${cleanPhone}`;
  });
}

// Dark Mode Toggle
function initializeDarkMode() {
  const savedMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedMode === 'true' || (savedMode === null && prefersDark)) {
    document.body.classList.add('dark-mode');
  }

  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle dark mode');
  document.body.appendChild(themeToggle);

  const syncLabel = () => {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  };

  themeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    syncLabel();
  });

  syncLabel();
}

// Tek giriş noktası (race condition'ları önler)
document.addEventListener('DOMContentLoaded', async function () {
  setPhoneNumberByPage();

  // Header/footer load -> sonra nav/floating gibi DOM'a bağlı şeyler
  await loadPartials();

  highlightActiveNavLink();
  setupGalleryLightbox();
  setupContactForm();
  setFloatingAndQuickButtons();
  initializeDarkMode();
});
