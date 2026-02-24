`use strict`;

// ===== SELCIONANDO ELEMENTOS DO DOM - CARTA DO DIA =====
const cardDeck = document.querySelector(".card-deck");
const cardResultDescription = document.querySelector(".card-result-description");
const cardResultImage = document.querySelector(".deck-image");
const cardResultNome = document.querySelector(".card-result-nome");
const btnReiniciar = document.querySelector(".btn-reiniciar");
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
  // Enviando a pergunta para a API da IA
  function enviarPerguntaIA() {
  const pergunta = perguntaModo1.value;
  console.log(pergunta);
  }
});


// FUNÇÃO PARA ENVIAR A PERGUNTA PARA A API DA IA
// const enviarPergunta = function() {
//   const pergunta = perguntaModo1.value;
//   console.log(pergunta);
// };






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

cardDeck.addEventListener("click", () => {
  if (cartaRevelada) return;

  const carta = sortearCarta();
  if (!carta) return;

  cartaRevelada = true;
  cardResultDescription.textContent = carta.descricao;
  cardResultNome.textContent = carta.nome;

  cardResultNome.classList.add("visible");
  cardResultImage.src = `imagens/Deck/${carta.imagem}`;

  const mostrarDescricaoQuandoImagemCarregar = () => {
    cardResultDescription.classList.add("visible");
    if (btnReiniciar) btnReiniciar.classList.add("visible");
  };

  if (cardResultImage.complete) {
    mostrarDescricaoQuandoImagemCarregar();
  } else {
    cardResultImage.addEventListener("load", mostrarDescricaoQuandoImagemCarregar, { once: true });
    cardResultImage.addEventListener("error", mostrarDescricaoQuandoImagemCarregar, { once: true });
  }
});

// ===== REINICIAR O JOGO =====
const reiniciarJogo = function() {
  cartaRevelada = false;
  cardResultDescription.classList.remove("visible");
  cardResultNome.classList.remove("visible");
  cardResultImage.src = "imagens/carta_tarot_placeholder.jpg";
  btnReiniciar.classList.remove("visible");
};

btnReiniciar.addEventListener("click", reiniciarJogo);
