(function () {
  const projets = window.PROJETS;
  const index = document.getElementById("index");
  const vitrine = document.getElementById("vitrine");

  const STATUTS = {
    ligne: "En ligne",
    pret: "Prêt à publier",
    dev: "En développement",
    maquette: "Maquette",
    local: "Outil local",
    archive: "Archivé",
  };
  const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  const enLigne = projets.filter((p) => p.statut === "ligne").length;
  document.getElementById("intro").textContent =
    `${projets.length} sites et applications, dont ${enLigne} en ligne : vitrines pour des thérapeutes, formations, boutiques et outils de trading, construits en 2026.`;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const dateLongue = (d) => {
    const [a, m] = d.split("-");
    return `${MOIS[Number(m) - 1]} ${a}`;
  };
  const hote = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  function fiche(p, mobile) {
    const lien = p.url
      ? `<a class="lien" href="${esc(p.url)}" target="_blank" rel="noopener">Ouvrir ${esc(hote(p.url))}</a>`
      : `<p class="sans-lien">${p.domaine ? `Bientôt sur ${esc(p.domaine)}` : "Pas de version publique"}</p>`;
    const vignettes = p.captures.length > 1
      ? `<div class="vignettes">${p.captures
          .map((c, i) => `<button type="button" data-capture="${esc(c)}" aria-pressed="${i === 0}" aria-label="Capture ${i + 1}"><img src="img/${esc(c)}.webp" alt=""></button>`)
          .join("")}</div>`
      : "";
    return `
      <figure class="ecran">
        <img src="img/${esc(p.captures[0])}.webp" alt="Page d'accueil de ${esc(p.nom)}" width="1200" height="750"${mobile ? ' loading="lazy"' : ""}>
      </figure>
      ${vignettes}
      <div class="infos">
        <div class="infos-titre">
          <h2 class="vitrine-nom">${mobile && p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.nom)}</a>` : esc(p.nom)}</h2>
          <p class="meta"><span class="statut" data-statut="${p.statut}">${STATUTS[p.statut]}</span>, ${dateLongue(p.date)}</p>
          ${lien}
        </div>
        <div class="infos-texte">
          <p class="resume">${esc(p.resume)}</p>
          <dl class="details">
            <div><dt>Technique</dt><dd>${esc(p.stack)}</dd></div>
            <div><dt>Palette</dt><dd class="palette">${p.palette
              .map((c) => `<span style="--c:${c}" title="${c}"></span>`)
              .join("")}</dd></div>
          </dl>
        </div>
      </div>`;
  }

  index.innerHTML = projets
    .map((p) => {
      const style = [
        `--p-police:${p.police}`,
        `--p-graisse:${p.graisse || 400}`,
        `--p-style:${p.italique ? "italic" : "normal"}`,
        `--p-echelle:${p.echelle || 1}`,
        `--p-fond:${p.fond}`,
        `--p-encre:${p.encre}`,
      ].join(";");
      return `
      <li data-id="${p.id}" data-groupe="${p.groupe}" style="${esc(style)}">
        ${p.url
          ? `<a class="nom" href="${esc(p.url)}" target="_blank" rel="noopener" aria-current="false">${esc(p.nom)}</a>`
          : `<button type="button" class="nom" aria-current="false" aria-controls="vitrine">${esc(p.nom)}</button>`}
      </li>`;
    })
    .join("");

  // Version mobile : une fiche par projet, à la suite
  const cartes = document.getElementById("cartes");
  cartes.innerHTML = projets
    .map((p) => {
      const style = [
        `--p-police:${p.police}`,
        `--p-graisse:${p.graisse || 400}`,
        `--p-style:${p.italique ? "italic" : "normal"}`,
        `--p-echelle:${p.echelle || 1}`,
        `--p-fond:${p.fond}`,
        `--p-encre:${p.encre}`,
        `--p-accent:${p.accent}`,
      ].join(";");
      return `<article class="carte" data-id="${p.id}" data-groupe="${p.groupe}" style="${esc(style)}">${fiche(p, true)}</article>`;
    })
    .join("");

  let actif = null;

  function activer(id) {
    const p = projets.find((x) => x.id === id);
    if (!p || actif === id) return;
    actif = id;
    index.querySelectorAll("li").forEach((l) =>
      l.querySelector(".nom").setAttribute("aria-current", String(l.dataset.id === id))
    );
    vitrine.style.setProperty("--p-fond", p.fond);
    vitrine.style.setProperty("--p-encre", p.encre);
    vitrine.style.setProperty("--p-accent", p.accent);
    vitrine.innerHTML = fiche(p);
    vitrine.classList.remove("apparait");
    void vitrine.offsetWidth;
    vitrine.classList.add("apparait");
  }

  index.addEventListener("click", (e) => {
    // Les noms des sites en ligne sont des liens : le navigateur ouvre le site
    const b = e.target.closest("button.nom");
    if (b) activer(b.parentElement.dataset.id);
  });
  index.addEventListener("pointerover", (e) => {
    const b = e.target.closest(".nom");
    if (b && e.pointerType === "mouse") activer(b.parentElement.dataset.id);
  });
  index.addEventListener("focusin", (e) => {
    const b = e.target.closest(".nom");
    if (b) activer(b.parentElement.dataset.id);
  });

  // Bascule entre les captures d'un même projet
  document.addEventListener("click", (e) => {
    const v = e.target.closest("[data-capture]");
    if (!v) return;
    const bloc = v.closest(".vitrine, .carte");
    bloc.querySelector(".ecran img").src = `img/${v.dataset.capture}.webp`;
    bloc.querySelectorAll("[data-capture]").forEach((x) => x.setAttribute("aria-pressed", String(x === v)));
  });

  document.querySelectorAll("[data-filtre]").forEach((b) =>
    b.addEventListener("click", () => {
      const f = b.dataset.filtre;
      document.querySelectorAll("[data-filtre]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      let premier = null;
      index.querySelectorAll("li").forEach((l) => {
        const visible = f === "tous" || l.dataset.groupe === f;
        l.hidden = !visible;
        if (visible && !premier) premier = l.dataset.id;
      });
      cartes.querySelectorAll(".carte").forEach((c) => {
        c.hidden = !(f === "tous" || c.dataset.groupe === f);
      });
      if (premier && index.querySelector(`[data-id="${actif}"]`).hidden) activer(premier);
    })
  );

  activer(projets[0].id);
})();
