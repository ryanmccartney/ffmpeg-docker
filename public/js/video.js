/*
FFmpeg Docker, an API wrapper around FFmpeg running in a configurable docker container
Copyright (C) 2022 Ryan McCartney

This file is part of the FFmpeg Docker (ffmpeg-docker).

FFmpeg Docker is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

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
