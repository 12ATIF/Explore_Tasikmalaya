// ============================================
// EXPLORE TASIKMALAYA — Enhanced JavaScript v2
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      // Trigger hero bg zoom
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg) heroBg.classList.add('loaded');
    }, 2000);
  });

  // --- AOS Init ---
  AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    anchorPlacement: 'top-bottom'
  });

  // --- Navbar Scroll ---
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  // --- Back to Top ---
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Parallax Hero ---
  const heroBg = document.querySelector('.hero-bg');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (heroBg && window.scrollY < window.innerHeight) {
          heroBg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.25}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- Mobile Menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-link');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink);

  // --- Animated Counters ---
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // --- Init Features ---
  initMap();
  initCharts();
  initLightbox();
});

// ==============================
// INTERACTIVE MAP
// ==============================
function initMap() {
  const mapEl = document.getElementById('tourismMap');
  if (!mapEl) return;

  const map = L.map('tourismMap', {
    scrollWheelZoom: false,
    zoomControl: false
  }).setView([-7.35, 108.22], 10);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>',
    maxZoom: 18
  }).addTo(map);

  const makeIcon = (emoji, color) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:17px;box-shadow:0 4px 15px ${color}66;border:2px solid rgba(255,255,255,0.3);transition:transform 0.3s">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  const icons = {
    nature: makeIcon('🏔', '#2E7D32'),
    culture: makeIcon('🏛', '#795548'),
    culinary: makeIcon('🍜', '#FF6F00'),
    craft: makeIcon('🎨', '#5D4037')
  };

  const locations = [
    { name: 'Gunung Galunggung', lat: -7.25, lng: 108.06, cat: 'nature',
      desc: 'An active stratovolcano rising 2,168m, offering spectacular crater lake views and hot springs.',
      tip: 'Best visited early morning for clear views. Bring warm clothes.' },
    { name: 'Kampung Naga', lat: -7.36, lng: 107.99, cat: 'culture',
      desc: 'A pristine traditional Sundanese village preserving centuries-old customs and architecture.',
      tip: 'Respect local customs. Photography may be restricted inside homes.' },
    { name: 'Pantai Cipatujah', lat: -7.72, lng: 107.94, cat: 'nature',
      desc: 'A stunning Indian Ocean coastline with dramatic cliffs, golden sand, and brilliant sunsets.',
      tip: 'Arrive before 5 PM for the best sunset views. Beware of strong currents.' },
    { name: 'Rajapolah Craft Center', lat: -7.33, lng: 108.18, cat: 'craft',
      desc: 'The heart of Tasikmalaya\'s world-renowned bamboo and handicraft industry.',
      tip: 'Visit workshops to see artisans at work. Bargain respectfully for souvenirs.' },
    { name: 'Pasar Kuliner Tasikmalaya', lat: -7.33, lng: 108.22, cat: 'culinary',
      desc: 'A vibrant traditional food market serving authentic Sundanese street food and delicacies.',
      tip: 'Try Nasi Tutug Oncom and Kupat Tahu — local favorites!' },
    { name: 'Situ Gede', lat: -7.31, lng: 108.19, cat: 'nature',
      desc: 'A tranquil lake surrounded by lush greenery, perfect for a peaceful retreat.',
      tip: 'Great for morning jogs and photography. Boat rides available.' }
  ];

  const markers = {};
  locations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], { icon: icons[loc.cat] }).addTo(map);
    marker.bindPopup(`
      <div style="min-width:220px">
        <h3 style="font-size:1.1rem;margin:0 0 6px 0;font-weight:700">${loc.name}</h3>
        <p style="font-size:0.85rem;color:#4B5563;margin:4px 0;line-height:1.5">${loc.desc}</p>
        <div style="margin-top:10px;padding:8px 12px;background:rgba(46,125,50,0.06);border-radius:8px;border-left:3px solid #2E7D32">
          <p style="font-size:0.8rem;color:#2E7D32;font-weight:600;margin:0">💡 ${loc.tip}</p>
        </div>
      </div>
    `, { maxWidth: 300 });
    if (!markers[loc.cat]) markers[loc.cat] = [];
    markers[loc.cat].push(marker);
  });

  window.filterMap = function(cat) {
    document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
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
  const fontFamily = "'Poppins', sans-serif";

  Chart.defaults.font.family = fontFamily;
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#6B7280';

  // Tourist Growth Chart
  const growthCtx = document.getElementById('growthChart');
  if (growthCtx) {
    const gradient = growthCtx.getContext('2d').createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(46,125,50,0.9)');
    gradient.addColorStop(1, 'rgba(76,175,80,0.6)');

    new Chart(growthCtx, {
      type: 'bar',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'Visitors (thousands)',
          data: [320, 85, 120, 245, 380, 510, 620],
          backgroundColor: gradient,
          borderRadius: 10, borderSkipped: false,
          barPercentage: 0.7
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a', cornerRadius: 10, padding: 12,
            titleFont: { family: fontFamily, weight: '600' },
            bodyFont: { family: fontFamily }
          }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false }, ticks: { padding: 8 } },
          x: { grid: { display: false }, ticks: { padding: 8 } }
        }
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
          backgroundColor: ['#1B5E20', '#2E7D32', '#4CAF50', '#795548', '#A1887F'],
          borderWidth: 0, hoverOffset: 10
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { family: fontFamily, size: 11 } } } }
      }
    });
  }

  // UMKM Growth Line
  const umkmCtx = document.getElementById('umkmChart');
  if (umkmCtx) {
    const lineGradient = umkmCtx.getContext('2d').createLinearGradient(0, 0, 0, 250);
    lineGradient.addColorStop(0, 'rgba(46,125,50,0.15)');
    lineGradient.addColorStop(1, 'rgba(46,125,50,0)');

    new Chart(umkmCtx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'Registered UMKM',
          data: [1200, 1450, 1800, 2300, 2900, 3500],
          borderColor: '#2E7D32', backgroundColor: lineGradient,
          fill: true, tension: 0.45,
          pointRadius: 5, pointBackgroundColor: '#fff',
          pointBorderColor: '#2E7D32', pointBorderWidth: 2.5,
          pointHoverRadius: 7, borderWidth: 2.5
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false }, ticks: { padding: 8 } },
          x: { grid: { display: false }, ticks: { padding: 8 } }
        }
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

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close') || e.target.closest('.lightbox-close')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
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
        { name: 'Gunung Galunggung Crater Trek', time: 'Morning · 3-4 hours', icon: '🏔️', desc: 'Hike to the stunning crater lake' },
        { name: 'Situ Gede Lake Visit', time: 'Morning · 2 hours', icon: '🌊', desc: 'Peaceful lake with boat rides' },
        { name: 'Cipatujah Beach Sunset', time: 'Afternoon · 3 hours', icon: '🌅', desc: 'Watch the golden Indian Ocean sunset' },
        { name: 'Curug Dengdeng Waterfall', time: 'Morning · 2-3 hours', icon: '💧', desc: 'Hidden jungle waterfall adventure' },
        { name: 'Rice Terrace Photography', time: 'Morning · 2 hours', icon: '🌾', desc: 'Capture stunning terraced landscapes' },
      ],
      culture: [
        { name: 'Kampung Naga Village Tour', time: 'Morning · 3-4 hours', icon: '🏛️', desc: 'Walk through living history' },
        { name: 'Batik Workshop Experience', time: 'Afternoon · 2-3 hours', icon: '🎨', desc: 'Create your own batik masterpiece' },
        { name: 'Traditional Dance Show', time: 'Evening · 1.5 hours', icon: '💃', desc: 'Experience Sundanese performing arts' },
        { name: 'Heritage Museum Visit', time: 'Morning · 1.5 hours', icon: '🏛️', desc: 'Discover centuries of history' },
      ],
      food: [
        { name: 'Nasi Tutug Oncom Breakfast', time: 'Morning · 1 hour', icon: '🍚', desc: 'Iconic Tasikmalaya signature dish' },
        { name: 'Kupat Tahu Street Food Tour', time: 'Afternoon · 2 hours', icon: '🍜', desc: 'Taste authentic street flavors' },
        { name: 'Traditional Cooking Class', time: 'Afternoon · 3 hours', icon: '👨‍🍳', desc: 'Learn Sundanese cooking secrets' },
        { name: 'Night Market Food Walk', time: 'Evening · 2 hours', icon: '🛒', desc: 'Explore local night market delicacies' },
      ],
      craft: [
        { name: 'Rajapolah Craft Center Visit', time: 'Morning · 2-3 hours', icon: '🧺', desc: 'See master artisans at work' },
        { name: 'Bamboo Weaving Workshop', time: 'Afternoon · 2 hours', icon: '🎋', desc: 'Try your hand at bamboo weaving' },
        { name: 'Artisan Studio Tour', time: 'Morning · 2 hours', icon: '🖌️', desc: 'Meet the creative minds behind the crafts' },
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

      // Fisher-Yates shuffle
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
        if (dayActivities.length > 0) {
          this.itinerary.push({ day: d + 1, activities: dayActivities });
        }
      }
      this.generated = true;
    }
  }));
});
