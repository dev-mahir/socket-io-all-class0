let camBtn = document.getElementById("camBtn");
let mic_btn = document.getElementById("micBtn");
let caller_screen = document.getElementById("caller-screen");

let peer_connection;
let local_stream;
let remote_stream;

//  create ice servers
let servers = {
    iceServers: [
        {
            urls: [
                "stun:stun1.1.google.com:19302",
                "stun:stun2.1.google.com:19302",
            ],
        },
    ],
};

// create a lacal stream
const local_stream_init = async () => {
    local_stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    document.getElementById("s2").srcObject = local_stream;
    local_stream.getAudioTracks()[0].enabled = false;
};

local_stream_init();

const create_offer = async () => {
    peer_connection = new RTCPeerConnection(servers);

    // get remote stream
    remote_stream = new MediaStream(); // just make a stream
    document.getElementById('s1').srcObject = remote_stream; 


    local_stream.getTracks().forEach((track) => {
        //remote client local stream
        peer_connection.addTrack(track, local_stream);
    });

    // send track to remote_stream
    peer_connection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remote_stream.addTrack(track);
        });
    };

    // check ice candidate (offer create ache kina)
    peer_connection.onicecandidate = (event) => {
        if (event.candidate) {
            document.getElementById("create-offer-sdp").value = JSON.stringify(
                peer_connection.localDescription
            );
        }
    };

    // create a offer
    let offer = await peer_connection.createOffer();
    document.getElementById("create-offer-sdp").value = JSON.stringify(offer);
    await peer_connection.setLocalDescription(offer);
};



//  create answer remote client
const create_answer = async () => {
    peer_connection = new RTCPeerConnection(servers);

    // get remote stream  (me)
    remote_stream = new MediaStream(); // just make a stream
    document.getElementById('s1').srcObject = remote_stream; 

    local_stream.getTracks().forEach((track) => {
        peer_connection.addTrack(track, local_stream);
    });

    // send track to remote_stream
    peer_connection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remote_stream.addTrack(track);
        });
    };

    // check ice candidate (offer create ache kina)
    peer_connection.onicecandidate = (event) => {
        if (event.candidate) {
            document.getElementById("create-offer-sdp").value = JSON.stringify(
                peer_connection.localDescription
            );
        }
    };

    // receive remote  offer
    let offer = document.getElementById("create-offer-sdp").value;
    offer = JSON.parse(offer);

    await  peer_connection.setRemoteDescription(offer)



    // create a answer
    let answer = await peer_connection.createAnswer();
    document.getElementById("create-answer-sdp").value = JSON.stringify(answer);
    await peer_connection.setLocalDescription(answer);


};



// add answer 
const addAnswer = async() => { 
    let answer = document.getElementById('add-answer-sdp').value;
    answer = JSON.parse(answer);
    await peer_connection.setRemoteDescription(answer);

}



document.getElementById("create-offer").onclick = () => {
    create_offer();
};
document.getElementById("create-answer").onclick = () => {
    create_answer();
};
document.getElementById("add-answer").onclick = () => {
    addAnswer();
};




// locam camera status

let camera_status = true;

camBtn.onclick = () => {
    camera_status = !camera_status;
    local_stream.getVideoTracks()[0].enabled = camera_status;
    caller_screen.classList.toggle("active");
    camBtn.classList.toggle("active");
};

// mic status
let mic_status = false;

mic_btn.onclick = () => {
    mic_status = !mic_status;
    local_stream.getAudioTracks()[0].enabled = mic_status;
    mic_btn.classList.toggle("active");
};
