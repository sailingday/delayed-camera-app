const video = document.getElementById('webcam');
const delayedCanvas = document.getElementById('delayedCanvas');
const delayedContext = delayedCanvas.getContext('2d');
const currentDelayElement = document.getElementById('currentDelay');
let delay = 5000; // 初期遅延時間は5000ミリ秒（5秒）
let frameBuffer = [];

document.getElementById('increaseDelay').addEventListener('click', () => {
    delay += 1000; // 遅延時間を1秒増やす
    updateDelayDisplay();
});

document.getElementById('decreaseDelay').addEventListener('click', () => {
    delay = Math.max(1000, delay - 1000); // 遅延時間を1秒減らすが、最小は1秒とする
    updateDelayDisplay();
});

function updateDelayDisplay() {
    currentDelayElement.textContent = delay / 1000; // 秒単位で表示
}

navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            delayedCanvas.width = video.videoWidth;
            delayedCanvas.height = video.videoHeight;
            captureAndDisplayDelayed();
        };
    })
    .catch((err) => {
        console.error("カメラへのアクセスに失敗しました: ", err);
    });

function captureAndDisplayDelayed() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setInterval(() => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            frameBuffer.push(imageData);
            if (frameBuffer.length > 1) {
                frameBuffer.shift();
            }
        }, delay);
    }, 100);

    function display() {
        if (frameBuffer.length) {
            delayedContext.putImageData(frameBuffer[0], 0, 0);
        }
        requestAnimationFrame(display);
    }

    display();
}