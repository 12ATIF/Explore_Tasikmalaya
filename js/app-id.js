// ============================================
// EXPLORE TASIKMALAYA — Indonesian Travel Planner
// ============================================

document.addEventListener('alpine:init', () => {
  Alpine.data('travelPlannerID', () => ({
    days: '2',
    interest: 'all',
    itinerary: [],
    generated: false,

    activities: {
      nature: [
        { name: 'Pendakian Kawah Gunung Galunggung', time: 'Pagi · 3-4 jam', icon: '🏔️', desc: 'Mendaki ke danau kawah yang menakjubkan' },
        { name: 'Kunjungan Situ Gede', time: 'Pagi · 2 jam', icon: '🌊', desc: 'Danau tenang dengan perahu wisata' },
        { name: 'Sunset Pantai Cipatujah', time: 'Sore · 3 jam', icon: '🌅', desc: 'Saksikan sunset emas di Samudra Hindia' },
        { name: 'Curug Dengdeng', time: 'Pagi · 2-3 jam', icon: '💧', desc: 'Petualangan air terjun tersembunyi di hutan' },
        { name: 'Fotografi Sawah Terasering', time: 'Pagi · 2 jam', icon: '🌾', desc: 'Abadikan lanskap terasering yang menakjubkan' },
      ],
      culture: [
        { name: 'Tur Desa Kampung Naga', time: 'Pagi · 3-4 jam', icon: '🏛️', desc: 'Berjalan melewati sejarah yang hidup' },
        { name: 'Workshop Membatik', time: 'Sore · 2-3 jam', icon: '🎨', desc: 'Buat karya batik Anda sendiri' },
        { name: 'Pertunjukan Tari Tradisional', time: 'Malam · 1,5 jam', icon: '💃', desc: 'Nikmati seni pertunjukan Sunda' },
        { name: 'Kunjungan Museum Warisan', time: 'Pagi · 1,5 jam', icon: '🏛️', desc: 'Temukan sejarah berabad-abad' },
      ],
      food: [
        { name: 'Sarapan Nasi Tutug Oncom', time: 'Pagi · 1 jam', icon: '🍚', desc: 'Hidangan ikonik khas Tasikmalaya' },
        { name: 'Tur Jajanan Kupat Tahu', time: 'Sore · 2 jam', icon: '🍜', desc: 'Rasakan cita rasa jajanan asli' },
        { name: 'Kelas Memasak Tradisional', time: 'Sore · 3 jam', icon: '👨‍🍳', desc: 'Pelajari rahasia masakan Sunda' },
        { name: 'Wisata Pasar Malam', time: 'Malam · 2 jam', icon: '🛒', desc: 'Jelajahi aneka kuliner pasar malam' },
      ],
      craft: [
        { name: 'Kunjungan Sentra Kerajinan Rajapolah', time: 'Pagi · 2-3 jam', icon: '🧺', desc: 'Lihat pengrajin ahli bekerja' },
        { name: 'Workshop Anyaman Bambu', time: 'Sore · 2 jam', icon: '🎋', desc: 'Coba menganyam bambu sendiri' },
        { name: 'Tur Studio Pengrajin', time: 'Pagi · 2 jam', icon: '🖌️', desc: 'Temui kreator di balik kerajinan' },
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
