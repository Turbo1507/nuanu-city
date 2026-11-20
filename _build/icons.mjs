const I = {
  school: '<path d="M2 9.5 12 4.5l10 5-10 5z"/><path d="M6 11.5V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.5"/>',
  gallery: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="m3 16 5-5 4.5 4.5 3-3L21 18"/><circle cx="15.5" cy="9" r="1.5"/>',
  alpaca: '<circle cx="6.5" cy="9.5" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17.5" cy="9.5" r="1.8"/><path d="M8 17c0-2.6 1.8-4.5 4-4.5s4 1.9 4 4.5c0 1.6-1.6 2.5-4 2.5s-4-.9-4-2.5z"/>',
  aurora: '<path d="M12 3v4.5M12 16.5V21M3 12h4.5M16.5 12H21M5.6 5.6l3 3M15.4 15.4l3 3M5.6 18.4l3-3M15.4 8.6l3-3"/>',
  rest: '<path d="M5.5 3v5.5a2.5 2.5 0 0 0 5 0V3M8 11v10"/><path d="M18 21V3c-2.2 1.2-3.5 4-3.5 8.5H18"/>',
  shop: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  luna: '<path d="M3.5 11.5a8.5 8.5 0 0 1 17 0z"/><path d="M12 11.5V20"/><path d="M3 20.5h18"/>',
  retreat: '<path d="M5 19C5 10.5 10.5 5 20 4c-.8 9.5-6 15-15 15z"/><path d="m5 19 7.5-7.5"/>',
  cave: '<path d="M3 9.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0M3 15c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0"/>',
  music: '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  beer: '<path d="M5 8.5h10V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M15 11h2a2 2 0 0 1 2 2v2.5a2 2 0 0 1-2 2h-2"/><path d="M5 8.5A2.8 2.8 0 0 1 9.5 6 3 3 0 0 1 15 8.5"/>',
  club: '<path d="M5 4h14l-7 8z"/><path d="M12 12v8M8 20h8"/>',
  venue: '<path d="M12 3.5 14.3 9l5.7.5-4.3 3.8 1.3 5.7-5-3-5 3 1.3-5.7L4 9.5 9.7 9z"/>',
  wedding: '<circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="14" r="5.5"/><path d="m10.5 5 1.5-1.8L13.5 5 12 6.8z"/>',
  thk: '<path d="M8.5 21 11 6h2l2.5 15M7 21h10M10 14h4M12 2.5V6"/>'
};
export const icon = k => I[k] ? `<svg class="pi" viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>` : '';
