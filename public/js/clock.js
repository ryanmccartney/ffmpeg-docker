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

let offset = 0;
getTime();

function updateClock() {
    var now = new Date(new Date() - offset);
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var milliseconds = now.getMilliseconds();

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");
    milliseconds = Math.floor(milliseconds / 100).toString();

    var time = hours + ":" + minutes + ":" + seconds;
    var millisecondsText = milliseconds;
    document.getElementById("clock").textContent = time;
    document.getElementById("milliseconds").textContent = "." + millisecondsText;
}

async function getTime() {
    const startTime = performance.now();
    const response = await fetch(`/api/system/time`);
    const data = await response.json();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (data.data.datatime) {
        const serverTime = new Date(new Date(data.data.datatime) - duration);
        offset = new Date() - serverTime;

        console.log(`Request toook ${duration}ms`);
        console.log(`Server time is ${serverTime}`);
        console.log(`Offset time is ${offset}ms`);
        document.getElementById("subtitle").textContent = `Synced to ${location.hostname}. Offset is ${offset}ms`;
    } else {
        document.getElementById("subtitle").textContent = `Could not sync with server. Offset is ${offset}ms`;
    }

    setInterval(updateClock, 1); // Update every millisecond
}
