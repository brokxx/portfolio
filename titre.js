// Au chargement, chaque mot du titre passe par les polices des sites du portfolio
(function () {
  const titre = document.getElementById("titre");
  if (!titre) return;

  const POLICES = [
    ["'IM Fell English', serif", "italic", 400],
    ["'Caveat', cursive", "normal", 600],
    ["'Instrument Serif', serif", "italic", 400],
    ["'Montserrat', sans-serif", "normal", 700],
    ["'Cormorant Garamond', serif", "italic", 500],
    ["'Space Grotesk', sans-serif", "normal", 700],
    ["'Bricolage Grotesque', sans-serif", "normal", 700],
    ["'Fraunces', serif", "normal", 400],
    ["'Archivo', sans-serif", "normal", 700],
    ["'Chakra Petch', sans-serif", "normal", 500],
  ];
  const texte = titre.textContent.trim();
  titre.setAttribute("aria-label", texte);
  titre.innerHTML = texte
    .split(" ")
    .map((m) => `<span class="mot fini" aria-hidden="true"><span class="mot-fixe">${m}</span><span class="mot-anime">${m}</span></span>`)
    .join(" ");

  const mots = [...titre.querySelectorAll(".mot")];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let minuteurs = [];
  function jouer() {
    minuteurs.forEach(clearTimeout);
    minuteurs = [];
    mots.forEach((mot, i) => {
      const anime = mot.querySelector(".mot-anime");
      const depart = Math.floor(Math.random() * POLICES.length);
      const etapes = 7 + i;
      mot.classList.remove("fini");
      for (let n = 0; n < etapes; n++) {
        minuteurs.push(setTimeout(() => {
          const [famille, style, graisse] = POLICES[(depart + n) % POLICES.length];
          anime.style.fontFamily = famille;
          anime.style.fontStyle = style;
          anime.style.fontWeight = graisse;
        }, 90 * n));
      }
      minuteurs.push(setTimeout(() => mot.classList.add("fini"), 90 * etapes));
    });
  }

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(jouer, 250));
  let dernier = 0;
  titre.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse" || Date.now() - dernier < 1500) return;
    dernier = Date.now();
    jouer();
  });
})();
