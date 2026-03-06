`use strict`;

// ===== SELCIONANDO ELEMENTOS DO DOM - CARTA DO DIA =====
const cardSlot = document.querySelector(".card-slot-1");
const cardResultOraculo = document.querySelector(".card-result-oraculo");
const cardResultNome = document.querySelector(".card-result-nome");
const btnReiniciar = document.querySelector(".btn-reiniciar");
const jogoInstruction = document.querySelector(".jogo-instruction");
// ===== SELCIONANDO ELEMENTOS DO DOM - PERGUNTA =====
const perguntaModo1 = document.querySelector("#pergunta-modo-1");
const btnPergunta = document.querySelector(".btn-pergunta");

const gameContainer = document.querySelector(".game-container");
const perguntaSection = document.querySelector(".pergunta-section");


// FUNÇÃO PARA EXIBIR O CONTEÚDO DO JOGO
const gameContainerShown = () => gameContainer.classList.add("visible");
const gameContainerHidden = () => gameContainer.classList.remove("visible");
const perguntaSectionShown = () => perguntaSection.classList.remove("hidden");
const perguntaSectionHidden = () => perguntaSection.classList.add("hidden");
// ===== VARIÁVEL PARA A PERGUNTA =====
// const perguntaUsuario = perguntaModo1.value;
let perguntaUsuario = "";


// ===== ARRAY DE CARTAS - CARREGANDO A PARTIR DO ARQUIVO JSON =====
let cartas = [];

async function getCartas() {
  try {
    const response = await fetch("cartas.json");
    if (!response.ok) throw new Error("Erro ao carregar as cartas");
    cartas = await response.json(); // Converte o JSON para um objeto JavaScript
    console.log(`${cartas.length} cartas carregadas`);
  } catch (error) {
    console.error("Erro ao carregar as cartas:", error);
    alert("Erro ao carregar as cartas. Por favor, tente novamente mais tarde.");
  }
}

document.addEventListener("DOMContentLoaded", getCartas);


// ===== EVENTO CLICK PARA ENVIAR A PERGUNTA PARA A API DA IA =====

perguntaModo1.addEventListener("input", () => {
  perguntaModo1.classList.remove("input-erro");
});

btnPergunta.addEventListener("click", () => {
  if (perguntaModo1.value.trim() === "") {
    perguntaModo1.classList.add("input-erro");
    perguntaModo1.setAttribute("placeholder", "Digite uma pergunta antes de continuar...");
    perguntaModo1.focus();
    return;
  }

  perguntaModo1.classList.remove("input-erro");
  perguntaUsuario = perguntaModo1.value;
  gameContainerShown();
  perguntaSectionHidden();
});

// ===== FUNÇÃO PARA ENVIAR A PERGUNTA PARA A API DA IA =====

async function enviarPerguntaIA(pergunta, cartaNome, descricaoCarta) {
  try {
    cardResultOraculo.innerHTML = `
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
    <em>Consultando os astros...</em>
  `;
    cardResultOraculo.classList.add("visible");

    const response = await fetch("/api/lercartas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pergunta: pergunta,
        cartas: [{ nome: cartaNome, descricao: descricaoCarta }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Falha na API");
    }

    if (!data.leitura) {
      throw new Error("Resposta inválida da IA");
    }

    const leituraFormatada = data.leitura
      .split(/\n\n+/)
      .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");
    cardResultOraculo.innerHTML = `<strong>O Oráculo diz:</strong>${leituraFormatada}`;
  } catch (error) {
    const msg = error.message || "Erro desconhecido";
    cardResultOraculo.innerHTML = `<strong style="color:#c0392b;">Erro:</strong> ${msg}<br><small>Dica: rode <code>npx vercel dev</code> e acesse por localhost.</small><hr style="margin:1rem 0;border-color:rgba(45,51,25,0.2);"><strong>Sobre a carta:</strong><p>${descricaoCarta}</p>`;
  }
}

// ===== FUNÇÃO PARA SORTEAR UMA CARTA ALEATÓRIA =====

const sortearCarta = function() {
  // Avisa se o baralho ainda não foi carregado
  if (cartas.length === 0) {
    console.warn("O baralho ainda não foi carregado.");
    return null;
  }
  const indexAleatorio = Math.trunc(Math.random() * cartas.length);
  return cartas[indexAleatorio];
};

let cartaRevelada = false;

// Evento click na carta

cardSlot.addEventListener("click", () => {
  if (cartaRevelada) return;

  const carta = sortearCarta();
  if (!carta) return;

  cartaRevelada = true;
  cardResultNome.textContent = carta.nome;

  const frontImg = cardSlot.querySelector(".card-front-img");
  if (frontImg) frontImg.src = `imagens/Deck/${carta.imagem}`;

  cardSlot.classList.remove("ativo");
  cardSlot.classList.add("revelado");

  jogoInstruction.classList.add("hidden");
  cardResultNome.classList.add("visible");
  if (btnReiniciar) btnReiniciar.classList.add("visible");

  if (perguntaUsuario) {
    enviarPerguntaIA(perguntaUsuario, carta.nome, carta.descricao);
  }
});

// ===== REINICIAR O JOGO =====
// const reiniciarJogo = function() {
//   cartaRevelada = false;
//   cardResultDescription.classList.remove("visible");
//   cardResultNome.classList.remove("visible");
//   cardResultOraculo.classList.remove("visible");
//   cardResultOraculo.innerHTML = "";
//   cardResultImage.src = "imagens/carta_tarot_placeholder.jpg";
//   btnReiniciar.classList.remove("visible");
//   perguntaUsuario = "";
//   perguntaModo1.value = "";
// };

// btnReiniciar.addEventListener("click", reiniciarJogo);

btnReiniciar.addEventListener("click", () => {
  window.location.href = "modos.html";
});