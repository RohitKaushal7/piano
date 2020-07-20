const recordAudio = () =>
    new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);

        });

        const start = () => mediaRecorder.start();

        const stop = () =>
            new Promise(resolve => {
                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    const play = () => audio.play();
                    resolve({ audioBlob, audioUrl, play });
                });

                mediaRecorder.stop();
                stream.getTracks() // get all tracks from the MediaStream
                    .forEach(track => track.stop()); // stop each of them
            });

        resolve({ start, stop });
    });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

// Record
let recorder;
let startRecording = async () => {
    recorder = await recordAudio();
    let old = document.querySelector('audio');
    if (old) {
        URL.revokeObjectURL(old.src)
    }
    document.querySelector(".record .file").innerHTML = 'recording...';
    recorder.start();
}

let stopRecording = async () => {
    audio = await recorder.stop()

    let container = new Audio(URL.createObjectURL(audio.audioBlob))
    container.setAttribute("controls", "true")
    container.seekable = true;
    container.setAttribute("type", "audio/wav");
    container.title = "play.wav";
    document.querySelector(".record .file").innerHTML = '';
    document.querySelector(".record .file").appendChild(container)

}
