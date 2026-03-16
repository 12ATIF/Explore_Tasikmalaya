// ============================================
// EXPLORE TASIKMALAYA — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // --- AOS Init ---
  AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 });

  // --- Navbar Scroll ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- Parallax Hero ---
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (heroBg) heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.3}px)`;
  });

  // --- Mobile Menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('active'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('active')));
  }

  // --- Animated Counters ---
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // --- Leaflet Map ---
  initMap();

  // --- Chart.js Dashboard ---
  initCharts();

  // --- Gallery Lightbox ---
  initLightbox();
});

// ==============================
// INTERACTIVE MAP
// ==============================
function initMap() {
  const mapEl = document.getElementById('tourismMap');
  if (!mapEl) return;

  const map = L.map('tourismMap', { scrollWheelZoom: false }).setView([-7.35, 108.22], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const icons = {
    nature: L.divIcon({ className: 'custom-marker', html: '<div style="background:#2E7D32;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;box-shadow:0 4px 12px rgba(46,125,50,0.4)">🏔</div>', iconSize: [32, 32], iconAnchor: [16, 16] }),
    culture: L.divIcon({ className: 'custom-marker', html: '<div style="background:#795548;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;box-shadow:0 4px 12px rgba(121,85,72,0.4)">🏛</div>', iconSize: [32, 32], iconAnchor: [16, 16] }),
    culinary: L.divIcon({ className: 'custom-marker', html: '<div style="background:#FF6F00;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;box-shadow:0 4px 12px rgba(255,111,0,0.4)">🍜</div>', iconSize: [32, 32], iconAnchor: [16, 16] }),
    craft: L.divIcon({ className: 'custom-marker', html: '<div style="background:#5D4037;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;box-shadow:0 4px 12px rgba(93,64,55,0.4)">🎨</div>', iconSize: [32, 32], iconAnchor: [16, 16] })
  };

  const locations = [
    { name: 'Gunung Galunggung', lat: -7.25, lng: 108.06, cat: 'nature', desc: 'An active stratovolcano rising 2,168m, offering spectacular crater lake views and hot springs.', tip: 'Best visited early morning for clear views. Bring warm clothes.' },
    { name: 'Kampung Naga', lat: -7.36, lng: 107.99, cat: 'culture', desc: 'A pristine traditional Sundanese village preserving centuries-old customs and architecture.', tip: 'Respect local customs. Photography may be restricted inside homes.' },
    { name: 'Pantai Cipatujah', lat: -7.72, lng: 107.94, cat: 'nature', desc: 'A stunning Indian Ocean coastline with dramatic cliffs, golden sand, and brilliant sunsets.', tip: 'Arrive before 5 PM for the best sunset views. Beware of strong currents.' },
    { name: 'Rajapolah Craft Center', lat: -7.33, lng: 108.18, cat: 'craft', desc: 'The heart of Tasikmalaya\'s world-renowned bamboo and handicraft industry.', tip: 'Visit workshops to see artisans at work. Bargain respectfully for souvenirs.' },
    { name: 'Pasar Kuliner Tasikmalaya', lat: -7.33, lng: 108.22, cat: 'culinary', desc: 'A vibrant traditional food market serving authentic Sundanese street food and delicacies.', tip: 'Try Nasi Tutug Oncom and Kupat Tahu — local favorites!' },
    { name: 'Situ Gede', lat: -7.31, lng: 108.19, cat: 'nature', desc: 'A tranquil lake surrounded by lush greenery, perfect for a peaceful retreat.', tip: 'Great for morning jogs and photography. Boat rides available.' }
  ];

  const markers = {};
  locations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], { icon: icons[loc.cat] }).addTo(map);
    marker.bindPopup(`
      <h3 style="font-size:1.1rem;margin-bottom:4px">${loc.name}</h3>
      <p style="font-size:0.85rem;color:#4B5563;margin:4px 0">${loc.desc}</p>
      <p style="font-size:0.8rem;color:#2E7D32;font-weight:600;margin-top:8px">💡 ${loc.tip}</p>
    `, { maxWidth: 280 });
    if (!markers[loc.cat]) markers[loc.cat] = [];
    markers[loc.cat].push(marker);
  });

  // Category filter
  window.filterMap = function(cat) {
    document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    Object.keys(markers).forEach(key => {
      markers[key].forEach(m => {
        if (cat === 'all' || key === cat) { m.addTo(map); } else { map.removeLayer(m); }
      });
    });
  };
}

// ==============================
// CHARTS DASHBOARD
// ==============================
function initCharts() {
  // Tourist Growth Chart
  const growthCtx = document.getElementById('growthChart');
  if (growthCtx) {
    new Chart(growthCtx, {
      type: 'bar',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'Visitors (thousands)',
          data: [320, 85, 120, 245, 380, 510, 620],
          backgroundColor: ['rgba(46,125,50,0.7)','rgba(46,125,50,0.5)','rgba(46,125,50,0.55)','rgba(46,125,50,0.65)','rgba(46,125,50,0.75)','rgba(46,125,50,0.85)','rgba(46,125,50,1)'],
          borderRadius: 8, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a1a1a', titleFont: { family: 'Poppins' }, bodyFont: { family: 'Poppins' } } },
        scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
      }
    });
  }

  // Top Destinations Doughnut
  const destCtx = document.getElementById('destChart');
  if (destCtx) {
    new Chart(destCtx, {
      type: 'doughnut',
      data: {
        labels: ['Gunung Galunggung', 'Kampung Naga', 'Pantai Cipatujah', 'Rajapolah', 'Others'],
        datasets: [{
          data: [35, 25, 20, 12, 8],
          backgroundColor: ['#2E7D32', '#4CAF50', '#81C784', '#795548', '#A1887F'],
          borderWidth: 0, hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { family: 'Poppins', size: 12 } } } }
      }
    });
  }

  // UMKM Growth Line
  const umkmCtx = document.getElementById('umkmChart');
  if (umkmCtx) {
    new Chart(umkmCtx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'Registered UMKM',
          data: [1200, 1450, 1800, 2300, 2900, 3500],
          borderColor: '#2E7D32', backgroundColor: 'rgba(46,125,50,0.1)',
          fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#2E7D32'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
      }
    });
  }
}

// ==============================
// GALLERY LIGHTBOX
// ==============================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox) return;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ==============================
// TRAVEL PLANNER (Alpine.js)
// ==============================
document.addEventListener('alpine:init', () => {
  Alpine.data('travelPlanner', () => ({
    days: '2',
    interest: 'all',
    itinerary: [],
    generated: false,

    activities: {
      nature: [
        { name: 'Gunung Galunggung Crater Trek', time: 'Morning', icon: '🏔️' },
        { name: 'Situ Gede Lake Visit', time: 'Morning', icon: '🌊' },
        { name: 'Cipatujah Beach Sunset', time: 'Afternoon', icon: '🌅' },
        { name: 'Curug Dengdeng Waterfall', time: 'Morning', icon: '💧' },
      ],
      culture: [
        { name: 'Kampung Naga Village Tour', time: 'Morning', icon: '🏛️' },
        { name: 'Batik Workshop Experience', time: 'Afternoon', icon: '🎨' },
        { name: 'Traditional Dance Performance', time: 'Evening', icon: '💃' },
        { name: 'Heritage Museum Visit', time: 'Morning', icon: '🏛️' },
      ],
      food: [
        { name: 'Nasi Tutug Oncom Breakfast', time: 'Morning', icon: '🍚' },
        { name: 'Kupat Tahu Street Food Tour', time: 'Afternoon', icon: '🍜' },
        { name: 'Traditional Cooking Class', time: 'Afternoon', icon: '👨‍🍳' },
        { name: 'Local Market Food Walk', time: 'Morning', icon: '🛒' },
      ],
      craft: [
        { name: 'Rajapolah Craft Center Visit', time: 'Morning', icon: '🧺' },
        { name: 'Bamboo Weaving Workshop', time: 'Afternoon', icon: '🎋' },
        { name: 'Artisan Studio Tour', time: 'Morning', icon: '🖌️' },
      ]
    },

    generate() {
      this.itinerary = [];
      const numDays = parseInt(this.days);
      const categories = this.interest === 'all'
        ? ['nature', 'culture', 'food', 'craft']
        : [this.interest];

      let pool = [];
      categories.forEach(cat => {
        if (this.activities[cat]) pool = pool.concat(this.activities[cat]);
      });

      // Shuffle pool
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      for (let d = 0; d < numDays; d++) {
        const dayActivities = [];
        const perDay = Math.min(3, Math.ceil(pool.length / numDays));
        for (let a = 0; a < perDay && pool.length > 0; a++) {
          dayActivities.push(pool.shift());
        }
        this.itinerary.push({ day: d + 1, activities: dayActivities });
      }
      this.generated = true;
    }
  }));
});
