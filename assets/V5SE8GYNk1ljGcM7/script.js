let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let rockets = [];
let numRockets = 12;
let range = 100;
let isEmitting = true;

// Stop spawning after 5 seconds
setTimeout(() => {
    isEmitting = false;
}, 5000);

function fillRockets() {
    if (isEmitting) {
        for (let i = rockets.length; i < numRockets; i++) {
            addRocket();
        }
    }
}

function addRocket() {
    let x = Math.floor(Math.random() * canvas.width);
    let y = Math.floor(Math.random() * canvas.height);

    const rocket = {
        x: x,
        y: y,
        delay: Math.floor(Math.random() * 100),
        sparks: []
    };

    for (let i = 0; i < 50; i++) {
        const spark = {
            x: rocket.x,
            y: rocket.y,
            size: Math.random() + 3.5,
            fill: randColor(),
            vx: Math.random() * 5 - 2.5,
            vy: Math.random() * -5 + 2.5,
            ay: 0.05,
            alpha: 1,
            life: Math.round(Math.random() * range / 2) + range / 2,
        };

        spark.base = {
            life: spark.life,
            size: spark.size
        };

        rocket.sparks.push(spark);
    }

    rockets.push(rocket);
}

function randColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function update() {
    for (let i = rockets.length - 1; i >= 0; i--) {
        let rocket = rockets[i];
        if (!rocket) continue;

        rocket.delay--;

        if (rocket.delay > 0) continue;

        // FIXED: rocket.sparks (not rockets.sparks)
        for (let i2 = rocket.sparks.length - 1; i2 >= 0; i2--) {
            let spark = rocket.sparks[i2];
            if (!spark) continue;

            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.vy += spark.ay;

            spark.alpha = spark.life / spark.base.life;
            spark.size = spark.alpha * spark.base.size;
            spark.alpha = spark.alpha > 0.6 ? 1 : spark.alpha;

            spark.life--;

            if (spark.life <= 0) {
                rocket.sparks.splice(i2, 1);
            }
        }

        // FIXED: rocket.sparks (not rocket.spark)
        if (rocket.sparks.length === 0) {
            rockets.splice(i, 1);
        }
    }

    fillRockets();
}

function draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rockets.length; i++) {
        let rocket = rockets[i];

        if (rocket.delay > 0) continue;

        for (let i2 = 0; i2 < rocket.sparks.length; i2++) {
            let spark = rocket.sparks[i2];

            ctx.globalAlpha = spark.alpha;
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            ctx.fillStyle = spark.fill;
            ctx.fill();
        }
    }

    ctx.globalAlpha = 1;
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

console.clear();
fillRockets();
loop();