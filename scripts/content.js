const createDisplayExtension = () => {
    var clearTime;
    var seconds = 0,
        minutes = 0,
        hours = 0;
    var secs, mins, gethours;
    var isSave = true;
    var stream;

    var div = document.createElement('div');
    div.style = "position: fixed; bottom: 20px; left: 20px; background: #fff; border-radius: 8px; padding: 10px; box-shadow: 0 2px 3px #ccc;";
    div.innerHTML = `<div id="box-button">
        <button id="start">Start</button>
        <button id="stop" style="display:none;">Stop</button>
        <button id="pause" style="display:none;">Pause </button>
        <button id="resume" style="display:none;">Continue</button>
        <button id="clear" style="display:none;">Clear</button>
        <p id="timer"> 00:00:00 </p>
    </div>
    <style>
        #box-button {
            display: flex;
            font-family: sans-serif;
        }
    
        #timer {
            width: 100px;
            padding: 6px 8px;
            font-weight: bold;
            font-size: 18px;
            display: block;
            border: 1px solid #eee;
            border-radius: 50px;
            text-align: center;
            box-shadow: 0 2px 3px #ccc;
            background-color: white;
            color: #4caf50;
            margin: 0;
            white-space: nowrap;
        }
    
        #box-button>button {
            border: 1px solid #eee;
            padding: 6px 8px;
            width: fit-content;
            border-radius: 50px;
            font-size: 18px;
            box-shadow: 0 2px 3px #ccc;
            background-color: white;
            font-weight: bold;
            cursor: pointer;
        }
    
        #start {
            color: #4caf50;
        }
    
        #stop {
            color: #d32f2f;
        }
    
        #pause {
            color: #ed6c02;
        }
    
        #resume {
            color: #0288d1;
        }
    
        #clear {
            color: #ff0000;
        }
    
        #box-button>*:not(:last-child) {
            margin-right: 16px;
        }
    </style>
    `

    document.body.appendChild(div);

    // screen record
    let start = document.getElementById('start'),
        stop = document.getElementById('stop'),
        pause = document.getElementById('pause'),
        resume = document.getElementById('resume'),
        clear = document.getElementById('clear'),
        timer = document.getElementById("timer"),
        mediaRecorder;

    const startTimer = () => {
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
        clearTime = setTimeout(startTimer, 1000);
    }

    const startTime = () => {
        if (seconds === 0 && minutes === 0 && hours === 0) {
            startTimer();
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
            clearTime = setTimeout(startTimer, 1000);
        }
    }

    const changeStyle = (data) => {
        data.map((item) => {
            switch (item.key) {
                case 'start':
                    start.style.display = item.value;
                    break;
                case 'stop':
                    stop.style.display = item.value;
                    break;
                case 'pause':
                    pause.style.display = item.value;
                    break;
                case 'resume':
                    resume.style.display = item.value;
                    break;
                case 'clear':
                    clear.style.display = item.value;
                    break;
                case 'timer':
                    timer.style.color = item.value;
                    break;
                default:
                    break;
            }
        })
    }

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
        changeStyle([{ key: 'start', value: 'block' }, { key: 'stop', value: 'none' }, { key: 'pause', value: 'none' }, { key: 'resume', value: 'none' }, { key: 'clear', value: 'none' }, { key: 'timer', value: '#4caf50' }]);
        stopTime();
        document.body.removeChild(div);
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
        stream = await recordScreen();
        isSave = true;
        let mimeType = 'video/webm';
        mediaRecorder = createRecorder(stream, mimeType);
        changeStyle([{ key: 'start', value: 'none' }, { key: 'stop', value: 'block' }, { key: 'pause', value: 'block' }, { key: 'clear', value: 'block' }, { key: 'timer', value: '#4caf50' }]);
        startTime();
    }

    const stopRecord = () => {
        mediaRecorder.stop();
        let tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
    }

    const pauseRecord = () => {
        mediaRecorder.pause();
        changeStyle([{ key: 'resume', value: 'block' }, { key: 'pause', value: 'none' }, { key: 'timer', value: '#ed6c02' }]);
        pauseTime();
    }

    const resumeRecord = () => {
        mediaRecorder.resume();
        changeStyle([{ key: 'resume', value: 'none' }, { key: 'pause', value: 'block' }, { key: 'timer', value: '#0288d1' }]);
        continueTime();
    }


    const clearRecord = () => {
        isSave = false;
        stopRecord();
    }

    start.addEventListener('click', startRecord);

    stop.addEventListener('click', stopRecord);

    pause.addEventListener('click', pauseRecord);

    resume.addEventListener('click', resumeRecord);

    clear.addEventListener('click', clearRecord);
}

function sendMessageToPopup(message) {
    chrome.runtime.sendMessage(message);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('Thông điệp nhận từ popup:', message);
    createDisplayExtension();

});