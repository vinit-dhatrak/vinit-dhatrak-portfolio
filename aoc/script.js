// AoC 2025 Terminal Controller

document.addEventListener('DOMContentLoaded', () => {
    console.log('System Initialized. Welcome to AoC 2025.');

    // Check if we are on the main dashboard or a specific day
    if (document.querySelector('.calendar-grid')) {
        initializeDashboard();
    } else if (document.querySelector('.day-view')) {
        initializeDayView();
    }
});

function initializeDashboard() {
    const grid = document.querySelector('.calendar-grid');
    // We will generate the grid dynamically if it's empty, 
    // but for now we might just let HTML handle it or enhance it here.

    const cards = document.querySelectorAll('.day-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playHoverSound();
        });
    });
}

function initializeDayView() {
    const runBtn = document.getElementById('run-btn');
    const inputArea = document.getElementById('puzzle-input');
    const outputLog = document.getElementById('output-log');

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            const input = inputArea.value;
            if (!input.trim()) {
                logOutput('Error: No input detected.', 'error');
                return;
            }

            logOutput('System: Processing input...', 'info');

            // This is where we will hook into the specific day's solver
            // For now, just simulate work
            runSimulation();
        });
    }
}

function logOutput(message, type = 'info') {
    const log = document.getElementById('output-log');
    const line = document.createElement('div');
    line.textContent = `> ${message}`;

    if (type === 'error') {
        line.style.color = 'var(--terminal-alert)';
    } else if (type === 'success') {
        line.style.color = 'var(--terminal-text)';
    }

    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
}

function runSimulation() {
    // Placeholder for visualization logic
    const viz = document.getElementById('viz-canvas');
    if (viz) {
        viz.innerHTML = '<div class="blink">PROCESSING...</div>';
        setTimeout(() => {
            viz.innerHTML = '<div style="color: var(--terminal-text)">[VISUALIZATION PLACEHOLDER]</div>';
            logOutput('Solution found: [PENDING IMPLEMENTATION]', 'success');
        }, 1500);
    }
}

// Optional: Sound effects for that extra retro feel
function playHoverSound() {
    // Placeholder for future sound implementation
}
