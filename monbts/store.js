/* MonBTS — Store & moteur de calcul (Brique 1)
   Persistance locale (localStorage) + fonctions pures de calcul, testables
   indépendamment du DOM (voir monbts/test-store.js). */

(function (root) {
  "use strict";

  var STORAGE_KEY = "monbts_matieres_v1";

  // ---------- Persistance ----------

  function chargerMatieres(seed) {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(seed)); // copie profonde du seed
  }

  function sauvegarderMatieres(matieres) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matieres));
    } catch (e) {}
  }

  function reinitialiser(seed) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return JSON.parse(JSON.stringify(seed));
  }

  // ---------- Calculs ----------

  /**
   * Moyenne générale pondérée.
   * @param {Array} matieres
   * @param {{ traiterInconnuCommeZero?: boolean }} [options]
   * @returns {{ moyenne: number|null, coefConnu: number, coefTotal: number, matieresManquantes: string[] }}
   */
  function calculerMoyenneGenerale(matieres, options) {
    options = options || {};
    var coefTotal = 0,
      coefConnu = 0,
      sommePonderee = 0,
      manquantes = [];

    matieres.forEach(function (m) {
      coefTotal += m.coefficient;
      if (m.noteActuelle === null || m.noteActuelle === undefined) {
        manquantes.push(m.code);
        if (options.traiterInconnuCommeZero) {
          coefConnu += m.coefficient;
          sommePonderee += 0;
        }
        return;
      }
      coefConnu += m.coefficient;
      sommePonderee += m.coefficient * m.noteActuelle;
    });

    var moyenne = coefConnu > 0 ? sommePonderee / coefConnu : null;
    return {
      moyenne: moyenne !== null ? Math.round(moyenne * 100) / 100 : null,
      coefConnu: coefConnu,
      coefTotal: coefTotal,
      matieresManquantes: manquantes
    };
  }

  /**
   * Impact = poids (coefficient) x retard par rapport à la cible.
   * Sert de base à la classification automatique de l'urgence.
   */
  function calculerImpact(matiere) {
    if (matiere.noteActuelle === null || matiere.noteActuelle === undefined) return null;
    var ecart = matiere.noteCible - matiere.noteActuelle;
    return matiere.coefficient * Math.max(ecart, 0);
  }

  /**
   * Alerte effective = surcharge manuelle si présente, sinon calcul automatique
   * à partir de l'impact et des seuils de config.
   */
  function calculerAlerte(matiere, seuils) {
    if (matiere.prioriteManuelle) {
      return alerteDepuisNiveau(matiere.prioriteManuelle, true);
    }
    if (matiere.noteActuelle === null || matiere.noteActuelle === undefined) {
      return { niveau: "inconnu", label: "Non renseigné", icone: "⚪", manuelle: false };
    }
    var impact = calculerImpact(matiere);
    if (matiere.noteCible - matiere.noteActuelle <= 0) {
      return { niveau: "ok", label: "Objectif atteint", icone: "🟢", manuelle: false };
    }
    if (impact >= seuils.urgent) {
      return { niveau: "urgent", label: "Urgent", icone: "🔴", manuelle: false };
    }
    if (impact >= seuils.maintenir) {
      return { niveau: "maintenir", label: "Maintenir", icone: "🟠", manuelle: false };
    }
    return { niveau: "attention", label: "À surveiller", icone: "🟡", manuelle: false };
  }

  function alerteDepuisNiveau(niveau, manuelle) {
    var table = {
      urgent: { label: "Urgent", icone: "🔴" },
      maintenir: { label: "Maintenir", icone: "🟠" },
      ok: { label: "Objectif atteint", icone: "🟢" }
    };
    var t = table[niveau] || { label: niveau, icone: "⚪" };
    return { niveau: niveau, label: t.label, icone: t.icone, manuelle: !!manuelle };
  }

  /**
   * Simulateur : note nécessaire sur `matiereId` pour atteindre `cibleGenerale`
   * en supposant que toutes les autres matières restent à leur note actuelle
   * (les matières sans note connue sont traitées comme 0 par prudence).
   * @returns {{ noteNecessaire: number, faisable: boolean }}
   */
  function calculerNoteNecessaire(matieres, cibleGenerale, matiereId) {
    var coefTotal = matieres.reduce(function (s, m) {
      return s + m.coefficient;
    }, 0);
    var cible = matieres.find(function (m) {
      return m.id === matiereId;
    });
    if (!cible) return null;

    var sommeAutres = matieres.reduce(function (s, m) {
      if (m.id === matiereId) return s;
      var note = m.noteActuelle === null || m.noteActuelle === undefined ? 0 : m.noteActuelle;
      return s + m.coefficient * note;
    }, 0);

    var noteNecessaire = (cibleGenerale * coefTotal - sommeAutres) / cible.coefficient;
    return {
      noteNecessaire: Math.round(noteNecessaire * 100) / 100,
      faisable: noteNecessaire <= 20
    };
  }

  root.MonBTS = root.MonBTS || {};
  root.MonBTS.store = {
    STORAGE_KEY: STORAGE_KEY,
    chargerMatieres: chargerMatieres,
    sauvegarderMatieres: sauvegarderMatieres,
    reinitialiser: reinitialiser,
    calculerMoyenneGenerale: calculerMoyenneGenerale,
    calculerImpact: calculerImpact,
    calculerAlerte: calculerAlerte,
    calculerNoteNecessaire: calculerNoteNecessaire
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.MonBTS.store;
  }
})(typeof window !== "undefined" ? window : globalThis);
