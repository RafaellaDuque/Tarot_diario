`use strict`;

// ===== SELCIONANDO ELEMENTOS DO DOM - CARTA DO DIA =====
const cardDeck = document.querySelector(".card-deck");
const cardResultDescription = document.querySelector(".card-result-description");
const cardResultOraculo = document.querySelector(".card-result-oraculo");
const cardResultImage = document.querySelector(".deck-image");
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

/* TODO:
- Conteudo do jogo/carta escondido até que o usuário selecione uma pergunta
- A pergunta deve ser enviada para a API da IA
- A resposta da IA deve ser exibida no elemento resultado-ia
- A resposta da IA deve ser exibida no elemento resultado-ia


*/



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


// ===== FUNÇÃO PARA ENVIAR A PERGUNTA PARA A API DA IA =====


btnPergunta.addEventListener("click", () => {
  gameContainerShown();
  perguntaSectionHidden();
  if (perguntaModo1.value.trim() === "") {
    alert("Por favor, digite uma pergunta válida.");
    return;
  }
  perguntaUsuario = perguntaModo1.value;
  
});

// ===== FUNÇÃO PARA ENVIAR A PERGUNTA PARA A API DA IA =====

async function enviarPerguntaIA(pergunta, cartaNome, descricaoCarta) {
  try {
    cardResultOraculo.innerHTML = '<em>Consultando os astros... aguarde.</em>';
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
    cardResultOraculo.innerHTML = `<strong style="color:#c0392b;">Erro:</strong> ${msg}<br><small>Dica: rode <code>npx vercel dev</code> e acesse por localhost.</small>`;
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

cardDeck.addEventListener("click", () => {
  if (cartaRevelada) return;

  const carta = sortearCarta();
  if (!carta) return;

  cartaRevelada = true;
  cardResultDescription.textContent = carta.descricao;
  cardResultNome.textContent = carta.nome;

  // Mostra nome e descrição imediatamente (não espera a imagem carregar)
  jogoInstruction.classList.add("hidden");
  cardResultNome.classList.add("visible");
  cardResultDescription.classList.add("visible");
  if (btnReiniciar) btnReiniciar.classList.add("visible");

  if (perguntaUsuario) {
    enviarPerguntaIA(perguntaUsuario, carta.nome, carta.descricao);
  }

  cardResultImage.src = `imagens/Deck/${carta.imagem}`;
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