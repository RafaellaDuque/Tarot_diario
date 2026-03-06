`use strict`;

// ===== ELEMENTOS DO DOM =====
const perguntaInput = document.querySelector("#pergunta-modo-3");
const btnPergunta = document.querySelector(".btn-pergunta");
const gameContainer = document.querySelector(".game-container");
const perguntaSection = document.querySelector(".pergunta-section");
const instrucao = document.querySelector(".jogo-instruction-3");
const oraculo = document.querySelector(".card-result-oraculo-3");
const btnReiniciar = document.querySelector(".btn-reiniciar-3");
const slots = document.querySelectorAll(".card-slot");

// ===== ESTADO INICIAL DO JOGO =====
let cartas = [];
let perguntaUsuario = "";
let cartasSorteadas = [];
let cartasReveladas = 0;

const posicoes = ["Passado", "Presente", "Futuro"];
const mensagens = [
  "Clique na carta do Passado para revelar...",
  "Agora revele o Presente...",
  "Por fim, revele o Futuro..."
];

// ===== CARREGAR CARTAS DO JSON =====
async function getCartas() {
  try {
    const response = await fetch("cartas.json");
    if (!response.ok) throw new Error("Erro ao carregar as cartas");
    cartas = await response.json();
    console.log(`${cartas.length} cartas carregadas`);
  } catch (error) {
    console.error("Erro ao carregar as cartas:", error);
  }
}

document.addEventListener("DOMContentLoaded", getCartas);

// ===== SORTEAR 3 CARTAS SEM REPETICAO =====
function sortear3Cartas() {
  if (cartas.length < 3) {
    console.warn("Baralho nao carregado ou insuficiente.");
    return [];
  }
  const indices = new Set();
  while (indices.size < 3) {
    indices.add(Math.trunc(Math.random() * cartas.length));
  }
  return [...indices].map(i => cartas[i]);
}

// ===== ATIVAR SLOT (glow + clicavel) =====
function ativarSlot(index) {
  if (index >= slots.length) return;
  slots[index].classList.add("ativo");
  instrucao.textContent = mensagens[index];
}

// ===== REVELAR CARTA (flip + nome) =====
function revelarCarta(slot, carta) {
  const frontImg = slot.querySelector(".card-front-img");
  frontImg.src = `imagens/Deck/${carta.imagem}`;

  slot.classList.remove("ativo");
  slot.classList.add("revelado");

  const nomeEl = slot.querySelector(".card-slot-nome");
  nomeEl.textContent = carta.nome;

  cartasReveladas++;

  if (cartasReveladas < 3) {
    ativarSlot(cartasReveladas);
  } else {
    instrucao.classList.add("hidden");
    enviarPerguntaIA();
  }
}

// ===== VALIDACAO E ENVIO DA PERGUNTA =====
perguntaInput.addEventListener("input", () => {
  perguntaInput.classList.remove("input-erro");
});

btnPergunta.addEventListener("click", () => {
  if (perguntaInput.value.trim() === "") {
    perguntaInput.classList.add("input-erro");
    perguntaInput.setAttribute("placeholder", "Digite uma pergunta antes de continuar...");
    perguntaInput.focus();
    return;
  }

  perguntaInput.classList.remove("input-erro");
  perguntaUsuario = perguntaInput.value;

  cartasSorteadas = sortear3Cartas();
  if (cartasSorteadas.length < 3) return;

  cartasReveladas = 0;
  slots.forEach(s => {
    s.classList.remove("ativo", "revelado");
    s.querySelector(".card-slot-nome").textContent = "";
    s.querySelector(".card-front-img").src = "";
  });

  perguntaSection.classList.add("hidden");
  gameContainer.classList.add("visible");
  oraculo.classList.remove("visible");
  oraculo.innerHTML = "";
  btnReiniciar.classList.remove("visible");

  ativarSlot(0);
});

// ===== CLICK NOS SLOTS =====
slots.forEach((slot) => {
  slot.addEventListener("click", () => {
    if (!slot.classList.contains("ativo")) return;

    const index = Number(slot.dataset.index);
    const carta = cartasSorteadas[index];
    if (!carta) return;

    revelarCarta(slot, carta);
  });
});

// ===== ENVIAR PARA A IA =====
async function enviarPerguntaIA() {
  oraculo.innerHTML = `
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
    <em>Consultando os astros...</em>
  `;
  oraculo.classList.add("visible");

  const cartasPayload = cartasSorteadas.map((c, i) => ({
    nome: `${c.nome} (${posicoes[i]})`,
    descricao: c.descricao
  }));

  try {
    const response = await fetch("/api/lercartas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pergunta: perguntaUsuario,
        cartas: cartasPayload
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Falha na API");
    }

    if (!data.leitura) {
      throw new Error("Resposta invalida da IA");
    }

    const leituraFormatada = data.leitura
      .split(/\n\n+/)
      .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");

    oraculo.innerHTML = `<strong>O Oráculo diz:</strong>${leituraFormatada}`;
  } catch (error) {
    const msg = error.message || "Erro desconhecido";
    const fallback = cartasSorteadas
      .map((c, i) => `<strong>${posicoes[i]} — ${c.nome}:</strong><p>${c.descricao}</p>`)
      .join('<hr style="margin:0.8rem 0;border-color:rgba(45,51,25,0.15);">');

    oraculo.innerHTML = `
      <strong style="color:#c0392b;">Erro:</strong> ${msg}<br>
      <small>Dica: rode <code>npx vercel dev</code> e acesse por localhost.</small>
      <hr style="margin:1rem 0;border-color:rgba(45,51,25,0.2);">
      <strong>Sobre as cartas:</strong>
      ${fallback}
    `;
  }

  btnReiniciar.classList.add("visible");
}

// ===== REINICIAR =====
btnReiniciar.addEventListener("click", () => {
  window.location.href = "modos.html";
});
