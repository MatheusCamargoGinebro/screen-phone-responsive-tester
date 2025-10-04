# 📱 Screen Phone Responsive Tester  

![HTML](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-blue?style=for-the-badge&logo=javascript)
![Responsive](https://img.shields.io/badge/Feature-Responsive%20Previewer-green?style=for-the-badge&logo=css3)
![Console](https://img.shields.io/badge/Feature-Console%20Integration-orange?style=for-the-badge&logo=google-chrome)
![Iframe](https://img.shields.io/badge/Tech-Iframe%20PostMessage-yellow?style=for-the-badge&logo=windowsterminal)
![Status](https://img.shields.io/badge/Status-Stable-success?style=for-the-badge&logo=vercel)

O **Screen Phone Responsive Tester** é uma ferramenta leve e totalmente client-side para **testar responsividade de telas dentro de um iframe**.  
Possui sidebars para *Predefinições*, *Controles* e um *Console visual integrado*, permitindo visualizar logs da aplicação carregada no `iframe` em tempo real.

Ideal para desenvolvedores que desejam testar diferentes resoluções de forma rápida, sem precisar de extensões de navegador ou simuladores externos.

---

## 🧩 Principais Recursos  

- **Sidebars independentes e exclusivas**
  - 📱 *Predefinições:* seleção de dispositivos com largura, altura e escala predefinidos.  
  - ⚙️ *Controles:* ajuste manual de dimensões e zoom.  
  - 💬 *Console:* exibe logs tanto da página principal quanto do conteúdo dentro do `iframe`.  
- **Layout dinâmico:** ao abrir uma sidebar, o `iframe` se ajusta automaticamente, mantendo o layout responsivo.  
- **Leitura de console integrada:** logs do `iframe` são capturados via `window.postMessage`.  
- **Interface 100% responsiva e minimalista.**

## 📂 Estrutura de Arquivos  

| Arquivo | Descrição |
|----------|------------|
| `index.html` | Página principal com o `iframe` e os painéis laterais. |
| `style.css` | Estilos do layout, variáveis e transições. |
| `index.js` | Lógica da interface: toggles, sliders, presets e captura de console. |
| `README.md` | Este documento. |

## 🚀 Como Executar  

> [!NOTE]  
> É necessário servir o projeto por um **servidor HTTP local** (recomendada a extenção **live server** do vscode).
> O iframe está configurado por padrão para http://localhost:8081/.
> Certifique-se de que sua aplicação esteja rodando nesse endereço para visualizar o conteúdo real, ou altere o endereço configurado diretamente no código HTML.

1. Instale a extensão Live Server
2. Clique em Go Live no rodapé do editor

## 🧰 Habilitando o Console do Iframe

Para capturar os logs (`console.log`, `warn`, `error`, etc.) da aplicação que o iframe está exibindo, adicione o código abaixo no arquivo raiz da aplicação alvo (ex: `main.js`, `app.js`):

```javascript
if (typeof window !== "undefined" && window.parent) {
  ["log", "info", "warn", "error", "debug"].forEach((type) => {
    const original = console[type].bind(console);
    console[type] = function (...args) {
      original(...args);
      try {
        window.parent.postMessage({ type: "console", level: type, args }, "*");
      } catch (e) { }
    };
  });
}
```

> [!IMPORTANT] 
> Esse recurso só funciona quando o iframe e a página pai estão sob o mesmo domínio (same-origin) ou quando o servidor dentro do iframe permite comunicação via postMessage.
Caso contrário, apenas os logs da página principal serão exibidos.

## ⚙️ Notas Técnicas, licença e contribuições

### 🛠️ Notas:
- Captura de console utiliza window.postMessage para envio dos logs.
- Layout feito com variáveis CSS e JavaScript puro (sem dependências externas).
- Sidebars funcionam com alternância exclusiva (abrir uma fecha as outras).
- A lógica do console é não intrusiva — mantém os logs originais no console nativo.

### 🤝 Contribuições

Sinta-se à vontade para **abrir PRs, relatar bugs ou sugerir melhorias!**
Toda contribuição é bem-vinda — seja de design, lógica ou documentação.

### 🧾 Licença

Este projeto é de uso livre para fins educacionais e de desenvolvimento.

*PS: Eu aceito uma estrelinha do git!* ⭐

