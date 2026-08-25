let currentLang = localStorage.getItem("lang") || "ru";
export let plants = [];
export let photos = [];

export function getCurrentLang() {
  return currentLang;
}

export function setCurrentLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
}
