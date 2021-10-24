// URLを取得
var url = new URL(window.location.href);

// URLSearchParamsオブジェクトを取得
var params = url.searchParams;

var TIME = params.get("time");

if (TIME == null) {
    alert("invalid params...")
    TIME = 1;
}
const WIDTH = 200;
const HEIGHT = 400;
const POT_RADIUS = 100;
const POINT_NUM = 3;
const ANIMATION_FRAME = 60;
const WAVE_HEIGHT = 30;
const WAVE_NUM = 3;
const TIME_DAMPING = 4;
const HEIGHT_STEP = TIME >= 300 ? 2 : 4;
const HEIGHT_INIT = 20;
const WATER_COLOR = "rgb(247, 206, 72)"
var t = 0;
var h = HEIGHT_INIT;
var end_flag = false;
const canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const context = canvas.getContext('2d');

if (TIME <= 60) {
    h = POT_RADIUS;
}

if (TIME <= 30) {
    h = POT_RADIUS * 1.5;
}

if (TIME <= 10) {
    h = POT_RADIUS * 1.75
}

const DROP_TIMES = (2 * POT_RADIUS - h) / HEIGHT_STEP;

document.getElementById("main-canvas").appendChild(canvas);

var water_drop_y = 0;

function loop1(timestamp) {
    water_drop_y = t * t;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.beginPath();
    context.fillStyle = WATER_COLOR;
    context.moveTo(WIDTH / 2 + 10, water_drop_y);
    context.lineTo(WIDTH / 2 + 5, water_drop_y + 10);
    context.quadraticCurveTo(WIDTH / 2 + 10, water_drop_y + 20, WIDTH / 2 + 15, water_drop_y + 10)
    context.fill();
    context.beginPath();
    context.rect(0, (HEIGHT - h), WIDTH, h);
    context.fill();
    t += 1;
    if (water_drop_y >= HEIGHT - h) {
        t = 0;
        water_drop_y = 0;
        h += HEIGHT_STEP;
        window.requestAnimationFrame((ts) => loop2(ts));
        return;
    }
    window.requestAnimationFrame((ts) => loop1(ts));
}

function loop2(timestamp) {
    // 画面をつけていなかった時の例外処理
    if (h > 2 * POT_RADIUS) {
        end_flag = true;
        return;
    }
    if (end_flag) {
        return;
    }
    t += 1;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.beginPath();
    context.fillStyle = WATER_COLOR;
    context.moveTo(100, (HEIGHT - h))
    for (var i = 1; i <= POINT_NUM; i += 2) {
        context.quadraticCurveTo(
            WIDTH / 2 - i / POINT_NUM * WIDTH / 2,
            (HEIGHT - h) - Math.sin(i * Math.PI / 2) * WAVE_HEIGHT * Math.exp(-i / POINT_NUM) * Math.sin(WAVE_NUM * t / ANIMATION_FRAME * Math.PI) * Math.exp(-TIME_DAMPING * t / ANIMATION_FRAME),
            WIDTH / 2 - (i + 1) / POINT_NUM * WIDTH / 2,
            (HEIGHT - h))
    }
    context.lineTo(0, HEIGHT);
    context.lineTo(WIDTH / 2, HEIGHT);
    context.lineTo(WIDTH / 2, (HEIGHT - h));
    for (var i = 1; i <= POINT_NUM; i += 2) {
        context.quadraticCurveTo(
            WIDTH / 2 + i / POINT_NUM * WIDTH / 2,
            (HEIGHT - h) + Math.sin(i * Math.PI / 2) * WAVE_HEIGHT * Math.exp(-i / POINT_NUM) * Math.sin(WAVE_NUM * t / ANIMATION_FRAME * Math.PI) * Math.exp(-TIME_DAMPING * t / ANIMATION_FRAME),
            WIDTH / 2 + (i + 1) / POINT_NUM * WIDTH / 2,
            (HEIGHT - h))
    }
    context.lineTo(WIDTH, HEIGHT);
    context.lineTo(WIDTH / 2, HEIGHT);
    context.fill();

    if (t == ANIMATION_FRAME) {
        t = 0;
        context.clearRect(0, 0, WIDTH, HEIGHT);
        context.beginPath();
        context.rect(0, (HEIGHT - h), WIDTH, h);
        context.fill();
        if (h == 2 * POT_RADIUS) {
            end_flag = true;
            context.beginPath();
            context.arc(POT_RADIUS, HEIGHT - POT_RADIUS, POT_RADIUS, 0, 2 * Math.PI);
            context.clip();
        }
        return;
    }
    window.requestAnimationFrame((ts) => loop2(ts));
}
context.clearRect(0, 0, WIDTH, HEIGHT);
context.beginPath();
context.arc(POT_RADIUS, HEIGHT - POT_RADIUS, POT_RADIUS, 0, 2 * Math.PI);
context.rect(0, 0, WIDTH, HEIGHT - (2 * POT_RADIUS) - WAVE_HEIGHT / 2);
context.clip();
context.beginPath();
context.fillStyle = WATER_COLOR;
context.rect(0, (HEIGHT - h), WIDTH, h);
context.fill();
var start_time = Date.now();
var time = 0;
setTimeString();
var time_interval = setInterval(() => {
    time += 1;
    setTimeString();
    if (time == TIME) {
        clearInterval(time_interval);
    }
}, 1000);
var water_interval = setInterval(() => {
    t = 0;
    if (end_flag) {
        clearInterval(water_interval);
        return;
    }
    window.requestAnimationFrame((ts) => loop1(ts));
}, TIME / DROP_TIMES * 1000)

function setTimeString() {
    var el = document.getElementById("time");
    var remain = TIME - time;
    var hour = Math.floor(remain / 3600);
    remain -= 3600 * hour;
    var minute = Math.floor(remain / 60);
    remain -= 60 * minute;
    var second = remain;
    var hourString = ("00" + hour).slice(-2);
    var minuteString = ("00" + minute).slice(-2);
    var secondString = ("00" + second).slice(-2);

    el.innerHTML = hourString + ":" + minuteString + ":" + secondString;
}