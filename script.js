// --------- Song data (edit names to match your mp3 files) ----------
const songs = [
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    file: "song1.mp3"
  },
  {
    title: "Ordinary",
    artist: "Alex Warren",
    file: "song2.mp3"
  },
  {
    title: "Someone Like You",
    artist: "Adele",
    file: "song3.mp3"
  }
];

let currentIndex = 0;

// --------- DOM elements ----------
const audio = document.getElementById("audio");
const titleEl = document.getElementById("song-title");
const artistEl = document.getElementById("song-artist");
const coverArt = document.getElementById("cover-art");
const coverLetter = document.getElementById("cover-letter");

const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const volumeSlider = document.getElementById("volume");
const player = document.querySelector(".player");

// --------- Load & display a song ----------
function loadSong(index) {
  const song = songs[index];
  if (!song) return;

  audio.src = song.file;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;

  // First letter of title as "logo"
  coverLetter.textContent = song.title.charAt(0).toUpperCase() || "♪";

  audio.load();
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
  player.classList.add("playing");
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
  player.classList.remove("playing");
}

function togglePlay() {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

// --------- Time / progress bar ----------
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

audio.addEventListener("loadedmetadata", () => {
  progress.max = audio.duration || 0;
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progress.value = audio.currentTime || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

// --------- Volume ----------
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

// --------- Controls ----------
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

audio.addEventListener("ended", nextSong);

// --------- Keyboard shortcuts ----------
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Space -> play/pause
  if (key === " " || key === "Spacebar") {
    event.preventDefault();
    togglePlay();
    return;
  }

  // Left/Right arrow: seek 5s
  if (key === "ArrowRight") {
    audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || audio.currentTime);
    return;
  }

  if (key === "ArrowLeft") {
    audio.currentTime = Math.max(audio.currentTime - 5, 0);
    return;
  }

  // Up/Down arrow: volume
  if (key === "ArrowUp") {
    event.preventDefault();
    audio.volume = Math.min(audio.volume + 0.05, 1);
    volumeSlider.value = audio.volume.toFixed(2);
    return;
  }

  if (key === "ArrowDown") {
    event.preventDefault();
    audio.volume = Math.max(audio.volume - 0.05, 0);
    volumeSlider.value = audio.volume.toFixed(2);
    return;
  }
});

// --------- Init ----------
audio.volume = volumeSlider.value;
loadSong(currentIndex);
