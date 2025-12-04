// AoC 2025 Terminal Controller

document.addEventListener('DOMContentLoaded', () => {
    console.log('System Initialized. Welcome to AoC 2025.');

    if (document.querySelector('.calendar-grid')) {
        initializeDashboard();
    } else if (document.querySelector('.day-layout')) {
        initializeDayView();
    }
});

function initializeDashboard() {
    const cards = document.querySelectorAll('.day-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Optional: hover sound effect
        });
    });
}

function initializeDayView() {
    const runPart1 = document.getElementById('run-part1');
    const runPart2 = document.getElementById('run-part2');

    if (runPart1) {
        runPart1.addEventListener('click', () => runSolver(1));
    }
    if (runPart2) {
        runPart2.addEventListener('click', () => runSolver(2));
    }
}

function runSolver(part) {
    const input = document.getElementById('puzzle-input').value;
    const statusLog = document.getElementById('status-log');
    const resultBox = document.getElementById(`part${part}-result`);
    const vizContainer = document.getElementById('viz-canvas');

    if (!input.trim()) {
        setStatus('Error: No input detected.', 'error');
        return;
    }

    setStatus(`Running Part ${part}...`, 'info');

    // Determine current day from URL
    const path = window.location.pathname;
    const dayMatch = path.match(/day-(\d+)/);
    const dayId = dayMatch ? `day${dayMatch[1]}` : null;

    if (dayId && window.solutions && window.solutions[dayId]) {
        try {
            const solver = window.solutions[dayId];
            let result;

            if (part === 1 && solver.part1) {
                result = solver.part1(input);
            } else if (part === 2 && solver.part2) {
                result = solver.part2(input);
            } else {
                result = 'Not Implemented';
            }

            resultBox.value = result;
            setStatus(`Part ${part} complete!`, 'success');

            // Start visualization if the solver supports it
            if (solver.startVisualization && vizContainer) {
                // Clear any existing content
                vizContainer.innerHTML = '';
                solver.startVisualization(vizContainer, part);
            }
        } catch (e) {
            setStatus(`Error: ${e.message}`, 'error');
            console.error(e);
        }
    } else {
        setStatus(`Solver for ${dayId} not found.`, 'error');
    }
}

function setStatus(message, type = 'info') {
    const statusLog = document.getElementById('status-log');
    if (!statusLog) return;

    statusLog.textContent = message;
    statusLog.style.color = type === 'error' ? 'var(--terminal-alert)' :
        type === 'success' ? 'var(--terminal-text)' :
            'var(--terminal-dim)';
}
