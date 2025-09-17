async function carregarAves() {
  const resposta = await fetch("data/aves.json");
  const aves = await resposta.json();
  const grid = document.getElementById("birdGrid");

  aves.forEach(ave => {
    const card = document.createElement("div");
    card.className = "card";

    let srcImagem = `assets/images/not_available.jpg`;

    if (ave.foto) {
      srcImagem = `assets/images/photos/${ave.particula}.jpg`;
    }

    card.innerHTML = `
      <img src="${srcImagem}" alt="${ave.nomeComumBrasileiro}" loading="lazy">
      <div class="card-content">
        <div>
          <h3 class="headline">${ave.nomeComumBrasileiro}</h3>
          <h4 class="subhead"><em>${ave.nomeCientifico} (${ave.descricao})</em></h4>
        </div>
      </div>
    `;

    const btn = document.createElement("button");
    btn.className = "primary-btn";
    btn.textContent = "Mais detalhes";
    btn.addEventListener("click", () => abrirModal(ave));
    card.querySelector(".card-content").appendChild(btn);

    grid.appendChild(card);
  });
}

function ativarBusca() {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("search");
  const clearBtn = document.getElementById("clearSearch");

  // busca via submit
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    aplicarFiltro(searchInput.value);
    searchInput.blur(); // fecha teclado no mobile
  });

  // busca em tempo real + controle do X
  searchInput.addEventListener("input", () => {
    aplicarFiltro(searchInput.value);
    clearBtn.style.display = searchInput.value ? "block" : "none";
  });

  // limpar busca
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    aplicarFiltro("");
    clearBtn.style.display = "none";
    searchInput.blur();
  });
}

function aplicarFiltro(termo) {
  termo = termo.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const texto = card.innerText.toLowerCase();
    card.style.display = texto.includes(termo) ? "flex" : "none";
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth" // rolagem suave
  });
}

function abrirModal(ave) {
  document.body.style.overflow = "hidden";

  const modal = document.createElement("div");
  modal.className = "modal";

  const imagens = ave.fotos?.length > 0
    ? ave.fotos.map(f => ({ src: `assets/images/photos/${f.src}`, legenda: f.legenda }))
    : [{ src: `assets/images/not_available.jpg`, legenda: "" }];

  let currentIndex = 0;

  // function getImagemHTML() {
  //   return `<img src="${imagens[currentIndex]}" alt="${ave.nomeComumBrasileiro}">`;
  // }

  function getImagemHTML() {
    const foto = imagens[currentIndex];
    return `
      <div class="image-with-caption">
        <img src="${foto.src}" alt="${ave.nomeComumBrasileiro}">
        ${foto.legenda ? `<span class="image-caption">${foto.legenda}</span>` : ""}
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="modal-card">
      <span class="close">&times;</span>
      <div class="modal-image-container">
        ${imagens.length > 1 ? '<span class="arrow left">&#10094;</span>' : ''}
        <div class="modal-image-wrapper">${getImagemHTML()}</div>
        ${imagens.length > 1 ? '<span class="arrow right">&#10095;</span>' : ''}
      </div>
      <div class="modal-body">
        <h1>${ave.nomeComumBrasileiro}</h1>
        <h2>${ave.nomeCientifico} (${ave.descricao})</h2>
        <p><b><span class="modal-body-titles">Ordem:</span></b> ${ave.ordem}</p>
        <p><b><span class="modal-body-titles">Família:</span></b> ${ave.familia}</p>
        <p><b><span class="modal-body-titles">Nome Inglês:</span></b> ${ave.nomeComumIngles}</p>
        <p><b><span class="modal-body-titles">Estado de Conservação IUCN:</span></b> ${ave.estadoConservacaoIucn}</p>
        <p><b><span class="modal-body-titles">Período de Atividade:</span></b> ${ave.periodoAtividade}</p>
        <p><b><span class="modal-body-titles">Dimorfismo Sexual:</span></b> ${ave.dimorfismo}</p>
        <p><b><span class="modal-body-titles">Habitats:</span></b></p>
        <ul>
          ${ave.habitats.map(h => `<li>${h}</li>`).join('')}
        </ul>
        <p><b><span class="modal-body-titles">Dieta:</span></b></p>
        <ul>
          ${ave.dieta.map(d => `<li>${d}</li>`).join('')}
        </ul>
        <p><b><span class="modal-body-titles">Endêmica do Brasil:</span></b> ${ave.endemicaBrasil}</p>
        <a class="primary-btn modal-body-btn" href="https://www.wikiaves.com.br/${ave.particula}" target=blank>Perfil da Espécie no Wikiaves</a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const imageWrapper = modal.querySelector(".modal-image-wrapper");
  const leftArrow = modal.querySelector(".arrow.left");
  const rightArrow = modal.querySelector(".arrow.right");

  function atualizarImagem() {
    imageWrapper.innerHTML = getImagemHTML();
  }

  // Adiciona eventos apenas se as setas existirem
  if (leftArrow && rightArrow) {
    leftArrow.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + imagens.length) % imagens.length;
      atualizarImagem();
    });

    rightArrow.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % imagens.length;
      atualizarImagem();
    });
  }

  // Função de fechar modal
  function fecharModal() {
    modal.remove();
    document.body.style.overflow = "";
    document.removeEventListener("keydown", escFechar);
  }

  // Fechar ao clicar no X
  modal.querySelector(".close").addEventListener("click", fecharModal);

  // Fechar clicando fora do card
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });

  // Teclas do teclado
  function escFechar(e) {
    if (e.key === "Escape") fecharModal();
    if (leftArrow && rightArrow) {
      if (e.key === "ArrowLeft") leftArrow.click();
      if (e.key === "ArrowRight") rightArrow.click();
    }
  }

  document.addEventListener("keydown", escFechar);
}

document.addEventListener("DOMContentLoaded", () => {
  carregarAves().then(() => ativarBusca());

  // Botão "Voltar ao topo"
  const scrollBtn = document.getElementById("scrollTopBtn");

  // Mostra ou esconde o botão ao rolar
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) { // aparece depois de rolar 300px
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
  });

  // Ao clicar, rola suavemente para o topo
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

const searchInput = document.getElementById("search");
const clearBtn = document.getElementById("clearSearch");

// Dar foco quando a página carrega
searchInput.focus();

const headerTitles = document.querySelectorAll("header h1, header h2");
headerTitles.forEach(title => {
  title.addEventListener("click", () => {
    // Limpa a busca
    searchInput.value = "";
    aplicarFiltro("");
    clearBtn.style.display = "none";

    // Rolagem suave até o topo
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Feedback visual temporário
    setTimeout(() => {
      title.style.color = ""; // volta para a cor original
    }, 300);

  });
});

// desabilita clique direito
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener("scroll", () => {
  const header = document.querySelector("header");

  if (window.scrollY > 200) {
    header.classList.add("shrink");
  } else {
    header.classList.remove("shrink");
  }
});