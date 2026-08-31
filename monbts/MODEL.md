# MonBTS — Modèle de données de référence

Ce document décrit l'architecture de données cible pour l'ensemble de l'application.
La Brique 1 (Dashboard de pilotage) n'implémente que `Matiere` et `Note`.
Les autres entités sont posées ici pour que les briques suivantes s'y raccrochent sans
refonte.

Format : JSDoc `@typedef`, exécutable comme documentation, sans dépendance à un
framework ou un backend (tout est sérialisé en JSON dans `localStorage`).

## Vue d'ensemble

```
Matiere 1---N Note (CCF, devoir, bac blanc, oral...)
Matiere 1---N Chapitre
Chapitre 1---1 Niveau1 / Niveau2 / Niveau3
Chapitre 1---1 QuizValidation
Chapitre 1---N MotCle (checklist "Connais-tu ton cours ?")
TentativeQuiz N---1 Chapitre        (historique, alimente le Turbo-Flash)
JournalEntreeAlternance N---1 Semaine
SituationPro N---N JournalEntreeAlternance (une situation agrège plusieurs entrées de journal)
DossierProfessionnel 1---N SituationPro
DossierProfessionnel 1---N ChecklistConformite
```

## 1. Matiere (Brique 1 — implémentée)

```js
/**
 * @typedef {Object} Matiere
 * @property {string} id                 - slug unique ('cejm', 'e4', 'e5', 'e6', 'e1', 'e2')
 * @property {string} code               - libellé court affiché ('CEJM', 'E4'...)
 * @property {string} nom                - libellé complet
 * @property {number} coefficient        - coefficient officiel (somme des 6 = 33)
 * @property {'ponctuel'|'ccf'|'oral'} typeEvaluation
 * @property {'a_venir'|'en_cours'|'verrouille'} statutEvaluation
 *           - 'verrouille' = note CCF définitive, ne peut plus évoluer (angle mort n°1)
 * @property {number|null} noteActuelle  - /20, null si aucune note connue
 * @property {number} noteCible          - objectif pour cette matière (12 par défaut)
 * @property {'urgent'|'maintenir'|'ok'|null} prioriteManuelle
 *           - surcharge humaine de l'alerte calculée automatiquement
 * @property {string|null} dateEcheance  - ISO date de l'épreuve ou du dépôt de dossier
 * @property {string[]} chapitreIds
 */
```

## 2. Note (historique, Brique 1 étendue)

```js
/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} matiereId
 * @property {'ccf'|'devoir'|'bac_blanc'|'oral'} type
 * @property {string} label              - ex: "Situation professionnelle n°2"
 * @property {number} valeur             - /20
 * @property {string} date               - ISO
 * @property {boolean} verrouillee        - true si CCF déjà tombé (ne plus simuler dessus)
 */
```

## 3. Chapitre & parcours à 3 niveaux (Brique 2)

```js
/**
 * @typedef {Object} Chapitre
 * @property {string} id
 * @property {string} matiereId
 * @property {string} titre
 * @property {string[]} motsCles         - alimente le module "Connais-tu ton cours ?"
 * @property {Niveau1} niveau1
 * @property {Niveau2} niveau2
 * @property {Niveau3} niveau3
 * @property {QuizValidation} quizValidation
 * @property {'non_commence'|'a_revoir'|'acquis'} statut
 */

/** @typedef {Object} Niveau1
 * @property {string} ficheCourseSynthese   - markdown court
 * @property {ExerciceGuide[]} exercices    - 2 exercices avec correction immédiate
 */
/** @typedef {Object} ExerciceGuide
 * @property {string} enonce
 * @property {string} correction
 * @property {string} [indice]
 */

/** @typedef {Object} Niveau2
 * @property {string} casPratique
 * @property {CritereBareme[]} bareme        - grille analytique du correcteur virtuel
 */
/** @typedef {Object} CritereBareme
 * @property {string} critere                - ex: "Citation de la certification Qualiopi"
 * @property {number} pointsMax
 * @property {string[]} motsClesAttendus
 * @property {string} feedbackSiManquant      - "Oubli de la citation Qualiopi"
 * @property {string} methodePourAtteindre15
 */

/** @typedef {Object} Niveau3
 * @property {QuestionAnalyse[]} questionsPieges
 */
/** @typedef {Object} QuestionAnalyse
 * @property {string} enonce
 * @property {string} pointDeVigilance       - le piège juridique/économique attendu
 * @property {string} correction
 */

/** @typedef {Object} QuizValidation
 * @property {Question[]} questions
 * @property {number} seuilValidationPct     - ex: 70
 */
```

## 4. TentativeQuiz — historique pour le Turbo-Flash (Brique 3)

```js
/**
 * @typedef {Object} TentativeQuiz
 * @property {string} chapitreId
 * @property {string} niveau                 - '1' | '2' | '3' | 'validation'
 * @property {string} date                   - ISO
 * @property {{questionId: string, correct: boolean}[]} reponses
 */
```
Le Turbo-Flash interroge cette table : `reponses.correct === false` sur les 30 derniers
jours, groupées par chapitre. (Roadmap : remplacer le filtre "30 jours" par un vrai
algorithme de répétition espacée type Leitner — chaque erreur revient à J+1, J+3, J+7.)

## 5. Alternance & dossier professionnel (Brique 4)

```js
/**
 * @typedef {Object} JournalEntreeAlternance
 * @property {string} id
 * @property {string} semaineISO             - ex: '2026-W10'
 * @property {string} activite               - "qu'as-tu fait en entreprise ?"
 * @property {string[]} processus            - codes configurables (ex: P1..P4 définis par l'établissement)
 * @property {string} risqueManage
 * @property {string|null} situationProId    - rattachement a posteriori à une situation pro
 */

/**
 * @typedef {Object} SituationPro
 * @property {string} id
 * @property {'E5'|'E6'} epreuve
 * @property {string} titre
 * @property {string} contexteEntreprise
 * @property {string[]} competencesMobilisees
 * @property {string[]} journalEntreeIds      - preuves terrain associées
 * @property {string} dateDebut
 * @property {string} dateFin
 */

/**
 * @typedef {Object} DossierProfessionnel
 * @property {'E5'|'E6'} epreuve
 * @property {string[]} situationProIds
 * @property {ChecklistConformiteItem[]} conformite
 */
/** @typedef {Object} ChecklistConformiteItem
 * @property {string} regle                  - ex: "Minimum 2 situations par processus"
 * @property {boolean} valide
 * @property {string} [commentaire]
 */
```

## 6. Bloc de compétences (angle mort n°3 — à activer si ton référentiel l'exige)

```js
/**
 * @typedef {Object} BlocCompetence
 * @property {string} id
 * @property {string} intitule
 * @property {string[]} matiereIds           - matières qui contribuent au bloc
 * @property {'valide'|'non_valide'|'en_cours'} statut
 */
```
À vérifier avec ton centre d'examen si le diplôme exige une validation par bloc en plus
de la moyenne pondérée globale — le modèle est prêt à le porter, mais je ne fige pas de
règle de calcul tant que ce n'est pas confirmé côté référentiel.
