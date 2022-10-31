// get elements
const screen_01 = document.getElementById("s1");
const screen_02 = document.getElementById("s2");
const camBtn = document.getElementById("camBtn");
const micBtn = document.getElementById("micBtn");
const screenShareBtn = document.getElementById("screenShareBtn");
const callerScreen = document.getElementById("caller-screen");

let camStream;
let screenStream;
let peerConnection;

// create  ice server 
let connection = {iceServers: [
    {
        "urls": [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302'
        ]
    }
]
}


// share webcam
const shareCam = () => {
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
            camStream = stream;
            screen_01.srcObject = camStream;
            // screen_02.srcObject = camStream;


        //     // create a peer connection
        //     peerConnection = new RTCPeerConnection(connection);

        //     // send my stream 
        //     peerConnection.addStream(camStream); 

        //     // receive other peer stream 
        //     peerConnection.onaddStream = (event) => {
        //         screen_01.srcObject = event.stream;
        //     }
        })
        .catch();
};

shareCam();

// cam video toggle
let camVideoStatus = true;
camBtn.onclick = (e) => {
    camVideoStatus = !camVideoStatus;
    camStream.getVideoTracks()[0].enabled = camVideoStatus;
    camBtn.classList.toggle("active");
};


// mic toggle
let camMicStatus = true;
micBtn.onclick = () => {
    camMicStatus = !camMicStatus;
    camStream.getAudioTracks()[0].enabled = camMicStatus;
    micBtn.classList.toggle("active");
};


// share screen
const shareScreen = () => {
    navigator.mediaDevices
        .getDisplayMedia({
            video: true,
            audio: true,
        })
        .then((stream) => {
            screenStream = stream;
            screen_01.srcObject = screenStream;
            screen_02.srcObject = camStream;
            callerScreen.style.display = "block";
        })
        .catch();
};




// share screen
let screenShareStatus = false;
screenShareBtn.onclick = () => {
    screenShareStatus = !screenShareStatus;
    if (screenShareStatus) {
        shareScreen();
    } else {
        callerScreen.style.display = "none";
        screenStream.getVideoTracks()[0].enabled = screenShareStatus;
        screen_01.srcObject = camStream;
    }

    screenShareBtn.classList.toggle("active");
};
