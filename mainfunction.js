class LayoutLoader {

  static async load(elementId, file) {
    const response = await fetch(file);
    const data = await response.text();
    document.getElementById(elementId).innerHTML = data;
  }

  static getActiveNav() {

    let file = window.location.pathname.split("/").pop();

    if (!file || file === "" || file.startsWith("index")) {
      return null;
    }

    file = file.toLowerCase();

    if (!file.startsWith("hauptreiter_")) {
      return null;
    }

    const part = file.replace("hauptreiter_", "");
    return part.split("_")[0];

  }

static async loadHeader() {
  const container = document.getElementById("header-placeholder");
  if (!container) return;

  await this.load("header-placeholder", "kopfzeile.html");

  const activeNav = this.getActiveNav();
  if (!activeNav) return;

  const links = document.querySelectorAll(".main-nav a");
  links.forEach(link => {
    const navName = link.dataset.nav.toLowerCase();
    if (navName === activeNav) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
static async loadBreadcrumb() {
  const file = window.location.pathname.split("/").pop().toLowerCase();
  const container = document.getElementById("breadcrumb-placeholder");
  if (!container) return;

  // Startseite
  let html = `<nav class="breadcrumb"><a href="index.html">Startseite</a>`;

  if (!file || file.startsWith("index") || !file.startsWith("hauptreiter_")) {
    container.innerHTML = html + "</nav>";
    return;
  }

  // Alles nach hauptreiter_
  const namePart = file.replace("hauptreiter_", "").replace(".html","");
  // Split nach doppelt Unterstrich = neue Breadcrumb-Ebenen
  const parts = namePart.split("__");

  let path = "hauptreiter_" + parts[0];

  // Erste Ebene = Hauptreiter
  let text = LayoutLoader.convertUmlauts(parts[0]);
  text = text.charAt(0).toUpperCase() + text.slice(1);
  html += ` &rsaquo; <a href="${path}.html">${text}</a>`;

  // Restliche Ebenen
  for (let i = 1; i < parts.length; i++) {
    path += `__${parts[i]}`;
    let subText = LayoutLoader.convertUmlauts(parts[i]).replace(/_/g, " ");
    subText = subText.charAt(0).toUpperCase() + subText.slice(1);
    html += ` &rsaquo; <a href="${path}.html">${subText}</a>`;
  }

  html += "</nav>";
  container.innerHTML = html;
}
  static async loadFooter() {
    await this.load("footer-placeholder", "fusszeile.html");
  }
static convertUmlauts(str) {
  return str
    .replace(/ae/g, "ä")
    .replace(/oe/g, "ö")
    .replace(/ue/g, "ü")
    .replace(/ss/g, "ß")
    .replace(/_/g, " "); // Unterstriche ? Leerzeichen
}
  static init() {
    this.loadHeader();
    this.loadFooter();
	 this.loadBreadcrumb();
  }

}
const TooltipData = {
  "Biologische Evolution": "<span style=\"font-size:11pt;color:#000000;\">Hier kann ein mehrzeiliger<br>Text rein<br>Wir können auch vereinbaren, dass ich Stile wie </span><span style=\"font-weight:bold;font-size:11pt;color:#000000;\">fett</span><span style=\"font-size:11pt;color:#000000;\"> oder die</span><span style=\"font-size:18pt;color:#000000;\"> Schriftgröße</span><span style=\"font-size:11pt;color:#000000;\"> oder </span><span style=\"font-size:11pt;color:#4472C4;\">Farbe</span><span style=\"font-size:11pt;color:#000000;\"> übernehme</span>",
  "Automatismen": "<span style=\"font-size:11pt;color:#000000;\">Handlungsautomatismus: Wir handeln, bevor wir denken<br>Adaptionsautomatismus: Das system lernt ohne unser Zutun</span>",
  "Automatismus": "<span style=\"font-size:11pt;color:#000000;\">Handlungsautomatismus: Wir handeln, bevor wir denken<br>Adaptionsautomatismus: Das system lernt ohne unser Zutun</span>"
};

document.addEventListener("DOMContentLoaded", () => {
  function formatKeyTitle(key) {
    return key
      .replace(/_/g, ' ')
      .replace(/ae/g, 'ä')
      .replace(/oe/g, 'ö')
      .replace(/ue/g, 'ü')
      .replace(/ss/g, 'ß')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // Alle Tooltip-Elemente
  document.querySelectorAll('.tooltip').forEach(el => {
    // Jede .tooltip-Instanz bekommt ihre eigene Variable
    let tooltipBox = null;

    el.addEventListener('mouseenter', () => {
      const key = el.getAttribute('data-key');
      const content = TooltipData[key];
      if (!content) return;

      // Tooltip erzeugen
      tooltipBox = document.createElement('div');
      tooltipBox.className = 'tooltip-box';

      const title = document.createElement('div');
      title.className = 'tooltip-title';
      title.innerText = formatKeyTitle(key);

      const body = document.createElement('div');
      body.className = 'tooltip-body';
      body.innerHTML = content;

      tooltipBox.appendChild(title);
      tooltipBox.appendChild(body);

      document.body.appendChild(tooltipBox);

      // Position über oder unter dem Element
      const rect = el.getBoundingClientRect();
      const tooltipRect = tooltipBox.getBoundingClientRect();
      let top = rect.top + window.scrollY - tooltipRect.height - 5;
      let left = rect.left + window.scrollX;

      if (top < window.scrollY) {
        top = rect.bottom + window.scrollY + 5;
      }

      tooltipBox.style.position = 'absolute';
      tooltipBox.style.top = top + 'px';
      tooltipBox.style.left = left + 'px';
      tooltipBox.style.visibility = 'visible';
      tooltipBox.style.zIndex = 9999;
    });

    el.addEventListener('mouseleave', () => {
      if (tooltipBox) {
        tooltipBox.remove();
        tooltipBox = null; // freigeben, damit nächste Hover wieder funktioniert
      }
    });
  });
});



