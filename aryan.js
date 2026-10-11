// ======================================
// CANSAT GROUND CONTROL STATION
// app.js
// ======================================

// ===========================
// GLOBAL VARIABLES
// ===========================

let telemetryTimer = null;
let telemetryLogs = [];

let payloadSeparated = true;
let emergencyParachute = false;

const telemetry = {
    altitude: 500,
    temperature: 25,
    pressure: 1013,
    battery: 12.6,
    descentRate: 9.0,

    latitude: 22.3072,
    longitude: 73.1812,

    pitch: 0,
    roll: 0,
    yaw: 0
};

// ===========================
// TELEMETRY CARDS
// ===========================

const telemetryContainer =
    document.getElementById("telemetryCards");

function renderTelemetry() {

    telemetryContainer.innerHTML = `

    <div class="telemetry-card">
        <div class="telemetry-label">Altitude</div>
        <div class="telemetry-value">
            ${telemetry.altitude.toFixed(2)} m
        </div>
    </div>

    <div class="telemetry-card">
        <div class="telemetry-label">Temperature</div>
        <div class="telemetry-value">
            ${telemetry.temperature.toFixed(2)} °C
        </div>
    </div>

    <div class="telemetry-card">
        <div class="telemetry-label">Pressure</div>
        <div class="telemetry-value">
            ${telemetry.pressure.toFixed(2)} hPa
        </div>
    </div>

    <div class="telemetry-card">
        <div class="telemetry-label">Battery</div>
        <div class="telemetry-value">
            ${telemetry.battery.toFixed(2)} V
        </div>
    </div>

    <div class="telemetry-card">
        <div class="telemetry-label">Descent Rate</div>
        <div class="telemetry-value">
            ${telemetry.descentRate.toFixed(2)} m/s
        </div>
    </div>

    <div class="telemetry-card">
        <div class="telemetry-label">GPS</div>
        <div class="telemetry-value">
            ${telemetry.latitude.toFixed(5)},
            ${telemetry.longitude.toFixed(5)}
        </div>
    </div>

    `;
}

// ===========================
// ERROR CODE SYSTEM
// ===========================

function updateErrorCode() {

    let digit1 =
        telemetry.descentRate >= 8 &&
        telemetry.descentRate <= 10
        ? 0
        : 1;

    let digit2 =
        telemetry.latitude &&
        telemetry.longitude
        ? 0
        : 1;

    let digit3 =
        payloadSeparated
        ? 0
        : 1;

    let digit4 =
        emergencyParachute
        ? 1
        : 0;

    const code =
        `${digit1}${digit2}${digit3}${digit4}`;

    document.getElementById("errorCode")
        .innerText = code;
}

// ===========================
// CHART.JS
// ===========================

const chartCtx =
    document.getElementById("altitudeChart");

const altitudeChart = new Chart(chartCtx, {

    type: "line",

    data: {
        labels: [],
        datasets: [{
            label: "Altitude",

            data: [],

            borderColor: "#00d9ff",

            borderWidth: 2,

            tension: 0.3
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// ===========================
// GPS MAP
// ===========================

const map = L.map("map")
    .setView(
        [telemetry.latitude, telemetry.longitude],
        13
    );

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap Contributors"
    }
).addTo(map);

const marker = L.marker(
    [telemetry.latitude, telemetry.longitude]
).addTo(map);

const pathPoints = [];

const polyline = L.polyline(
    pathPoints,
    {
        color: "cyan"
    }
).addTo(map);

// ===========================
// THREE JS
// ===========================

const orientationDiv =
    document.getElementById("orientation");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    orientationDiv.clientWidth /
    orientationDiv.clientHeight,
    0.1,
    1000
);

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });

renderer.setSize(
    orientationDiv.clientWidth,
    orientationDiv.clientHeight
);

orientationDiv.appendChild(
    renderer.domElement
);

const geometry =
    new THREE.BoxGeometry(1, 1, 2);

const material =
    new THREE.MeshNormalMaterial();

const cansat =
    new THREE.Mesh(
        geometry,
        material
    );

scene.add(cansat);

camera.position.z = 4;

function animate3D() {

    requestAnimationFrame(
        animate3D
    );

    cansat.rotation.x =
        THREE.MathUtils.degToRad(
            telemetry.pitch
        );

    cansat.rotation.y =
        THREE.MathUtils.degToRad(
            telemetry.yaw
        );

    cansat.rotation.z =
        THREE.MathUtils.degToRad(
            telemetry.roll
        );

    renderer.render(
        scene,
        camera
    );
}

animate3D();

// ===========================
// TELEMETRY GENERATOR
// ===========================

function generateTelemetry() {

    telemetry.altitude -=
        Math.random() * 5;

    telemetry.temperature =
        20 + Math.random() * 10;

    telemetry.pressure =
        1000 + Math.random() * 20;

    telemetry.battery -=
        0.005;

    telemetry.descentRate =
        7 + Math.random() * 5;

    telemetry.latitude +=
        0.0001;

    telemetry.longitude +=
        0.0001;

    telemetry.pitch =
        Math.random() * 40 - 20;

    telemetry.roll =
        Math.random() * 40 - 20;

    telemetry.yaw =
        Math.random() * 360;
}

// ===========================
// UPDATE DASHBOARD
// ===========================

function updateDashboard() {

    generateTelemetry();

    renderTelemetry();

    updateErrorCode();

    altitudeChart.data.labels.push(
        altitudeChart.data.labels.length
    );

    altitudeChart.data.datasets[0].data.push(
        telemetry.altitude
    );

    altitudeChart.update();

    marker.setLatLng([
        telemetry.latitude,
        telemetry.longitude
    ]);

    pathPoints.push([
        telemetry.latitude,
        telemetry.longitude
    ]);

    polyline.setLatLngs(
        pathPoints
    );

    telemetryLogs.push({
        ...telemetry
    });
}

// ===========================
// START TELEMETRY
// ===========================

function startTelemetry() {

    if (telemetryTimer) return;

    telemetryTimer =
        setInterval(
            updateDashboard,
            1000
        );
}

// ===========================
// STOP TELEMETRY
// ===========================

function stopTelemetry() {

    clearInterval(
        telemetryTimer
    );

    telemetryTimer = null;
}

// ===========================
// RESET
// ===========================

function resetPackets() {

    telemetryLogs = [];

    altitudeChart.data.labels = [];

    altitudeChart.data.datasets[0].data = [];

    altitudeChart.update();
}

// ===========================
// CSV EXPORT
// ===========================

function exportCSV() {

    let csv =
        "altitude,temperature,pressure,battery,descentRate,latitude,longitude,pitch,roll,yaw\n";

    telemetryLogs.forEach(row => {

        csv +=
            `${row.altitude},` +
            `${row.temperature},` +
            `${row.pressure},` +
            `${row.battery},` +
            `${row.descentRate},` +
            `${row.latitude},` +
            `${row.longitude},` +
            `${row.pitch},` +
            `${row.roll},` +
            `${row.yaw}\n`;
    });

    const blob =
        new Blob([csv], {
            type: "text/csv"
        });

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "telemetry.csv";

    link.click();
}

// ===========================
// MISSION COMMANDS
// ===========================

function manualSeparation() {

    payloadSeparated = true;

    setStatus(
        "Payload Separated"
    );
}

function deployParachute() {

    emergencyParachute = true;

    setStatus(
        "Emergency Parachute Activated"
    );

    updateErrorCode();
}

function redundantActivation() {

    setStatus(
        "Redundant System Activated"
    );
}

function setStatus(text) {

    document
        .getElementById("missionStatus")
        .innerText = text;
}

// ===========================
// CAMERA STREAM
// ===========================

async function startCamera() {

    try {

        const stream =
            await navigator
                .mediaDevices
                .getUserMedia({
                    video: true
                });

        document
            .getElementById("videoFeed")
            .srcObject = stream;

    } catch (error) {

        console.error(error);
    }
}

// ===========================
// INITIALIZE
// ===========================

renderTelemetry();

updateErrorCode();