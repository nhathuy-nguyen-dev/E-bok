// ============================================================
// Små hjelpefunksjoner som brukes på flere sider
// ============================================================

// Viser en kort beskjed nederst på skjermen i 2,5 sekunder.
let meldingTimer;
function visMelding(tekst) {
  const boks = document.getElementById("melding");
  if (!boks) return;
  boks.textContent = tekst;
  boks.classList.add("vis");
  clearTimeout(meldingTimer);
  meldingTimer = setTimeout(() => boks.classList.remove("vis"), 2500);
}

// Gir klokkeslettet nå på norsk form, for eksempel «18.40».
function klokkeslettNa() {
  const na = new Date();
  const timer = String(na.getHours()).padStart(2, "0");
  const minutter = String(na.getMinutes()).padStart(2, "0");
  return timer + "." + minutter;
}

// Kobler knappene i situasjonsvelgeren til en funksjon.
// visSituasjon blir kalt med navnet på situasjonen, f.eks. "forlenget".
function lagSituasjonsvelger(visSituasjon) {
  const knapper = document.querySelectorAll("#situasjoner button");
  knapper.forEach((knapp) => {
    knapp.addEventListener("click", () => {
      knapper.forEach((k) => k.setAttribute("aria-pressed", "false"));
      knapp.setAttribute("aria-pressed", "true");
      visSituasjon(knapp.dataset.situasjon);
    });
  });
}
