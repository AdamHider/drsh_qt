import { ref } from 'vue';
import { useUserStore } from '../stores/user'


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = ref({});

export async function loadAudio(url, key) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    audioBuffers.value[key] = audioBuffer;
  } catch (error) {
    console.error(`Ошибка загрузки аудиофайла ${url}:`, error);
  }
}

export function playAudio(key) {
  const { user } = useUserStore()
  const buffer = audioBuffers.value[key];
  if(user.active.data.settings.soundFX?.value !== '1') return
  if (!buffer) {
    console.warn(`Аудиофайл с ключом '${key}' не загружен.`);
    return;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
}

// Полезно для остановки всех звуков, если нужно
export function stopAllAudio() {
  audioContext.close().then(() => {
    // Создаем новый контекст для дальнейшего использования
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  });
}


let backgroundAudio = null;
let currentTrack = null;
/**
 * Plays a background audio track. If a track is already playing, it will stop it first.
 *
 * @param {string} trackName The name of the audio file to play (e.g., 'ambience_bg').
 */
export function playMusic(trackName) {
  // Check if a new track is requested. If it's the same as the current, do nothing.
  if (currentTrack === trackName) {
    return;
  }

  // Stop any currently playing music.
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio = null;
  }

  // Start the new music track.
  const audioPath = `/audio/${trackName}.mp3`;
  backgroundAudio = new Audio(audioPath);
  backgroundAudio.loop = true;
  backgroundAudio.play().catch(error => {
    console.error("Ошибка при воспроизведении фоновой музыки:", error);
    // This can happen if the user hasn't interacted with the page yet.
    // We might need to add a UI element to allow them to start the music.
  });
  currentTrack = trackName;
}

/**
 * Stops the background audio playback.
 */
export function stopBackgroundMusic() {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio = null;
  }
  currentTrack = null;
}
