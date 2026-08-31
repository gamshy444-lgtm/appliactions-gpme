/* MonBTS — Moteur de chapitre (Brique 2)
   Gère les 5 onglets d'un chapitre : mots-clés, niveau 1, niveau 2 (Correcteur
   Virtuel auto-évalué), niveau 3, quiz de validation. Persistance locale +
   alimentation du journal d'erreurs pour le Turbo-Flash (Brique 5). */

(function (root) {
  "use strict";

  var PROGRESS_KEY = "monbts_chapitres_progress_v1";
  var ERREURS_KEY = "monbts_erreurs_v1";
  var MAX_ERREURS = 300;

  // ---------- Persistance ----------

  function loadAllProgress() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  function saveAllProgress(all) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
    } catch (e) {}
  }

  function defaultProgress(chapitre) {
    return {
      motsClesChecked: chapitre.motsCles.map(function () { return false; }),
      niveau1ExercicesVus: chapitre.niveau1.exercices.map(function () { return false; }),
      niveau2CritereChecked: chapitre.niveau2.bareme.map(function () { return false; }),
      niveau3: { completed: false, score: 0, total: chapitre.niveau3.questionsPieges.length },
      quizValidation: { completed: false, score: 0, total: chapitre.quizValidation.questions.length, statut: "non_commence" }
    };
  }

  function loadProgress(chapitre) {
    var all = loadAllProgress();
    var p = all[chapitre.id];
    var def = defaultProgress(chapitre);
    if (!p) return def;
    // fusion défensive si la structure du chapitre a changé depuis la dernière visite
    return {
      motsClesChecked: p.motsClesChecked && p.motsClesChecked.length === def.motsClesChecked.length ? p.motsClesChecked : def.motsClesChecked,
      niveau1ExercicesVus: p.niveau1ExercicesVus && p.niveau1ExercicesVus.length === def.niveau1ExercicesVus.length ? p.niveau1ExercicesVus : def.niveau1ExercicesVus,
      niveau2CritereChecked: p.niveau2CritereChecked && p.niveau2CritereChecked.length === def.niveau2CritereChecked.length ? p.niveau2CritereChecked : def.niveau2CritereChecked,
      niveau3: p.niveau3 || def.niveau3,
      quizValidation: p.quizValidation || def.quizValidation
    };
  }

  function saveProgress(chapitreId, progress) {
    var all = loadAllProgress();
    all[chapitreId] = progress;
    saveAllProgress(all);
  }

  function statutChapitre(progress) {
    if (!progress.quizValidation.completed) return "non_commence";
    return progress.quizValidation.statut === "acquis" ? "acquis" : "a_revoir";
  }

  // ---------- Journal d'erreurs (Turbo-Flash) ----------

  function loadErreurs() {
    try {
      var raw = localStorage.getItem(ERREURS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  function logErreur(entry) {
    var erreurs = loadErreurs();
    entry.date = new Date().toISOString();
    erreurs.unshift(entry);
    if (erreurs.length > MAX_ERREURS) erreurs.length = MAX_ERREURS;
    try {
      localStorage.setItem(ERREURS_KEY, JSON.stringify(erreurs));
    } catch (e) {}
  }

  function erreursRecentes(joursMax) {
    var seuil = Date.now() - joursMax * 24 * 60 * 60 * 1000;
    return loadErreurs().filter(function (e) {
      return new Date(e.date).getTime() >= seuil;
    });
  }

  // ---------- DOM helper ----------

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined) return;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.indexOf("on") === 0 && typeof v === "function") node[k] = v;
      else if (k === "disabled") node.disabled = true;
      else node.setAttribute(k, v);
    });
    (children || []).forEach(function (c) {
      if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  // ---------- Rendu principal ----------

  function render(container, chapitre) {
    var progress = loadProgress(chapitre);
    var view = {
      tab: "motscles",
      niveau3Index: progress.niveau3.completed ? chapitre.niveau3.questionsPieges.length : 0,
      niveau3Answered: false,
      niveau3Selected: null,
      _score_niveau3: progress.niveau3.score,
      validationIndex: progress.quizValidation.completed ? chapitre.quizValidation.questions.length : 0,
      validationAnswered: false,
      validationSelected: null,
      _score_quizValidation: progress.quizValidation.score
    };

    function persist() {
      saveProgress(chapitre.id, progress);
    }

    function draw() {
      container.innerHTML = "";
      container.appendChild(renderHeader());
      container.appendChild(renderTabs());
      container.appendChild(renderActiveTab());
    }

    function renderHeader() {
      var statut = statutChapitre(progress);
      var statutLabel = statut === "acquis" ? "✅ Acquis" : statut === "a_revoir" ? "🔁 À revoir" : "⚪ Non commencé";
      var statutClass = statut === "acquis" ? "success" : statut === "a_revoir" ? "danger" : "neutral";
      return el("div", { class: "hero" }, [
        el("div", { class: "kicker" }, [chapitre.matiereId.toUpperCase()]),
        el("h1", {}, [chapitre.titre]),
        el("span", { class: "badge " + statutClass }, [statutLabel])
      ]);
    }

    function renderTabs() {
      var tabs = [
        { id: "motscles", label: "🔑 Mots-clés" },
        { id: "niveau1", label: "🟢 Niveau 1 · Facile" },
        { id: "niveau2", label: "🟠 Niveau 2 · Dur" },
        { id: "niveau3", label: "🔴 Niveau 3 · Compliqué" },
        { id: "validation", label: "🏁 Quiz de validation" }
      ];
      var nav = el("div", { class: "mb-tabs" });
      tabs.forEach(function (t) {
        nav.appendChild(
          el("button", {
            class: "mb-tab-btn" + (view.tab === t.id ? " active" : ""),
            onclick: function () { view.tab = t.id; draw(); }
          }, [t.label])
        );
      });
      return nav;
    }

    function renderActiveTab() {
      if (view.tab === "motscles") return renderMotsCles();
      if (view.tab === "niveau1") return renderNiveau1();
      if (view.tab === "niveau2") return renderNiveau2();
      if (view.tab === "niveau3") return renderNiveau3();
      return renderValidation();
    }

    // ----- Mots-clés : "Connais-tu ton cours ?" -----
    function renderMotsCles() {
      var card = el("div", { class: "card" });
      var checkedCount = progress.motsClesChecked.filter(Boolean).length;
      card.appendChild(el("h3", { style: "margin-top:0;" }, ["🔑 Connais-tu ton cours ?"]));
      card.appendChild(el("p", { style: "color:var(--muted);font-size:13.5px;" }, [
        "Coche chaque notion que tu es capable d'expliquer sans regarder le cours. " + checkedCount + "/" + chapitre.motsCles.length + " maîtrisées."
      ]));
      var list = el("div", { class: "mb-checklist" });
      chapitre.motsCles.forEach(function (mot, i) {
        var id = "mc-" + i;
        var label = el("label", { class: "mb-check-item" }, [
          (function () {
            var input = el("input", { type: "checkbox", id: id });
            input.checked = progress.motsClesChecked[i];
            input.addEventListener("change", function () {
              progress.motsClesChecked[i] = input.checked;
              persist();
              draw();
            });
            return input;
          })(),
          el("span", {}, [mot])
        ]);
        list.appendChild(label);
      });
      card.appendChild(list);
      return card;
    }

    // ----- Niveau 1 : fiche + exercices guidés -----
    function renderNiveau1() {
      var wrap = document.createDocumentFragment();
      var fiche = el("div", { class: "card" }, [
        el("h3", { style: "margin-top:0;" }, ["📄 Fiche de cours synthétique"]),
        el("p", {}, [chapitre.niveau1.ficheCourseSynthese])
      ]);
      wrap.appendChild(fiche);

      chapitre.niveau1.exercices.forEach(function (ex, i) {
        var revealed = progress.niveau1ExercicesVus[i];
        var card = el("div", { class: "card", style: "margin-top:14px;" });
        card.appendChild(el("div", { class: "progress-line" }, ["Exercice guidé " + (i + 1) + "/" + chapitre.niveau1.exercices.length]));
        card.appendChild(el("div", { class: "question-text" }, [ex.enonce]));
        if (revealed) {
          card.appendChild(el("div", { class: "explain" }, ["✅ Correction : " + ex.correction]));
        } else {
          card.appendChild(el("button", {
            class: "btn secondary",
            onclick: function () { progress.niveau1ExercicesVus[i] = true; persist(); draw(); }
          }, ["Voir la correction"]));
        }
        wrap.appendChild(card);
      });
      return wrap;
    }

    // ----- Niveau 2 : cas pratique + Correcteur Virtuel auto-évalué -----
    function renderNiveau2() {
      var wrap = document.createDocumentFragment();
      wrap.appendChild(el("div", { class: "card" }, [
        el("h3", { style: "margin-top:0;" }, ["💼 Mini-cas pratique"]),
        el("p", {}, [chapitre.niveau2.casPratique]),
        el("textarea", { rows: "5", placeholder: "Rédige ta réponse ici (non enregistrée), puis fais-toi corriger ci-dessous.", style: "width:100%;padding:10px;border-radius:10px;border:1.5px solid var(--border);font-family:inherit;font-size:14px;" })
      ]));

      var total = chapitre.niveau2.bareme.reduce(function (s, c) { return s + c.pointsMax; }, 0);
      var obtenu = 0;
      chapitre.niveau2.bareme.forEach(function (crit, i) {
        if (progress.niveau2CritereChecked[i]) obtenu += crit.pointsMax;
      });
      var noteEstimee = Math.round((obtenu / total) * 20 * 10) / 10;

      var correcteur = el("div", { class: "card", style: "margin-top:14px;" });
      correcteur.appendChild(el("h3", { style: "margin-top:0;" }, ["🤖 Correcteur Virtuel — auto-évaluation guidée"]));
      correcteur.appendChild(el("p", { style: "color:var(--muted);font-size:13px;" }, [
        "Pas de correction automatique de texte libre ici (application 100% locale, sans IA distante) : coche ce que ta réponse contient réellement, comme le ferait un examinateur avec sa grille."
      ]));

      var grille = el("div", { class: "mb-checklist" });
      chapitre.niveau2.bareme.forEach(function (crit, i) {
        var input = el("input", { type: "checkbox" });
        input.checked = progress.niveau2CritereChecked[i];
        input.addEventListener("change", function () {
          progress.niveau2CritereChecked[i] = input.checked;
          persist();
          draw();
        });
        var label = el("label", { class: "mb-check-item" }, [
          input,
          el("span", {}, [crit.critere + " (" + crit.pointsMax + " pts)"])
        ]);
        grille.appendChild(label);
        if (!progress.niveau2CritereChecked[i]) {
          grille.appendChild(el("div", { class: "explain", style: "margin-left:28px;margin-bottom:10px;" }, [
            "❌ " + crit.feedbackSiManquant + " → Méthode pour atteindre 15+ : " + crit.methodePourAtteindre15
          ]));
        }
      });
      correcteur.appendChild(grille);

      var resultClass = noteEstimee >= 15 ? "ok" : noteEstimee >= 10 ? "" : "danger";
      correcteur.appendChild(el("div", { class: "mb-sim-result " + resultClass, style: "margin-top:12px;" }, [
        el("b", {}, ["Note estimée : " + noteEstimee + "/20 "]),
        document.createTextNode(
          noteEstimee >= 15
            ? "— Excellent, ta structure de copie est solide."
            : noteEstimee >= 10
            ? "— Correct, mais regarde les points ❌ ci-dessus pour viser 15+."
            : "— À retravailler : reprends chaque critère manquant avant de continuer."
        )
      ]));
      wrap.appendChild(correcteur);
      return wrap;
    }

    // ----- Niveau 3 : questions pièges (MCQ) -----
    function renderNiveau3() {
      return renderMcqFlow({
        niveau: "3",
        items: chapitre.niveau3.questionsPieges.map(function (q) {
          return { q: q.enonce, choices: q.choices, answer: q.answer, explain: "⚠️ " + q.pointDeVigilance + " — " + q.correction };
        }),
        indexKey: "niveau3Index",
        answeredKey: "niveau3Answered",
        selectedKey: "niveau3Selected",
        progressField: "niveau3",
        onFinish: function (score, total) {
          progress.niveau3 = { completed: true, score: score, total: total };
          persist();
        }
      });
    }

    // ----- Quiz de validation -----
    function renderValidation() {
      return renderMcqFlow({
        niveau: "validation",
        items: chapitre.quizValidation.questions.map(function (q) {
          return { q: q.q, choices: q.choices, answer: q.answer, explain: q.explain };
        }),
        indexKey: "validationIndex",
        answeredKey: "validationAnswered",
        selectedKey: "validationSelected",
        progressField: "quizValidation",
        seuilPct: chapitre.quizValidation.seuilValidationPct,
        onFinish: function (score, total, seuilPct) {
          var pct = (score / total) * 100;
          progress.quizValidation = { completed: true, score: score, total: total, statut: pct >= seuilPct ? "acquis" : "a_revoir" };
          persist();
        }
      });
    }

    // ----- Moteur MCQ générique (niveau 3 + validation) -----
    function renderMcqFlow(cfg) {
      var wrap = el("div", { class: "card quiz-area" });
      var idx = view[cfg.indexKey];
      var items = cfg.items;
      var progField = progress[cfg.progressField];

      if (idx >= items.length) {
        var total = items.length;
        var score = view["_score_" + cfg.progressField] || progField.score || 0;
        var pct = Math.round((score / total) * 100);
        var passed = cfg.seuilPct ? pct >= cfg.seuilPct : true;
        wrap.appendChild(el("div", { class: "result-box" }, [
          el("div", { class: "score" }, [score + "/" + total]),
          el("div", { class: "msg" }, [
            cfg.seuilPct
              ? (passed ? "🎉 Chapitre validé : " + pct + "% ≥ seuil de " + cfg.seuilPct + "%. Statut : Acquis." : "🔁 " + pct + "% < seuil de " + cfg.seuilPct + "%. Statut : À revoir — retente ce quiz après avoir revu la fiche.")
              : "Terminé. Consulte l'onglet suivant."
          ])
        ]));
        wrap.appendChild(el("button", {
          class: "btn secondary",
          onclick: function () { view[cfg.indexKey] = 0; view[cfg.answeredKey] = false; view["_score_" + cfg.progressField] = 0; draw(); }
        }, ["Refaire"]));
        return wrap;
      }

      var q = items[idx];
      wrap.appendChild(el("div", { class: "progress-line" }, ["Question " + (idx + 1) + "/" + items.length]));
      wrap.appendChild(el("div", { class: "question-text" }, [q.q]));
      var choicesWrap = el("div", { class: "choices" });
      q.choices.forEach(function (choice, ci) {
        var btn = el("button", {
          class: "choice-btn",
          onclick: function () {
            if (view[cfg.answeredKey]) return;
            view[cfg.answeredKey] = true;
            view[cfg.selectedKey] = ci;
            var scoreKey = "_score_" + cfg.progressField;
            if (view[scoreKey] === undefined) view[scoreKey] = 0;
            if (ci === q.answer) {
              view[scoreKey]++;
            } else {
              logErreur({ chapitreId: chapitre.id, matiereId: chapitre.matiereId, niveau: cfg.niveau, enonce: q.q, correction: q.explain });
            }
            draw();
          }
        }, [choice]);
        choicesWrap.appendChild(btn);
      });
      wrap.appendChild(choicesWrap);

      if (view[cfg.answeredKey]) {
        wrap.appendChild(el("div", { class: "explain" }, [q.explain]));
        var isLast = idx === items.length - 1;
        wrap.appendChild(el("button", {
          class: "btn",
          onclick: function () {
            if (isLast) {
              var finalScore = view["_score_" + cfg.progressField] || 0;
              cfg.onFinish(finalScore, items.length, cfg.seuilPct);
              view[cfg.indexKey] = items.length;
            } else {
              view[cfg.indexKey]++;
            }
            view[cfg.answeredKey] = false;
            view[cfg.selectedKey] = null;
            draw();
          }
        }, [isLast ? "Terminer" : "Question suivante"]));
        setTimeout(function () {
          var btns = wrap.querySelectorAll(".choice-btn");
          btns.forEach(function (b, ci) {
            b.disabled = true;
            if (ci === q.answer) b.classList.add("correct");
            else if (ci === view[cfg.selectedKey]) b.classList.add("incorrect");
          });
        }, 0);
      }
      return wrap;
    }

    draw();
  }

  root.MonBTS = root.MonBTS || {};
  root.MonBTS.chapitreEngine = {
    PROGRESS_KEY: PROGRESS_KEY,
    ERREURS_KEY: ERREURS_KEY,
    loadAllProgress: loadAllProgress,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    statutChapitre: statutChapitre,
    loadErreurs: loadErreurs,
    logErreur: logErreur,
    erreursRecentes: erreursRecentes,
    render: render
  };
})(typeof window !== "undefined" ? window : globalThis);
