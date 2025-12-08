/**
 * Day 02: Gift Shop - Invalid Product IDs
 * Part 1: Digit sequence repeated exactly twice (e.g., 123123)
 * Part 2: Digit sequence repeated 2+ times (e.g., 123123, 123123123, 111)
 */
window.solutions = window.solutions || {};
window.solutions.day02 = {
    p5Instance: null,
    vizData: null,

    parseInput: function (input) {
        const ranges = [];
        const parts = input.replace(/\s+/g, '').split(',');
        parts.forEach(part => {
            const match = part.match(/(\d+)-(\d+)/);
            if (match) {
                ranges.push({
                    start: BigInt(match[1]),
                    end: BigInt(match[2])
                });
            }
        });
        return ranges;
    },

    /**
     * Check if a number is a repeated pattern (for Part 2)
     * A number like 123123123 = "123" repeated 3 times
     */
    isRepeatedPatternAny: function (numStr) {
        const len = numStr.length;
        if (numStr[0] === '0') return false;

        // Try all possible base lengths that evenly divide the total length
        for (let baseLen = 1; baseLen <= len / 2; baseLen++) {
            if (len % baseLen !== 0) continue;

            const base = numStr.slice(0, baseLen);
            const repeatCount = len / baseLen;

            if (repeatCount >= 2 && base.repeat(repeatCount) === numStr) {
                return { valid: true, base, repeatCount };
            }
        }
        return { valid: false };
    },

    /**
     * Generate patterns: base repeated n times, where total digits = totalLen
     */
    generatePatternsForLength: function (totalLen, minRepeats) {
        const patterns = [];

        // For each possible base length
        for (let baseLen = 1; baseLen <= totalLen / minRepeats; baseLen++) {
            if (totalLen % baseLen !== 0) continue;
            const repeatCount = totalLen / baseLen;
            if (repeatCount < minRepeats) continue;

            // Generate all bases of this length
            const start = baseLen === 1 ? 1 : Math.pow(10, baseLen - 1);
            const end = Math.pow(10, baseLen) - 1;

            for (let base = start; base <= end; base++) {
                const baseStr = String(base);
                const pattern = baseStr.repeat(repeatCount);
                patterns.push({
                    value: BigInt(pattern),
                    base: baseStr,
                    repeatCount: repeatCount
                });
            }
        }
        return patterns;
    },

    /**
     * Find invalid IDs - Part 1 (exactly doubled)
     */
    findInvalidIdsPart1: function (ranges) {
        const invalidIds = [];

        let maxVal = 0n;
        ranges.forEach(r => { if (r.end > maxVal) maxVal = r.end; });
        const maxDigits = maxVal.toString().length;

        // Only even-length patterns (exactly doubled)
        for (let totalLen = 2; totalLen <= maxDigits; totalLen += 2) {
            const halfLen = totalLen / 2;
            const start = halfLen === 1 ? 1 : Math.pow(10, halfLen - 1);
            const end = Math.pow(10, halfLen) - 1;

            for (let base = start; base <= end; base++) {
                const baseStr = String(base);
                const pattern = BigInt(baseStr + baseStr);

                for (let i = 0; i < ranges.length; i++) {
                    if (pattern >= ranges[i].start && pattern <= ranges[i].end) {
                        invalidIds.push({
                            value: pattern,
                            base: baseStr,
                            repeatCount: 2,
                            rangeIndex: i
                        });
                        break;
                    }
                }
            }
        }
        return invalidIds;
    },

    /**
     * Find invalid IDs - Part 2 (repeated 2+ times)
     */
    findInvalidIdsPart2: function (ranges) {
        const invalidIds = [];
        const seen = new Set(); // Avoid duplicates

        let maxVal = 0n;
        ranges.forEach(r => { if (r.end > maxVal) maxVal = r.end; });
        const maxDigits = maxVal.toString().length;

        // For each total length
        for (let totalLen = 2; totalLen <= maxDigits; totalLen++) {
            const patterns = this.generatePatternsForLength(totalLen, 2);

            patterns.forEach(p => {
                const valStr = p.value.toString();
                if (seen.has(valStr)) return;

                for (let i = 0; i < ranges.length; i++) {
                    if (p.value >= ranges[i].start && p.value <= ranges[i].end) {
                        seen.add(valStr);
                        invalidIds.push({
                            value: p.value,
                            base: p.base,
                            repeatCount: p.repeatCount,
                            rangeIndex: i
                        });
                        break;
                    }
                }
            });
        }
        return invalidIds;
    },

    part1: function (input) {
        const ranges = this.parseInput(input);
        const invalidIds = this.findInvalidIdsPart1(ranges);

        let sum = 0n;
        invalidIds.forEach(id => { sum += id.value; });

        this.vizData = { ranges, invalidIds, sum, part: 1 };
        return sum.toString();
    },

    part2: function (input) {
        const ranges = this.parseInput(input);
        const invalidIds = this.findInvalidIdsPart2(ranges);

        let sum = 0n;
        invalidIds.forEach(id => { sum += id.value; });

        this.vizData = { ranges, invalidIds, sum, part: 2 };
        return sum.toString();
    },

    startVisualization: function (container, part) {
        const self = this;

        if (this.p5Instance) {
            this.p5Instance.remove();
            this.p5Instance = null;
        }

        container.style.minHeight = '450px';

        const sketch = function (p) {
            const data = self.vizData || { ranges: [], invalidIds: [], sum: 0n, part: 1 };
            const invalidIds = data.invalidIds;

            let currentIdx = 0;
            let isPlaying = false;
            let speedValue = 0.3;
            let sliderDragging = false;

            p.setup = function () {
                const w = Math.max(container.clientWidth, 500);
                const h = Math.max(container.clientHeight, 450);
                const canvas = p.createCanvas(w, h);
                canvas.parent(container);
                p.textFont('Courier New');
            };

            p.draw = function () {
                p.background(13);

                const stepsPerFrame = speedValue >= 0.95 ? invalidIds.length : Math.max(1, Math.floor(Math.pow(10, speedValue * 2)));

                if (isPlaying && currentIdx < invalidIds.length) {
                    for (let s = 0; s < stepsPerFrame && currentIdx < invalidIds.length; s++) {
                        currentIdx++;
                    }
                    if (currentIdx >= invalidIds.length) isPlaying = false;
                }

                // Title
                p.fill(0, 255, 100);
                p.textAlign(p.LEFT, p.TOP);
                p.textSize(14);
                p.text('Day 2: Invalid Product IDs (Part ' + data.part + ')', 15, 10);

                p.textSize(12);
                p.fill(0, 180, 70);
                p.text('Invalid IDs found: ' + currentIdx + ' / ' + invalidIds.length, 15, 30);

                // Running sum
                let runningSum = 0n;
                for (let i = 0; i < currentIdx; i++) {
                    runningSum += invalidIds[i].value;
                }

                p.fill(255, 50, 100);
                p.textSize(16);
                p.text('Sum: ' + runningSum.toString(), 15, 50);

                // Current invalid ID
                if (currentIdx > 0 && currentIdx <= invalidIds.length) {
                    const current = invalidIds[currentIdx - 1];
                    const centerY = p.height / 2 - 30;

                    p.fill(0, 120, 50);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(12);
                    p.text('Current Invalid ID:', p.width / 2, centerY - 50);

                    // Show base × repeatCount
                    p.textSize(28);
                    p.fill(0, 255, 100);
                    p.text(current.base, p.width / 2 - 80, centerY);

                    p.fill(255, 200, 50);
                    p.textSize(20);
                    p.text('× ' + current.repeatCount, p.width / 2 + 20, centerY);

                    p.fill(255, 50, 100);
                    p.textSize(16);
                    p.text('= ' + current.value.toString(), p.width / 2, centerY + 35);
                }

                // Recent finds list
                const listY = p.height / 2 + 40;
                p.fill(0, 100, 40);
                p.textAlign(p.LEFT, p.TOP);
                p.textSize(10);
                p.text('Recent finds:', 15, listY);

                const startIdx = Math.max(0, currentIdx - 6);
                for (let i = startIdx; i < currentIdx && i < invalidIds.length; i++) {
                    const id = invalidIds[i];
                    const y = listY + 15 + (i - startIdx) * 14;
                    p.fill(0, 200, 80);
                    p.text(id.value.toString() + ' (' + id.base + '×' + id.repeatCount + ')', 15, y);
                }

                // Controls
                const ctrlY = p.height - 55;

                p.fill(isPlaying ? p.color(255, 150, 50) : p.color(0, 180, 60));
                p.noStroke();
                p.rect(15, ctrlY, 55, 26, 5);
                p.fill(0);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(10);
                p.text(isPlaying ? 'PAUSE' : 'PLAY', 42, ctrlY + 13);

                p.fill(0, 140, 55);
                p.rect(78, ctrlY, 42, 26, 5);
                p.fill(255);
                p.text('STEP', 99, ctrlY + 13);

                p.fill(120, 50, 50);
                p.rect(127, ctrlY, 48, 26, 5);
                p.fill(255);
                p.text('RESET', 151, ctrlY + 13);

                // Speed slider
                const sliderX = 190;
                const sliderW = p.width - sliderX - 50;
                const trackY = ctrlY + 14;

                p.fill(0, 100, 40);
                p.textAlign(p.LEFT, p.CENTER);
                p.textSize(9);
                p.text('SPEED', sliderX, ctrlY + 4);

                p.fill(30, 50, 30);
                p.rect(sliderX, trackY, sliderW, 7, 3);
                p.fill(0, 180, 70);
                p.rect(sliderX, trackY, sliderW * speedValue, 7, 3);

                p.fill(sliderDragging ? p.color(0, 255, 150) : p.color(0, 220, 100));
                p.ellipse(sliderX + sliderW * speedValue, trackY + 3, 12, 12);

                let speedLabel = speedValue >= 0.95 ? 'MAX' : Math.round(Math.pow(10, speedValue * 2)) + 'x';
                p.fill(0, 180, 70);
                p.textAlign(p.RIGHT, p.CENTER);
                p.text(speedLabel, p.width - 15, ctrlY + 4);
            };

            p.mousePressed = function () {
                const mx = p.mouseX, my = p.mouseY;
                const ctrlY = p.height - 55;
                const sliderX = 190, sliderW = p.width - sliderX - 50, trackY = ctrlY + 14;

                if (my >= trackY - 6 && my <= trackY + 13 && mx >= sliderX && mx <= sliderX + sliderW) {
                    sliderDragging = true;
                    speedValue = p.constrain((mx - sliderX) / sliderW, 0, 1);
                }

                if (my >= ctrlY && my <= ctrlY + 26) {
                    if (mx >= 15 && mx <= 70) isPlaying = !isPlaying;
                    if (mx >= 78 && mx <= 120 && currentIdx < invalidIds.length) currentIdx++;
                    if (mx >= 127 && mx <= 175) { currentIdx = 0; isPlaying = false; }
                }
            };

            p.mouseDragged = function () {
                if (sliderDragging) {
                    const sliderX = 190, sliderW = p.width - sliderX - 50;
                    speedValue = p.constrain((p.mouseX - sliderX) / sliderW, 0, 1);
                }
            };

            p.mouseReleased = function () { sliderDragging = false; };

            p.windowResized = function () {
                const w = Math.max(container.clientWidth, 500);
                const h = Math.max(container.clientHeight, 450);
                p.resizeCanvas(w, h);
            };
        };

        this.p5Instance = new p5(sketch);
    }
};
