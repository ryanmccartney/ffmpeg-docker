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

const gaugeOptions = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.44, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: "#000000", // Fill color
    },
    limitMax: false, // If false, max value increases automatically if value > maxValue
    limitMin: false, // If true, the min value of the gauge will be fixed
    percentColors: [
        [0.25, "#0BD70B"],
        [0.5, "#FFB300"],
        [1.0, "#FF3300"],
    ],
    staticLabels: {
        font: "10px sans-serif", // Specifies font
        labels: [0, 100], // Print labels at these values
        color: "#000000", // Optional: Label text color
        fractionDigits: 0,
    },
    strokeColor: "#E0E0E0",
    generateGradient: false,
    highDpiSupport: true, // High resolution support
};

const gaugeCpuElement = document.getElementById("gaugeCpu");
const gaugeMemoryElement = document.getElementById("gaugeMemory");
const gaugeDiskElement = document.getElementById("gaugeDisk");

const textCpuElement = document.getElementById("textCpu");
const textMemoryElement = document.getElementById("textMemory");
const textDiskElement = document.getElementById("textDisk");

const gaugeCpu = new Gauge(gaugeCpuElement).setOptions(gaugeOptions);
const gaugeMemory = new Gauge(gaugeMemoryElement).setOptions(gaugeOptions);
const gaugeDisk = new Gauge(gaugeDiskElement).setOptions(gaugeOptions);

gaugeCpu.maxValue = 100;
gaugeCpu.setMinValue(0);
gaugeCpu.set(0);

gaugeMemory.maxValue = 100;
gaugeMemory.setMinValue(0);
gaugeMemory.set(0);

gaugeDisk.maxValue = 100;
gaugeDisk.setMinValue(0);
gaugeDisk.set(0);

const getData = async () => {
    const response = await fetch(`/api/system/stats`);
    const data = await response.json();

    gaugeCpu.set(data?.load * 100);
    gaugeMemory.set(data?.memory?.usage * 100);
    gaugeDisk.set(data?.disk?.usage * 100);

    textCpuElement.innerHTML = `${Math.round(data?.load * 100)}%`;
    textMemoryElement.innerHTML = `${Math.round(data?.memory?.usage * 100)}% (${Math.round(
        (data?.memory?.total - data?.memory?.free) / 1000000000
    )}GB / ${Math.round(data?.memory?.total / 1000000000)}GB)`;

    textDiskElement.innerHTML = `${Math.round(data?.disk?.usage * 100)}% (${Math.round(
        (data?.disk?.size - data?.disk?.free) / 1000000000
    )}GB / ${Math.round(data?.disk?.size / 1000000000)}GB)`;
};

getData();
const interval = setInterval(getData, 1000);
