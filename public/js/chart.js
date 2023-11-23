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

getData();

async function getData() {
    const file = urlParams.get("file");
    const frames = [];
    const psnr = [];
    const vmaf = [];

    const response = await fetch(`/api/vmaf/results/json?file=${file}`);
    const data = await response.json();

    const framesData = data.data.frames;
    for (let frame of framesData) {
        frames.push(frame.frameNum);
        psnr.push(frame.metrics.psnr);
        vmaf.push(frame.metrics.vmaf);
    }

    new Chart("myChart", {
        type: "line",
        data: {
            labels: frames,
            datasets: [
                {
                    label: "PSNR",
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(0,0,255,0.6)",
                    borderColor: "rgba(0,0,255,0.6)",
                    pointRadius: 0,
                    data: psnr,
                },
                {
                    label: "VMAF",
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(255,0,0,0.6)",
                    borderColor: "rgba(255,0,0,0.6)",
                    pointRadius: 0,
                    data: vmaf,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    position: "bottom",
                    display: true,
                },
                title: {
                    display: true,
                    text: `VMAF Results for ${file}`,
                },
            },
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "Frames",
                        padding: { top: 20, left: 0, right: 0, bottom: 0 },
                    },
                    ticks: {
                        stepSize: 10,
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: "Percentage (0-100%)",
                    },
                    max: 100,
                    min: 0,
                    ticks: {
                        stepSize: 2,
                    },
                    padding: { top: 20, left: 0, right: 0, bottom: 0 },
                },
            },
        },
    });
}
