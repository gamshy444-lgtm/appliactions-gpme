/* Moteur commun de révision BTS GPME — 3 paliers verrouillés + bilan /20 */
(function (window) {
  "use strict";

  var PALIER_NAMES = ["Facile", "Dur", "Compliqué"];
  var PALIER_ICONS = ["🟢", "🟠", "🔴"];
  var UNLOCK_THRESHOLD = 0.5; // 50% pour débloquer le palier suivant

  function storageKey(id) {
    return "gpme_" + id;
  }

  function loadState(id, numPaliers) {
    var raw = null;
    try {
      raw = localStorage.getItem(storageKey(id));
    } catch (e) {}
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.unlocked) && parsed.unlocked.length === numPaliers) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      unlocked: [true].concat(Array(numPaliers - 1).fill(false)),
      completed: Array(numPaliers).fill(false),
      scores: Array(numPaliers).fill(null),
      totals: Array(numPaliers).fill(null)
    };
  }

  function saveState(id, state) {
    try {
      localStorage.setItem(storageKey(id), JSON.stringify(state));
    } catch (e) {}
  }

  function resetState(id) {
    try {
      localStorage.removeItem(storageKey(id));
    } catch (e) {}
  }

  function computeBilan(state, paliers) {
    var allDone = state.completed.every(function (c) { return c; });
    if (!allDone) return null;
    var totalQ = 0, totalCorrect = 0;
    for (var i = 0; i < paliers.length; i++) {
      totalQ += paliers[i].questions.length;
      totalCorrect += state.scores[i] || 0;
    }
    if (totalQ === 0) return null;
    return Math.round((totalCorrect / totalQ) * 20 * 10) / 10;
  }

  function statusFromBilan(bilan) {
    if (bilan === null || bilan === undefined) return "en-cours";
    if (bilan < 12) return "a-revoir";
    if (bilan < 14) return "en-cours";
    return "valide";
  }

  function statusLabel(status) {
    if (status === "a-revoir") return "À revoir";
    if (status === "valide") return "Validé";
    return "En cours";
  }

  function statusBadgeClass(status) {
    if (status === "a-revoir") return "danger";
    if (status === "valide") return "success";
    return "warning";
  }

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

  function initQuiz(config) {
    var id = config.id;
    var paliers = config.paliers;
    var numPaliers = paliers.length;
    var root = document.getElementById("app");
    var state = loadState(id, numPaliers);

    var view = { activePalier: null, qIndex: 0, sessionScore: 0, answered: false };

    function persist() { saveState(id, state); }

    function render() {
      root.innerHTML = "";
      root.appendChild(renderHero());
      root.appendChild(renderPaliersGrid());

      if (view.activePalier !== null) {
        root.appendChild(renderQuizArea());
      }

      root.appendChild(renderBilan());
    }

    function renderHero() {
      var bilan = computeBilan(state, paliers);
      var status = statusFromBilan(bilan);
      var hero = el("div", { class: "hero" }, [
        el("div", { class: "kicker" }, [config.code || ""]),
        el("h1", {}, [config.title]),
        el("p", {}, [config.subtitle || ""]),
        el("span", { class: "coeff" }, ["Coefficient " + config.coeff])
      ]);
      return hero;
    }

    function paliersDoneCount() {
      return state.completed.filter(function (c) { return c; }).length;
    }

    function renderPaliersGrid() {
      var grid = el("div", { class: "paliers-grid" });
      for (var i = 0; i < numPaliers; i++) {
        (function (i) {
          var locked = !state.unlocked[i];
          var done = state.completed[i];
          var icon = locked ? "🔒" : done ? "✅" : "🔓";
          var sub = locked
            ? "Verrouillé"
            : done
            ? "Score : " + state.scores[i] + "/" + state.totals[i]
            : "Cliquer pour commencer";
          var btn = el(
            "button",
            {
              class: "palier-card level-" + i + (view.activePalier === i ? " active" : ""),
              disabled: locked ? "disabled" : null,
              onclick: function () {
                if (locked) return;
                startPalier(i);
              }
            },
            [
              el("div", { class: "p-icon" }, [icon + " " + PALIER_ICONS[i]]),
              el("div", { class: "p-name" }, [PALIER_NAMES[i]]),
              el("div", { class: "p-sub" }, [sub])
            ]
          );
          grid.appendChild(btn);
        })(i);
      }
      return grid;
    }

    function startPalier(i) {
      view.activePalier = i;
      view.qIndex = 0;
      view.sessionScore = 0;
      view.answered = false;
      view.showResult = false;
      render();
      var quizArea = document.querySelector(".quiz-area");
      if (quizArea) quizArea.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderQuizArea() {
      var wrap = el("div", { class: "card quiz-area" });
      var palier = paliers[view.activePalier];
      var questions = palier.questions;

      if (view.showResult) {
        var total = questions.length;
        var pct = view.sessionScore / total;
        var unlockedNext = pct >= UNLOCK_THRESHOLD && view.activePalier < numPaliers - 1;
        var box = el("div", { class: "result-box" }, [
          el("div", { class: "progress-line" }, [PALIER_NAMES[view.activePalier] + " — Résultat"]),
          el("div", { class: "score" }, [view.sessionScore + "/" + total]),
          el(
            "div",
            { class: "msg" },
            [
              pct >= UNLOCK_THRESHOLD
                ? view.activePalier < numPaliers - 1
                  ? "🎉 Bravo, palier suivant débloqué !"
                  : "🎉 Bravo, tu as terminé le dernier palier !"
                : "Il te faut au moins 50% de bonnes réponses pour débloquer le palier suivant. Retente ta chance !"
            ]
          )
        ]);
        var actions = el("div", {}, []);
        actions.appendChild(
          el("button", { class: "btn secondary", onclick: function () { view.activePalier = null; render(); } }, ["Retour aux paliers"])
        );
        actions.appendChild(document.createTextNode(" "));
        actions.appendChild(
          el("button", { class: "btn", onclick: function () { startPalier(view.activePalier); } }, ["Recommencer ce palier"])
        );
        box.appendChild(actions);
        wrap.appendChild(box);
        return wrap;
      }

      var q = questions[view.qIndex];
      wrap.appendChild(el("div", { class: "progress-line" }, [
        PALIER_NAMES[view.activePalier] + " — Question " + (view.qIndex + 1) + "/" + questions.length
      ]));
      var pbar = el("div", { class: "progress-bar" }, [
        el("span", { style: "width:" + Math.round(((view.qIndex) / questions.length) * 100) + "%" })
      ]);
      wrap.appendChild(pbar);
      wrap.appendChild(el("div", { class: "question-text" }, [q.q]));

      var choicesWrap = el("div", { class: "choices" });
      q.choices.forEach(function (choice, idx) {
        var btn = el(
          "button",
          {
            class: "choice-btn",
            onclick: function () { selectAnswer(idx); }
          },
          [choice]
        );
        choicesWrap.appendChild(btn);
      });
      wrap.appendChild(choicesWrap);

      if (view.answered) {
        wrap.appendChild(el("div", { class: "explain" }, [q.explain || ""]));
        var isLast = view.qIndex === questions.length - 1;
        wrap.appendChild(
          el("button", { class: "btn", onclick: function () { nextQuestion(questions.length); } }, [
            isLast ? "Terminer le palier" : "Question suivante"
          ])
        );
      }

      // If answered, disable + highlight choices after render
      setTimeout(function () {
        if (!view.answered) return;
        var btns = wrap.querySelectorAll(".choice-btn");
        btns.forEach(function (b, idx) {
          b.disabled = true;
          if (idx === q.answer) b.classList.add("correct");
          else if (idx === view.selectedIdx) b.classList.add("incorrect");
        });
      }, 0);

      return wrap;
    }

    function selectAnswer(idx) {
      if (view.answered) return;
      var palier = paliers[view.activePalier];
      var q = palier.questions[view.qIndex];
      view.answered = true;
      view.selectedIdx = idx;
      if (idx === q.answer) view.sessionScore++;
      render();
    }

    function nextQuestion(total) {
      if (view.qIndex < total - 1) {
        view.qIndex++;
        view.answered = false;
        view.selectedIdx = null;
        render();
      } else {
        var i = view.activePalier;
        state.completed[i] = true;
        state.scores[i] = view.sessionScore;
        state.totals[i] = total;
        var pct = view.sessionScore / total;
        if (pct >= UNLOCK_THRESHOLD && i < numPaliers - 1) {
          state.unlocked[i + 1] = true;
        }
        persist();
        view.showResult = true;
        render();
      }
    }

    function renderBilan() {
      var bilan = computeBilan(state, paliers);
      var doneCount = paliersDoneCount();
      var card = el("div", { class: "card bilan-card" });
      card.appendChild(el("div", { class: "bilan-label" }, ["Bilan " + config.code]));

      if (bilan === null) {
        card.appendChild(el("div", { class: "bilan-score" }, ["—/20"]));
        card.appendChild(
          el("div", { class: "bilan-progress" }, [
            doneCount + "/" + numPaliers + " palier(s) terminé(s). Termine les 3 paliers pour obtenir ton bilan."
          ])
        );
      } else {
        var status = statusFromBilan(bilan);
        card.appendChild(el("div", { class: "bilan-score" }, [bilan + "/20"]));
        card.appendChild(el("span", { class: "badge " + statusBadgeClass(status) }, [
          (status === "a-revoir" ? "🔒 " : status === "valide" ? "✅ " : "🟡 ") + statusLabel(status)
        ]));
      }
      return card;
    }

    render();

    // Bouton de réinitialisation optionnel
    var resetBtn = document.getElementById("reset-progress");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (confirm("Réinitialiser ta progression sur cette matière ?")) {
          resetState(id);
          state = loadState(id, numPaliers);
          view.activePalier = null;
          render();
        }
      });
    }
  }

  window.GPME = {
    loadState: loadState,
    saveState: saveState,
    resetState: resetState,
    computeBilan: computeBilan,
    statusFromBilan: statusFromBilan,
    statusLabel: statusLabel,
    statusBadgeClass: statusBadgeClass,
    initQuiz: initQuiz
  };
})(window);
