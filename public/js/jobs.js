const table = document.getElementById("jobTable");
let interval;

getJobs();

async function killJob(jobId) {
    const response = await fetch(`/api/system/job/kill/${jobId}`, {
        method: "POST",
    });
    console.log(`Killed Job ID ${jobId}`);
}

async function killAll() {
    const response = await fetch(`/api/system/job/kill/all`, {
        method: "POST",
    });
    console.log(`Killed all Jobs`);
}

async function getJobs() {
    for (let i = table.rows.length; i >= 1; i--) {
        try {
            await table.deleteRow(i);
        } catch (error) {
            console.log(error);
        }
    }

    const response = await fetch(`/api/system/job/all`);
    const data = await response.json();

    for (let [jobId, job] of Object.entries(data?.jobs)) {
        const row = await table.insertRow(table.rows.length);

        const cell1 = await row.insertCell(0);
        const cell2 = await row.insertCell(1);
        const cell3 = await row.insertCell(2);
        const cell4 = await row.insertCell(3);
        const cell5 = await row.insertCell(4);
        const cell6 = await row.insertCell(5);
        const cell7 = await row.insertCell(6);
        const cell8 = await row.insertCell(7);
        const cell9 = await row.insertCell(8);

        // Add some text to the new cells:
        cell1.innerHTML = job?.jobNumber || "-";
        cell2.innerHTML = job?.jobName || "-";
        cell3.innerHTML = job?.jobId || "-";

        for (let tag of job?.type) {
            if (tag === "file") {
                cell4.innerHTML += `<span class="badge badge-pill bg-danger">${tag}</span>`;
            } else if (tag === "bars") {
                cell4.innerHTML += `<span class="badge badge-pill bg-success">${tag}</span>`;
            } else if (tag === "decklink") {
                cell4.innerHTML += `<span class="badge badge-pill bg-warning">${tag}</span>`;
            } else {
                cell4.innerHTML += `<span class="badge badge-pill bg-info">${tag}</span>`;
            }
        }

        cell5.innerHTML = job?.started || "-";
        cell6.innerHTML = `${Math.round(job?.load?.cpu * 100)}%`;
        cell7.innerHTML = job?.progress
            ? `<div class="progress">
            <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" style="width: 25%" aria-valuenow="${job?.progress}" aria-valuemin="0" aria-valuemax="100"></div>${job?.progress}%
        </div>`
            : "-";
        cell8.innerHTML = `<a href="/api/system/job/thumbnail/${jobId}"><img src="/api/system/job/thumbnail/${jobId}?cahce=${Math.random()}" alt="No Image" class="img-thumbnail"></a>`;
        cell9.innerHTML = `<button onclick="killJob('${jobId}')" type="button" class="btn btn-danger">Kill</button>`;
    }
}

interval = setInterval(getJobs, 2000);
