import { ref } from 'vue';

export const canInstallPWA = ref(false);
export let deferredPrompt = null;

export function isMobile() {
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isInstallable() {
  return window.matchMedia('(display-mode: browser)').matches && isMobile();
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  canInstallPWA.value = true;
});

