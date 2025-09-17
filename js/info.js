document.addEventListener("DOMContentLoaded", () => {

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

const headerTitles = document.querySelectorAll("header h1, header h2");
headerTitles.forEach(title => {
  title.addEventListener("click", () => {
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