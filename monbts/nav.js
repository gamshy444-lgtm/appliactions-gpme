/* MonBTS — navigation partagée entre tous les modules */
(function (root) {
  "use strict";

  var LINKS = [
    { id: "accueil", label: "🏠 Accueil", href: "index.html" },
    { id: "dashboard", label: "📊 Dashboard", href: "dashboard.html" },
    { id: "chapitres", label: "📚 Chapitres", href: "chapitres.html" },
    { id: "examens", label: "🧪 Examens", href: "examens.html" },
    { id: "journal", label: "📓 Journal alternance", href: "journal.html" },
    { id: "conformite", label: "✅ Conformité dossiers", href: "conformite.html" }
  ];

  function navHtml(activeId) {
    return LINKS.map(function (l) {
      return '<a href="' + l.href + '" class="' + (l.id === activeId ? "current" : "") + '">' + l.label + "</a>";
    }).join("");
  }

  root.MonBTS = root.MonBTS || {};
  root.MonBTS.navHtml = navHtml;
})(typeof window !== "undefined" ? window : globalThis);
