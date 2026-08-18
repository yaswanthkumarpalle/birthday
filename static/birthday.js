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
let pieces = [];

function burstConfetti(originX, originY, count = 160) {
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
}

function fireworkBurst(x, y, count = 50) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 6 + 3;
        pieces.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.12,
            size: Math.random() * 5 + 3,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rotation: 0, spin: 0, life: 0
        });
    }
}

function draw() {
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (pieces.length) {
            pieces.forEach(p => {
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.spin;
                p.life++;

                ctx.save();
                ctx.globalAlpha = Math.max(0, 1 - p.life / 240);
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });
            pieces = pieces.filter(p => p.life < 240);
        }
    }
    requestAnimationFrame(draw);
}
draw();

function launchFireworkShow() {
    let count = 0;
    const interval = setInterval(() => {
        const x = Math.random() * canvas.width * 0.7 + canvas.width * 0.15;
        const y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
        fireworkBurst(x, y, 50);
        count++;
        if (count >= 5) clearInterval(interval);
    }, 500);
}

/* ---------- Floating hearts ---------- */
function launchFloatingHearts() {
    const container = document.getElementById("floating-hearts");
    if (!container) return;
    const emojis = ["💖", "💕", "💗", "✨", "🎉"];
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
        if (count >= 30) clearInterval(interval);
    }, 400);
}

/* ---------- Poppable balloons ---------- */
function spawnBalloon() {
    const container = document.getElementById("pop-balloons");
    if (!container) return;

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
    spawnBalloon();
    setInterval(spawnBalloon, 1400);
}

/* ---------- Slideshow ---------- */
let currentSlide = 0;
let feelingAnimationId = 0;

function showSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    if (!slides.length) return;

    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");

    typeFeeling(slides[index]);
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

function startSlideshow() {
    if (typeof slideCount === "undefined" || slideCount === 0) return;
    showSlide(0);
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slideCount;
        showSlide(currentSlide);
    }, 6000);
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

            setTimeout(() => burstConfetti(originX, originY, 120), 300);

            setTimeout(() => {
                giftScreen.classList.add("hidden");
                card.classList.add("reveal");
                typeTitle();
                startSlideshow();
                launchFireworkShow();
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
// Typewriter effect function
function typeWriter(text, elementId, speed = 50) {
  const container = document.getElementById(elementId);
  container.innerHTML = "";
  let i = 0;
  
  function type() {
    if (i < text.length) {
      container.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Function to reveal the card overlay
function showMessageCard() {
  const overlay = document.getElementById("ui-overlay");
  overlay.style.pointerEvents = "auto";
  
  // Animate card in
  gsap.to(overlay, { 
    opacity: 1, 
    y: 0, 
    duration: 0.8, 
    ease: "power2.out",
    onComplete: () => {
      // Start typing the wish message passed from Jinja2
      if (typeof wishMessage !== "undefined") {
        typeWriter(wishMessage, "typed-message");
      }
    }
  });
}

// Function to hide the card overlay
function hideMessageCard() {
  const overlay = document.getElementById("ui-overlay");
  overlay.style.pointerEvents = "none";
  gsap.to(overlay, { opacity: 0, y: 20, duration: 0.5 });
}

// Update your existing Raycaster click event listener inside birthday3d.js
window.addEventListener("click", (e) => {
  // Ignore clicks on the UI card itself
  if (e.target.closest("#ui-overlay")) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(boxGroup.children);
  if (intersects.length > 0) {
    // 1. Animate Lid Opening
    gsap.to(boxLid.position, { y: 4, duration: 1, ease: "back.out(1.7)" });
    gsap.to(boxLid.rotation, { x: -Math.PI / 2, duration: 1 });
    gsap.to(boxGroup.scale, { x: 0, y: 0, z: 0, delay: 0.8, duration: 0.5 });

    // 2. Reveal 3D Photo Frame
    if (typeof slidesData !== "undefined" && slidesData.length > 0) {
      const firstPhotoPath = "/static/uploads/" + slidesData[0].photo;
      const photoCard = createPhotoFrame(firstPhotoPath);
      photoCard.position.set(0, 1.5, 0);
      photoCard.scale.set(0, 0, 0);
      scene.add(photoCard);
      gsap.to(photoCard.scale, { x: 1, y: 1, z: 1, delay: 0.5, duration: 0.8, ease: "back.out(2)" });
    }

    // 3. Trigger the message UI overlay display
    setTimeout(() => {
      showMessageCard();
    }, 1200);
  }
});
