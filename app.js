// Simple Audiobook Player
const CHAPTERS = [
    { title: 'Chapter 1: The Rise of the Machines', file: 'audio/chapter_01.mp3' },
    { title: 'Chapter 2: From Factory Arms to Humanoids', file: 'audio/chapter_02.mp3' },
    { title: 'Chapter 3: The Key Players', file: 'audio/chapter_03.mp3' },
    { title: 'Chapter 4: The Warehouse Revolution', file: 'audio/chapter_04.mp3' },
    { title: 'Chapter 5: Robots on the Road', file: 'audio/chapter_05.mp3' },
    { title: 'Chapter 6: The Farm of Tomorrow', file: 'audio/chapter_06.mp3' },
    { title: 'Chapter 7: Metal Surgeons and Robot Nurses', file: 'audio/chapter_07.mp3' },
    { title: 'Chapter 8: The Home Invasion', file: 'audio/chapter_08.mp3' },
    { title: 'Chapter 9: Brains for Bots', file: 'audio/chapter_09.mp3' },
    { title: 'Chapter 10: Swarm Intelligence', file: 'audio/chapter_10.mp3' },
    { title: 'Chapter 11: The Battlefield Transformed', file: 'audio/chapter_11.mp3' },
    { title: 'Chapter 12: The Great Displacement', file: 'audio/chapter_12.mp3' },
    { title: 'Chapter 13: New Jobs in the Age of Robots', file: 'audio/chapter_13.mp3' },
    { title: 'Chapter 14: The Economics of Automation', file: 'audio/chapter_14.mp3' },
    { title: 'Chapter 15: The Cost of Living with Robots', file: 'audio/chapter_15.mp3' },
    { title: 'Chapter 16: The Ethics of Artificial Agency', file: 'audio/chapter_16.mp3' },
    { title: 'Chapter 17: Regulating the Revolution', file: 'audio/chapter_17.mp3' },
    { title: 'Chapter 18: Love, Care, and Companionship', file: 'audio/chapter_18.mp3' },
    { title: 'Chapter 19: The World of 2035', file: 'audio/chapter_19.mp3' },
    { title: 'Chapter 20: Choosing Our Future', file: 'audio/chapter_20.mp3' },
    { title: 'Appendix A: Major Robotics Companies', file: 'audio/appendix_a.mp3' },
    { title: 'Appendix B: Timeline of Robotics Development', file: 'audio/appendix_b.mp3' },
    { title: 'Appendix C: Glossary of Robotics Terms', file: 'audio/appendix_c.mp3' },
    { title: 'Appendix D: Key Research Institutions', file: 'audio/appendix_d.mp3' },
    { title: 'Appendix E: Further Reading and Resources', file: 'audio/appendix_e.mp3' }
];

let currentChapter = 0;
let isPlaying = false;
let audio = null;

function initPlayer() {
    audio = document.getElementById('audio-player');
    
    // Setup audio event listeners
    audio.addEventListener('ended', onAudioEnded);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('error', onAudioError);
    
    // Setup button listeners
    document.getElementById('play-pause-btn').addEventListener('click', togglePlay);
    document.getElementById('next-btn').addEventListener('click', playNext);
    document.getElementById('prev-btn').addEventListener('click', playPrevious);
    document.getElementById('progress-bar').addEventListener('click', seekAudio);
    
    // Render playlist
    renderPlaylist();
    
    // Load first chapter
    loadChapter(0);
}

function renderPlaylist() {
    const playlist = document.getElementById('playlist');
    playlist.innerHTML = CHAPTERS.map((chapter, index) => `
        <li data-index="${index}" class="${index === 0 ? 'active' : ''}">
            <span class="chapter-title">${chapter.title}</span>
            <span class="chapter-duration">--:--</span>
        </li>
    `).join('');
    
    // Add click handlers
    playlist.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            loadChapter(index);
            playAudio();
        });
    });
}

function loadChapter(index) {
    currentChapter = index;
    const chapter = CHAPTERS[index];
    
    // Update audio source
    audio.src = chapter.file;
    audio.load();
    
    // Update display
    document.getElementById('current-track').textContent = chapter.title;
    document.getElementById('current-progress').textContent = 'Ready to play';
    
    // Update active state in playlist
    document.querySelectorAll('#playlist li').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    // Reset progress
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('current-time').textContent = '0:00';
    document.getElementById('total-time').textContent = '--:--';
}

function playAudio() {
    if (!audio.src) {
        loadChapter(0);
    }
    
    audio.play().then(() => {
        isPlaying = true;
        updatePlayButton();
    }).catch(err => {
        console.error('Play failed:', err);
        alert('Failed to play audio. Please try again.');
    });
}

function pauseAudio() {
    audio.pause();
    isPlaying = false;
    updatePlayButton();
}

function togglePlay() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function playNext() {
    if (currentChapter < CHAPTERS.length - 1) {
        loadChapter(currentChapter + 1);
        playAudio();
    }
}

function playPrevious() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else if (currentChapter > 0) {
        loadChapter(currentChapter - 1);
        playAudio();
    }
}

function onAudioEnded() {
    // Auto-advance to next chapter
    if (currentChapter < CHAPTERS.length - 1) {
        loadChapter(currentChapter + 1);
        playAudio();
    } else {
        isPlaying = false;
        updatePlayButton();
    }
}

function onAudioError(e) {
    console.error('Audio error:', e);
    alert('Error loading audio. Please check your connection.');
}

function updateProgress() {
    const current = audio.currentTime;
    const duration = audio.duration || 0;
    
    document.getElementById('current-time').textContent = formatTime(current);
    
    const percent = duration > 0 ? (current / duration) * 100 : 0;
    document.getElementById('progress-fill').style.width = percent + '%';
}

function updateDuration() {
    const duration = audio.duration;
    document.getElementById('total-time').textContent = formatTime(duration);
    
    // Update playlist duration
    const item = document.querySelector(`#playlist li[data-index="${currentChapter}"]`);
    if (item) {
        item.querySelector('.chapter-duration').textContent = formatTime(duration);
    }
}

function seekAudio(e) {
    const rect = document.getElementById('progress-bar').getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * audio.duration;
    audio.currentTime = time;
}

function updatePlayButton() {
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initPlayer);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            playNext();
            break;
        case 'ArrowLeft':
            playPrevious();
            break;
    }
});
