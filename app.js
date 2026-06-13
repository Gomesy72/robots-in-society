// Audiobook Player Application
const CHAPTERS = [
    { id: 'chapter_01', title: 'Chapter 1: The Rise of the Machines', file: 'audio/chapter_01.mp3' },
    { id: 'chapter_02', title: 'Chapter 2: From Factory Arms to Humanoids', file: 'audio/chapter_02.mp3' },
    { id: 'chapter_03', title: 'Chapter 3: The Key Players', file: 'audio/chapter_03.mp3' },
    { id: 'chapter_04', title: 'Chapter 4: The Warehouse Revolution', file: 'audio/chapter_04.mp3' },
    { id: 'chapter_05', title: 'Chapter 5: Robots on the Road', file: 'audio/chapter_05.mp3' },
    { id: 'chapter_06', title: 'Chapter 6: The Farm of Tomorrow', file: 'audio/chapter_06.mp3' },
    { id: 'chapter_07', title: 'Chapter 7: Metal Surgeons and Robot Nurses', file: 'audio/chapter_07.mp3' },
    { id: 'chapter_08', title: 'Chapter 8: The Home Invasion', file: 'audio/chapter_08.mp3' },
    { id: 'chapter_09', title: 'Chapter 9: Brains for Bots', file: 'audio/chapter_09.mp3' },
    { id: 'chapter_10', title: 'Chapter 10: Swarm Intelligence', file: 'audio/chapter_10.mp3' },
    { id: 'chapter_11', title: 'Chapter 11: The Battlefield Transformed', file: 'audio/chapter_11.mp3' },
    { id: 'chapter_12', title: 'Chapter 12: The Great Displacement', file: 'audio/chapter_12.mp3' },
    { id: 'chapter_13', title: 'Chapter 13: New Jobs in the Age of Robots', file: 'audio/chapter_13.mp3' },
    { id: 'chapter_14', title: 'Chapter 14: The Economics of Automation', file: 'audio/chapter_14.mp3' },
    { id: 'chapter_15', title: 'Chapter 15: The Cost of Living with Robots', file: 'audio/chapter_15.mp3' },
    { id: 'chapter_16', title: 'Chapter 16: The Ethics of Artificial Agency', file: 'audio/chapter_16.mp3' },
    { id: 'chapter_17', title: 'Chapter 17: Regulating the Revolution', file: 'audio/chapter_17.mp3' },
    { id: 'chapter_18', title: 'Chapter 18: Love, Care, and Companionship', file: 'audio/chapter_18.mp3' },
    { id: 'chapter_19', title: 'Chapter 19: The World of 2035', file: 'audio/chapter_19.mp3' },
    { id: 'chapter_20', title: 'Chapter 20: Choosing Our Future', file: 'audio/chapter_20.mp3' },
    { id: 'appendix_a', title: 'Appendix A: Major Robotics Companies', file: 'audio/appendix_a.mp3' },
    { id: 'appendix_b', title: 'Appendix B: Timeline of Robotics Development', file: 'audio/appendix_b.mp3' },
    { id: 'appendix_c', title: 'Appendix C: Glossary of Robotics Terms', file: 'audio/appendix_c.mp3' },
    { id: 'appendix_d', title: 'Appendix D: Key Research Institutions', file: 'audio/appendix_d.mp3' },
    { id: 'appendix_e', title: 'Appendix E: Further Reading and Resources', file: 'audio/appendix_e.mp3' }
];

class AudiobookPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audio-player');
        this.currentTrackEl = document.getElementById('current-track');
        this.currentProgressEl = document.getElementById('current-progress');
        this.playlistEl = document.getElementById('playlist');
        this.currentChapter = 0;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.renderPlaylist();
        this.setupEventListeners();
        this.loadChapter(0);
    }
    
    renderPlaylist() {
        this.playlistEl.innerHTML = CHAPTERS.map((chapter, index) => `
            <li data-index="${index}" class="${index === 0 ? 'active' : ''}">
                <div class="play-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-duration">--:--</span>
            </li>
        `).join('');
        
        // Add click handlers
        this.playlistEl.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.loadChapter(index);
                this.play();
            });
        });
    }
    
    setupEventListeners() {
        this.audioPlayer.addEventListener('ended', () => {
            this.playNext();
        });
        
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
    }
    
    loadChapter(index) {
        this.currentChapter = index;
        const chapter = CHAPTERS[index];
        
        this.audioPlayer.src = chapter.file;
        this.currentTrackEl.textContent = chapter.title;
        this.currentProgressEl.textContent = 'Ready to play';
        
        // Update active state in playlist
        this.playlistEl.querySelectorAll('li').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        this.audioPlayer.load();
    }
    
    play() {
        this.audioPlayer.play().then(() => {
            this.isPlaying = true;
        }).catch(err => {
            console.error('Playback failed:', err);
        });
    }
    
    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
    }
    
    playNext() {
        if (this.currentChapter < CHAPTERS.length - 1) {
            this.loadChapter(this.currentChapter + 1);
            this.play();
        }
    }
    
    playPrevious() {
        if (this.currentChapter > 0) {
            this.loadChapter(this.currentChapter - 1);
            this.play();
        }
    }
    
    updateProgress() {
        const current = this.formatTime(this.audioPlayer.currentTime);
        const duration = this.formatTime(this.audioPlayer.duration || 0);
        this.currentProgressEl.textContent = `${current} / ${duration}`;
    }
    
    updateDuration() {
        const chapter = CHAPTERS[this.currentChapter];
        const duration = this.formatTime(this.audioPlayer.duration);
        
        // Update duration in playlist
        const item = this.playlistEl.querySelector(`li[data-index="${this.currentChapter}"]`);
        if (item) {
            item.querySelector('.chapter-duration').textContent = duration;
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const player = new AudiobookPlayer();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (player.isPlaying) {
                    player.pause();
                } else {
                    player.play();
                }
                break;
            case 'ArrowRight':
                player.playNext();
                break;
            case 'ArrowLeft':
                player.playPrevious();
                break;
        }
    });
});

// Service Worker for offline support (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
