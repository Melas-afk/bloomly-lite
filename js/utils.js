export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function getPlantsNeedingWatering(plants) {
  return plants.filter(p => {
    const diff = (Date.now() - p.lastWatered.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= p.frequency;
  });
}
