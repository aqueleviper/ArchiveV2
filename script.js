// ==========================================
// PROTOCOLO PARANORMAL - SISTEMA GERAL
// ==========================================

console.log("%cProtocolo Paranormal", "color: red; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0px black;");
console.log("%cVocê foi registrado como Afetado. Boa sorte.", "color: #ff3333; font-size: 14px; font-style: italic;");

const tituloOriginal = document.title;
const frasesBizarras = ["Ele está atrás de você...", "Não olhe para trás.", "Você ouviu isso?", "Afetado detectado.", "O Medo é uma via de mão dupla.", "Estamos observando."];

setInterval(() => {
    if (!document.hidden && Math.random() < 0.6) {
        document.title = frasesBizarras[Math.floor(Math.random() * frasesBizarras.length)];
    } else if (!document.hidden) {
        document.title = tituloOriginal;
    }
}, 5000);

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO MENU SUSPENSO ---
    const btnMenu = document.getElementById('btn-menu');
    const dropdown = document.getElementById('dropdown-menu');
    const btnAbrirAtualizacoes = document.getElementById('btn-abrir-atualizacoes');
    const btnFecharAtualizacoes = document.getElementById('btn-fechar-atualizacoes');
    const painelAtualizacoes = document.getElementById('painel-atualizacoes');

    if (btnMenu && dropdown) {
        btnMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('mostrar');
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== btnMenu) {
                dropdown.classList.remove('mostrar');
            }
        });
    }

    if (btnAbrirAtualizacoes && painelAtualizacoes) {
        btnAbrirAtualizacoes.addEventListener('click', () => {
            painelAtualizacoes.classList.add('aberto');
            dropdown.classList.remove('mostrar');
        });
    }

    if (btnFecharAtualizacoes && painelAtualizacoes) {
        btnFecharAtualizacoes.addEventListener('click', () => {
            painelAtualizacoes.classList.remove('aberto');
        });
    }

    // --- LÓGICA DE PESQUISA ---
    const inputPesquisa = document.getElementById('input-pesquisa');
    const itens = document.querySelectorAll('.resultado-item');
    const msgVazio = document.getElementById('mensagem-vazio');

    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase().trim();
            let encontrados = 0;

            itens.forEach(item => {
                const texto = item.textContent.toLowerCase();
                if (texto.includes(termo)) {
                    item.style.display = 'flex';
                    encontrados++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (msgVazio) msgVazio.style.display = (encontrados === 0) ? 'block' : 'none';
        });
    }
});