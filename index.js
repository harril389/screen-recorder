var clearTime;
var seconds = 0,
    minutes = 0,
    hours = 0;
var secs, mins, gethours;
var isSave = true;
const timer = document.getElementById("timer");

const startWatch = () => {
    if (seconds === 60) {
        seconds = 0;
        minutes = minutes + 1;
    }
    mins = minutes < 10 ? "0" + minutes + ": " : minutes + ": ";
    if (minutes === 60) {
        minutes = 0;
        hours = hours + 1;
    }
    gethours = hours < 10 ? "0" + hours + ": " : hours + ": ";
    secs = seconds < 10 ? "0" + seconds : seconds;
    timer.innerHTML = gethours + mins + secs;
    seconds++;
    clearTime = setTimeout("startWatch()", 1000);
}

const startTime = () => {
    if (seconds === 0 && minutes === 0 && hours === 0) {
        startWatch();
    }
}

const stopTime = () => {
    if (seconds !== 0 || minutes !== 0 || hours !== 0) {
        seconds = 0;
        minutes = 0;
        hours = 0;
        secs = "0" + seconds;
        mins = "0" + minutes + ": ";
        gethours = "0" + hours + ": ";

        var stopTime = gethours + mins + secs;
        timer.innerHTML = stopTime;
        clearTimeout(clearTime);
    }
}

const pauseTime = () => {
    if (seconds !== 0 || minutes !== 0 || hours !== 0) {
        var stopTime = gethours + mins + secs;
        timer.innerHTML = stopTime;

        clearTimeout(clearTime);
    }
}


const continueTime = () => {
    if (seconds !== 0 || minutes !== 0 || hours !== 0) {
        var continueTime = gethours + mins + secs;
        timer.innerHTML = continueTime;
        clearTimeout(clearTime);
        clearTime = setTimeout("startWatch()", 1000);
    }
}

// screen record
let start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    pause = document.getElementById('pause'),
    resume = document.getElementById('resume'),
    clear = document.getElementById('clear'),
    mediaRecorder;

const videoElem = document.getElementById("video");

const recordScreen = async () => {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: { mediaSource: "screen" }
    });
}

const saveFile = (recordedChunks) => {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });
    if (isSave) {
        let filename = window.prompt('Enter file name');
        if (filename) {
            let downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${filename}.webm`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }

    }

    URL.revokeObjectURL(blob); // clear from memory
    start.style.display = "block";
    stop.style.display = "none";
    pause.style.display = "none";
    resume.style.display = "none";
    clear.style.display = "none";
    timer.style.color = "#4caf50";
    stopTime();
}

const createRecorder = (stream, mimeType) => {
    // the stream data is stored in this array
    let recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };
    mediaRecorder.onstop = function () {
        saveFile(recordedChunks);
        recordedChunks = [];
    };
    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    return mediaRecorder;
}

const startRecord = async () => {
    let stream = await recordScreen();
    isSave = true;
    videoElem.srcObject = stream
    videoElem.srcObject.getVideoTracks()[0];
    let mimeType = 'video/webm';
    mediaRecorder = createRecorder(stream, mimeType);
    start.style.display = "none";
    stop.style.display = "block";
    clear.style.display = "block";
    pause.style.display = "block";
    timer.style.color = "#4caf50";

    startTime();
}

const stopRecord = () => {
    mediaRecorder.stop();
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
}

const pauseRecord = () => {
    mediaRecorder.pause();
    resume.style.display = "block";
    pause.style.display = "none";
    timer.style.color = "#ed6c02";
    pauseTime();
}

const resumeRecord = () => {
    mediaRecorder.resume();
    resume.style.display = "none";
    pause.style.display = "block";
    timer.style.color = "#0288d1";
    continueTime();
}


const clearRecord = () => {
    isSave = false;
    stopRecord();
}

start.addEventListener('click', startRecord)

stop.addEventListener('click', stopRecord)

pause.addEventListener('click', pauseRecord)

resume.addEventListener('click', resumeRecord)

clear.addEventListener('click', clearRecord)

