// Локации на мастер-плане Nuanu: координаты в % взяты с сайта UNIT. Space City (тот же план, v2/index.html .plan-pin), тексты на 9 языков.
// mx/my — точка на мобильном кадре plan-m.webp (до 768), привязка по совпадению картинок; m/w больше не используются
export const PINS = [
  { k: 'school', x: 51.98, y: 27.98, mx: 52.09, my: 36.44, m: 1 },
  { k: 'gallery', x: 36.01, y: 34.6, mx: 30.93, my: 40.69 },
  { k: 'alpaca', x: 67.54, y: 34.27, mx: 72.71, my: 40.47, w: 1 },
  { k: 'aurora', x: 79.72, y: 34.27, mx: 88.85, my: 40.47, m: 1 },
  { k: 'rest', x: 58.59, y: 45.73, mx: 60.85, my: 47.83, m: 1 },
  { k: 'shop', x: 83.99, y: 47.02, mx: 94.5, my: 48.66 },
  { k: 'luna', x: 43.91, y: 53.31, mx: 41.4, my: 52.7, m: 1 },
  { k: 'retreat', x: 67.54, y: 62.98, mx: 72.71, my: 58.9 },
  { k: 'cave', x: 36.99, y: 68.95, mx: 32.23, my: 62.73 },
  { k: 'music', x: 23.43, y: 36.05, mx: 14.26, my: 41.62 },
  { k: 'beer', x: 17.3, y: 58.95, mx: 6.14, my: 56.31 },
  { k: 'club', x: 73.02, y: 47.66, mx: 79.97, my: 49.07 },
  { k: 'venue', x: 28.91, y: 35.56, mx: 21.52, my: 41.30 },
  { k: 'wedding', x: 22.06, y: 61.53, mx: 12.45, my: 57.97 },
  { k: 'thk', x: 47.78, y: 68.47, mx: 46.53, my: 62.42 }
];
export const UNIT_PIN = { x: 75.7, y: 19.7, mx: 83.52, my: 31.12 }; // UNIT. Space City
export const BSO_PIN = { x: 21.23, y: 20.8, mx: 11.35, my: 31.83 }; // Black Sands Oasis: точка с сайта BSO (window.BSO_NUANU_BADGE_PIN), тот же план
export const PT = {
  en: { label: 'Locations on the Nuanu master plan', school: 'International school', gallery: 'Art gallery', alpaca: 'Alpaca park', aurora: 'Aurora media park', rest: 'Restaurants', shop: 'Shopping center', luna: 'Luna Beach Club', retreat: 'Retreat center', cave: 'Pool in the Utopia cave', music: 'Music studio', beer: 'Beer Garden restaurant', club: 'Night club', venue: 'Event art venue', wedding: 'Wedding hall', thk: 'THK Tower' },
  ru: { label: 'Локации на мастер‑плане Nuanu', school: 'Международная школа', gallery: 'Арт‑галерея', alpaca: 'Альпака‑парк', aurora: 'Медиапарк Aurora', rest: 'Рестораны', shop: 'Торговый центр', luna: 'Luna Beach Club', retreat: 'Ретритный центр', cave: 'Бассейн в пещере Utopia', music: 'Музыкальная студия', beer: 'Ресторан Beer Garden', club: 'Ночной клуб', venue: 'Арт‑площадка для событий', wedding: 'Венчальный зал', thk: 'THK Tower' },
  id: { label: 'Lokasi di rencana induk Nuanu', school: 'Sekolah internasional', gallery: 'Galeri seni', alpaca: 'Taman alpaka', aurora: 'Taman media Aurora', rest: 'Restoran', shop: 'Pusat perbelanjaan', luna: 'Luna Beach Club', retreat: 'Pusat retret', cave: 'Kolam di gua Utopia', music: 'Studio musik', beer: 'Restoran Beer Garden', club: 'Klub malam', venue: 'Ruang seni untuk acara', wedding: 'Aula pernikahan', thk: 'THK Tower' },
  fr: { label: 'Lieux sur le plan directeur de Nuanu', school: 'École internationale', gallery: 'Galerie d’art', alpaca: 'Parc des alpagas', aurora: 'Parc multimédia Aurora', rest: 'Restaurants', shop: 'Centre commercial', luna: 'Luna Beach Club', retreat: 'Centre de ressourcement', cave: 'Piscine de la grotte Utopia', music: 'Studio de musique', beer: 'Restaurant Beer Garden', club: 'Boîte de nuit', venue: 'Lieu d’art événementiel', wedding: 'Salle de mariage', thk: 'THK Tower' },
  es: { label: 'Lugares en el plan maestro de Nuanu', school: 'Escuela internacional', gallery: 'Galería de arte', alpaca: 'Parque de alpacas', aurora: 'Parque multimedia Aurora', rest: 'Restaurantes', shop: 'Centro comercial', luna: 'Luna Beach Club', retreat: 'Centro de retiros', cave: 'Piscina en la cueva Utopia', music: 'Estudio de música', beer: 'Restaurante Beer Garden', club: 'Club nocturno', venue: 'Espacio artístico para eventos', wedding: 'Salón de bodas', thk: 'THK Tower' },
  uk: { label: 'Локації на майстер‑плані Nuanu', school: 'Міжнародна школа', gallery: 'Арт‑галерея', alpaca: 'Альпака‑парк', aurora: 'Медіапарк Aurora', rest: 'Ресторани', shop: 'Торговий центр', luna: 'Luna Beach Club', retreat: 'Ретритний центр', cave: 'Басейн у печері Utopia', music: 'Музична студія', beer: 'Ресторан Beer Garden', club: 'Нічний клуб', venue: 'Арт‑майданчик для подій', wedding: 'Весільна зала', thk: 'THK Tower' },
  it: { label: 'Luoghi sul masterplan di Nuanu', school: 'Scuola internazionale', gallery: 'Galleria d’arte', alpaca: 'Parco degli alpaca', aurora: 'Parco multimediale Aurora', rest: 'Ristoranti', shop: 'Centro commerciale', luna: 'Luna Beach Club', retreat: 'Centro ritiri', cave: 'Piscina nella grotta Utopia', music: 'Studio musicale', beer: 'Ristorante Beer Garden', club: 'Night club', venue: 'Spazio d’arte per eventi', wedding: 'Sala matrimoni', thk: 'THK Tower' },
  tr: { label: 'Nuanu master planındaki konumlar', school: 'Uluslararası okul', gallery: 'Sanat galerisi', alpaca: 'Alpaka parkı', aurora: 'Aurora medya parkı', rest: 'Restoranlar', shop: 'Alışveriş merkezi', luna: 'Luna Beach Club', retreat: 'Retreat merkezi', cave: 'Utopia mağarasında havuz', music: 'Müzik stüdyosu', beer: 'Beer Garden restoranı', club: 'Gece kulübü', venue: 'Etkinlik sanat alanı', wedding: 'Düğün salonu', thk: 'THK Tower' },
  nl: { label: 'Locaties op het masterplan van Nuanu', school: 'Internationale school', gallery: 'Kunstgalerie', alpaca: 'Alpacapark', aurora: 'Mediapark Aurora', rest: 'Restaurants', shop: 'Winkelcentrum', luna: 'Luna Beach Club', retreat: 'Retreatcentrum', cave: 'Zwembad in de Utopia‑grot', music: 'Muziekstudio', beer: 'Restaurant Beer Garden', club: 'Nachtclub', venue: 'Kunstlocatie voor events', wedding: 'Trouwzaal', thk: 'THK Tower' }
};
