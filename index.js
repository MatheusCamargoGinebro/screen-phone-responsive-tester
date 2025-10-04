// ====== Seletores principais ======
const iframe = document.getElementById("myIframe");        // Iframe exibido na tela
const wrapper = document.getElementById("iframeWrapper");  // Contêiner que envolve o iframe (para transformações)


// ====== Sliders e inputs numéricos ======
const widthSlider = document.getElementById("widthSlider");    // Controle de largura (slider)
const widthInput = document.getElementById("widthInput");      // Campo numérico de largura
const heightSlider = document.getElementById("heightSlider");  // Controle de altura (slider)
const heightInput = document.getElementById("heightInput");    // Campo numérico de altura
const scaleSlider = document.getElementById("scaleSlider");    // Controle de escala (zoom)
const scaleInput = document.getElementById("scaleInput");      // Campo numérico de escala


// ====== Botões de alternância de menus ======
const toggleMenuBtn = document.getElementById("toggleMenuBtn");        // Botão que abre/fecha a barra lateral "Menu"
const toggleConsoleBtn = document.getElementById("toggleConsoleBtn");  // Botão que abre/fecha a barra lateral "Console"


// ====== Elementos das barras laterais ======
const menuBar = document.getElementById("menuBar");               // Barra lateral do menu
const closeMenuBtn = document.getElementById("closeMenuBtn");     // Botão para fechar o menu

const consoleBar = document.getElementById("consoleBar");         // Barra lateral do console
const closeConsoleBtn = document.getElementById("closeConsoleBtn"); // Botão para fechar o console
const clearConsoleBtn = document.getElementById("clearConsoleBtn"); // Botão "limpar console"
const consoleOutput = document.getElementById("consoleOutput");     // Área onde as mensagens do console aparecem


// ====== Presets e rotação ======
const presetButtons = document.querySelectorAll(".preset");  // Botões predefinidos (ex: "mobile", "desktop", etc.)
const rotateBtn = document.getElementById("rotateBtn");      // Botão de rotação da tela

let isLandscape = false; // Flag que indica se o modo atual é paisagem (horizontal)


// ====== Funções para ajustar o tamanho e escala do iframe ======

/**
 * Atualiza o tamanho (largura e altura) do iframe.
 */
function updateIframeSize() {
    const width = Math.max(1, parseInt(widthSlider.value || 0));
    const height = Math.max(1, parseInt(heightSlider.value || 0));
    iframe.width = width;
    iframe.height = height;
    updateWrapperSize(); // Ajusta o wrapper de acordo com o novo tamanho
}

/**
 * Atualiza o "zoom" (escala) do iframe.
 */
function updateIframeScale() {
    const scale = Math.max(0.01, parseFloat(scaleSlider.value || 1));
    iframe.style.transform = `scale(${scale})`;
    updateWrapperSize();
}

/**
 * Ajusta o tamanho do wrapper de acordo com as dimensões e a escala.
 * Isso garante que o contêiner acompanhe o tamanho visual real.
 */
function updateWrapperSize() {
    const scale = Math.max(0.01, parseFloat(scaleSlider.value || 1));
    const width = Math.max(1, parseInt(widthSlider.value || 0));
    const height = Math.max(1, parseInt(heightSlider.value || 0));
    wrapper.style.width = `${width * scale}px`;
    wrapper.style.height = `${height * scale}px`;
}


// ====== Sincroniza sliders e inputs numéricos ======
/**
 * Sincroniza um slider com um input (de mesmo tipo),
 * e chama uma função callback sempre que o valor muda.
 */
function syncInputs(slider, input, callback) {
    slider.addEventListener("input", () => {
        input.value = slider.value;
        callback();
    });
    input.addEventListener("input", () => {
        if (input.value === "") return;
        slider.value = input.value;
        callback();
    });
}

// Liga sliders e inputs entre si
syncInputs(widthSlider, widthInput, updateIframeSize);
syncInputs(heightSlider, heightInput, updateIframeSize);
syncInputs(scaleSlider, scaleInput, updateIframeScale);

// Inicializa com os valores padrões
updateIframeSize();
updateIframeScale();


// ====== Funções para presets ======
function clearActivePresets() {
    presetButtons.forEach((b) => b.classList.remove("active"));
}

/**
 * Aplica um preset (largura, altura, escala) ao iframe.
 * Se estiver em modo paisagem, inverte largura e altura.
 */
function applyPreset(btn) {
    let width = parseInt(btn.getAttribute("data-width"));
    let height = parseInt(btn.getAttribute("data-height"));
    const scale = parseFloat(btn.getAttribute("data-scale"));

    if (isLandscape) {
        [width, height] = [height, width];
    }

    widthSlider.value = widthInput.value = width;
    heightSlider.value = heightInput.value = height;
    scaleSlider.value = scaleInput.value = scale;

    updateIframeSize();
    updateIframeScale();

    clearActivePresets();
    btn.classList.add("active"); // Marca o preset como ativo
}

// Liga eventos a cada botão de preset
presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyPreset(btn));
});


// ====== Acessibilidade e alternância de barras laterais ======

function setAriaOpen(button, isOpen) {
    button.setAttribute("aria-expanded", String(isOpen));
}

/**
 * Fecha todas as sidebars (menu e console).
 */
function closeAllSidebars() {
    menuBar.classList.remove("open");
    menuBar.setAttribute("aria-hidden", "true");
    setAriaOpen(toggleMenuBtn, false);

    consoleBar.classList.remove("open");
    consoleBar.setAttribute("aria-hidden", "true");
    setAriaOpen(toggleConsoleBtn, false);

    document.body.classList.remove("sidebar-open");
}

/**
 * Abre uma das sidebars ("menu" ou "console") e fecha a outra.
 */
function openSidebar(which) {
    if (which === "menu") {
        // Fecha o console
        consoleBar.classList.remove("open");
        consoleBar.setAttribute("aria-hidden", "true");
        setAriaOpen(toggleConsoleBtn, false);

        // Abre o menu
        menuBar.classList.add("open");
        menuBar.setAttribute("aria-hidden", "false");
        setAriaOpen(toggleMenuBtn, true);
    } else if (which === "console") {
        // Fecha o menu
        menuBar.classList.remove("open");
        menuBar.setAttribute("aria-hidden", "true");
        setAriaOpen(toggleMenuBtn, false);

        // Abre o console
        consoleBar.classList.add("open");
        consoleBar.setAttribute("aria-hidden", "false");
        setAriaOpen(toggleConsoleBtn, true);
    }
    document.body.classList.add("sidebar-open");
}

// Botões de abrir/fechar barras
toggleMenuBtn.addEventListener("click", () => {
    const wasOpen = menuBar.classList.contains("open");
    if (wasOpen) closeAllSidebars();
    else openSidebar("menu");
});

toggleConsoleBtn.addEventListener("click", () => {
    const wasOpen = consoleBar.classList.contains("open");
    if (wasOpen) closeAllSidebars();
    else openSidebar("console");
});

// Botões de fechar
closeMenuBtn.addEventListener("click", closeAllSidebars);
closeConsoleBtn.addEventListener("click", closeAllSidebars);

// Fecha sidebars com tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllSidebars();
});

// Fecha se clicar fora do conteúdo
menuBar.addEventListener("click", (ev) => {
    if (ev.target === menuBar) closeAllSidebars();
});
consoleBar.addEventListener("click", (ev) => {
    if (ev.target === consoleBar) closeAllSidebars();
});


// ====== Função de rotação (modo retrato/paisagem) ======
rotateBtn.addEventListener("click", () => {
    const ANIM_MS = 500; // duração da animação (ms)

    // Aplica uma rotação visual de 90°
    if (!isLandscape) {
        wrapper.style.transform = "translate(-50%, -50%) rotate(-90deg)";
    } else {
        wrapper.style.transform = "translate(-50%, -50%) rotate(90deg)";
    }

    // Após a animação, troca largura/altura e reseta a rotação
    setTimeout(() => {
        const currentWidth = widthSlider.value;
        const currentHeight = heightSlider.value;
        widthSlider.value = widthInput.value = currentHeight;
        heightSlider.value = heightInput.value = currentWidth;

        updateIframeSize();
        updateIframeScale();
        clearActivePresets();

        // Remove transição temporariamente para restaurar a posição
        wrapper.classList.add("no-transition");
        wrapper.style.transform = "translate(-50%, -50%) rotate(0deg)";
        void wrapper.offsetHeight; // força reflow
        wrapper.classList.remove("no-transition");

        isLandscape = !isLandscape; // alterna estado
    }, ANIM_MS);
});


// ====== Captura e exibição de logs no "console visual" ======

// Guarda os métodos originais do console para não perder a funcionalidade
const origConsole = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    debug: console.debug.bind(console),
};


/**
 * Converte objetos para string de forma segura (sem loops circulares).
 */
function safeStringify(obj) {
    const cache = new WeakSet();
    try {
        return JSON.stringify(
            obj,
            function (key, value) {
                if (typeof value === "object" && value !== null) {
                    if (cache.has(value)) return "[Circular]";
                    cache.add(value);
                }
                if (typeof value === "function")
                    return `[Function: ${value.name || "anonymous"}]`;
                return value;
            },
            2
        );
    } catch (e) {
        return String(obj);
    }
}

/**
 * Converte argumentos de console (objetos, funções, etc.) em texto legível.
 */
function formatArg(arg) {
    if (arg === null) return "null";
    if (arg === undefined) return "undefined";
    const t = typeof arg;
    if (t === "string") return arg;
    if (t === "number" || t === "boolean") return String(arg);
    if (t === "function") return `[Function ${arg.name || "anonymous"}]`;
    if (t === "object") return safeStringify(arg);
    return String(arg);
}

/**
 * Mostra mensagens no painel de console dentro da interface.
 */
function logToPanel(type, args, origin = "page") {
    try {
        const line = document.createElement("div");
        line.classList.add("console-line");

        const typeClass = ["log", "info", "warn", "error"].includes(type)
            ? type
            : "log";
        line.classList.add(typeClass);

        const meta = document.createElement("div");
        meta.className = "console-meta";
        const time = new Date().toLocaleTimeString();
        const originLabel = origin === "iframe" ? "IFRAME" : "PAGE";
        meta.textContent = `${time} — ${originLabel} — ${type.toUpperCase()}`;

        const content = document.createElement("div");
        content.className = "console-content";
        const text = args.map(formatArg).join(" ");
        content.textContent = text;

        line.appendChild(meta);
        line.appendChild(content);

        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    } catch (e) { }
}


// ====== Substitui console.* para registrar no painel ======
["log", "info", "warn", "error", "debug"].forEach((type) => {
    console[type] = function (...args) {
        try {
            origConsole[type](...args); // mantém log original
        } catch (e) { }
        try {
            logToPanel(type, args, "page"); // envia pro painel
        } catch (e) { }
    };
});

// Botão "Limpar console"
clearConsoleBtn.addEventListener("click", () => {
    consoleOutput.innerHTML = "";
});


// ====== Comunicação com o iframe ======

// Envia logs para o "pai" (janela principal)
["log", "info", "warn", "error", "debug"].forEach((type) => {
    const original = console[type].bind(console);
    console[type] = function (...args) {
        original(...args);
        try {
            window.parent.postMessage(
                { type: "console", level: type, args },
                "*"
            );
        } catch (e) { }
    };
});

// Recebe logs vindos do iframe e mostra no painel
window.addEventListener("message", (event) => {
    if (event.data?.type === "console") {
        const { level, args } = event.data;
        logToPanel(level, args, "iframe");
    }
});
