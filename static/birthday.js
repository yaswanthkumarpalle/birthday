/* ---------- Ambient sparkles (before opening) ---------- */

const sparkleField = document.getElementById("sparkle-field");

if (sparkleField) {

    for (let i = 0; i < 25; i++) {

        const s = document.createElement("div");

        s.className = "spark";

        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 100 + "%";

        s.style.animationDelay =
            Math.random() * 2.5 + "s";

        sparkleField.appendChild(s);
    }
}


/* ---------- Confetti / fireworks canvas ---------- */

const canvas = document.getElementById("confetti");

const ctx = canvas
    ? canvas.getContext("2d")
    : null;


if (canvas) {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    });
}


const colors = [
    "#ff6b81",
    "#feca57",
    "#48dbfb",
    "#1dd1a1",
    "#a29bfe",
    "#ff9ff3",
    "#ffe066"
];


let pieces = [];


function burstConfetti(originX, originY, count = 160) {

    for (let i = 0; i < count; i++) {

        pieces.push({

            x: originX,
            y: originY,

            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 1.3) * 15,

            gravity: 0.28,

            size: Math.random() * 8 + 4,

            color:
                colors[
                    Math.floor(
                        Math.random() * colors.length
                    )
                ],

            rotation: Math.random() * 360,

            spin: Math.random() * 6 - 3,

            life: 0
        });
    }
}


function fireworkBurst(x, y, count = 50) {

    for (let i = 0; i < count; i++) {

        const angle =
            (Math.PI * 2 * i) / count;

        const speed =
            Math.random() * 6 + 3;


        pieces.push({

            x: x,
            y: y,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,

            gravity: 0.12,

            size: Math.random() * 5 + 3,

            color:
                colors[
                    Math.floor(
                        Math.random() * colors.length
                    )
                ],

            rotation: 0,

            spin: 0,

            life: 0
        });
    }
}


function draw() {

    if (ctx) {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        if (pieces.length) {

            pieces.forEach(p => {

                p.vy += p.gravity;

                p.x += p.vx;
                p.y += p.vy;

                p.rotation += p.spin;

                p.life++;


                ctx.save();

                ctx.globalAlpha =
                    Math.max(
                        0,
                        1 - p.life / 240
                    );


                ctx.translate(
                    p.x,
                    p.y
                );


                ctx.rotate(
                    (p.rotation * Math.PI) / 180
                );


                ctx.fillStyle = p.color;


                ctx.fillRect(
                    -p.size / 2,
                    -p.size / 2,
                    p.size,
                    p.size * 0.6
                );


                ctx.restore();

            });


            pieces =
                pieces.filter(
                    p => p.life < 240
                );
        }
    }


    requestAnimationFrame(draw);
}


draw();


function launchFireworkShow() {

    let count = 0;


    const interval =
        setInterval(() => {

            const x =
                Math.random() *
                canvas.width *
                0.7 +
                canvas.width *
                0.15;


            const y =
                Math.random() *
                canvas.height *
                0.4 +
                canvas.height *
                0.1;


            fireworkBurst(
                x,
                y,
                50
            );


            count++;


            if (count >= 5) {

                clearInterval(interval);

            }

        }, 500);
}


/* ---------- Floating hearts rising after reveal ---------- */

function launchFloatingHearts() {

    const container =
        document.getElementById(
            "floating-hearts"
        );


    if (!container) return;


    const emojis = [
        "💖",
        "💕",
        "💗",
        "✨",
        "🎉"
    ];


    let count = 0;


    const interval =
        setInterval(() => {

            const el =
                document.createElement(
                    "span"
                );


            el.className = "fh";


            el.textContent =
                emojis[
                    Math.floor(
                        Math.random() *
                        emojis.length
                    )
                ];


            el.style.left =
                Math.random() * 100 + "%";


            el.style.setProperty(
                "--drift",
                (Math.random() * 100 - 50) +
                "px"
            );


            el.style.animationDuration =
                (Math.random() * 4 + 6) +
                "s";


            container.appendChild(el);


            setTimeout(() => {

                el.remove();

            }, 10000);


            count++;


            if (count >= 30) {

                clearInterval(interval);

            }

        }, 400);
}


/* ---------- Gift box open sequence ---------- */

const giftBox =
    document.getElementById(
        "gift-box"
    );


const giftScreen =
    document.getElementById(
        "gift-screen"
    );


const card =
    document.getElementById(
        "card"
    );


let opened = false;


if (giftBox) {

    giftBox.addEventListener(
        "click",
        () => {

            if (opened) return;

            opened = true;


            giftBox.classList.add(
                "shake"
            );


            setTimeout(() => {

                giftBox.classList.remove(
                    "shake"
                );


                giftBox.classList.add(
                    "opened"
                );


                const rect =
                    giftBox.getBoundingClientRect();


                const originX =
                    rect.left +
                    rect.width / 2;


                const originY =
                    rect.top +
                    rect.height / 2;


                setTimeout(
                    () =>
                        burstConfetti(
                            originX,
                            originY,
                            100
                        ),
                    250
                );


                setTimeout(() => {

                    giftScreen.classList.add(
                        "hidden"
                    );


                    card.classList.add(
                        "reveal"
                    );


                    typeTitle();
                    startSlideshow();

                    launchFireworkShow();

                    launchFloatingHearts();

                }, 750);

            }, 500);

        }
    );
}


/* ---------- Typed title ---------- */

function typeTitle() {

    const el =
        document.getElementById(
            "title-text"
        );


    if (!el) return;


    const full =
        `Happy Birthday, ${wishName}! 🎉`;


    let i = 0;


    el.textContent = "";


    function typeChar() {

        if (i < full.length) {

            el.textContent +=
                full.charAt(i);

            i++;


            setTimeout(
                typeChar,
                35
            );

        }
    }


    typeChar();
}


/* ---------- Slideshow ---------- */

function startSlideshow() {

    const slides = Array.from(document.querySelectorAll(".slide"));
    const dots = Array.from(document.querySelectorAll(".dot"));

    if (slides.length < 2) return;

    let currentIndex = slides.findIndex(slide =>
        slide.classList.contains("active")
    );

    if (currentIndex < 0) currentIndex = 0;

    function showSlide(index) {
        slides[currentIndex].classList.remove("active");
        dots[currentIndex]?.classList.remove("active");

        currentIndex = index;

        slides[currentIndex].classList.add("active");
        dots[currentIndex]?.classList.add("active");
    }

    let slideshowTimer;

    function scheduleNextSlide() {
        clearTimeout(slideshowTimer);

        slideshowTimer = setTimeout(() => {
            showSlide((currentIndex + 1) % slides.length);
            scheduleNextSlide();
        }, 10000);
    }

    slides.forEach(slide => {
        const photo = slide.querySelector(".slide-photo");

        photo?.addEventListener("click", () => {
            showSlide((currentIndex + 1) % slides.length);
            scheduleNextSlide();
        });
    });

    scheduleNextSlide();
}


/* ---------- Balloon themes ---------- */

if (
    typeof balloonThemes !== "undefined" &&
    balloonThemes &&
    balloonThemes.length > 0
) {

    const balloonThemeColors = {

        classic: [
            "#ff4d6d",
            "#ffd60a",
            "#4cc9f0",
            "#06d6a0",
            "#7209b7"
        ],

        pastel: [
            "#ffc9de",
            "#c9f0ff",
            "#d9ffea",
            "#fff3c4",
            "#e0c9ff"
        ],

        neon: [
            "#ff00e5",
            "#00fff2",
            "#ccff00",
            "#ff6a00",
            "#7dff00"
        ],

        elegant: [
            "#d4af37",
            "#1a1a1a",
            "#b8860b",
            "#2c2c2c",
            "#e5c158"
        ],

        rainbow: [
            "#ff0000",
            "#ff9900",
            "#ffee00",
            "#33ff00",
            "#0099ff",
            "#6a00ff",
            "#ff00cc"
        ],

        tropical: [
            "#ff6b35",
            "#f7c548",
            "#2ec4b6",
            "#ff9f1c",
            "#26547c"
        ],

        love: [
            "#ff4d6d",
            "#ff85a1",
            "#ffb3c6"
        ],

        cake: [
            "#ffb3c6",
            "#ffd6a5",
            "#e0aaff"
        ],

        celebration: [
            "#f6d365",
            "#fda085",
            "#ff6a88"
        ]
    };


    const balloonThemeEmojis = {

        love: [
            "💕",
            "💖",
            "💗",
            "❤️",
            "💘",
            "😍"
        ],

        cake: [
            "🎂",
            "🍰",
            "🧁",
            "🍩",
            "🍫"
        ],

        celebration: [
            "🎉",
            "🎊",
            "🥳",
            "🎁",
            "🎇",
            "✨"
        ]
    };


    /* ---------- Combine selected themes ---------- */

    let balloonColors = [];


    balloonThemes.forEach(theme => {

        if (balloonThemeColors[theme]) {

            balloonColors =
                balloonColors.concat(
                    balloonThemeColors[theme]
                );
        }
    });


    if (balloonColors.length === 0) {

        balloonColors =
            balloonThemeColors.classic;
    }


    /* ---------- Combine selected emojis ---------- */

    let balloonEmojis = [];


    balloonThemes.forEach(theme => {

        if (balloonThemeEmojis[theme]) {

            balloonEmojis =
                balloonEmojis.concat(
                    balloonThemeEmojis[theme]
                );
        }
    });


    /* ---------- Apply first theme ---------- */

    document.body.classList.add(
        "theme-" + balloonThemes[0]
    );


    /* ---------- Create one balloon ---------- */

    function spawnBalloon() {

        const container =
            document.getElementById(
                "pop-balloons"
            );


        if (!container) return;


        const balloon =
            document.createElement(
                "div"
            );


        balloon.className =
            "pop-balloon";


        /* Random color */

        const color =
            balloonColors[
                Math.floor(
                    Math.random() *
                    balloonColors.length
                )
            ];


        /* Randomly use emoji */

        const useEmoji =
            balloonEmojis.length > 0 &&
            Math.random() < 0.5;


        if (useEmoji) {

            balloon.classList.add(
                "emoji-balloon"
            );


            balloon.textContent =
                balloonEmojis[
                    Math.floor(
                        Math.random() *
                        balloonEmojis.length
                    )
                ];

        } else {

            balloon.style.setProperty(
                "--balloon-color",
                color
            );


            const shine =
                document.createElement(
                    "div"
                );


            shine.className =
                "balloon-shine";


            balloon.appendChild(
                shine
            );
        }


        /* Random horizontal position */

        balloon.style.left =
            Math.random() * 90 + "%";


        /* Random floating speed */

        balloon.style.animationDuration =
            (Math.random() * 4 + 7) +
            "s";


        /* Balloon click */

        balloon.addEventListener(
            "click",
            () => {

                if (
                    typeof popBalloon ===
                    "function"
                ) {

                    popBalloon(
                        balloon,
                        color
                    );

                } else {

                    balloon.remove();

                }
            }
        );


        /* Add balloon to page */

        container.appendChild(
            balloon
        );


        /* Remove after animation */

        setTimeout(() => {

            if (balloon.parentNode) {

                balloon.remove();

            }

        }, 12000);
    }


    /* ================================================= */
    /* ⭐ NEW: CREATE MANY BALLOONS IMMEDIATELY          */
    /* ================================================= */

    for (let i = 0; i < 20; i++) {

        setTimeout(() => {

            spawnBalloon();

        }, i * 300);
    }


    /* ================================================= */
    /* ⭐ NEW: KEEP GENERATING BALLOONS                 */
    /* ================================================= */

    setInterval(() => {

        spawnBalloon();

    }, 1500);

}
