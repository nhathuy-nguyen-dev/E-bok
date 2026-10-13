// ============================================================
// Skisse A–I
// Hver skisse har sin egen del i fila, merket med bokstaven.
// ============================================================

// Felles: «Varsle meg»-knapper som slås av og på.
function lagVarsleKnapp(id) {
  const knapp = document.getElementById(id);
  let pa = false;
  knapp.addEventListener("click", () => {
    pa = !pa;
    knapp.firstChild.textContent = pa ? "✓ Du blir varslet " : "Varsle meg ";
    visMelding(pa ? "Vi sier fra når boken er klar." : "Varsling er slått av.");
  });
}


// ============================================================
// A – Stafettlinjen
// Tre etapper: den som låner nå, nr. 1 og nr. 2. Etter dem kommer DU.
// Hver etappe er delt i fire kvarter. Én dag i prototypen = ett kvarter.
// ============================================================
const A_START = 3; // etappe 1 har kommet 3 av 4 kvarter
let aKvarter = A_START;

function tegnStafett() {
  const liste = document.getElementById("a-etapper");
  const ferdigeEtapper = Math.floor(aKvarter / 4);
  const plass = 3 - ferdigeEtapper;
  const igjen = 12 - aKvarter; // kvarter igjen før boken er din

  if (igjen <= 0) {
    document.getElementById("a-status").innerHTML = "<strong>Boken er klar for deg!</strong>";
  } else {
    // Enkelt anslag: minst like mange dager som kvarter igjen, maks dobbelt + 3
    const fra = Math.max(1, igjen - 1);
    const til = igjen * 2 + 3;
    document.getElementById("a-status").innerHTML =
      "Du er nr. " + plass + " · ca. <strong>" + fra + "–" + til + " dager</strong>";
  }

  let html = "";
  for (let etappe = 1; etappe <= 3; etappe++) {
    // Hvor mange kvarter er fylt i akkurat denne etappen (0–4)?
    const fylt = Math.min(4, Math.max(0, aKvarter - (etappe - 1) * 4));

    let klasse, tittel, tekst, stiplet;
    if (fylt === 4) {
      klasse = "ferdig"; tittel = "ferdig"; tekst = "levert tilbake"; stiplet = false;
    } else if (etappe === ferdigeEtapper + 1) {
      klasse = "aktiv"; tittel = "lytter nå"; stiplet = false;
      tekst = "ca. " + fylt + "/4 · ferdig om ca. " + (4 - fylt) + "–" + ((4 - fylt) * 2 + 1) + " dager";
    } else {
      klasse = ""; tittel = "venter"; tekst = "har ikke startet · anslag 3–9 dager"; stiplet = true;
    }

    let ruter = "";
    for (let i = 0; i < 4; i++) {
      ruter += "<span class='" + (i < fylt ? "fylt" : "") + "'></span>";
    }

    html += "<li class='" + klasse + "'><strong>Etappe " + etappe + " · " + tittel + "</strong>" +
      "<div class='ruter" + (stiplet ? " stiplet" : "") + "'>" + ruter + "</div>" +
      "<span class='liten'>" + tekst + "</span></li>";
  }
  html += "<li class='mal'><strong>DU</strong></li>";
  liste.innerHTML = html;

  document.getElementById("a-dag").disabled = igjen <= 0;
}

document.getElementById("a-dag").addEventListener("click", () => {
  aKvarter++;
  tegnStafett();
});
document.getElementById("a-nullstill").addEventListener("click", () => {
  aKvarter = A_START;
  tegnStafett();
});
lagVarsleKnapp("a-varsle");
tegnStafett();


// ============================================================
// B – Værmeldingen
// Sjansen for at boken er din innen hver dag (som nedbør på yr).
// ============================================================
const bDager = [
  { dag: "ons", navn: "onsdag", prosent: 5 },
  { dag: "tor", navn: "torsdag", prosent: 15 },
  { dag: "fre", navn: "fredag", prosent: 35 },
  { dag: "lør", navn: "lørdag", prosent: 60 },
  { dag: "søn", navn: "søndag", prosent: 80 },
  { dag: "man", navn: "mandag", prosent: 90 },
];

const bStolper = document.getElementById("b-stolper");
const bDagRad = document.getElementById("b-dager");

bDager.forEach((d) => {
  const stolpe = document.createElement("button");
  stolpe.className = "stolpe";
  stolpe.setAttribute("aria-label", d.navn + ": " + d.prosent + " prosent");
  // 85 % av høyden er satt av til søylen, resten til tallet over
  stolpe.innerHTML = "<span class='verdi'>" + d.prosent + "%</span>" +
    "<span class='soyle' style='height:" + (d.prosent * 0.85) + "%'></span>";

  stolpe.addEventListener("click", () => {
    document.querySelectorAll(".stolpe").forEach((s) => s.classList.remove("valgt"));
    stolpe.classList.add("valgt");
    document.getElementById("b-tekst").innerHTML =
      "Innen <strong>" + d.navn + "</strong>: " + d.prosent + " % sjanse";
  });
  bStolper.appendChild(stolpe);

  const etikett = document.createElement("span");
  etikett.textContent = d.dag;
  if (d.dag === "lør") etikett.style.fontWeight = "bold";
  bDagRad.appendChild(etikett);
});

document.getElementById("b-hvorfor").addEventListener("click", () => {
  const tekst = document.getElementById("b-hvorfor-tekst");
  tekst.hidden = !tekst.hidden;
});


// ============================================================
// C – Prikkdiagram
// Ti prikker = ti mulige utfall. Tallet er hvor mange dager det tar.
// ============================================================
const cSikker = [9, 9, 9, 10, 10, 10, 10, 11, 11, 11];
const cUsikker = [3, 6, 8, 8, 11, 13, 13, 16, 18, 21];

function tegnPrikker(beholderId, dager, fylt) {
  const beholder = document.getElementById(beholderId);
  const antallPerDag = {}; // teller prikker på samme dag, så de stables

  dager.forEach((dag) => {
    const nr = antallPerDag[dag] || 0;
    antallPerDag[dag] = nr + 1;

    const prikk = document.createElement("button");
    prikk.className = "prikk " + (fylt ? "fylt" : "hul");
    // Dag 1 helt til venstre, dag 21 helt til høyre
    prikk.style.left = ((dag - 1) / 20) * 100 + "%";
    prikk.style.bottom = 2 + nr * 15 + "px";
    prikk.setAttribute("aria-label", "Utfall: " + dag + " dager");

    prikk.addEventListener("click", () => {
      document.querySelectorAll(".prikk").forEach((p) => p.classList.remove("valgt"));
      prikk.classList.add("valgt");
      document.getElementById("c-tekst").innerHTML =
        "Ett av ti utfall: boken er din om <strong>" + dag + " dager</strong>";
    });
    beholder.appendChild(prikk);
  });
}
tegnPrikker("c-sikker", cSikker, true);
tegnPrikker("c-usikker", cUsikker, false);


// ============================================================
// D – Begynn mens du venter
// «Spill av» later som den spiller 12 minutter (går 60x fortere her).
// ============================================================
const D_LENGDE = 12 * 60; // sekunder
let dSekunder = 0;
let dTimer = null;

function formaterTid(sek) {
  const min = Math.floor(sek / 60);
  const s = String(sek % 60).padStart(2, "0");
  return min + ":" + s;
}

function dOppdaterVisning() {
  document.getElementById("d-linje").style.width = (dSekunder / D_LENGDE) * 100 + "%";
  document.getElementById("d-tid").textContent = dSekunder === 0
    ? "12 minutter · gratis smakebit"
    : formaterTid(dSekunder) + " av 12:00 · gratis smakebit";
}

function dStopp() {
  clearInterval(dTimer);
  dTimer = null;
  document.getElementById("d-ikon").textContent = "▶";
  document.getElementById("d-knappetekst").textContent = "Spill av";
}

document.getElementById("d-spill").addEventListener("click", () => {
  if (dTimer) {
    dStopp(); // spiller allerede → pause
    return;
  }
  if (dSekunder >= D_LENGDE) dSekunder = 0; // start på nytt
  document.getElementById("d-ikon").textContent = "❚❚";
  document.getElementById("d-knappetekst").textContent = "Pause";

  dTimer = setInterval(() => {
    dSekunder = Math.min(D_LENGDE, dSekunder + 6);
    dOppdaterVisning();
    if (dSekunder >= D_LENGDE) {
      dStopp();
      visMelding("Kapittel 1 er ferdig. Du står fortsatt i køen.");
    }
  }, 100);
});

document.getElementById("d-lan").addEventListener("click", (e) => {
  e.target.textContent = "✓ Lånt";
  e.target.disabled = true;
  visMelding("«Under isen» er lånt. Du mister ikke plassen i køen.");
});


// ============================================================
// E – Nummerlappen
// ============================================================
const E_MITT = 43;
let eNa = 41;

function tegnNummer() {
  const foran = E_MITT - eNa;
  document.getElementById("e-na").textContent = "#" + eNa;

  let tekst;
  if (foran === 0) tekst = "Det er din tur! Boken er klar.";
  else if (foran === 1) tekst = "1 foran deg · ca. 2–7 dager";
  else tekst = foran + " foran deg · ca. 8–14 dager";
  document.getElementById("e-tekst").textContent = tekst;

  document.getElementById("e-neste").disabled = foran === 0;
}

document.getElementById("e-neste").addEventListener("click", () => {
  eNa++;
  tegnNummer();
  if (eNa === E_MITT) visMelding("Nummer 43 – det er deg!");
});
document.getElementById("e-nullstill").addEventListener("click", () => {
  eNa = 41;
  tegnNummer();
});
lagVarsleKnapp("e-varsle");
tegnNummer();


// ============================================================
// F – Hendelsesloggen
// ============================================================
const fHendelser = [
  { tid: "13.10 kl. 18.10", kort: "Lånet ble forlenget.",
    detalj: "Anslag endret: 30 min → 2–4 dager.<br>Du er fortsatt først." },
  { tid: "10.10", kort: "Du rykket opp til nr. 1",
    detalj: "Personen foran deg fikk boken." },
  { tid: "08.10", kort: "Du rykket opp til nr. 2",
    detalj: "En person foran deg trakk reservasjonen." },
  { tid: "06.10", kort: "Du reserverte boken",
    detalj: "Du var nr. 3 i køen. Første anslag: 8–14 dager." },
];

const fLogg = document.getElementById("f-logg");
fHendelser.forEach((h, i) => {
  const knapp = document.createElement("button");
  knapp.className = "hendelse" + (i === 0 ? " apen" : ""); // den nyeste er åpen
  knapp.innerHTML = "<strong>" + h.tid + "</strong><br>" + h.kort +
    "<span class='detalj'>" + h.detalj + "</span>";
  knapp.addEventListener("click", () => knapp.classList.toggle("apen"));
  fLogg.appendChild(knapp);
});


// ============================================================
// G – Regler for fornyelse
// ============================================================
const gFaner = document.querySelectorAll("#g-faner button");
gFaner.forEach((fane) => {
  fane.addEventListener("click", () => {
    gFaner.forEach((f) => f.setAttribute("aria-pressed", "false"));
    fane.setAttribute("aria-pressed", "true");

    const valgt = fane.dataset.variant;
    document.querySelectorAll(".variant").forEach((v) => {
      v.hidden = valgt !== "alle" && v.dataset.nr !== valgt;
    });
  });
});


// ============================================================
// H – Status på hvileskjermen
// ============================================================
const hHvile = document.getElementById("h-skjerm");
const hApen = document.getElementById("h-apen");

function hLasOpp() { hHvile.hidden = true; hApen.hidden = false; }
function hLas() { hApen.hidden = true; hHvile.hidden = false; }

hHvile.addEventListener("click", hLasOpp);
hHvile.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hLasOpp(); }
});
document.getElementById("h-las").addEventListener("click", hLas);


// ============================================================
// I – Tempo i stedet for tall
// ============================================================
const iAnslag = {
  rolig: { tid: "10–16 dager", tekst: "Hvis tempoet øker, går det fortere." },
  jevnt: { tid: "6–10 dager", tekst: "Låneren lytter litt hver dag." },
  raskt: { tid: "3–6 dager", tekst: "Låneren lytter mye. Det kan gå enda fortere." },
};

const iKnapper = document.querySelectorAll("#i-tempo button");
iKnapper.forEach((knapp) => {
  knapp.addEventListener("click", () => {
    iKnapper.forEach((k) => k.setAttribute("aria-pressed", "false"));
    knapp.setAttribute("aria-pressed", "true");
    const valg = iAnslag[knapp.dataset.tempo];
    document.getElementById("i-anslag").textContent = valg.tid;
    document.getElementById("i-tekst").textContent = valg.tekst;
  });
});
