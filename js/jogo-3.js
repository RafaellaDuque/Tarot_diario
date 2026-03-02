`use strict`;

// SELCIONANDO ELEMENTOS DO DOM - 3 CARTAS



// TODO: implementar lógica da tiragem de 3 cartas (passado, presente, futuro)



// ARRAY DE CARTAS - CARREGANDO A PARTIR DO ARQUIVO JSON
let cartas = [];

async function getCartas() {
  const response = await fetch("cartas.json");
  cartas = await response.json();
}

window.onload = getCartas;

// FUNÇÃO PARA SORTEAR UMA CARTA ALEATÓRIA
const sortearCarta = function() {
  const indexAleatorio = Math.trunc(Math.random() * cartas.length);
  return cartas[indexAleatorio];
};