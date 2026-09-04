/* ---------- Balloon theme data ---------- */
const balloonThemeColors = {
    classic:     ["#ff4d6d", "#ffd60a", "#4cc9f0", "#06d6a0", "#7209b7"],
    pastel:      ["#ffc9de", "#c9f0ff", "#d9ffea", "#fff3c4", "#e0c9ff"],
    neon:        ["#ff00e5", "#00fff2", "#ccff00", "#ff6a00", "#7dff00"],
    elegant:     ["#d4af37", "#1a1a1a", "#b8860b", "#2c2c2c", "#e5c158"],
    rainbow:     ["#ff0000", "#ff9900", "#ffee00", "#33ff00", "#0099ff", "#6a00ff", "#ff00cc"],
    tropical:    ["#ff6b35", "#f7c548", "#2ec4b6", "#ff9f1c", "#26547c"],
    love:        ["#ff4d6d", "#ff85a1", "#ffb3c6"],
    cake:        ["#ffb3c6", "#ffd6a5", "#e0aaff"],
    celebration: ["#f6d365", "#fda085", "#ff6a88"]
};

const balloonThemeEmojis = {
    love:        ["💕", "💖", "💗", "❤️", "💘", "😍"],
    cake:        ["🎂", "🍰", "🧁", "🍩", "🍫"],
    celebration: ["🎉", "🎊", "🥳", "🎁", "🎇", "✨"]
};

let balloonColors = [];
(typeof balloonThemes !== "undefined" ? balloonThemes : ["classic"]).forEach(theme => {
    if (balloonThemeColors[theme]) balloonColors = balloonColors.concat(balloonThemeColors[theme]);
});
if (balloonColors.length === 0) balloonColors = balloonThemeColors.classic;

let balloonEmojis = [];
(typeof balloonThemes !== "undefined" ? balloonThemes : []).forEach(theme => {
    if (balloonThemeEmojis[theme]) balloonEmojis = balloonEmojis.concat(balloonThemeEmojis[theme]);
});

if (typeof balloonThemes !== "undefined" && balloonThemes.length) {
    document.body.classList.add("theme-" + balloonThemes[0]);
}

/* ---------- Ambient sparkles ---------- */
const sparkleField = document.getElementById("sparkle-field");
if (sparkleField) {
    for (let i = 0; i < 25; i++) {
        const s = document.createElement("div");
        s.className = "spark";
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";
        s.style.animationDelay = Math.random() * 2.5 + "s";
        sparkleField.appendChild(s);
    }
}

/* ---------- Confetti / fireworks ---------- */
const canvas = document.getElementById("confetti");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

const confettiColors = ["#ff6b81", "#feca57", "#48dbfb", "#1dd1a1", "#a29bfe", "#ff9ff3", "#ffe066"];
const skyshotColors = ["#ff1744", "#ffea00", "#00e5ff", "#76ff03", "#ff4081", "#d500f9", "#ffffff"];
const lowPowerDevice = window.matchMedia("(max-width: 900px)").matches
    || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    || (navigator.deviceMemory && navigator.deviceMemory <= 4)
    || (navigator.connection && navigator.connection.saveData === true);
let pieces = [];
let skyshotTimer = null;
let skyshotSlide = 0;
let lastFrameTime = 0;
let burstColorIndex = 0;
let burstNumber = 0;
let grandBurstActive = false;
let drawScheduled = false;
function scheduleDraw() {
    if (drawScheduled || document.hidden) return;
    drawScheduled = true;
    requestAnimationFrame((timestamp) => {
        drawScheduled = false;
        draw(timestamp);
    });
}

const slideSkyshotPalettes = [
    ["#00e676", "#2979ff", "#ff6d00", "#d500f9", "#ffea00"],
    ["#2979ff", "#00e676", "#ff4081", "#ffd600", "#d500f9"],
    ["#ff6d00", "#00e5ff", "#76ff03", "#ff1744", "#ffea00"],
    ["#d500f9", "#ff4081", "#00e676", "#2979ff", "#fff8e1"],
    ["#76ff03", "#00e676", "#00e5ff", "#ffea00", "#ff6d00"]
];

function getSelectedThemeColors() {
    const selectedColors = [];
    const selectedThemes = typeof balloonThemes !== "undefined" && balloonThemes.length
        ? balloonThemes
        : ["classic"];

    selectedThemes.forEach((theme) => {
        (balloonThemeColors[theme] || []).forEach((color) => {
            if (!selectedColors.includes(color)) selectedColors.push(color);
        });
    });

    return selectedColors.length ? selectedColors : slideSkyshotPalettes[0];
}

function burstConfetti(originX, originY, count = 160) {
    if (lowPowerDevice) return;
    for (let i = 0; i < count; i++) {
        pieces.push({
            x: originX, y: originY,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 1.3) * 15,
            gravity: 0.28,
            size: Math.random() * 8 + 4,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rotation: Math.random() * 360,
            spin: Math.random() * 6 - 3,
            life: 0
        });
    }
    scheduleDraw();
}

function fireworkBurst(x, y, count = 50, palette = skyshotColors, allowCrackle = true, color = null, isGrand = false) {
    x = Math.max(40, Math.min(canvas.width - 40, x));
    y = Math.max(45, Math.min(canvas.height * 0.58, y));
    const patterns = ["ring", "star", "willow"];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const shellColor = color || palette[0];

    pieces.push({
        x, y, vx: 0, vy: 0, gravity: 0, drag: 1,
        size: isGrand ? 42 : 24, color: shellColor, shape: "flash",
        rotation: 0, spin: 0, life: 0, maxLife: 18
    });
    pieces.push({
        x, y, vx: 0, vy: 0, gravity: 0, drag: 1,
        size: isGrand ? 20 : 10, color: shellColor, shape: "halo",
        rotation: 0, spin: 0, life: 0, maxLife: 42
    });

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.08;
        let speed = Math.random() * (isGrand ? 1.7 : 1.35) + (isGrand ? 1.3 : 1.05);
        if (pattern === "star" && i % 5 === 0) speed += 0.65;
        if (pattern === "willow") speed *= 0.62;
        pieces.push({
            x, y,
            previousX: x,
            previousY: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: pattern === "willow" ? 0.022 : 0.012,
            drag: pattern === "willow" ? 0.996 : 0.999,
            size: Math.random() * (isGrand ? 3.2 : 2.5) + (isGrand ? 2.2 : 1.8),
            color: shellColor,
            shape: i % 9 === 0 ? "sparkle" : (pattern === "star" && i % 5 === 0 ? "dot" : (pattern === "willow" ? "spark" : "dash")),
            rotation: angle, spin: 0, life: 0,
            maxLife: pattern === "willow" ? (lowPowerDevice ? 360 : 620) : (lowPowerDevice ? 280 : 480)
        });
    }

    // A smaller delayed shell creates the crackling finish of a real firework.
    if (allowCrackle) {
        setTimeout(() => {
            if (!document.hidden) fireworkBurst(x + (Math.random() - 0.5) * 18, y + (Math.random() - 0.5) * 18, Math.max(8, Math.floor(count * 0.22)), palette, false, shellColor, false);
        }, 260);
    }
    scheduleDraw();
}

function launchSkyshot(slideIndex = skyshotSlide) {
    if (!canvas || grandBurstActive) return;

    const selectedColors = getSelectedThemeColors();
    const palette = selectedColors.slice(slideIndex % selectedColors.length)
        .concat(selectedColors.slice(0, slideIndex % selectedColors.length));
    const shellColor = palette[burstColorIndex % palette.length];
    burstColorIndex++;
    const isGrand = burstNumber % 3 === 1;
    burstNumber++;
    if (isGrand) grandBurstActive = true;
    const targetX = canvas.width * (0.18 + Math.random() * 0.64);
    const targetY = canvas.height * (0.12 + Math.random() * 0.3);
    const startX = targetX + (Math.random() - 0.5) * 80;
    const startY = canvas.height + 10;
    const flightTime = lowPowerDevice ? (isGrand ? 1450 : 1200) : (isGrand ? 1750 : 1500);
    const flightFrames = Math.round(flightTime / 16.67);
    pieces.push({
        x: startX,
        y: startY,
        previousX: startX,
        previousY: startY,
        vx: (targetX - startX) / flightFrames,
        vy: (targetY - startY) / flightFrames,
        gravity: 0,
        drag: 1,
        size: isGrand ? 4.5 : 2.5,
        color: shellColor,
        shape: "rocket",
        rotation: 0,
        spin: 0,
        life: 0,
        maxLife: flightFrames
    });

    scheduleDraw();
    setTimeout(() => fireworkBurst(targetX, targetY, lowPowerDevice ? (isGrand ? 28 : 16) : (isGrand ? 90 : 55), palette, !lowPowerDevice, shellColor, isGrand), flightTime);
    if (isGrand) {
        setTimeout(() => {
            grandBurstActive = false;
        }, flightTime + (lowPowerDevice ? 2600 : 3200));
    }
}

function startSkyshotShow() {
    if (!canvas) return;
    burstColorIndex = 0;
    burstNumber = 0;
    grandBurstActive = false;
    if (skyshotTimer) clearInterval(skyshotTimer);
    launchSkyshot(skyshotSlide);
    skyshotTimer = setInterval(() => launchSkyshot(skyshotSlide), lowPowerDevice ? 2200 : 1150);
}

function draw(timestamp = 0) {
    if (!ctx || document.hidden) return;
    if (lowPowerDevice && timestamp - lastFrameTime < 32) {
        scheduleDraw();
        return;
    }
    lastFrameTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = lowPowerDevice ? "source-over" : "lighter";
    pieces.forEach(p => {
        p.previousX = p.x;
        p.previousY = p.y;
        p.vy += p.gravity;
        p.vx *= p.drag || 1;
        p.vy *= p.drag || 1;
        p.x += p.vx;
        p.y += p.vy;
        if (p.shape === "rocket" && p.life >= p.maxLife) p.life = 999;
        p.rotation += p.spin;
        p.life++;

        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p.life / (p.maxLife || 300));
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.shape === "flash" ? (lowPowerDevice ? 4 : 10) : 0;
        if (p.shape === "flash") {
            const flashProgress = p.life / p.maxLife;
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * (1 - flashProgress * 0.6));
            gradient.addColorStop(0, lowPowerDevice ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.95)");
            gradient.addColorStop(0.35, p.color + "cc");
            gradient.addColorStop(1, p.color + "00");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * (1 - flashProgress * 0.5), 0, Math.PI * 2);
            ctx.fill();
        } else if (p.shape === "halo") {
            const haloProgress = p.life / p.maxLife;
            ctx.globalAlpha *= 1 - haloProgress;
            ctx.beginPath();
            ctx.arc(0, 0, p.size + haloProgress * 38, 0, Math.PI * 2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (p.shape === "sparkle") {
            const sparkleSize = p.size * (1 + Math.sin(p.life * 0.22) * 0.35);
            ctx.globalAlpha *= 0.9;
            ctx.beginPath();
            ctx.moveTo(-sparkleSize * 2.2, 0);
            ctx.lineTo(sparkleSize * 2.2, 0);
            ctx.moveTo(0, -sparkleSize * 2.2);
            ctx.lineTo(0, sparkleSize * 2.2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = Math.max(1, p.size * 0.7);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.shape === "rocket") {
            ctx.shadowColor = p.color;
            ctx.shadowBlur = lowPowerDevice ? 0 : 6;
            ctx.beginPath();
            ctx.moveTo(p.previousX - p.x, p.previousY - p.y);
            ctx.lineTo(0, 0);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, p.size + 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else if (p.shape === "dot") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(p.previousX - p.x, p.previousY - p.y);
            ctx.lineTo(0, 0);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.shape === "spark" ? p.size * 0.7 : p.size;
            ctx.stroke();
            if (p.shape !== "spark") ctx.fillRect(-p.size / 2, -p.size / 2, p.size * 1.8, p.size * 0.55);
        }
        ctx.shadowBlur = 0;
        ctx.restore();
    });
    pieces = pieces.filter(p => p.life < (p.maxLife || 300));

    if (!pieces.length) return;
    scheduleDraw();
}

document.addEventListener("visibilitychange", () => {
    if (!document.hidden && pieces.length) scheduleDraw();
});

draw();

/* ---------- Floating hearts ---------- */
function launchFloatingHearts() {
    if (lowPowerDevice) return;
    const container = document.getElementById("floating-hearts");
    if (!container) return;
    const emojis = ["💖", "💕", "💗", "✨", "🎉"];
    const heartCount = lowPowerDevice ? 12 : 30;
    let count = 0;
    const interval = setInterval(() => {
        const el = document.createElement("span");
        el.className = "fh";
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + "%";
        el.style.setProperty("--drift", (Math.random() * 100 - 50) + "px");
        el.style.animationDuration = (Math.random() * 4 + 6) + "s";
        container.appendChild(el);
        setTimeout(() => el.remove(), 10000);
        count++;
        if (count >= heartCount) clearInterval(interval);
    }, 400);
}

/* ---------- Poppable balloons ---------- */
function spawnBalloon() {
    const container = document.getElementById("pop-balloons");
    if (!container) return;
    const maximumBalloons = lowPowerDevice ? 1 : 3;
    if (container.querySelectorAll(".pop-balloon").length >= maximumBalloons) return;

    const balloon = document.createElement("div");
    balloon.className = "pop-balloon";

    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const useEmoji = balloonEmojis.length > 0 && Math.random() < 0.5;

    if (useEmoji) {
        balloon.classList.add("emoji-balloon");
        balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
    } else {
        balloon.style.setProperty("--balloon-color", color);
        const shine = document.createElement("div");
        shine.className = "balloon-shine";
        balloon.appendChild(shine);
    }

    balloon.style.left = Math.random() * 90 + "%";
    balloon.style.animationDuration = (Math.random() * 4 + 7) + "s";

    balloon.addEventListener("click", () => popBalloon(balloon, color));
    container.appendChild(balloon);

    setTimeout(() => {
        if (balloon.parentNode) balloon.remove();
    }, 12000);
}

function popBalloon(balloon, color) {
    if (balloon.classList.contains("popped")) return;
    balloon.classList.add("popped");

    const rect = balloon.getBoundingClientRect();
    const burst = document.createElement("div");
    burst.className = "pop-burst";
    burst.style.left = (rect.left + rect.width / 2 - 30) + "px";
    burst.style.top = (rect.top + rect.height / 2 - 30) + "px";
    burst.style.setProperty("--burst-color", color);

    for (let i = 0; i < 10; i++) {
        const piece = document.createElement("span");
        const angle = (Math.PI * 2 * i) / 10;
        const dist = Math.random() * 35 + 20;
        piece.style.setProperty("--tx", Math.cos(angle) * dist + "px");
        piece.style.setProperty("--ty", Math.sin(angle) * dist + "px");
        burst.appendChild(piece);
    }

    document.getElementById("pop-balloons").appendChild(burst);
    balloon.remove();
    setTimeout(() => burst.remove(), 550);
}

function startBalloonSpawner() {
    if (lowPowerDevice) return;
    spawnBalloon();
    setInterval(spawnBalloon, 4200);
}

/* ---------- Slideshow ---------- */
let currentSlide = 0;
let feelingAnimationId = 0;
let slideshowTimer = null;

function updateSlideNavigation() {
    const prevButton = document.querySelector(".slide-prev");
    const nextButton = document.querySelector(".slide-next");
    if (!prevButton || !nextButton || typeof slideCount === "undefined") return;

    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide >= slideCount - 1;

    prevButton.hidden = isFirstSlide;
    prevButton.disabled = isFirstSlide;
    prevButton.style.visibility = isFirstSlide ? "hidden" : "visible";

    nextButton.hidden = isLastSlide;
    nextButton.disabled = isLastSlide;
    nextButton.style.visibility = isLastSlide ? "hidden" : "visible";
}

function showSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    if (!slides.length) return;

    const safeIndex = ((index % slides.length) + slides.length) % slides.length;
    currentSlide = safeIndex;
    skyshotSlide = safeIndex;

    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    slides[safeIndex].classList.add("active");
    if (dots[safeIndex]) dots[safeIndex].classList.add("active");

    updateSlideNavigation();
    typeFeeling(slides[safeIndex]);
    if (card && card.classList.contains("reveal")) startSkyshotShow();
}

function typeFeeling(slideEl) {
    const p = slideEl.querySelector(".slide-feeling");
    const text = p.getAttribute("data-feeling") || "";
    const animationId = ++feelingAnimationId;
    let i = 0;
    p.textContent = "";
    function typeChar() {
        if (animationId !== feelingAnimationId) return;
        if (i < text.length) {
            p.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, 22);
        }
    }
    typeChar();
}

function restartSlideshow() {
    if (slideshowTimer) {
        clearInterval(slideshowTimer);
    }
    if (typeof slideCount === "undefined" || slideCount === 0) return;
    slideshowTimer = setInterval(() => {
        if (currentSlide < slideCount - 1) {
            currentSlide += 1;
        } else {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }, 30000);
}

function bindSlideTapNavigation() {
    const prevButton = document.querySelector(".slide-prev");
    const nextButton = document.querySelector(".slide-next");

    if (prevButton) {
        prevButton.addEventListener("click", () => {
            if (currentSlide > 0) {
                currentSlide -= 1;
                showSlide(currentSlide);
                restartSlideshow();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            if (currentSlide < slideCount - 1) {
                currentSlide += 1;
                showSlide(currentSlide);
                restartSlideshow();
            }
        });
    }

    document.querySelectorAll(".slide-photo-wrap").forEach((photoWrap) => {
        photoWrap.addEventListener("click", () => {
            if (currentSlide < slideCount - 1) {
                currentSlide += 1;
                showSlide(currentSlide);
                restartSlideshow();
            }
        });
    });
}

function startSlideshow() {
    if (typeof slideCount === "undefined" || slideCount === 0) return;
    showSlide(0);
    bindSlideTapNavigation();
    restartSlideshow();
}

/* ---------- Typed title ---------- */
function typeTitle() {
    const el = document.getElementById("title-text");
    if (!el) return;
    const full = `Happy Birthday, ${wishName}! 🎉`;
    let i = 0;
    el.textContent = "";
    function typeChar() {
        if (i < full.length) {
            el.textContent += full.charAt(i);
            i++;
            setTimeout(typeChar, 35);
        }
    }
    typeChar();
}

/* ---------- 3D Gift box open sequence ---------- */
const giftBox = document.getElementById("gift-box");
const giftScreen = document.getElementById("gift-screen");
const card = document.getElementById("card");
let opened = false;

if (giftBox) {
    giftBox.addEventListener("click", () => {
        if (opened) return;
        opened = true;

        giftBox.classList.add("shake");

        setTimeout(() => {
            giftBox.classList.remove("shake");
            giftBox.classList.add("opened");

            const rect = giftBox.getBoundingClientRect();
            const originX = rect.left + rect.width / 2;
            const originY = rect.top + rect.height / 2;

            setTimeout(() => burstConfetti(originX, originY, lowPowerDevice ? 55 : 120), 300);

            setTimeout(() => {
                giftScreen.classList.add("hidden");
                card.classList.add("reveal");
                typeTitle();
                startSlideshow();
                startSkyshotShow();
                launchFloatingHearts();
                startBalloonSpawner();
            }, 950);

        }, 500);
    });
}

/* ---------- 3D tilt on card following mouse ---------- */
function enableCardTilt() {
    if (!card) return;
    const maxTilt = 6;

    document.addEventListener("mousemove", (e) => {
        if (!card.classList.contains("reveal")) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(0) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg)`;
    });

    document.addEventListener("mouseleave", () => {
        if (card.classList.contains("reveal")) {
            card.style.transform = "translateY(0) rotateY(0deg) rotateX(0deg)";
        }
    });
}
enableCardTilt();

const saveMemoryButton = document.getElementById("save-memory");
if (saveMemoryButton) {
    saveMemoryButton.addEventListener("click", async () => {
        saveMemoryButton.disabled = true;
        saveMemoryButton.textContent = "Preparing PDF...";

        const photos = [...document.querySelectorAll(".slide-photo")];
        photos.forEach((photo) => {
            photo.loading = "eager";
        });

        await Promise.all(photos.map((photo) => {
            if (photo.complete) return Promise.resolve();
            return new Promise((resolve) => {
                photo.addEventListener("load", resolve, { once: true });
                photo.addEventListener("error", resolve, { once: true });
            });
        }));

        window.print();
        saveMemoryButton.disabled = false;
        saveMemoryButton.textContent = "⬇ Save Wish as PDF";
    });
}
