/**
 * Day 01: Secret Entrance - Parts 1 & 2
 * Educational step-by-step visualization with smooth speed slider
 */
window.solutions = window.solutions || {};
window.solutions.day01 = {
    p5Instance: null,
    vizData: null,

    parseInput: function (input) {
        const rotations = [];
        const tokens = input.trim().split(/[\s\n]+/);
        tokens.forEach(token => {
            const match = token.match(/([LR])(\d+)/);
            if (match) {
                rotations.push({
                    direction: match[1],
                    distance: parseInt(match[2], 10)
                });
            }
        });
        return rotations;
    },

    /**
     * Count zeros passed during a single rotation
     * This counts every position where dial points at 0 during the rotation
     */
    countZerosInRotation: function (position, direction, distance) {
        if (direction === 'L') {
            // Going left (decreasing): we hit 0 when (position - k) mod 100 = 0
            // i.e., k ≡ position (mod 100), k ∈ [1, distance]
            if (position === 0) {
                return Math.floor(distance / 100);
            } else {
                return position <= distance ? Math.floor((distance - position) / 100) + 1 : 0;
            }
        } else {
            // Going right (increasing): we hit 0 when (position + k) mod 100 = 0
            // i.e., k ≡ (100 - position) (mod 100), k ∈ [1, distance]
            if (position === 0) {
                return Math.floor(distance / 100);
            } else {
                const firstZeroAt = 100 - position;
                return firstZeroAt <= distance ? Math.floor((distance - firstZeroAt) / 100) + 1 : 0;
            }
        }
    },

    simulate: function (rotations) {
        let position = 50;
        let part1Zeros = 0;  // Zeros at END of rotation
        let part2Zeros = 0;  // ALL zeros (passed through + end)
        const history = [{ position: 50, instruction: 'START', part1Zeros: 0, part2Zeros: 0, zerosThisStep: 0 }];

        rotations.forEach((rot) => {
            // Count zeros passed DURING this rotation
            const zerosThisStep = this.countZerosInRotation(position, rot.direction, rot.distance);
            part2Zeros += zerosThisStep;

            // Calculate new position
            if (rot.direction === 'L') {
                position = (position - rot.distance % 100 + 100) % 100;
            } else {
                position = (position + rot.distance) % 100;
            }

            // Part 1: count if we END at 0
            if (position === 0) part1Zeros++;

            history.push({
                position: position,
                instruction: rot.direction + rot.distance,
                part1Zeros: part1Zeros,
                part2Zeros: part2Zeros,
                zerosThisStep: zerosThisStep
            });
        });

        return { history, part1Answer: part1Zeros, part2Answer: part2Zeros };
    },

    part1: function (input) {
        const rotations = this.parseInput(input);
        this.vizData = this.simulate(rotations);
        return this.vizData.part1Answer;
    },

    part2: function (input) {
        const rotations = this.parseInput(input);
        this.vizData = this.simulate(rotations);
        return this.vizData.part2Answer;
    },

    startVisualization: function (container, part) {
        const self = this;

        if (this.p5Instance) {
            this.p5Instance.remove();
            this.p5Instance = null;
        }

        container.style.minHeight = '450px';

        const sketch = function (p) {
            let centerX, centerY, dialRadius;
            let history = [];
            let currentStep = 0;
            let displayPos = 50;
            let targetPos = 50;
            let animProgress = 1;
            let zeroFlash = 0;
            let currentPart = part;

            // Controls
            let isPlaying = false;
            let speedValue = 0.3;
            let sliderDragging = false;
            let progressDragging = false;

            p.setup = function () {
                const data = self.vizData || { history: [{ position: 50, instruction: 'START', part1Zeros: 0, part2Zeros: 0, zerosThisStep: 0 }] };
                history = data.history;

                const w = Math.max(container.clientWidth, 500);
                const h = Math.max(container.clientHeight, 480);
                const canvas = p.createCanvas(w, h);
                canvas.parent(container);

                p.textFont('Courier New');
                p.angleMode(p.DEGREES);

                centerX = w / 2;
                centerY = h / 2 - 50;
                dialRadius = Math.min(w, h - 140) * 0.30;

                displayPos = history[0].position;
                targetPos = history[0].position;
            };

            p.draw = function () {
                p.background(13);

                const stepsPerFrame = speedValue >= 0.95 ? history.length : Math.max(1, Math.floor(Math.pow(100, speedValue)));
                const animSpeed = speedValue >= 0.95 ? 1 : 0.1 + speedValue * 0.4;

                if (isPlaying && animProgress >= 1 && currentStep < history.length - 1) {
                    for (let s = 0; s < stepsPerFrame && currentStep < history.length - 1; s++) {
                        currentStep++;
                        if (history[currentStep].zerosThisStep > 0) {
                            zeroFlash = 1;
                        }
                    }
                    targetPos = history[currentStep].position;
                    animProgress = speedValue >= 0.95 ? 1 : 0;

                    if (currentStep >= history.length - 1) isPlaying = false;
                }

                if (animProgress < 1) {
                    animProgress += animSpeed;
                    animProgress = Math.min(animProgress, 1);

                    let prev = currentStep > 0 ? history[currentStep - 1].position : 50;
                    let diff = targetPos - prev;
                    if (diff > 50) diff -= 100;
                    if (diff < -50) diff += 100;
                    displayPos = (prev + diff * easeOut(animProgress) + 100) % 100;
                } else {
                    displayPos = targetPos;
                }

                if (zeroFlash > 0) zeroFlash -= 0.03;

                // Draw dial
                p.push();
                p.translate(centerX, centerY);

                p.noFill();
                p.stroke(0, 100, 30);
                p.strokeWeight(3);
                p.ellipse(0, 0, dialRadius * 2, dialRadius * 2);

                for (let i = 0; i < 100; i++) {
                    const angle = (i * 3.6) - 90;
                    const isZero = i === 0;
                    const isMajor = i % 10 === 0;
                    const innerR = isMajor ? dialRadius - 18 : dialRadius - 10;

                    if (isZero) {
                        p.stroke(zeroFlash > 0 ? p.lerpColor(p.color(255, 50, 100), p.color(255, 255, 100), zeroFlash) : p.color(255, 50, 100));
                        p.strokeWeight(4);
                    } else if (isMajor) {
                        p.stroke(0, 220, 70);
                        p.strokeWeight(2);
                    } else {
                        p.stroke(0, 80, 30);
                        p.strokeWeight(1);
                    }

                    p.line(innerR * p.cos(angle), innerR * p.sin(angle), dialRadius * p.cos(angle), dialRadius * p.sin(angle));
                }

                p.textAlign(p.CENTER, p.CENTER);
                for (let i = 0; i < 100; i += 10) {
                    const angle = (i * 3.6) - 90;
                    const labelR = dialRadius - 32;
                    p.noStroke();
                    p.fill(i === 0 ? p.color(255, 50, 100) : p.color(0, 200, 70));
                    p.textSize(13);
                    p.text(i, labelR * p.cos(angle), labelR * p.sin(angle));
                }

                // Arrow
                const arrowAngle = (displayPos * 3.6) - 90;
                p.push();
                p.rotate(arrowAngle);
                p.stroke(0, 255, 100);
                p.strokeWeight(4);
                p.line(0, 0, dialRadius - 45, 0);
                p.fill(0, 255, 100);
                p.noStroke();
                p.triangle(dialRadius - 40, 0, dialRadius - 55, -8, dialRadius - 55, 8);
                p.fill(0, 200, 70);
                p.ellipse(0, 0, 12, 12);
                p.pop();

                if (zeroFlash > 0) {
                    p.noFill();
                    p.stroke(255, 50, 100, zeroFlash * 200);
                    p.strokeWeight(zeroFlash * 15);
                    p.ellipse(0, 0, dialRadius * 2.3, dialRadius * 2.3);
                }

                p.pop();

                // Info panel
                const step = history[currentStep];
                p.fill(0, 255, 100);
                p.textAlign(p.LEFT, p.TOP);
                p.textSize(12);
                p.text('Step: ' + currentStep + ' / ' + (history.length - 1), 15, 8);
                p.text('Instruction: ' + step.instruction, 15, 24);
                p.text('Position: ' + Math.round(displayPos), 15, 40);

                if (step.zerosThisStep > 0) {
                    p.fill(255, 200, 50);
                    p.text('Passed through 0: ' + step.zerosThisStep + 'x', 15, 56);
                }

                // Part results
                p.textAlign(p.RIGHT, p.TOP);
                p.fill(255, 50, 100);
                p.textSize(14);
                p.text('Part 1 (ends at 0): ' + step.part1Zeros, p.width - 15, 8);
                p.fill(255, 200, 50);
                p.text('Part 2 (all zeros): ' + step.part2Zeros, p.width - 15, 26);

                // Controls
                const ctrlY = p.height - 90;

                // Progress bar
                const barW = p.width - 30;
                const progress = currentStep / Math.max(history.length - 1, 1);
                p.noStroke();
                p.fill(30, 50, 30);
                p.rect(15, ctrlY, barW, 12, 6);
                p.fill(0, 200, 70);
                p.rect(15, ctrlY, barW * progress, 12, 6);
                p.fill(0, 255, 100);
                p.ellipse(15 + barW * progress, ctrlY + 6, 14, 14);

                // Buttons
                const btnY = ctrlY + 22;

                p.fill(isPlaying ? p.color(255, 150, 50) : p.color(0, 180, 60));
                p.rect(15, btnY, 55, 26, 5);
                p.fill(0);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(10);
                p.text(isPlaying ? 'PAUSE' : 'PLAY', 42, btnY + 13);

                p.fill(0, 140, 55);
                p.rect(78, btnY, 42, 26, 5);
                p.fill(255);
                p.text('STEP', 99, btnY + 13);

                p.fill(120, 50, 50);
                p.rect(127, btnY, 48, 26, 5);
                p.fill(255);
                p.text('RESET', 151, btnY + 13);

                // Speed slider
                const sliderX = 190;
                const sliderW = p.width - sliderX - 50;
                const trackY = btnY + 14;

                p.fill(0, 100, 40);
                p.textAlign(p.LEFT, p.CENTER);
                p.textSize(9);
                p.text('SPEED', sliderX, btnY + 4);

                p.fill(30, 50, 30);
                p.rect(sliderX, trackY, sliderW, 7, 3);
                p.fill(0, 180, 70);
                p.rect(sliderX, trackY, sliderW * speedValue, 7, 3);

                const sliderHandleX = sliderX + sliderW * speedValue;
                p.fill(sliderDragging ? p.color(0, 255, 150) : p.color(0, 220, 100));
                p.ellipse(sliderHandleX, trackY + 3, 12, 12);

                let speedLabel = speedValue >= 0.95 ? 'MAX' : speedValue < 0.1 ? '1x' : Math.round(Math.pow(100, speedValue)) + 'x';
                p.fill(0, 180, 70);
                p.textAlign(p.RIGHT, p.CENTER);
                p.text(speedLabel, p.width - 15, btnY + 4);
            };

            function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

            p.mousePressed = function () {
                const mx = p.mouseX, my = p.mouseY;
                const ctrlY = p.height - 90;
                const btnY = ctrlY + 22;
                const sliderX = 190;
                const sliderW = p.width - sliderX - 50;
                const trackY = btnY + 14;

                if (my >= ctrlY && my <= ctrlY + 12 && mx >= 15 && mx <= p.width - 15) {
                    progressDragging = true;
                    updateProgress(mx);
                }

                if (my >= trackY - 6 && my <= trackY + 13 && mx >= sliderX && mx <= sliderX + sliderW) {
                    sliderDragging = true;
                    updateSlider(mx);
                }

                if (my >= btnY && my <= btnY + 26) {
                    if (mx >= 15 && mx <= 70) isPlaying = !isPlaying;
                    if (mx >= 78 && mx <= 120 && currentStep < history.length - 1) {
                        currentStep++;
                        targetPos = history[currentStep].position;
                        animProgress = 0;
                        if (history[currentStep].zerosThisStep > 0) zeroFlash = 1;
                    }
                    if (mx >= 127 && mx <= 175) {
                        currentStep = 0;
                        displayPos = targetPos = 50;
                        animProgress = 1;
                        isPlaying = false;
                    }
                }
            };

            p.mouseDragged = function () {
                if (sliderDragging) updateSlider(p.mouseX);
                if (progressDragging) updateProgress(p.mouseX);
            };

            p.mouseReleased = function () {
                sliderDragging = progressDragging = false;
            };

            function updateSlider(mx) {
                const sliderX = 190, sliderW = p.width - sliderX - 50;
                speedValue = p.constrain((mx - sliderX) / sliderW, 0, 1);
            }

            function updateProgress(mx) {
                const barW = p.width - 30;
                const ratio = p.constrain((mx - 15) / barW, 0, 1);
                currentStep = Math.floor(ratio * (history.length - 1));
                targetPos = history[currentStep].position;
                displayPos = targetPos;
                animProgress = 1;
            }

            p.windowResized = function () {
                const w = Math.max(container.clientWidth, 500);
                const h = Math.max(container.clientHeight, 480);
                p.resizeCanvas(w, h);
                centerX = w / 2;
                centerY = h / 2 - 50;
                dialRadius = Math.min(w, h - 140) * 0.30;
            };
        };

        this.p5Instance = new p5(sketch);
    }
};
