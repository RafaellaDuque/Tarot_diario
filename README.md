# Tarot Diario

Aplicacao web interativa de Tarot que oferece leituras diarias personalizadas com interpretacoes geradas por inteligencia artificial (Google Gemini).

## Funcionalidades

**Landing Page** — Pagina inicial com hero section, explicacao sobre o que e o Tarot e como funciona a tiragem diaria.

**Modos de Jogo** — Tela de selecao com tres modalidades de tiragem:
- **Carta do Dia** — O usuario escreve uma pergunta, sorteia uma carta aleatoria do baralho de 78 cartas e recebe uma interpretacao personalizada gerada pela IA.
- **Tiragem de 3 Cartas** — Leitura de passado, presente e futuro.
- **Cruz Celta** — Tiragem classica de 10 cartas (em breve).

**Leitura por IA** — Integracaoo com a API do Google Gemini. A IA atua como tarologa.

**Baralho Completo** — 78 cartas (22 Arcanos Maiores + 56 Arcanos Menores) com nome, descricao detalhada e imagem propria, armazenadas em JSON.

**Design Responsivo** — Interface adaptada para desktop e mobile.

## Tecnologias

- **HTML5 / CSS3** — Estrutura e estilizacao das paginas
- **JavaScript (ES6+)** — Logica de jogo, manipulacao do DOM e consumo de APIs
- **JSON** — Dados estruturados das 78 cartas
- **Vercel Serverless Functions** — Backend da API de leitura (`api/lercartas.js`)
- **Google Gemini API** — Geracao de interpretacoes por IA
- **Git / GitHub** — Controle de versao

## Estrutura do Projeto

```
Tarot_diario/
├── api/
│   └── lercartas.js          # Serverless function - integracaoo com Gemini
├── css/
│   ├── style.css              # Estilos globais e landing page
│   ├── jogo.css               # Estilos das paginas de jogo
│   └── modos.css              # Estilos da pagina de selecao de modo
├── js/
│   ├── script.js              # Script da landing page
│   ├── jogo-1.js              # Logica do modo Carta do Dia
│   └── jogo-3.js              # Logica do modo Tiragem de 3 Cartas
├── imagens/
│   └── Deck/                  # Imagens das 78 cartas
├── cartas.json                # Dados de todas as cartas do baralho
├── index.html                 # Landing page
├── modos.html                 # Selecao de modo de jogo
├── jogo-1.html                # Carta do Dia
├── jogo-3.html                # Tiragem de 3 Cartas
├── jogo-celta.html            # Cruz Celta (em breve)
├── cadastro.html              # Pagina de cadastro
├── login.html                 # Pagina de login
└── .env.local                 # Chave da API Gemini (nao versionado)
```

## Como Rodar Localmente

1. Clone o repositorio:
   ```bash
   git clone https://github.com/RafaellaDuque/Tarot_diario.git
   cd Tarot_diario
   ```

2. Crie o arquivo `.env.local` na raiz com sua chave da API Gemini:
   ```
   GEMINI_API_KEY=sua_chave_aqui
   ```

3. Rode o servidor de desenvolvimento da Vercel:
   ```bash
   npx vercel dev
   ```

4. Acesse `http://localhost:3000` no navegador.

> **Importante:** A aplicacao precisa ser servida via `vercel dev` para que a API serverless funcione. Abrir os arquivos HTML diretamente pelo navegador (`file://`) causara erros nas chamadas a API.
