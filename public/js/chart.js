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
