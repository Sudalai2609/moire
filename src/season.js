import { scene } from './world.js';

function getSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

const seasonColors = {
  spring: 0xe8ddd0,
  summer: 0xf0e8d8,
  autumn: 0xe0d0b8,
  winter: 0xe0e4e8
};

export function applySeason() {
  const season = getSeason();
  scene.background.setHex(seasonColors[season]);
}
