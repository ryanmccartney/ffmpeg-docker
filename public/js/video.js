const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const file = urlParams.get("file");
const filePath = `/api/hls/${file}.m3u8`;

const options = {
    sources: [
        {
            src: filePath,
            type: "application/x-mpegURL",
        },
    ],
    fluid: true,
};

const player = videojs("video-player", options, function onPlayerReady() {
    videojs.log("Video player is ready.");
    this.play();
});
