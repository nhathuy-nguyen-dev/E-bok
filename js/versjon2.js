// ============================================================
// Versjon 2 – høy kontrast, fremdrift i fire trinn
// ============================================================

const situasjoner = {
  normal: {
    plass: 3,
    ventetid: "8–14 dager",
    undertekst: "Tidsrommet kan endre seg.",
    visSitat: false,
    trinn: 2, // hvor mange av de fire firkantene som er fylt
    bilde: "bilder/v2-normal-venting.png",
    forklaring: "Vanlig venting. I stedet for prosent viser linjen fire grove trinn. " +
      "Det gir mindre informasjon om låneren og passer godt på e-blekk, der skjermen oppdateres sjelden.",
  },
  forlenget: {
    plass: 1,
    ventetid: "2–4 dager",
    undertekst: "Ventetiden er endret.",
    visSitat: true,
    trinn: 3,
    bilde: "bilder/v2-forlenget-lan.png",
    forklaring: "Lånet ble forlenget. Endringen forklares med en strek i margen i stedet for en grå boks, " +
      "fordi grått blir utydelig på e-blekk.",
  },
  usikker: {
    plass: 3,
    ventetid: "8–21 dager",
    undertekst: "Usikkert anslag – begrenset grunnlag.",
    visSitat: false,
    trinn: 2,
    bilde: "bilder/v2-usikkert-anslag.png",
    forklaring: "Vi vet lite om hvor fort låneren lytter, så tidsrommet er bredere. Teksten sier det rett ut.",
  },
};

// Tekst for hvert trinn (indeks 0–4)
const trinnTekst = [
  "Har ikke startet",
  "Omtrent en firedel lyttet",
  "Omtrent halvveis lyttet",
  "Omtrent tre firedeler lyttet",
  "Nesten ferdig",
];

let gjeldende = situasjoner.normal;

function visSituasjon(navn) {
  gjeldende = situasjoner[navn];
  const s = gjeldende;

  document.getElementById("status").textContent =
    s.plass === 1 ? "Du er først i køen" : "Du er nummer " + s.plass + " i køen";
  document.getElementById("ventetid").textContent = s.ventetid;
  document.getElementById("undertekst").textContent = s.undertekst;
  document.getElementById("sitat").hidden = !s.visSitat;

  // Fyll de første «s.trinn» firkantene
  const firkanter = document.querySelectorAll("#trinn span");
  firkanter.forEach((firkant, i) => firkant.classList.toggle("fylt", i < s.trinn));
  document.getElementById("trinn").setAttribute("aria-label", s.trinn + " av 4 trinn");
  document.getElementById("lyttet").textContent = trinnTekst[s.trinn];

  document.getElementById("forklaring-tekst").textContent = s.forklaring;
  document.getElementById("original").src = s.bilde;

  lukkPaneler();
}

// ---------- Undersidene (paneler) ----------
function lukkPaneler() {
  document.querySelectorAll(".panel").forEach((p) => (p.hidden = true));
}

function apnePanel(id) {
  lukkPaneler();
  if (id === "panel-ko") fyllKo();
  document.getElementById(id).hidden = false;
}

function fyllKo() {
  let html = "<div class='rad'><span>Lånes nå</span><span>" + trinnTekst[gjeldende.trinn].toLowerCase() + "</span></div>";
  for (let nr = 1; nr <= gjeldende.plass; nr++) {
    const erDeg = nr === gjeldende.plass;
    html += "<div class='rad" + (erDeg ? " deg" : "") + "'><span>Nr. " + nr + "</span><span>" +
      (erDeg ? "Deg" : "Venter") + "</span></div>";
  }
  document.getElementById("ko-rader").innerHTML = html;
}

document.querySelectorAll("[data-panel]").forEach((knapp) => {
  knapp.addEventListener("click", () => apnePanel(knapp.dataset.panel));
});
document.querySelectorAll(".panel .tilbake").forEach((knapp) => {
  knapp.addEventListener("click", lukkPaneler);
});

// ---------- E-postskjema ----------
const skjema = document.getElementById("epost-skjema");
skjema.addEventListener("submit", (hendelse) => {
  hendelse.preventDefault(); // ikke last siden på nytt

  const felt = document.getElementById("epost");
  const adresse = felt.value.trim();
  const gyldig = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse);

  document.getElementById("epost-feil").hidden = gyldig;
  if (!gyldig) {
    felt.focus();
    return;
  }

  document.getElementById("epost-vis").textContent = adresse;
  skjema.hidden = true;
  document.getElementById("epost-ferdig").hidden = false;
  document.getElementById("epost-knapp").firstChild.textContent = "✓ Varsling er på ";
  visMelding("Du får e-post når boken er klar.");
});

document.getElementById("epost-av").addEventListener("click", () => {
  skjema.hidden = false;
  document.getElementById("epost-ferdig").hidden = true;
  document.getElementById("epost-knapp").firstChild.textContent = "Varsling på e-post ";
  visMelding("Varsling er slått av.");
});

// ---------- Oppdater ----------
document.getElementById("oppdater").addEventListener("click", () => {
  document.getElementById("tidspunkt").textContent = "Sist oppdatert kl. " + klokkeslettNa();
  visMelding("Oppdatert – ingen endringer.");
});

lagSituasjonsvelger(visSituasjon);
visSituasjon("normal");
