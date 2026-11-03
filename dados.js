// ==========================================
// SISTEMA DE FICHA E ROLAGEM - ORDEM PARANORMAL
// ==========================================

const atributos = {
    for: { base: 2, atual: 2 }, agi: { base: 2, atual: 2 }, pre: { base: 3, atual: 3 },
    int: { base: 2, atual: 2 }, vig: { base: 2, atual: 2 }
};

const estadoPericias = {};
const listaPericias = [
    { nome: "Acrobacia", attr: "agi", penalidade: true }, { nome: "Adestramento", attr: "pre" },
    { nome: "Artes", attr: "pre" }, { nome: "Atletismo", attr: "for" }, { nome: "Atualidades", attr: "int" },
    { nome: "Ciências", attr: "int" }, { nome: "Crime", attr: "agi", penalidade: true },
    { nome: "Diplomacia", attr: "pre" }, { nome: "Enganação", attr: "pre" }, { nome: "Fortitude", attr: "vig" },
    { nome: "Furtividade", attr: "agi", penalidade: true }, { nome: "Iniciativa", attr: "agi" },
    { nome: "Intimidação", attr: "pre" }, { nome: "Intuição", attr: "pre" }, { nome: "Investigação", attr: "int" },
    { nome: "Luta", attr: "for" }, { nome: "Medicina", attr: "int" }, { nome: "Ocultismo", attr: "int" },
    { nome: "Percepção", attr: "pre" }, { nome: "Pilotagem", attr: "agi" }, { nome: "Pontaria", attr: "agi" },
    { nome: "Profissão", attr: "int" }, { nome: "Reflexos", attr: "agi" }, { nome: "Religião", attr: "pre" },
    { nome: "Sobrevivência", attr: "int" }, { nome: "Tática", attr: "int" }, { nome: "Tecnologia", attr: "int" },
    { nome: "Vontade", attr: "pre" }
];

document.addEventListener('DOMContentLoaded', () => {
    listaPericias.forEach(p => { 
        estadoPericias[p.nome] = { dadosExtra: 0, dadosLivres: 0, treino: 0, bonus: 0 }; 
    });
    
    renderizarAtributos();
    renderizarPericias();
    
    document.getElementById('btn-passar-rodada').addEventListener('click', passarRodada);
    document.getElementById('btn-fechar-resultado').addEventListener('click', () => {
        document.getElementById('card-resultado-flutuante').classList.remove('ativo');
    });
});

function renderizarAtributos() {
    for (let chave in atributos) {
        document.getElementById(`val-${chave}`).textContent = atributos[chave].base;
        atualizarDisplayGasto(chave);
    }
}

function atualizarDisplayGasto(chave) {
    const el = document.getElementById(`gasto-${chave}`);
    if(el) {
        el.textContent = atributos[chave].atual;
        if (atributos[chave].atual <= 0) el.parentElement.classList.add('esgotado');
        else el.parentElement.classList.remove('esgotado');
    }
}

window.mudarAtributo = function(chave, delta) {
    const gastos = atributos[chave].base - atributos[chave].atual;
    if (delta > 0 && gastos > 0) { alert("Zere os gastos primeiro."); return; }
    if (atributos[chave].base + delta < 0) return;
    atributos[chave].base += delta;
    atributos[chave].atual = atributos[chave].base;
    renderizarAtributos();
    renderizarPericias(); 
}

function renderizarPericias() {
    const container = document.getElementById('lista-pericias');
    container.innerHTML = '';

    const headerEl = document.createElement('div');
    headerEl.className = 'pericia-header';
    headerEl.innerHTML = `
        <div class="header-nome">PERÍCIA</div>
        <div class="header-centro">TREINO</div>
        <div class="header-centro">BÔNUS</div>
        <div class="header-dados">GASTOS</div>
        <div class="header-dados">EXTRAS</div>
    `;
    container.appendChild(headerEl);
    
    listaPericias.forEach((pericia) => {
        const estado = estadoPericias[pericia.nome];
        const attrAtual = atributos[pericia.attr].atual;

        const item = document.createElement('div');
        item.className = 'pericia-item';

        const nomeEl = document.createElement('div');
        nomeEl.className = 'pericia-nome';
        nomeEl.innerHTML = `${pericia.nome}${pericia.penalidade ? '*' : ''} <span class="tag-attr">${pericia.attr.toUpperCase()}</span>`;
        nomeEl.onclick = () => rolarPericia(pericia);

        const detalhesEl = document.createElement('div');
        detalhesEl.className = 'pericia-detalhes';
        detalhesEl.innerHTML = `
            <div class="detalhe-grupo">
                <div class="custom-input-wrapper">
                    <input type="number" id="treino-${pericia.nome}" value="${estado.treino}" min="0" max="15" step="5" onchange="atualizarValorPericia('${pericia.nome}', 'treino', this.value)">
                    <div class="custom-arrows">
                        <button type="button" onclick="mudarTreino('${pericia.nome}', 5)">▲</button>
                        <button type="button" onclick="mudarTreino('${pericia.nome}', -5)">▼</button>
                    </div>
                </div>
            </div>
            <div class="detalhe-grupo">
                <input type="number" id="bonus-${pericia.nome}" value="${estado.bonus}" min="0" class="input-sem-seta" onchange="atualizarValorPericia('${pericia.nome}', 'bonus', this.value)">
            </div>
        `;

        const controlesEl = document.createElement('div');
        controlesEl.className = 'controles-duplos';

        const grupoAtributo = document.createElement('div');
        grupoAtributo.className = 'grupo-dados atributo';
        
        const btnMenosA = document.createElement('button');
        btnMenosA.className = 'btn-mini'; btnMenosA.textContent = '-';
        btnMenosA.disabled = (estado.dadosExtra <= 0);
        btnMenosA.onclick = (e) => { e.stopPropagation(); alterarDadosExtra(pericia.nome, 'atributo', -1); };

        const displayA = document.createElement('span');
        displayA.className = `pericia-dados ${estado.dadosExtra >= attrAtual && estado.dadosExtra > 0 ? 'limite' : ''}`;
        displayA.textContent = estado.dadosExtra;

        const btnMaisA = document.createElement('button');
        btnMaisA.className = 'btn-mini'; btnMaisA.textContent = '+';
        btnMaisA.disabled = (estado.dadosExtra >= attrAtual);
        btnMaisA.onclick = (e) => { e.stopPropagation(); alterarDadosExtra(pericia.nome, 'atributo', 1); };

        grupoAtributo.appendChild(btnMenosA);
        grupoAtributo.appendChild(displayA);
        grupoAtributo.appendChild(btnMaisA);

        const grupoLivre = document.createElement('div');
        grupoLivre.className = 'grupo-dados livre';
        
        const btnMenosL = document.createElement('button');
        btnMenosL.className = 'btn-mini'; btnMenosL.textContent = '-';
        btnMenosL.disabled = (estado.dadosLivres <= -10);
        btnMenosL.onclick = (e) => { e.stopPropagation(); alterarDadosExtra(pericia.nome, 'livre', -1); };

        const displayL = document.createElement('span');
        displayL.className = `pericia-dados`;
        displayL.textContent = estado.dadosLivres;

        const btnMaisL = document.createElement('button');
        btnMaisL.className = 'btn-mini'; btnMaisL.textContent = '+';
        btnMaisL.disabled = (estado.dadosLivres >= 10);
        btnMaisL.onclick = (e) => { e.stopPropagation(); alterarDadosExtra(pericia.nome, 'livre', 1); };

        grupoLivre.appendChild(btnMenosL);
        grupoLivre.appendChild(displayL);
        grupoLivre.appendChild(btnMaisL);

        controlesEl.appendChild(grupoAtributo);
        controlesEl.appendChild(grupoLivre);

        item.appendChild(nomeEl);
        item.appendChild(detalhesEl);
        item.appendChild(controlesEl);
        container.appendChild(item);
    });
}

window.atualizarValorPericia = function(nome, tipo, valor) {
    let v = parseInt(valor) || 0;
    if (tipo === 'treino') { if (v > 15) v = 15; if (v < 0) v = 0; } else if (v < 0) v = 0;
    estadoPericias[nome][tipo] = v;
    document.getElementById(`${tipo}-${nome}`).value = v;
};

window.mudarTreino = function(nome, delta) {
    let novoValor = estadoPericias[nome].treino + delta;
    if (novoValor > 15) novoValor = 15; if (novoValor < 0) novoValor = 0;
    estadoPericias[nome].treino = novoValor;
    document.getElementById(`treino-${nome}`).value = novoValor;
};

window.alterarDadosExtra = function(nome, tipo, delta) {
    const pericia = listaPericias.find(p => p.nome === nome);
    const estado = estadoPericias[nome];
    const attrAtual = atributos[pericia.attr].atual;

    if (tipo === 'atributo') {
        if (delta > 0 && estado.dadosExtra >= attrAtual) return;
        if (delta < 0 && estado.dadosExtra <= 0) return;
        estado.dadosExtra += delta;
    } else if (tipo === 'livre') {
        if (delta > 0 && estado.dadosLivres >= 10) return;
        if (delta < 0 && estado.dadosLivres <= -10) return;
        estado.dadosLivres += delta;
    }
    
    renderizarPericias(); 
}

function rolarPericia(pericia) {
    const estado = estadoPericias[pericia.nome];
    const dadosAtributo = estado.dadosExtra; // Gastos (verdes)
    const dadosLivres = estado.dadosLivres;  // Extras (vermelhos)
    
    // 1. Desconta os dados gastos do atributo principal
    if (dadosAtributo > 0) {
        const desconto = Math.min(dadosAtributo, atributos[pericia.attr].atual);
        atributos[pericia.attr].atual -= desconto;
        atualizarDisplayGasto(pericia.attr);
        estado.dadosExtra = 0;
    }

    // 2. Reseta os dados extras após a rolagem
    estado.dadosLivres = 0;
    renderizarPericias();

    // ==========================================
    // MATEMÁTICA DEFINITIVA
    // ==========================================
    // Regra: 1 base + gastos + extras
    const totalMatematico = 1 + dadosAtributo + dadosLivres;
    
    let totalDados;
    let desvantagem = false;
    let vantagem = false;

    if (totalMatematico > 1) {
        // Se der positivo (maior que 1), rola o total e pega o MAIOR
        totalDados = totalMatematico;
        vantagem = true;
    } 
    else if (totalMatematico === 1) {
        // Se der exatamente 1, rola 1 dado normal
        totalDados = 1;
    } 
    else {
        // Se der 0 ou negativo, rola Abs(Resultado) + 2 e pega o MENOR
        // 0 => Abs(0) + 2 = 2 dados
        // -1 => Abs(-1) + 2 = 3 dados
        // -2 => Abs(-2) + 2 = 4 dados
        totalDados = Math.abs(totalMatematico) + 2; 
        desvantagem = true;
    }

    // 3. Rola os dados
    const resultados = [];
    for (let i = 0; i < totalDados; i++) {
        resultados.push(Math.floor(Math.random() * 20) + 1);
    }

    // 4. Escolha do dado (Maior para vantagem, Menor para desvantagem)
    let resultadoBase = Math.max(...resultados); 
    if (desvantagem) {
        resultadoBase = Math.min(...resultados); 
    }

    const resultadoFinal = resultadoBase + estado.treino + estado.bonus;

    // 5. Preenche o Card de Resultado
    const cardResultado = document.getElementById('card-resultado-flutuante');
    
    let titulo = pericia.nome;
    if (desvantagem) titulo += " (Desvantagem)";
    else if (vantagem) titulo += " (Vantagem)";
    
    document.getElementById('card-titulo').textContent = titulo;
    
    const modalDados = document.getElementById('card-dados-visuais');
    modalDados.innerHTML = '';
    resultados.forEach(res => {
        const dado = document.createElement('span');
        dado.className = `dado-mini ${res === resultadoBase ? 'destaque' : ''}`;
        dado.textContent = res;
        modalDados.appendChild(dado);
    });

    document.getElementById('card-total').textContent = resultadoFinal;
    
    let msg = `Base (${resultadoBase})`;
    if(estado.treino > 0) msg += ` + Treino (${estado.treino})`;
    if(estado.bonus > 0) msg += ` + Bônus (${estado.bonus})`;
    
    if (desvantagem) {
        msg = `<span style="color:#ff8888; font-weight:bold;">Desvantagem (${totalDados} dados)!</span><br>` + msg;
    } else if (vantagem) {
        msg = `<span style="color:#00ff64; font-weight:bold;">Vantagem (${totalDados} dados)!</span><br>` + msg;
    }
    
    document.getElementById('card-desc').innerHTML = msg;
    cardResultado.classList.add('ativo');
}

function passarRodada() {
    for (let chave in atributos) { atributos[chave].atual = atributos[chave].base; }
    for (let nome in estadoPericias) { 
        estadoPericias[nome].dadosExtra = 0; 
        estadoPericias[nome].dadosLivres = 0;
    }
    renderizarAtributos();
    renderizarPericias(); 
    
    const card = document.getElementById('card-resultado-flutuante');
    if(card) card.classList.remove('ativo');

    const btn = document.getElementById('btn-passar-rodada');
    btn.textContent = "Rodada Reiniciada!";
    setTimeout(() => { btn.textContent = "Passar Rodada (Resetar)"; }, 1500);
}