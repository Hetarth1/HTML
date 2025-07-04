document.addEventListener("DOMContentLoaded", () => {
  const audio = new Audio();
  const playPauseBtn = document.querySelector(".fa-circle-play").parentElement;
  const progress = document.getElementById("progress");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration");
  const albumArt = document.querySelector(".song-img");
  const artistName = document.getElementById("artist-name");
  const songName = document.getElementById("song-name");

  const playIcon = `<i class="fa-regular fa-circle-play"></i>`;
  const pauseIcon = `<i class="fa-regular fa-circle-pause"></i>`;

  const defaultTracks = [
    {
      src: "./All The Stars - Kendrick Lamar.mp3",
      name: "All The Stars",
      artist: ["Kendrick Lamar", "SZA"],
    },
    {
      src: "./Dil Diyan Gallan.mp3",
      name: "Dil Diyan Gallan",
      artist: "Atif Aslam",
    },
    {
      src: "./Iktara.mp3",
      name: "Iktara",
      artist: ["Amit Trivedi", "Kavita Seth"],
    },
    {
      src: "./Agar Tum Saath Ho.mp3",
      name: "Agar Tum Saath Ho",
      artist: ["A.R. Rahman", "Alka Yagnik", "Arijit Singh"],
    },
    {
      src: "./Coast.mp3",
      name: "Coast",
      artist: "Hailee Steinfeld",
    },
    {
      src: "./Kesariya.mp3",
      name: "Kesariya",
      artist: ["Pritam", "Arijit Singh"],
    },
    {
      src: "./Apna Bana Le.mp3",
      name: "Apna Bana Le",
      artist: "Arijit Singh",
    },
    {
      src: "./Tera Hone Laga Hoon.mp3",
      name: "Tera Hone Laga Hoon",
      artist: ["Atif Aslam", "Pritam"],
    },
    {
      src: "./Channa Mereya (Unplugged).mp3",
      name: "Channa Mereya (Unplugged)",
      artist: ["Pritam", "Arijit Singh"],
    },
  ];
  let currentTrackIndex = 0;

  function loadSong(track) {
    audio.src = track.src;
    audio.load();
    songName.textContent = track.name;
    artistName.textContent = Array.isArray(track.artist)
      ? track.artist.join(", ")
      : track.artist;
  }

  loadSong(defaultTracks[currentTrackIndex]);

  function formatTime(time) {
    const mins = Math.floor(time / 60) || 0;
    const secs = Math.floor(time % 60) || 0;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  }

  audio.addEventListener("loadedmetadata", () => {
    if (!isNaN(audio.duration)) {
      progress.max = 100;
      durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  // Update time and progress bar
  audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.value = percent;
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
  });

  // Seek via progress bar
  progress.addEventListener("input", () => {
    if (!isNaN(audio.duration)) {
      const seekTime = (progress.value / 100) * audio.duration;
      if (isFinite(seekTime)) {
        audio.currentTime = seekTime;
      }
    }
  });

  // Play/Pause toggle via button
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().catch((error) => console.error("Playback failed:", error));
    } else {
      audio.pause();
    }
  });

  // UI updates when playing
  audio.addEventListener("play", () => {
    playPauseBtn.innerHTML = pauseIcon;
    albumArt?.classList.add("spin");
  });

  // UI updates when paused
  audio.addEventListener("pause", () => {
    playPauseBtn.innerHTML = playIcon;
    albumArt?.classList.remove("spin");
  });

  // Move to next song when current song ends
  audio.addEventListener("ended", () => {
    currentTrackIndex = (currentTrackIndex + 1) % defaultTracks.length; // Loop to start if at end
    loadSong(defaultTracks[currentTrackIndex]);
    audio.play().catch((error) => console.error("Playback failed:", error));
  });

  // Keyboard shortcut: 'k', 'Enter', or 'Space' to toggle play
  document.addEventListener("keydown", (e) => {
    if (e.key === "k" || e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent spacebar from scrolling
      if (audio.paused) {
        audio.play().catch((error) => console.error("Playback failed:", error));
      } else {
        audio.pause();
      }
    }
  });

  // Handle previous and next buttons
  const prevBtn = document.querySelector(".fa-backward-step").parentElement;
  const nextBtn = document.querySelector(".fa-forward-step").parentElement;

  prevBtn.addEventListener("click", () => {
    currentTrackIndex =
      currentTrackIndex === 0
        ? defaultTracks.length - 1
        : currentTrackIndex - 1; // Loop to end if at start
    loadSong(defaultTracks[currentTrackIndex]);
    audio.play().catch((error) => console.error("Playback failed:", error));
  });

  nextBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % defaultTracks.length; // Loop to start if at end
    loadSong(defaultTracks[currentTrackIndex]);
    audio.play().catch((error) => console.error("Playback failed:", error));
  });
});
