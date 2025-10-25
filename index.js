// ====== Seletores principais ======
const iframe = document.getElementById("myIframe"); // Iframe exibido na tela
const wrapper = document.getElementById("iframeWrapper"); // Contêiner que envolve o iframe (para transformações)

// ====== Sliders e inputs numéricos ======
const widthSlider = document.getElementById("widthSlider"); // Controle de largura (slider)
const widthInput = document.getElementById("widthInput"); // Campo numérico de largura
const heightSlider = document.getElementById("heightSlider"); // Controle de altura (slider)
const heightInput = document.getElementById("heightInput"); // Campo numérico de altura
const scaleSlider = document.getElementById("scaleSlider"); // Controle de escala (zoom)
const scaleInput = document.getElementById("scaleInput"); // Campo numérico de escala
const urlInput = document.getElementById("urlInput");
const applyUrlBtn = document.getElementById("applyUrlBtn");

// ====== Botões de alternância de menus ======
const toggleMenuBtn = document.getElementById("toggleMenuBtn"); // Botão que abre/fecha a barra lateral "Menu"
const toggleConsoleBtn = document.getElementById("toggleConsoleBtn"); // Botão que abre/fecha a barra lateral "Console"
const toggleControlsBtn = document.getElementById("toggleControlsBtn"); // Botão que abre/fecha a barra lateral "Controles"
const dpiSlider = document.getElementById("dpiSlider");
const dpiInput = document.getElementById("dpiInput");

// ====== Elementos das barras laterais ======
const menuBar = document.getElementById("menuBar"); // Barra lateral do menu
const closeMenuBtn = document.getElementById("closeMenuBtn"); // Botão para fechar o menu
const controlsBar = document.getElementById("controlsBar"); // Barra lateral de controles
const closeControlsBtn = document.getElementById("closeControlsBtn"); // Botão para fechar controles

const consoleBar = document.getElementById("consoleBar"); // Barra lateral do console
const closeConsoleBtn = document.getElementById("closeConsoleBtn"); // Botão para fechar o console
const clearConsoleBtn = document.getElementById("clearConsoleBtn"); // Botão "limpar console"
const consoleOutput = document.getElementById("consoleOutput"); // Área onde as mensagens do console aparecem

// ====== Presets e rotação ======
const presetButtons = document.querySelectorAll(".preset"); // Botões predefinidos (ex: "mobile", "desktop", etc.)
const rotateBtn = document.getElementById("rotateBtn"); // Botão de rotação da tela

let isLandscape = false; // Flag que indica se o modo atual é paisagem (horizontal)

// ====== Funções para ajustar o tamanho e escala do iframe ======

/**
 * Atualiza o tamanho (largura e altura) do iframe.
 */
function updateIframeSize() {
	const width = Math.max(1, parseInt(widthSlider.value || 0));
	const height = Math.max(1, parseInt(heightSlider.value || 0));
	const dpi = Math.max(1, parseFloat(dpiSlider.value || 1));

	iframe.width = width / dpi;
	iframe.height = height / dpi;

	updateWrapperSize();
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
	const width = parseInt(widthSlider.value || 0);
	const height = parseInt(heightSlider.value || 0);
	const dpi = parseFloat(dpiSlider.value || 1);
	const scale = parseFloat(scaleSlider.value || 1);

	// Calcula dimensões lógicas (em pixels simulados)
	const logicalWidth = width / dpi;
	const logicalHeight = height / dpi;

	// Aplica o scale à wrapper (zoom visual)
	const visualWidth = logicalWidth * scale;
	const visualHeight = logicalHeight * scale;

	iframeWrapper.style.width = `${visualWidth}px`;
	iframeWrapper.style.height = `${visualHeight}px`;

	// Atualiza a escala CSS do iframe (para o zoom interno)
	iframe.style.transform = `scale(${scale})`;
	iframe.style.transformOrigin = "top left";
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
syncInputs(dpiSlider, dpiInput, updateIframeSize);

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
// ====== DPI ======

function updateIframeSize() {
	const width = Math.max(1, parseInt(widthSlider.value || 0));
	const height = Math.max(1, parseInt(heightSlider.value || 0));
	const dpi = Math.max(1, parseFloat(dpiSlider.value || 1));

	const logicalWidth = width / dpi;
	const logicalHeight = height / dpi;

	iframe.width = logicalWidth;
	iframe.height = logicalHeight;
	updateWrapperSize();
}

syncInputs(widthSlider, widthInput, updateIframeSize);
syncInputs(heightSlider, heightInput, updateIframeSize);
syncInputs(scaleSlider, scaleInput, updateIframeScale);
syncInputs(dpiSlider, dpiInput, updateIframeSize);

// ====== Ajuste nos presets ======
function applyPreset(btn) {
	let width = parseInt(btn.getAttribute("data-width"));
	let height = parseInt(btn.getAttribute("data-height"));
	const scale = parseFloat(btn.getAttribute("data-scale"));
	const dpi = parseFloat(btn.getAttribute("data-dpi") || "1");

	if (isLandscape) [width, height] = [height, width];

	widthSlider.value = widthInput.value = width;
	heightSlider.value = heightInput.value = height;
	scaleSlider.value = scaleInput.value = scale;
	dpiSlider.value = dpiInput.value = dpi;

	updateIframeSize();
	updateIframeScale();

	clearActivePresets();
	btn.classList.add("active");
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

	controlsBar.classList.remove("open");
	controlsBar.setAttribute("aria-hidden", "true");
	setAriaOpen(toggleControlsBtn, false);

	document.body.classList.remove("sidebar-open");
}

/**
 * Abre uma das sidebars ("menu" ou "console") e fecha a outra.
 */
function openSidebar(which) {
	// Fecha tudo primeiro para garantir que apenas uma sidebar esteja aberta
	closeAllSidebars();

	if (which === "menu") {
		menuBar.classList.add("open");
		menuBar.setAttribute("aria-hidden", "false");
		setAriaOpen(toggleMenuBtn, true);
	} else if (which === "console") {
		consoleBar.classList.add("open");
		consoleBar.setAttribute("aria-hidden", "false");
		setAriaOpen(toggleConsoleBtn, true);
	} else if (which === "controls") {
		controlsBar.classList.add("open");
		controlsBar.setAttribute("aria-hidden", "false");
		setAriaOpen(toggleControlsBtn, true);
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

toggleControlsBtn.addEventListener("click", () => {
	const wasOpen = controlsBar.classList.contains("open");
	if (wasOpen) closeAllSidebars();
	else openSidebar("controls");
});

// Botões de fechar
closeMenuBtn.addEventListener("click", closeAllSidebars);
closeConsoleBtn.addEventListener("click", closeAllSidebars);
closeControlsBtn.addEventListener("click", closeAllSidebars);

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
	} catch (e) {}
}

// ====== Substitui console.* para registrar no painel ======
["log", "info", "warn", "error", "debug"].forEach((type) => {
	console[type] = function (...args) {
		try {
			origConsole[type](...args); // mantém log original
		} catch (e) {}
		try {
			logToPanel(type, args, "page"); // envia pro painel
		} catch (e) {}
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
			window.parent.postMessage({ type: "console", level: type, args }, "*");
		} catch (e) {}
	};
});

// Recebe logs vindos do iframe e mostra no painel
window.addEventListener("message", (event) => {
	if (event.data?.type === "console") {
		const { level, args } = event.data;
		logToPanel(level, args, "iframe");
	}
});

// ====== Controle de URL do iframe ======
applyUrlBtn.addEventListener("click", () => {
	let newUrl = urlInput.value.trim();

	// Adiciona protocolo se o usuário não colocou
	if (newUrl && !/^https?:\/\//i.test(newUrl)) {
		newUrl = "http://" + newUrl;
		urlInput.value = newUrl;
	}

	// Atualiza o iframe
	try {
		iframe.src = newUrl;
		console.info(`[IFRAME] URL alterada para: ${newUrl}`);
	} catch (e) {
		console.error("Erro ao definir URL do iframe:", e);
	}
});

// Permite aplicar ao pressionar Enter
urlInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") applyUrlBtn.click();
});
