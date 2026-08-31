/* MonBTS — Checklists de conformité administrative (Brique 4)
   ⚠️ Ces règles sont indicatives et généralistes. Les exigences précises
   (pagination, nombre de situations, dates de dépôt...) varient selon
   l'établissement et la session d'examen : vérifie-les avec ton centre
   avant de t'y fier à 100%. */

(function (root) {
  "use strict";

  var CONFORMITE = {
    E4: [
      { id: "e4-1", regle: "Chaque situation professionnelle respecte le nombre de pages maximum fixé par ton centre d'examen." },
      { id: "e4-2", regle: "Les situations présentées couvrent des processus différents (pas de doublon de processus)." },
      { id: "e4-3", regle: "Les documents supports (factures, devis, extraits CRM...) sont anonymisés avant remise (RGPD)." },
      { id: "e4-4", regle: "La date de chaque situation est cohérente avec le calendrier réel de la période en entreprise." },
      { id: "e4-5", regle: "Une attestation sur l'honneur de non-plagiat est signée et jointe au dossier." },
      { id: "e4-6", regle: "Le dossier est déposé avant la date limite fixée par le centre d'examen." }
    ],
    E5: [
      { id: "e5-1", regle: "Le dossier présente au moins le nombre de situations minimum exigé par ton référentiel." },
      { id: "e5-2", regle: "Chaque situation identifie clairement un risque et la démarche de prévention associée." },
      { id: "e5-3", regle: "Les annexes (DUERP, grilles, tableaux) sont bien référencées dans le corps du dossier." },
      { id: "e5-4", regle: "Le dossier respecte la pagination maximale imposée." },
      { id: "e5-5", regle: "La confidentialité des données de l'entreprise d'accueil est respectée (accord de diffusion si nécessaire)." }
    ],
    E6: [
      { id: "e6-1", regle: "Le dossier-projet répond à une problématique de performance clairement formulée." },
      { id: "e6-2", regle: "Le plan d'action proposé est réaliste et chiffré." },
      { id: "e6-3", regle: "Le support de soutenance orale respecte la durée imposée (préparation / exposé / entretien)." },
      { id: "e6-4", regle: "Les sources et références utilisées sont citées." },
      { id: "e6-5", regle: "Une version imprimée ou déposée est prête avant la date limite fixée par le centre d'examen." }
    ]
  };

  root.MonBTS = root.MonBTS || {};
  root.MonBTS.CONFIG = root.MonBTS.CONFIG || {};
  root.MonBTS.CONFIG.CONFORMITE_SEED = CONFORMITE;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = CONFORMITE;
  }
})(typeof window !== "undefined" ? window : globalThis);
