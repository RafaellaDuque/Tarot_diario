`use strict`;

// Parallax na imagem de fundo (mouse + scroll)
const heroBgImage = document.getElementById("hero-bg-image");
const mouseParallaxStrength = 15;
const scrollParallaxStrength = 0.3; // 30% da velocidade do scroll

let mouseX = 0;
let mouseY = 0;

function updateParallax() {
  if (!heroBgImage) return;

  const scrollY = window.scrollY || window.pageYOffset;
  const moveX = mouseX * mouseParallaxStrength;
  const moveY = mouseY * mouseParallaxStrength + scrollY * scrollParallaxStrength;

  heroBgImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

if (heroBgImage) {
  document.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    mouseX = (clientX / innerWidth - 0.5) * 2;
    mouseY = (clientY / innerHeight - 0.5) * 2;

    updateParallax();
  });
  window.addEventListener("scroll", () => {
    updateParallax();
  });
}

