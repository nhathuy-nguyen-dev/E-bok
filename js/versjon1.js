// ============================================================
// Versjon 1 – lys ramme, bokomslag og prosentlinje
// ============================================================

// All teksten som endrer seg mellom situasjonene ligger samlet her.
// Da trenger vi bare én funksjon (visSituasjon) som fyller den inn.
const situasjoner = {
  normal: {
    tittel: "Reservasjonen din",
    plass: 3,
    ventetid: "8–14 dager",
    undertekst: "Du får beskjed når boken er klar.",
    visEndret: false,
    lyttetFra: 50,
    lyttetTil: 75,
    bilde: "bilder/v1-normal-venting.png",
    forklaring: "Vanlig venting. Du er nr. 3 i køen, og den som låner boken nå " +
      "har lyttet omtrent 50–75 %. Den skraverte delen av linjen betyr at vi ikke vet nøyaktig hvor langt låneren har kommet.",
  },
  forlenget: {
    tittel: "Oppdatert ventetid",
    plass: 1,
    ventetid: "2–4 dager",
    undertekst: "Du er den neste som får boken.",
    visEndret: true,
    lyttetFra: 75,
    lyttetTil: 100,
    bilde: "bilder/v1-forlenget-lan.png",
    forklaring: "Låneren forlenget lånet, så ventetiden økte fra rundt 30 minutter til 2–4 dager. " +
      "Den grå boksen forklarer hvorfor, så brukeren ikke tror at noe er galt.",
  },
  usikker: {
    tittel: "Usikkert anslag",
    plass: 3,
    ventetid: "8–21 dager",
    undertekst: "Vi har for lite grunnlag til et mer presist anslag.",
    visEndret: false,
    lyttetFra: 50,
    lyttetTil: 75,
    bilde: "bilder/v1-usikkert-anslag.png",
    forklaring: "Låneren har ikke lyttet på en stund. Da blir tidsrommet bredere (8–21 dager), " +
      "og vi sier rett ut at anslaget er usikkert.",
  },
};

let gjeldende = situasjoner.normal;

function visSituasjon(navn) {
  gjeldende = situasjoner[navn];
  const s = gjeldende;

  document.getElementById("statustittel").textContent = s.tittel;
  document.getElementById("plass").textContent = "Nr. " + s.plass + " i køen";
  document.getElementById("ventetid").textContent = s.ventetid;
  document.getElementById("undertekst").textContent = s.undertekst;
  document.getElementById("endret").hidden = !s.visEndret;
  document.getElementById("lyttet").textContent =
    "Nåværende lån: omtrent " + s.lyttetFra + "–" + s.lyttetTil + " % lyttet";

  // Fremdriftslinjen: den svarte delen går til «lyttetFra»,
  // den skraverte delen fyller mellomrommet opp til «lyttetTil».
  document.getElementById("linje-sikker").style.width = s.lyttetFra + "%";
  const kanskje = document.getElementById("linje-kanskje");
  kanskje.style.left = s.lyttetFra + "%";
  kanskje.style.width = (s.lyttetTil - s.lyttetFra) + "%";
  document.getElementById("linje").setAttribute("aria-label",
    "Omtrent " + s.lyttetFra + " til " + s.lyttetTil + " prosent lyttet");

  document.getElementById("forklaring-tekst").textContent = s.forklaring;
  document.getElementById("original").src = s.bilde;

  lukkKo();
}

// ---------- «Se køen din» ----------
function apneKo() {
  const liste = document.getElementById("ko-liste");
  liste.innerHTML = "";

  // Første rad er den som låner boken akkurat nå
  liste.innerHTML += "<li><span>Lånes nå</span><span>" +
    gjeldende.lyttetFra + "–" + gjeldende.lyttetTil + " % lyttet</span></li>";

  // Så alle i køen, frem til og med deg
  for (let nr = 1; nr <= gjeldende.plass; nr++) {
    if (nr === gjeldende.plass) {
      liste.innerHTML += "<li class='deg'><span>Nr. " + nr + "</span><span>Deg</span></li>";
    } else {
      liste.innerHTML += "<li><span>Nr. " + nr + "</span><span>Venter</span></li>";
    }
  }
  document.getElementById("ko-panel").hidden = false;
}

function lukkKo() {
  document.getElementById("ko-panel").hidden = true;
}

// ---------- Varsling ----------
let varslerPa = false;
function byttVarsling() {
  varslerPa = !varslerPa;
  const knapp = document.getElementById("varsle");
  knapp.classList.toggle("aktiv", varslerPa);
  if (varslerPa) {
    knapp.textContent = "✓ Du blir varslet";
    visMelding("Vi sier fra når boken er klar.");
  } else {
    knapp.textContent = "Varsle meg når boken er klar";
    visMelding("Varsling er slått av.");
  }
}

// ---------- Oppdater ----------
function oppdater() {
  document.getElementById("tidspunkt").textContent = "Sist oppdatert kl. " + klokkeslettNa();
  visMelding("Oppdatert – ingen endringer.");
}

// ---------- Koble knappene til funksjonene ----------
lagSituasjonsvelger(visSituasjon);
document.getElementById("se-ko").addEventListener("click", apneKo);
document.getElementById("lukk-ko").addEventListener("click", lukkKo);
document.getElementById("varsle").addEventListener("click", byttVarsling);
document.getElementById("oppdater").addEventListener("click", oppdater);

visSituasjon("normal");
