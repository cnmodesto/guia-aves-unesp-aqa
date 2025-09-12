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
      <img src="${srcImagem}" alt="${ave.nomeComumBrasileiro}">
      <div class="card-content">
        <div>
          <h3 class="headline">${ave.nomeComumBrasileiro}</h3>
          <h4 class="subhead"><em>${ave.nomeCientifico}</em></h4>
          <div class="body">
            <p class="insidebody"><b>Descrição:</b> ${ave.descricao}</p>
            <p class="insidebody"><b>Ordem:</b> ${ave.ordem}</p>
            <p class="insidebody"><b>Família:</b> ${ave.familia}</p>
            <p class="insidebody"><b>Nome Comum em Inglês:</b> ${ave.nomeComumIngles}</p>
          </div>
        </div>
        <a class="primary-btn" href="https://www.wikiaves.com/${ave.particula}" target="blank">Mais detalhes</a>
      </div>
    `;
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
}

document.addEventListener("DOMContentLoaded", () => {
  carregarAves().then(() => ativarBusca());
});

// desabilita clique direito
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});