/* MonBTS — Configuration des matières (Brique 1)
   Coefficients officiels fournis par l'utilisateur : total = 33.
   Les seuils d'urgence sont volontairement isolés ici pour rester ajustables
   sans toucher au moteur de calcul (store.js). */

(function (root) {
  "use strict";

  var CIBLE_GENERALE_DEFAUT = 12;

  // impact = coefficient * max(cible - note, 0)
  // Ajuste ces deux seuils si l'auto-classification ne te semble pas assez fine.
  var SEUILS_ALERTE = {
    urgent: 20, // ex: coeff 6 avec ~3,4 points de retard, ou coeff 8 avec 2,5 points de retard
    maintenir: 8 // en dessous : rien à signaler, l'écart est faible ou déjà comblé
  };

  // Les notes ci-dessous reprennent les exemples donnés dans le cahier des charges.
  // Complète/édite-les directement dans le dashboard : elles sont ensuite persistées
  // dans localStorage et cette config ne sert que de valeurs de démarrage.
  var MATIERES = [
    {
      id: "cejm",
      code: "CEJM",
      nom: "Culture Économique, Juridique et Managériale",
      coefficient: 6,
      typeEvaluation: "ponctuel",
      statutEvaluation: "a_venir",
      noteActuelle: 5.71,
      noteCible: CIBLE_GENERALE_DEFAUT,
      prioriteManuelle: null, // laissé au calcul automatique
      dateEcheance: null
    },
    {
      id: "e4",
      code: "E4",
      nom: "Gestion de la Relation Client et Fournisseurs",
      coefficient: 6,
      typeEvaluation: "ccf",
      statutEvaluation: "en_cours",
      noteActuelle: 8.0,
      noteCible: CIBLE_GENERALE_DEFAUT,
      prioriteManuelle: null,
      dateEcheance: null
    },
    {
      id: "e5",
      code: "E5",
      nom: "Management et Gestion des Risques — RH de la PME",
      coefficient: 8,
      typeEvaluation: "ccf",
      statutEvaluation: "en_cours",
      noteActuelle: null,
      noteCible: CIBLE_GENERALE_DEFAUT,
      prioriteManuelle: "maintenir", // indiqué explicitement dans le cahier des charges
      dateEcheance: null
    },
    {
      id: "e6",
      code: "E6",
      nom: "Soutenir la Performance et le Développement de la PME",
      coefficient: 6,
      typeEvaluation: "oral",
      statutEvaluation: "en_cours",
      noteActuelle: 8.59,
      noteCible: CIBLE_GENERALE_DEFAUT,
      prioriteManuelle: null,
      dateEcheance: null
    },
    {
      id: "e1",
      code: "E1",
      nom: "Culture Générale et Expression",
      coefficient: 4,
      typeEvaluation: "ponctuel",
      statutEvaluation: "a_venir",
      noteActuelle: null,
      noteCible: CIBLE_GENERALE_DEFAUT,
      prioriteManuelle: "maintenir", // indiqué explicitement dans le cahier des charges
      dateEcheance: null
    },
    {
      id: "e2",
      code: "E2",
      nom: "Anglais — Communication en langue vivante étrangère",
      coefficient: 3,
      typeEvaluation: "ponctuel",
      statutEvaluation: "a_venir",
      noteActuelle: null,
      noteCible: CIBLE_GENERALE_DEFAUT,
      prioriteManuelle: "urgent", // "E2 écrit" signalé urgent dans le cahier des charges
      dateEcheance: null
    }
  ];

  root.MonBTS = root.MonBTS || {};
  root.MonBTS.CONFIG = {
    CIBLE_GENERALE_DEFAUT: CIBLE_GENERALE_DEFAUT,
    SEUILS_ALERTE: SEUILS_ALERTE,
    MATIERES_SEED: MATIERES
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.MonBTS.CONFIG;
  }
})(typeof window !== "undefined" ? window : globalThis);
