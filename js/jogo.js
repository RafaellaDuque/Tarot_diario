`use strict`;

// SELCIONANDO ELEMENTOS DO DOM
const cardDeck = document.querySelector(".card-deck");
const cardResult = document.querySelector(".card-result");
const cardResultDescription = document.querySelector(".card-result-description");
const cardResultImage = document.querySelector(".deck-image");
const cardResultNome = document.querySelector(".card-result-nome");
const btnReiniciar = document.querySelector(".btn-reiniciar");

// SELCIONANDO ELEMENTOS DO DOM - PERGUNTA
const perguntaModo1 = document.querySelector("#pergunta-modo-1");
const perguntaModo3 = document.querySelector("#pergunta-modo-3");

/* A FAZER:

- Conteudo do MODO escondido até que o usuário selecione 




*/





/*
LÓGICA PARA CHAMAR A API DA IA
- perguntar ao usuário uma pergunta 
- chamar a API da IA com a pergunta e as cartas sorteadas
- exibir a resposta da IA no elemento resultado-ia





*/ 


// SELCIONANDO ELEMENTOS DO DOM - MODO 3 CARTAS


// SELCIONANDO ELEMENTOS DO DOM - MODO CRUZ CELTA




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

// REINICIAR O JOGO

const reiniciarJogo = function() {
  // VOLTANDO PARA O ESTADO INICIAL DO JOGO 
  cartaRevelada = false;
  cardResultDescription.classList.remove("visible");
  cardResultNome.classList.remove("visible");
  cardResultImage.src = "imagens/carta_tarot_placeholder.jpg";
  btnReiniciar.classList.remove("visible");
}

btnReiniciar.addEventListener("click", reiniciarJogo);





/*
async function obterLeitura() {
  const perguntaUsuario = document.getElementById('pergunta').value;
  const cartasSorteadas = ["O Mago", "A Estrela"]; // Exemplo: pegue do seu array de sorteio

  console.log("Enviando para o servidor...");

  try {
    const resposta = await fetch('/api/ler-cartas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pergunta: perguntaUsuario,
        cartas: cartasSorteadas
      })
    });

    const dados = await resposta.json();
    
    // Agora você exibe no seu HTML
    document.getElementById('resultado-ia').innerText = dados.leitura;

  } catch (erro) {
    console.error("Erro ao falar com a API:", erro);
  }
}
  */