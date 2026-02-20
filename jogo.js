`use strict`;

// SELCIONANDO ELEMENTOS DO DOM
const cardDeck = document.querySelector(".card-deck");
const cardResult = document.querySelector(".card-result");
const cardResultDescription = document.querySelector(".card-result-description");
const cardResultImage = document.querySelector(".deck-image");
const cardResultNome = document.querySelector(".card-result-nome");
const btnReiniciar = document.querySelector(".btn-reiniciar");



//  ARRAY DE CARTAS - CARREGANDO A PARTIR DO ARQUIVO JSON
let cartas = [];

async function getCartas() {
  const response = await fetch("cartas.json");
  cartas = await response.json();

  console.log(cartas.length);
}

window.onload = getCartas;


// FUNÇÃO PARA SORTEAR UMA CARTA ALEATÓRIA
const sortearCarta = function() {
  const indexAleatorio = Math.trunc(Math.random()
  * cartas.length);
  return cartas[indexAleatorio];
}

// FUNÇÃO PARA EXIBIR A DESCRIÇÃO E NOME DA CARTA SORTEADA
 
let cartaRevelada = false;


cardDeck.addEventListener("click", () => {
  if (cartaRevelada) return;
  cartaRevelada = true;

  const carta = sortearCarta();
  cardResultDescription.textContent = carta.descricao;
  cardResultDescription.classList.add("visible");

  cardResultNome.classList.add("visible");
  cardResultImage.src = `imagens/Deck/${carta.imagem}`;
  cardResultNome.textContent = carta.nome;

  if (btnReiniciar) btnReiniciar.classList.add("visible");
});

// REINICIAR O JOGO

const reiniciarJogo = function() {
  // VOLTANDO PARA O ESTADO INICIAL DO JOGO 
  cartaRevelada = false;
  cardResultDescription.classList.remove("visible");
  cardResultNome.classList.remove("visible");
  cardResultImage.src = "imagens/tarot-image.jpg";
  btnReiniciar.classList.remove("visible");
}

btnReiniciar.addEventListener("click", reiniciarJogo);





