/* =====================================================
   CONSTANTES FÍSICAS
===================================================== */

const SPEED_OF_LIGHT = 299792458;


/* =====================================================
   ELEMENTOS HTML
===================================================== */

const frequencyInput =
    document.getElementById("frequency");

const simulateButton =
    document.getElementById("simulateButton");

const frequencyResult =
    document.getElementById("frequencyResult");

const wavelengthResult =
    document.getElementById("wavelengthResult");

const dipoleResult =
    document.getElementById("dipoleResult");

const simFrequency =
    document.getElementById("simFrequency");

const simWavelength =
    document.getElementById("simWavelength");

const radiationFrequency =
    document.getElementById("radiationFrequency");


/* =====================================================
   CANVAS DE FONDO
===================================================== */

const backgroundCanvas =
    document.getElementById("backgroundCanvas");

const bg =
    backgroundCanvas.getContext("2d");


/* =====================================================
   CANVAS DE ONDAS
===================================================== */

const waveCanvas =
    document.getElementById("waveCanvas");

const wave =
    waveCanvas.getContext("2d");


/* =====================================================
   CANVAS DE RADIACIÓN
===================================================== */

const radiationCanvas =
    document.getElementById("radiationCanvas");

const radiation =
    radiationCanvas.getContext("2d");


/* =====================================================
   VARIABLES
===================================================== */

let frequencyMHz = 100;

let wavelength = 0;

let dipoleLength = 0;

let animationTime = 0;


/* =====================================================
   CÁLCULOS FÍSICOS
===================================================== */

function calculatePhysics() {

    frequencyMHz =
        Number(frequencyInput.value);


    if (
        !Number.isFinite(frequencyMHz) ||
        frequencyMHz <= 0
    ) {

        alert(
            "Introduce una frecuencia válida."
        );

        return;

    }


    /*
        Convertimos MHz → Hz
    */

    const frequencyHz =
        frequencyMHz * 1000000;


    /*
        λ = c / f
    */

    wavelength =
        SPEED_OF_LIGHT /
        frequencyHz;


    /*
        Dipolo de media onda
    */

    dipoleLength =
        wavelength / 2;


    /*
        Actualizamos la interfaz
    */

    frequencyResult.textContent =
        frequencyMHz.toFixed(2);


    wavelengthResult.textContent =
        wavelength.toFixed(3);


    dipoleResult.textContent =
        dipoleLength.toFixed(3);


    simFrequency.textContent =
        `${frequencyMHz.toFixed(2)} MHz`;


    simWavelength.textContent =
        `${wavelength.toFixed(3)} m`;


    radiationFrequency.textContent =
        `${frequencyMHz.toFixed(2)} MHz`;

}


/* =====================================================
   BOTÓN SIMULAR
===================================================== */

simulateButton.addEventListener(
    "click",
    calculatePhysics
);


/* =====================================================
   BOTONES DE FRECUENCIA
===================================================== */

const frequencyButtons =
    document.querySelectorAll(
        ".frequency-btn"
    );


frequencyButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const value =
                Number(
                    button.dataset.frequency
                );


            frequencyInput.value =
                value;


            frequencyButtons.forEach(
                b =>
                    b.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            calculatePhysics();

        }
    );

});


/* =====================================================
   ENTER EN EL INPUT
===================================================== */

frequencyInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            calculatePhysics();

        }

    }
);


/* =====================================================
   AJUSTAR CANVAS
===================================================== */

function resizeCanvas(canvas) {

    const ratio =
        window.devicePixelRatio || 1;


    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;


    const context =
        canvas.getContext("2d");


    context.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

}


/* =====================================================
   FONDO DE ONDAS
===================================================== */

function drawBackground() {

    const width =
        backgroundCanvas.clientWidth;

    const height =
        backgroundCanvas.clientHeight;


    bg.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        Horizonte
    */

    const horizon =
        height * 0.54;


    /*
        Fondo
    */

    const gradient =
        bg.createLinearGradient(
            0,
            0,
            0,
            height
        );


    gradient.addColorStop(
        0,
        "#010711"
    );


    gradient.addColorStop(
        0.45,
        "#021526"
    );


    gradient.addColorStop(
        1,
        "#01060d"
    );


    bg.fillStyle =
        gradient;


    bg.fillRect(
        0,
        0,
        width,
        height
    );


    /*
        Malla de ondas
    */

    const lines = 32;

    const points = 70;


    for (
        let row = 0;
        row < lines;
        row++
    ) {

        const depth =
            row / lines;


        const yBase =
            horizon +
            depth * height * 0.45;


        bg.beginPath();


        for (
            let i = 0;
            i <= points;
            i++
        ) {

            const x =
                (i / points) *
                width;


            /*
                Onda relacionada
                con la frecuencia
            */

            const frequencyScale =
                Math.max(
                    0.25,
                    150 /
                    frequencyMHz
                );


            const wave1 =
                Math.sin(
                    i * 0.23 *
                    frequencyScale +
                    animationTime * 0.8
                );


            const wave2 =
                Math.sin(
                    i * 0.11 *
                    frequencyScale -
                    animationTime * 0.35
                );


            const amplitude =
                (1 - depth) *
                35 +
                8;


            const y =
                yBase +
                (
                    wave1 * 0.7 +
                    wave2 * 0.3
                ) *
                amplitude;


            if (i === 0) {

                bg.moveTo(
                    x,
                    y
                );

            } else {

                bg.lineTo(
                    x,
                    y
                );

            }

        }


        /*
            Líneas más lejanas
            más transparentes
        */

        const alpha =
            0.03 +
            (1 - depth) * 0.10;


        bg.strokeStyle =
            `rgba(0, 190, 255, ${alpha})`;


        bg.lineWidth =
            depth < 0.4
                ? 1.1
                : 0.7;


        bg.stroke();

    }


    /*
        Líneas verticales
        de perspectiva
    */

    for (
        let i = -15;
        i <= 15;
        i++
    ) {

        const xBottom =
            width / 2 +
            i * 100;


        bg.beginPath();


        bg.moveTo(
            width / 2,
            horizon
        );


        bg.lineTo(
            xBottom,
            height
        );


        bg.strokeStyle =
            "rgba(0, 170, 240, 0.035)";


        bg.lineWidth =
            1;


        bg.stroke();

    }

}


/* =====================================================
   ONDA PRINCIPAL
===================================================== */

function drawWave() {

    const width =
        waveCanvas.clientWidth;

    const height =
        waveCanvas.clientHeight;


    wave.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        Fondo del área
    */

    const gradient =
        wave.createLinearGradient(
            0,
            0,
            0,
            height
        );


    gradient.addColorStop(
        0,
        "rgba(0,30,50,0.1)"
    );


    gradient.addColorStop(
        1,
        "rgba(0,5,15,0.7)"
    );


    wave.fillStyle =
        gradient;


    wave.fillRect(
        0,
        0,
        width,
        height
    );


    /*
        Número de líneas
    */

    const lines = 35;


    for (
        let row = 0;
        row < lines;
        row++
    ) {

        const depth =
            row / lines;


        const baseY =
            height *
            0.35 +
            depth *
            height *
            0.7;


        wave.beginPath();


        for (
            let x = 0;
            x <= width;
            x += 8
        ) {

            /*
                Aumentar frecuencia
                junta las ondas
            */

            const frequencyScale =
                Math.max(
                    0.35,
                    150 /
                    frequencyMHz
                );


            const phase =
                x *
                0.025 *
                frequencyScale;


            const waveA =
                Math.sin(
                    phase +
                    animationTime
                );


            const waveB =
                Math.sin(
                    phase * 0.47 -
                    animationTime * 0.6
                );


            const amplitude =
                (1 - depth) *
                45 +
                5;


            const y =
                baseY +
                (
                    waveA * 0.7 +
                    waveB * 0.3
                ) *
                amplitude;


            if (x === 0) {

                wave.moveTo(
                    x,
                    y
                );

            } else {

                wave.lineTo(
                    x,
                    y
                );

            }

        }


        const alpha =
            0.025 +
            (1 - depth) * 0.10;


        wave.strokeStyle =
            `rgba(45, 205, 255, ${alpha})`;


        wave.lineWidth =
            1;


        wave.stroke();

    }


    /*
        Línea central de propagación
    */

    wave.beginPath();


    wave.moveTo(
        0,
        height * 0.5
    );


    wave.lineTo(
        width,
        height * 0.5
    );


    wave.strokeStyle =
        "rgba(80,220,255,0.08)";


    wave.stroke();

}


/* =====================================================
   PATRÓN DE RADIACIÓN
===================================================== */

function drawRadiationPattern() {

    const width = radiationCanvas.clientWidth;
    const height = radiationCanvas.clientHeight;

    radiation.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    /*
        Patrón analítico de un dipolo delgado de media onda.

        E(theta) = cos((pi/2) cos(theta)) / sin(theta)

        theta = 0° y 180° -> nulos sobre el eje de la antena
        theta = 90° y 270° -> máxima radiación

        El patrón se normaliza para que el máximo sea 0 dB.
    */

    const maxRadius = Math.min(width, height) * 0.38;
    const minDb = -25;
    const maxGainDbi = 2.15;

    function patternDb(theta) {
        const sinTheta = Math.sin(theta);

        if (Math.abs(sinTheta) < 1e-8) {
            return minDb;
        }

        const field = Math.abs(
            Math.cos((Math.PI / 2) * Math.cos(theta)) /
            sinTheta
        );

        if (field < 1e-8) {
            return minDb;
        }

        return Math.max(
            minDb,
            20 * Math.log10(field)
        );
    }

    function radiusFromDb(db) {
        return maxRadius * (db - minDb) / (0 - minDb);
    }

    /* Fondo */
    radiation.fillStyle = "rgba(1,10,20,0.3)";
    radiation.fillRect(0, 0, width, height);

    /* Rejilla polar en dB */
    const dbRings = [0, -3, -6, -10, -15, -20, -25];

    dbRings.forEach(db => {
        const r = radiusFromDb(db);

        radiation.beginPath();
        radiation.arc(centerX, centerY, r, 0, Math.PI * 2);
        radiation.strokeStyle = "rgba(70,190,240,0.10)";
        radiation.lineWidth = db === 0 ? 1.2 : 0.8;
        radiation.stroke();

        radiation.fillStyle = "rgba(150,220,240,0.55)";
        radiation.font = "10px Arial";
        radiation.fillText(
            db === 0 ? `${maxGainDbi.toFixed(2)} dBi` : `${db} dB`,
            centerX + 5,
            centerY - r + 12
        );
    });

    /* Ejes angulares */
    for (let i = 0; i < 12; i++) {
        const theta = i * Math.PI / 6;

        radiation.beginPath();
        radiation.moveTo(centerX, centerY);
        radiation.lineTo(
            centerX + maxRadius * Math.sin(theta),
            centerY - maxRadius * Math.cos(theta)
        );
        radiation.strokeStyle = "rgba(70,190,240,0.08)";
        radiation.lineWidth = 1;
        radiation.stroke();
    }

    /* Patrón polar */
    radiation.beginPath();

    const samples = 720;

    for (let i = 0; i <= samples; i++) {
        const theta = (i / samples) * Math.PI * 2;
        const db = patternDb(theta);
        const r = radiusFromDb(db);

        const x = centerX + r * Math.sin(theta);
        const y = centerY - r * Math.cos(theta);

        if (i === 0) {
            radiation.moveTo(x, y);
        } else {
            radiation.lineTo(x, y);
        }
    }

    radiation.strokeStyle = "#49d9ff";
    radiation.lineWidth = 2.5;
    radiation.shadowBlur = 15;
    radiation.shadowColor = "#00bfff";
    radiation.stroke();
    radiation.shadowBlur = 0;

    /* Eje físico del dipolo */
    radiation.beginPath();
    radiation.moveTo(centerX, centerY - 32);
    radiation.lineTo(centerX, centerY + 32);
    radiation.strokeStyle = "#dffaff";
    radiation.lineWidth = 4;
    radiation.stroke();

    /* Punto de alimentación */
    radiation.beginPath();
    radiation.arc(centerX, centerY, 5, 0, Math.PI * 2);
    radiation.fillStyle = "#00d9ff";
    radiation.shadowBlur = 20;
    radiation.shadowColor = "#00d9ff";
    radiation.fill();
    radiation.shadowBlur = 0;

    /* Etiquetas angulares */
    radiation.fillStyle = "rgba(170,225,240,0.75)";
    radiation.font = "10px Arial";
    radiation.textAlign = "center";
    radiation.textBaseline = "middle";

    for (let i = 0; i < 8; i++) {
        const theta = i * Math.PI / 4;
        const labelRadius = maxRadius + 16;
        const x = centerX + labelRadius * Math.sin(theta);
        const y = centerY - labelRadius * Math.cos(theta);
        radiation.fillText(`${i * 45}°`, x, y);
    }

    radiation.textAlign = "start";
    radiation.textBaseline = "alphabetic";
}

/* =====================================================
   BUCLE PRINCIPAL
===================================================== */

function animate() {

    animationTime += 0.015;

    drawBackground();

    drawWave();

    requestAnimationFrame(
        animate
    );

}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

function initialize() {

    resizeCanvas(
        backgroundCanvas
    );

    resizeCanvas(
        waveCanvas
    );

    resizeCanvas(
        radiationCanvas
    );


    calculatePhysics();

    drawRadiationPattern();

    animate();

}


/* =====================================================
   REDIMENSIONAR VENTANA
===================================================== */

window.addEventListener(
    "resize",
    () => {

        resizeCanvas(
            backgroundCanvas
        );

        resizeCanvas(
            waveCanvas
        );

        resizeCanvas(
            radiationCanvas
        );

        drawRadiationPattern();

    }
);


/* =====================================================
   INICIAR
===================================================== */

initialize();

/* =====================================================
   SIMULACIÓN LOCAL DEL DIPOLO
===================================================== */

const simular4NEC2Btn = document.getElementById("simular4NEC2Btn");
const necStatus = document.getElementById("necStatus");
const necIcon = document.getElementById("necIcon");
const necTitle = document.getElementById("necTitle");
const necDescription = document.getElementById("necDescription");

function obtenerFrecuenciaActual() {
    return Number(frequencyInput.value) || 100;
}

function setNecEstado(mensaje, tipo) {
    necStatus.textContent = mensaje;

    if (tipo === "cargando") {
        necStatus.style.color = "#ffc107";
        necIcon.style.borderColor = "rgba(255,193,7,0.4)";
        necTitle.textContent = "⏳ Calculando...";
        necDescription.textContent = "Calculando localmente el modelo de dipolo de media onda.";
    } else if (tipo === "exito") {
        necStatus.style.color = "#28a745";
        necIcon.style.borderColor = "rgba(40,167,69,0.4)";
        necTitle.textContent = "✅ Cálculo completado";
        necDescription.textContent = "Resultados calculados directamente en el navegador; no se utilizó Flask ni un servidor externo.";
    } else if (tipo === "error") {
        necStatus.style.color = "#dc3545";
        necIcon.style.borderColor = "rgba(220,53,69,0.4)";
        necTitle.textContent = "❌ Error en el cálculo";
        necDescription.textContent = mensaje;
    }
}

function calcularDipoloLocal() {
    const frecuencia = obtenerFrecuenciaActual();

    if (!Number.isFinite(frecuencia) || frecuencia <= 0) {
        setNecEstado("Frecuencia no válida.", "error");
        return;
    }

    setNecEstado("CALCULANDO...", "cargando");

    document.getElementById("impedance").textContent = "...";
    document.getElementById("swr").textContent = "...";
    document.getElementById("gain").textContent = "...";

    /*
        Modelo de dipolo delgado de media onda.

        Para un dipolo exactamente de λ/2 se utiliza una aproximación
        clásica de impedancia de entrada. La reactancia no se fuerza a
        cero porque λ/2 geométrico no coincide exactamente con la longitud
        resonante práctica (~0.48 λ).
    */
    const resistance = 73.0;
    const reactance = 42.5;
    const referenceImpedance = 50.0;
    const gainDbi = 2.15;

    const z = mathComplex(resistance, reactance);
    const gamma = complexAbs(
        complexDivide(
            complexSubtract(z, referenceImpedance),
            complexAdd(z, referenceImpedance)
        )
    );

    const swr = (1 + gamma) / (1 - gamma);

    document.getElementById("impedance").textContent =
        `${resistance.toFixed(1)} + j${reactance.toFixed(1)}`;

    document.getElementById("swr").textContent =
        swr.toFixed(2);

    document.getElementById("gain").textContent =
        gainDbi.toFixed(2);

    const radiationGain = document.getElementById("radiationGain");
    if (radiationGain) {
        radiationGain.textContent = `${gainDbi.toFixed(2)} dBi`;
    }

    drawRadiationPattern();
    setNecEstado("COMPLETADO", "exito");
}

/* Operaciones complejas mínimas para calcular Γ sin librerías externas. */
function mathComplex(re, im) {
    return { re, im };
}

function complexAdd(a, b) {
    const z = typeof b === "number" ? { re: b, im: 0 } : b;
    return { re: a.re + z.re, im: a.im + z.im };
}

function complexSubtract(a, b) {
    const z = typeof b === "number" ? { re: b, im: 0 } : b;
    return { re: a.re - z.re, im: a.im - z.im };
}

function complexDivide(a, b) {
    const denominator = b.re * b.re + b.im * b.im;
    return {
        re: (a.re * b.re + a.im * b.im) / denominator,
        im: (a.im * b.re - a.re * b.im) / denominator
    };
}

function complexAbs(a) {
    return Math.sqrt(a.re * a.re + a.im * a.im);
}

if (simular4NEC2Btn) {
    simular4NEC2Btn.addEventListener("click", calcularDipoloLocal);
}

