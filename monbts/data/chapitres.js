/* MonBTS — Banque de chapitres (Brique 2)
   Un chapitre pilote par matière, structure conforme à MODEL.md :
   motsCles -> niveau1 (fiche + exercices guidés) -> niveau2 (cas pratique + barème
   du Correcteur Virtuel) -> niveau3 (questions pièges) -> quizValidation. */

(function (root) {
  "use strict";

  var CHAPITRES = [
    {
      id: "cejm-structures-juridiques",
      matiereId: "cejm",
      titre: "Les structures juridiques de l'entreprise",
      motsCles: [
        "Personnalité morale", "EURL", "SASU", "Responsabilité limitée",
        "Capital social", "Statuts", "Associé unique", "Immatriculation RCS"
      ],
      niveau1: {
        ficheCourseSynthese: "Le choix d'une structure juridique détermine la responsabilité du dirigeant, le régime fiscal et social, et les règles de fonctionnement de l'entreprise. Pour un entrepreneur seul, les deux formes principales sont l'EURL (SARL à associé unique, gérant travailleur non salarié) et la SASU (président assimilé salarié, statuts très souples). Dans ces structures à responsabilité limitée, les associés ne répondent des dettes qu'à hauteur de leurs apports au capital social. La société est créée par la rédaction des statuts puis l'immatriculation au Registre du Commerce et des Sociétés (RCS), qui lui donne la personnalité morale : elle devient titulaire de droits et d'obligations propres, distincts de ceux de ses associés.",
        exercices: [
          {
            enonce: "Cite deux conséquences pratiques de la personnalité morale d'une société.",
            correction: "La société peut posséder un patrimoine propre, distinct de celui des associés, et elle peut agir en justice en son nom propre (contracter, être elle-même responsable de ses actes)."
          },
          {
            enonce: "Un entrepreneur seul veut protéger son patrimoine personnel tout en gardant des statuts très souples pour faire entrer des investisseurs plus tard. Quelle structure lui conseiller, et pourquoi ?",
            correction: "La SASU : la responsabilité y est limitée aux apports comme en EURL, mais les statuts de la SAS/SASU sont beaucoup plus libres et permettent d'organiser facilement l'entrée de nouveaux associés (pactes d'actionnaires, actions de préférence)."
          }
        ]
      },
      niveau2: {
        casPratique: "Léa crée seule « Néo Solutions », une société de conseil. Elle vous demande de rédiger un court paragraphe expliquant à sa banque pourquoi sa responsabilité personnelle est protégée si elle choisit l'EURL, en citant les bons termes juridiques.",
        bareme: [
          {
            critere: "Mentionne la responsabilité limitée aux apports",
            pointsMax: 6,
            motsClesAttendus: ["responsabilité limitée", "apports"],
            feedbackSiManquant: "Tu n'as pas explicitement dit que la responsabilité est limitée au montant des apports : c'est le cœur de la réponse attendue.",
            methodePourAtteindre15: "Commence toujours par la règle générale : « Dans une EURL, l'associé unique n'est responsable des dettes sociales qu'à hauteur de ses apports au capital social. »"
          },
          {
            critere: "Cite la notion de personnalité morale",
            pointsMax: 5,
            motsClesAttendus: ["personnalité morale", "patrimoine propre"],
            feedbackSiManquant: "Oubli de la personnalité morale : c'est elle qui justifie juridiquement la séparation des patrimoines.",
            methodePourAtteindre15: "Relie toujours « responsabilité limitée » à sa cause juridique : la société a un patrimoine propre grâce à la personnalité morale."
          },
          {
            critere: "Emploie un vocabulaire juridique précis (EURL, associé unique, capital social)",
            pointsMax: 5,
            motsClesAttendus: ["EURL", "associé unique", "capital social"],
            feedbackSiManquant: "Vocabulaire trop généraliste : le correcteur attend les termes techniques exacts, pas des paraphrases.",
            methodePourAtteindre15: "Note les 3-4 mots-clés du chapitre avant de rédiger, et coche-les mentalement au fur et à mesure que tu les utilises."
          },
          {
            critere: "Formule une phrase de conclusion claire et rassurante pour la banque",
            pointsMax: 4,
            motsClesAttendus: [],
            feedbackSiManquant: "Une bonne copie professionnelle se termine par une phrase de synthèse, pas par une accumulation de définitions.",
            methodePourAtteindre15: "Termine par : « Ainsi, le patrimoine personnel de Léa est protégé, sauf faute de gestion grave. »"
          }
        ]
      },
      niveau3: {
        questionsPieges: [
          {
            enonce: "Dans une EURL, l'associé unique peut-il perdre plus que ses apports en cas de faillite ?",
            choices: [
              "Non, sauf en cas de faute de gestion grave ou de confusion des patrimoines",
              "Oui, systématiquement",
              "Non, jamais, même en cas de fraude",
              "Oui, mais seulement si le capital social dépasse 10 000 €"
            ],
            answer: 0,
            pointDeVigilance: "Piège classique : la responsabilité limitée n'est pas absolue, elle tombe en cas de faute de gestion ou de confusion des patrimoines.",
            correction: "La responsabilité limitée protège le patrimoine personnel dans la gestion normale, mais un juge peut la lever en cas de faute de gestion caractérisée ou de confusion des patrimoines."
          },
          {
            enonce: "Une SASU peut-elle avoir un capital social de 1 € ?",
            choices: [
              "Oui, aucun capital minimum n'est légalement exigé",
              "Non, il faut au moins 1 000 €",
              "Non, il faut au moins 37 000 €",
              "Non, il faut au moins 7 500 €"
            ],
            answer: 0,
            pointDeVigilance: "Beaucoup confondent avec l'ancienne SA (37 000 €). Depuis 2003, SARL/EURL/SAS/SASU n'ont plus de capital minimum légal.",
            correction: "Le capital social minimum a été supprimé pour la SARL, l'EURL, la SAS et la SASU ; seule la SA impose un capital minimum de 37 000 €."
          },
          {
            enonce: "La personnalité morale d'une société naît...",
            choices: [
              "à son immatriculation au RCS",
              "à la signature des statuts",
              "au premier jour d'activité commerciale",
              "à l'ouverture du compte bancaire professionnel"
            ],
            answer: 0,
            pointDeVigilance: "Piège fréquent : les statuts signés ne suffisent pas, c'est l'immatriculation qui déclenche juridiquement la personnalité morale.",
            correction: "La société n'existe juridiquement qu'à compter de son immatriculation au Registre du Commerce et des Sociétés."
          }
        ]
      },
      quizValidation: {
        seuilValidationPct: 70,
        questions: [
          {
            q: "Qu'est-ce que le capital social ?",
            choices: ["L'ensemble des apports des associés formant le patrimoine initial de la société", "Le chiffre d'affaires annuel", "Le bénéfice net de l'exercice", "Le salaire du dirigeant"],
            answer: 0,
            explain: "Le capital social correspond aux apports effectués par les associés lors de la création ou d'une augmentation de capital."
          },
          {
            q: "Dans une SASU, quel est le statut social du président ?",
            choices: ["Assimilé salarié", "Travailleur non salarié (TNS)", "Fonctionnaire", "Auto-entrepreneur"],
            answer: 0,
            explain: "Le président de SASU relève du régime général (assimilé salarié), contrairement au gérant associé unique d'EURL qui est TNS."
          },
          {
            q: "Que désignent les statuts d'une société ?",
            choices: ["Le contrat qui organise son fonctionnement", "Le bilan comptable annuel", "La déclaration de TVA", "Le contrat de travail des salariés"],
            answer: 0,
            explain: "Les statuts constituent l'acte fondateur qui régit le fonctionnement interne de la société."
          },
          {
            q: "Quelle structure impose un capital minimum de 37 000 € ?",
            choices: ["La SA", "La SASU", "L'EURL", "La SARL"],
            answer: 0,
            explain: "Seule la SA conserve un capital social minimum légal de 37 000 €."
          },
          {
            q: "Qu'est-ce que l'immatriculation au RCS ?",
            choices: ["La formalité qui donne naissance à la personnalité morale", "Une déclaration fiscale annuelle", "Une autorisation réservée aux professions réglementées", "Le dépôt des comptes annuels"],
            answer: 0,
            explain: "L'immatriculation au Registre du Commerce et des Sociétés confère la personnalité morale à la société."
          },
          {
            q: "La confusion des patrimoines concerne surtout...",
            choices: ["Le dirigeant qui mélange ses comptes personnels et ceux de la société", "Le client qui ne paie pas sa facture", "Le fournisseur qui retarde une livraison", "Le salarié en période d'essai"],
            answer: 0,
            explain: "Quand le dirigeant mélange ses finances personnelles avec celles de l'entreprise, un juge peut lever la protection de responsabilité limitée."
          }
        ]
      }
    },

    {
      id: "e1-synthese",
      matiereId: "e1",
      titre: "La synthèse de documents : méthode et pièges",
      motsCles: [
        "Objectivité", "Problématique", "Hiérarchisation des idées", "Confrontation des sources",
        "Plan thématique", "Reformulation", "Connecteurs logiques", "Neutralité"
      ],
      niveau1: {
        ficheCourseSynthese: "La synthèse consiste à confronter plusieurs documents pour en restituer les idées principales de façon neutre, organisée et hiérarchisée, sans jamais donner son avis personnel. Méthode : 1) repérer le thème commun et les convergences/divergences entre documents, 2) formuler une problématique qui relie tous les documents, 3) construire un plan thématique (2 ou 3 axes), 4) rédiger en reformulant avec ses propres mots, en citant la source, et en utilisant des connecteurs logiques pour articuler les idées.",
        exercices: [
          {
            enonce: "Pourquoi est-il interdit de traiter les documents dans l'ordre où on les a lus (document 1 puis document 2...) plutôt que par thème ?",
            correction: "Parce que la synthèse doit être organisée par idées communes (plan thématique) : suivre l'ordre des documents produit un simple résumé juxtaposé, sans réelle mise en relation, ce qui est sanctionné."
          },
          {
            enonce: "Un document affirme une opinion tranchée. Peux-tu la reprendre telle quelle dans ta synthèse sans précaution ?",
            correction: "Non : il faut la reformuler avec des marques de distance (« l'auteur affirme que... », « selon X... ») pour montrer que c'est une idée du document, et non ton propre avis."
          }
        ]
      },
      niveau2: {
        casPratique: "On te donne trois documents sur le télétravail (un article de presse favorable, une étude économique nuançant les gains de productivité, un témoignage de DRH critique). Rédige l'introduction de ta synthèse (accroche, présentation du corpus, problématique, annonce du plan), en 5 à 8 lignes.",
        bareme: [
          {
            critere: "Présente le corpus sans le juger (nature des documents, thème commun)",
            pointsMax: 6,
            motsClesAttendus: ["corpus", "documents"],
            feedbackSiManquant: "L'introduction ne dit pas clairement de quoi parlent les documents ni leur nature.",
            methodePourAtteindre15: "Une phrase suffit : « Ce corpus de trois documents (un article de presse, une étude économique, un témoignage) traite du télétravail. »"
          },
          {
            critere: "Formule une problématique qui engage une véritable question",
            pointsMax: 6,
            motsClesAttendus: ["problématique", "dans quelle mesure"],
            feedbackSiManquant: "Pas de vraie question posée : une problématique en « Nous verrons que... » n'en est pas une.",
            methodePourAtteindre15: "Utilise un tour interrogatif direct : « Dans quelle mesure le télétravail améliore-t-il réellement la performance de l'entreprise ? »"
          },
          {
            critere: "Annonce un plan en 2 ou 3 axes cohérents avec les documents",
            pointsMax: 5,
            motsClesAttendus: ["dans un premier temps", "puis", "enfin"],
            feedbackSiManquant: "Le plan annoncé ne reflète pas les tensions réelles entre les documents.",
            methodePourAtteindre15: "Fais correspondre chaque axe à une tension identifiée dans les documents (ex : axe 1 = bénéfices, axe 2 = limites)."
          },
          {
            critere: "Ton neutre, aucune opinion personnelle exprimée",
            pointsMax: 3,
            motsClesAttendus: [],
            feedbackSiManquant: "Une trace de jugement personnel fait perdre des points même si le reste est bon.",
            methodePourAtteindre15: "Relis-toi en traquant les « je », « à mon avis », « il est évident que »."
          }
        ]
      },
      niveau3: {
        questionsPieges: [
          {
            enonce: "Un document contredit les deux autres sur un point précis. Que doit faire le rédacteur ?",
            choices: [
              "Signaler explicitement ce désaccord entre les sources, sans trancher",
              "Ignorer le document qui contredit les autres",
              "Trancher lui-même en faveur de la majorité",
              "Supprimer ce point de la synthèse"
            ],
            answer: 0,
            pointDeVigilance: "Le piège : croire qu'il faut « lisser » les documents en une opinion unique, alors que la mise en tension fait partie de l'exercice.",
            correction: "La synthèse doit mettre en lumière convergences ET divergences entre documents, sans que le rédacteur ne prenne parti."
          },
          {
            enonce: "Reformuler un document, c'est...",
            choices: [
              "Exprimer son idée avec d'autres mots, en conservant le sens exact",
              "Recopier le document en changeant juste quelques mots",
              "Résumer en donnant son avis dessus",
              "Traduire le document dans un registre plus soutenu"
            ],
            answer: 0,
            pointDeVigilance: "Piège : une reformulation trop proche du texte original (quasi-recopiage) est sanctionnée.",
            correction: "Reformuler exige de s'approprier l'idée pour la restituer avec un vocabulaire différent, sans en trahir le sens."
          },
          {
            enonce: "La longueur imposée pour la synthèse doit être...",
            choices: [
              "Respectée avec une tolérance limitée, un écart trop important est sanctionné",
              "Ignorée si le sujet est riche",
              "Doublée pour montrer sa maîtrise du sujet",
              "Réduite de moitié pour aller à l'essentiel"
            ],
            answer: 0,
            pointDeVigilance: "Piège classique : penser que « plus c'est long, mieux c'est ». La contrainte de longueur fait partie de l'exercice.",
            correction: "Le non-respect du nombre de mots imposé (au-delà de la tolérance indiquée) est explicitement sanctionné dans le barème officiel."
          }
        ]
      },
      quizValidation: {
        seuilValidationPct: 70,
        questions: [
          { q: "Quel est le principal interdit dans une synthèse de documents ?", choices: ["Exprimer son opinion personnelle", "Utiliser des connecteurs logiques", "Reformuler les idées des documents", "Organiser sa réponse en plan"], answer: 0, explain: "La synthèse impose une stricte neutralité." },
          { q: "Le plan d'une synthèse doit être organisé...", choices: ["Par thèmes communs aux documents", "Document par document", "Par ordre alphabétique des auteurs", "Par ordre de longueur des documents"], answer: 0, explain: "Un plan thématique croise les documents entre eux." },
          { q: "Que doit contenir l'introduction d'une synthèse ?", choices: ["Présentation du corpus, problématique, annonce du plan", "Uniquement le titre du sujet", "La conclusion personnelle du candidat", "La liste des auteurs par ordre de citation"], answer: 0, explain: "L'introduction pose le cadre, la question et la structure." },
          { q: "Reformuler un document sert à...", choices: ["Montrer qu'on s'est approprié l'idée sans recopier le texte", "Gagner du temps en copiant plus vite", "Éviter de citer la source", "Allonger artificiellement la synthèse"], answer: 0, explain: "La reformulation prouve la compréhension réelle du document." },
          { q: "Que faire si deux documents se contredisent ?", choices: ["Signaler la contradiction sans trancher", "Ne garder que le document le plus récent", "Fusionner les deux points de vue en un seul", "Ne pas en parler dans la synthèse"], answer: 0, explain: "Le rédacteur met en évidence les tensions, il ne les résout pas." },
          { q: "Le non-respect de la longueur imposée est...", choices: ["Sanctionné dans la notation", "Sans aucune conséquence", "Toléré au-delà de 50%", "Positif si la synthèse est plus longue"], answer: 0, explain: "La maîtrise du nombre de mots imposé fait partie des compétences évaluées." }
        ]
      }
    },

    {
      id: "e2-negotiating",
      matiereId: "e2",
      titre: "Negotiating a business deal",
      motsCles: [
        "Negotiation", "Terms and conditions", "Trade-off", "Deadline",
        "Counter-offer", "Draft contract", "Bottom line", "Win-win agreement"
      ],
      niveau1: {
        ficheCourseSynthese: "En anglais des affaires, négocier un accord commercial suppose de maîtriser un vocabulaire précis : les « terms and conditions » (conditions générales), le « trade-off » (compromis), la « counter-offer » (contre-proposition), le « bottom line » (le minimum acceptable) et le « win-win agreement » (accord gagnant-gagnant). Phrases types : proposer (« We would like to offer... »), objecter poliment (« I'm afraid that won't be possible, however... »), conclure (« Let's shake hands on this deal. »).",
        exercices: [
          { enonce: "Translate: « Nous ne pouvons pas accepter ce délai, mais nous proposons un compromis. »", correction: "« We cannot accept this deadline, but we propose a trade-off. »" },
          { enonce: "Complete politely: « Your price is too high. ___ » (fais une contre-proposition polie)", correction: "« Your price is too high. Would you consider a 10% discount if we commit to a larger order? » — une contre-offre polie propose une alternative concrète plutôt que de simplement refuser." }
        ]
      },
      niveau2: {
        casPratique: "You are negotiating a supply contract with a British supplier. Their initial offer is £50,000 for a 12-month contract, but your budget is £42,000. Write 4-5 sentences replying to their offer, using at least one negotiation phrase from the fiche de cours.",
        bareme: [
          { critere: "Uses at least one negotiation phrase from the lesson (trade-off, counter-offer, bottom line...)", pointsMax: 6, motsClesAttendus: ["trade-off", "counter-offer", "bottom line"], feedbackSiManquant: "Aucune expression de négociation vue en cours n'est utilisée.", methodePourAtteindre15: "Réutilise littéralement une expression du cours, ex : « We would like to propose a trade-off. »" },
          { critere: "Grammatically correct conditional or polite request form", pointsMax: 5, motsClesAttendus: ["would", "could", "if we"], feedbackSiManquant: "Le ton est trop direct (« I want », « you must »).", methodePourAtteindre15: "Utilise systématiquement « would you consider... », « we would be able to... »." },
          { critere: "Gives a concrete counter-figure (not just 'it's too expensive')", pointsMax: 5, motsClesAttendus: ["£", "budget", "discount"], feedbackSiManquant: "Une négociation efficace donne un chiffre précis.", methodePourAtteindre15: "Chiffre toujours ta contre-proposition : « Our budget is £42,000, could we agree on £45,000? »" },
          { critere: "Correct business register (no slang, no overly casual tone)", pointsMax: 4, motsClesAttendus: [], feedbackSiManquant: "Le registre est trop familier pour un contexte professionnel écrit.", methodePourAtteindre15: "Relis en évitant les contractions trop familières et en gardant des formules de politesse standard." }
        ]
      },
      niveau3: {
        questionsPieges: [
          { enonce: "What does 'bottom line' mean in a negotiation?", choices: ["The minimum acceptable outcome for one party", "The first offer made", "The final signature line of a contract", "The total revenue of a company"], answer: 0, pointDeVigilance: "Piège : 'bottom line' est confondu avec 'first offer' — c'est en réalité le seuil minimal acceptable.", correction: "'Bottom line' refers to the lowest acceptable position a party is willing to accept." },
          { enonce: "Choose the most diplomatic way to reject an offer:", choices: ["\"I'm afraid that won't be possible, however we could consider...\"", "\"No, that's impossible.\"", "\"That's a terrible offer.\"", "\"We refuse.\""], answer: 0, pointDeVigilance: "Piège : un refus direct et sec est perçu comme agressif en anglais professionnel.", correction: "Business English favours softened refusals followed by a constructive alternative." },
          { enonce: "What is a 'counter-offer'?", choices: ["A new proposal made in response to a rejected offer", "The final accepted price", "A written contract", "A cancellation of the negotiation"], answer: 0, pointDeVigilance: "Piège de vocabulaire : ce n'est pas le contrat final, mais une étape intermédiaire.", correction: "A counter-offer is a new proposal made after the initial offer is rejected or unsatisfactory." }
        ]
      },
      quizValidation: {
        seuilValidationPct: 70,
        questions: [
          { q: "What does 'trade-off' mean?", choices: ["A compromise between two conflicting objectives", "A type of contract", "A final signature", "A shipping delay"], answer: 0, explain: "A trade-off is a balance between two desirable but incompatible outcomes." },
          { q: "'Terms and conditions' refers to...", choices: ["The detailed rules governing an agreement", "Only the price of a deal", "The names of the negotiators", "The location of the meeting"], answer: 0, explain: "Terms and conditions define an agreement's obligations." },
          { q: "Choose the polite negotiation opener:", choices: ["\"We would like to offer...\"", "\"Give us your best price now.\"", "\"Take it or leave it.\"", "\"You have no choice.\""], answer: 0, explain: "Business English negotiations open with softened, collaborative phrasing." },
          { q: "A 'win-win agreement' means...", choices: ["Both parties gain something from the deal", "Only one party benefits", "The negotiation fails", "The contract is cancelled"], answer: 0, explain: "A win-win agreement satisfies both sides." },
          { q: "What's an appropriate way to end a successful negotiation?", choices: ["\"Let's shake hands on this deal.\"", "\"This is over.\"", "\"Whatever.\"", "\"I don't care anymore.\""], answer: 0, explain: "This phrase formally and positively signals agreement." },
          { q: "A 'deadline' in a business context is...", choices: ["The final date by which something must be completed", "A type of penalty clause", "A synonym for budget", "A meeting agenda"], answer: 0, explain: "A deadline is the time limit for completing a task or reaching an agreement." }
        ]
      }
    },

    {
      id: "e4-facturation",
      matiereId: "e4",
      titre: "La facturation et le suivi des règlements clients",
      motsCles: [
        "Facture", "TVA collectée", "Délai de paiement", "Relance client",
        "Escompte", "Acompte", "Lettrage", "Créance client"
      ],
      niveau1: {
        ficheCourseSynthese: "La facture matérialise juridiquement une vente et déclenche l'obligation de paiement du client. Elle mentionne le montant HT, la TVA collectée et le montant TTC. Le délai légal de paiement entre professionnels est de 60 jours à compter de la date de facturation (ou 45 jours fin de mois), sauf accord contractuel différent. Le suivi des règlements passe par le lettrage des comptes clients et, en cas de retard, par une relance progressive. Un acompte est un paiement partiel anticipé ; un escompte est une réduction accordée pour paiement comptant ou anticipé.",
        exercices: [
          { enonce: "Une facture de 1 200 € HT est soumise à une TVA de 20%. Calcule le montant TTC.", correction: "TVA = 1 200 × 20% = 240 €. Montant TTC = 1 200 + 240 = 1 440 €." },
          { enonce: "Un client paie sa facture 10 jours avant l'échéance et bénéficie d'un escompte de 2%. Sur une facture de 1 440 € TTC, quel montant doit-il réellement régler ?", correction: "Escompte = 1 440 × 2% = 28,80 €. Montant à régler = 1 440 − 28,80 = 1 411,20 €." }
        ]
      },
      niveau2: {
        casPratique: "Un client, « Atelier Dubois », n'a pas réglé une facture de 2 400 € échue depuis 15 jours. Rédige le contenu (3-4 phrases) d'un premier email de relance, en respectant un ton commercial ferme mais courtois.",
        bareme: [
          { critere: "Rappelle précisément le numéro et le montant de la facture concernée", pointsMax: 5, motsClesAttendus: ["facture", "montant", "2 400"], feedbackSiManquant: "Une relance vague sans référence précise à la facture est peu professionnelle.", methodePourAtteindre15: "Cite toujours le numéro de facture, la date d'échéance et le montant exact dès la première phrase." },
          { critere: "Ton courtois mais ferme", pointsMax: 6, motsClesAttendus: ["nous vous remercions", "cependant", "nous vous invitons"], feedbackSiManquant: "Le ton est soit trop mou, soit trop agressif pour un premier email de relance.", methodePourAtteindre15: "Structure type : politesse → rappel des faits → demande claire → délai précis → clôture." },
          { critere: "Propose une action concrète et un délai", pointsMax: 5, motsClesAttendus: ["sous 8 jours", "dans les meilleurs délais"], feedbackSiManquant: "Pas de délai fixé : la relance reste sans effet contraignant.", methodePourAtteindre15: "Termine toujours par une échéance précise pour créer une obligation claire." },
          { critere: "Mentionne la possibilité d'une suite en cas de non-paiement", pointsMax: 4, motsClesAttendus: ["mise en demeure", "pénalités de retard"], feedbackSiManquant: "Aucune mention des conséquences en cas de non-régularisation.", methodePourAtteindre15: "Une phrase suffit : « À défaut de règlement sous ce délai, nous serons contraints d'engager une procédure de relance formelle. »" }
        ]
      },
      niveau3: {
        questionsPieges: [
          { enonce: "Le délai légal de paiement par défaut entre professionnels en France est de...", choices: ["60 jours à compter de la date de facturation", "30 jours à compter de la livraison", "90 jours calendaires", "15 jours ouvrés"], answer: 0, pointDeVigilance: "Piège : confusion avec le délai de livraison ou avec les 30 jours des marchés publics.", correction: "Le délai légal maximal par défaut est de 60 jours nets, ou 45 jours fin de mois si stipulé au contrat." },
          { enonce: "Un escompte pour paiement comptant réduit...", choices: ["Le montant réellement encaissé par le vendeur, en échange d'un paiement plus rapide", "La TVA due sur la facture", "Le délai de paiement légal", "Le montant du capital social"], answer: 0, pointDeVigilance: "Piège : confondre l'escompte (réduction financière) avec une remise commerciale classique.", correction: "L'escompte est une réduction à caractère financier accordée en contrepartie d'un paiement anticipé." },
          { enonce: "Le lettrage d'un compte client sert à...", choices: ["Rapprocher chaque facture émise du règlement correspondant", "Calculer la TVA collectée du mois", "Fixer le prix de vente d'un produit", "Rédiger les statuts d'une société"], answer: 0, pointDeVigilance: "Piège : le lettrage est confondu avec le simple enregistrement comptable.", correction: "Le lettrage associe chaque facture à son règlement, ce qui permet de repérer les impayés." }
        ]
      },
      quizValidation: {
        seuilValidationPct: 70,
        questions: [
          { q: "Que représente la TVA collectée sur une facture de vente ?", choices: ["La TVA facturée au client, reversée à l'État", "La TVA payée aux fournisseurs", "Une charge définitive pour l'entreprise", "Le bénéfice net réalisé"], answer: 0, explain: "La TVA collectée est perçue pour le compte de l'État." },
          { q: "Un acompte est...", choices: ["Un paiement partiel versé avant la fin de la prestation", "Une réduction pour paiement rapide", "Une pénalité de retard", "Le montant total de la facture"], answer: 0, explain: "L'acompte est versé en avance sur le prix total." },
          { q: "Quel est le délai légal maximal de paiement interentreprises par défaut ?", choices: ["60 jours à compter de la facturation", "10 jours", "6 mois", "Aucun délai n'est fixé par la loi"], answer: 0, explain: "Sauf accord contraire, ce délai est de 60 jours (ou 45 jours fin de mois)." },
          { q: "Le lettrage d'un compte client permet de...", choices: ["Identifier les factures encore impayées", "Calculer le taux de marge", "Déterminer le capital social", "Rédiger un contrat de travail"], answer: 0, explain: "Le lettrage rapproche chaque facture de son règlement." },
          { q: "Un escompte est accordé en échange de...", choices: ["Un paiement comptant ou anticipé", "Une commande groupée", "Une livraison retardée", "Un contrat à durée indéterminée"], answer: 0, explain: "L'escompte récompense la rapidité de paiement." },
          { q: "Une première relance client doit impérativement contenir...", choices: ["La référence précise de la facture et un délai de régularisation", "Une menace immédiate de poursuites judiciaires", "Une nouvelle offre commerciale", "Le bilan comptable de l'entreprise"], answer: 0, explain: "Une relance efficace rappelle les faits précis et fixe un délai clair." }
        ]
      }
    },

    {
      id: "e5-duerp",
      matiereId: "e5",
      titre: "Le document unique d'évaluation des risques (DUERP)",
      motsCles: [
        "DUERP", "Risque professionnel", "Prévention", "Cartographie des risques",
        "Unité de travail", "Plan d'action", "Obligation de sécurité", "Mise à jour annuelle"
      ],
      niveau1: {
        ficheCourseSynthese: "Le Document Unique d'Évaluation des Risques Professionnels (DUERP) est obligatoire dans toute entreprise dès le premier salarié. Il recense, pour chaque unité de travail, les risques identifiés, évalue leur fréquence et leur gravité, puis débouche sur un plan d'action de prévention. L'employeur a une obligation de sécurité de résultat envers ses salariés : ne pas tenir le DUERP à jour (au moins annuellement, ou lors de tout changement important) l'expose à une sanction pénale en cas d'accident. Le DUERP doit être accessible aux salariés, au CSE et à la médecine du travail.",
        exercices: [
          { enonce: "Cite deux situations qui doivent déclencher une mise à jour du DUERP en dehors de la révision annuelle.", correction: "L'introduction d'une nouvelle machine ou d'un nouveau procédé de travail, et la survenue d'un accident du travail révélant un risque non identifié auparavant." },
          { enonce: "Qui doit avoir accès au DUERP dans l'entreprise ?", correction: "Les salariés, les membres du CSE, le médecin du travail, et l'inspection du travail sur demande." }
        ]
      },
      niveau2: {
        casPratique: "Une PME de 12 salariés vient d'acheter une nouvelle machine de découpe pour son atelier. Le dirigeant te demande de rédiger un court paragraphe expliquant pourquoi il doit impérativement mettre à jour le DUERP avant la mise en service, et ce qu'il risque s'il ne le fait pas.",
        bareme: [
          { critere: "Explique que l'achat d'une nouvelle machine impose une mise à jour", pointsMax: 6, motsClesAttendus: ["mise à jour", "nouvelle machine", "changement"], feedbackSiManquant: "La copie ne relie pas explicitement l'achat de la machine à l'obligation de mise à jour.", methodePourAtteindre15: "Pose la règle générale d'abord : « Toute modification importante des conditions de travail impose une mise à jour du DUERP », puis applique-la." },
          { critere: "Mentionne l'obligation de sécurité de résultat de l'employeur", pointsMax: 5, motsClesAttendus: ["obligation de sécurité", "employeur"], feedbackSiManquant: "Oubli du fondement juridique précis.", methodePourAtteindre15: "Cite la notion exacte : « obligation de sécurité de résultat »." },
          { critere: "Cite un risque concret en cas de non-mise à jour", pointsMax: 5, motsClesAttendus: ["sanction", "accident du travail", "responsabilité"], feedbackSiManquant: "Aucune conséquence concrète n'est indiquée.", methodePourAtteindre15: "Donne une conséquence juridique concrète : sanction pénale possible, aggravation de la responsabilité en cas d'accident." },
          { critere: "Propose une méthode concrète (évaluer le risque avant mise en service)", pointsMax: 4, motsClesAttendus: ["évaluer", "avant la mise en service"], feedbackSiManquant: "Pas de recommandation opérationnelle.", methodePourAtteindre15: "Termine par : « Faites évaluer les risques liés à la machine avant sa mise en service et intégrez-les au DUERP. »" }
        ]
      },
      niveau3: {
        questionsPieges: [
          { enonce: "Le DUERP est-il obligatoire uniquement pour les entreprises de plus de 11 salariés ?", choices: ["Non, il est obligatoire dès le premier salarié", "Oui, en dessous de 11 salariés il est facultatif", "Non, seulement à partir de 20 salariés", "Non, seulement pour les entreprises industrielles"], answer: 0, pointDeVigilance: "Piège : confondre le seuil du DUERP (dès 1 salarié) avec celui du CSE (11 salariés).", correction: "Le DUERP est obligatoire pour toute entreprise employant au moins un salarié." },
          { enonce: "À quelle fréquence minimale le DUERP doit-il être mis à jour ?", choices: ["Au moins une fois par an, et à chaque changement important", "Une seule fois, à la création de l'entreprise", "Tous les 5 ans", "Uniquement après un accident du travail"], answer: 0, pointDeVigilance: "Piège : croire que le DUERP est un document figé rédigé une fois pour toutes.", correction: "La mise à jour est au minimum annuelle, mais doit aussi intervenir lors de tout changement significatif." },
          { enonce: "L'obligation de sécurité de l'employeur est qualifiée juridiquement d'obligation de...", choices: ["Résultat", "Moyens uniquement", "Diligence facultative", "Bonne foi commerciale"], answer: 0, pointDeVigilance: "Piège classique : penser qu'il suffit de « faire de son mieux » (obligation de moyens).", correction: "L'employeur doit garantir un résultat, pas seulement mettre en œuvre des moyens." }
        ]
      },
      quizValidation: {
        seuilValidationPct: 70,
        questions: [
          { q: "Le DUERP est obligatoire...", choices: ["Dès le premier salarié de l'entreprise", "Seulement au-delà de 50 salariés", "Seulement dans l'industrie", "Uniquement sur demande de l'inspection du travail"], answer: 0, explain: "Aucun seuil d'effectif n'exempte l'entreprise de cette obligation." },
          { q: "Le DUERP recense les risques par...", choices: ["Unité de travail", "Ordre alphabétique des salariés", "Ancienneté des salariés", "Montant du salaire"], answer: 0, explain: "L'évaluation se fait par unité de travail pour identifier les risques réels." },
          { q: "Qui doit pouvoir consulter le DUERP ?", choices: ["Les salariés, le CSE et le médecin du travail", "Uniquement le dirigeant", "Uniquement les actionnaires", "Uniquement l'expert-comptable"], answer: 0, explain: "Le DUERP doit être accessible aux représentants du personnel et aux acteurs de santé au travail." },
          { q: "À quelle fréquence minimale doit-on mettre à jour le DUERP ?", choices: ["Au moins une fois par an", "Tous les 3 ans", "Une seule fois à la création", "Tous les 10 ans"], answer: 0, explain: "La mise à jour annuelle est un minimum légal." },
          { q: "L'obligation de sécurité de l'employeur est une obligation de...", choices: ["Résultat", "Moyens simples", "Courtoisie", "Discrétion"], answer: 0, explain: "La jurisprudence qualifie cette obligation de résultat." },
          { q: "Ne pas tenir de DUERP à jour expose l'employeur à...", choices: ["Une sanction pénale, notamment en cas d'accident du travail", "Aucune conséquence", "Une simple amende civile plafonnée à 10 €", "Une obligation de fermeture immédiate"], answer: 0, explain: "L'absence ou la non-mise à jour du DUERP peut être sanctionnée pénalement." }
        ]
      }
    },

    {
      id: "e6-tableau-bord",
      matiereId: "e6",
      titre: "Le tableau de bord et le pilotage de la performance",
      motsCles: [
        "Tableau de bord", "Indicateur (KPI)", "Écart", "Plan d'action correctif",
        "Objectif SMART", "Fréquence de suivi", "Seuil d'alerte", "Reporting"
      ],
      niveau1: {
        ficheCourseSynthese: "Le tableau de bord est un outil de pilotage qui rassemble un nombre limité d'indicateurs clés (KPI) permettant de suivre l'atteinte des objectifs et de détecter rapidement les écarts. Chaque indicateur doit être relié à un objectif SMART, disposer d'un seuil d'alerte, et être suivi à une fréquence adaptée. Lorsqu'un écart significatif apparaît, il faut en identifier la cause puis définir un plan d'action correctif (actions, responsables, délais). Le tableau de bord n'a de valeur que s'il déclenche des décisions, pas seulement de l'observation.",
        exercices: [
          { enonce: "Un objectif de chiffre d'affaires mensuel est de 50 000 €, le réalisé est de 41 000 €. Calcule l'écart en valeur et en pourcentage.", correction: "Écart en valeur = 41 000 − 50 000 = −9 000 €. Écart en pourcentage = −9 000 / 50 000 × 100 = −18%." },
          { enonce: "Cite les 3 éléments indispensables d'un plan d'action correctif suite à cet écart.", correction: "Le diagnostic de la cause de l'écart, les actions concrètes à mettre en œuvre, et les responsables + délais associés." }
        ]
      },
      niveau2: {
        casPratique: "Le tableau de bord commercial d'une PME montre un taux de satisfaction client en baisse de 92% à 78% en un trimestre, sans que la cause soit identifiée. Rédige un court plan d'action correctif (4-5 phrases) à proposer à la direction.",
        bareme: [
          { critere: "Propose d'abord d'investiguer la cause avant d'agir", pointsMax: 6, motsClesAttendus: ["cause", "enquête", "identifier"], feedbackSiManquant: "Le plan propose des actions directement, sans chercher la cause : risque de traiter un symptôme.", methodePourAtteindre15: "Commence systématiquement par une étape de diagnostic avant de proposer des solutions." },
          { critere: "Propose au moins une action concrète et réaliste", pointsMax: 5, motsClesAttendus: ["action", "mettre en place"], feedbackSiManquant: "Le plan reste trop théorique.", methodePourAtteindre15: "Donne une action précise : « Mettre en place une enquête de satisfaction à chaud après chaque livraison. »" },
          { critere: "Associe un responsable et un délai à l'action", pointsMax: 5, motsClesAttendus: ["responsable", "délai", "sous"], feedbackSiManquant: "Sans responsable ni délai, une action reste théorique.", methodePourAtteindre15: "Précise toujours « qui fait quoi, pour quand »." },
          { critere: "Prévoit un nouveau point de suivi", pointsMax: 4, motsClesAttendus: ["suivi", "prochain tableau de bord"], feedbackSiManquant: "Aucun mécanisme de vérification n'est prévu.", methodePourAtteindre15: "Termine par une clause de suivi : « Un nouveau point sera fait dans le tableau de bord du mois suivant. »" }
        ]
      },
      niveau3: {
        questionsPieges: [
          { enonce: "Un tableau de bord efficace doit contenir...", choices: ["Un nombre limité d'indicateurs réellement pilotables", "Le plus grand nombre d'indicateurs possible", "Uniquement des indicateurs financiers", "Des indicateurs choisis au hasard chaque mois"], answer: 0, pointDeVigilance: "Piège : croire qu'un bon tableau de bord doit être exhaustif.", correction: "Un tableau de bord efficace se limite à quelques indicateurs clés, réellement actionnables." },
          { enonce: "Face à un écart constaté, la première étape est...", choices: ["Identifier la cause de l'écart avant d'agir", "Sanctionner immédiatement les équipes concernées", "Supprimer l'indicateur qui pose problème", "Augmenter l'objectif pour le trimestre suivant"], answer: 0, pointDeVigilance: "Piège classique : agir dans la précipitation sans diagnostic préalable.", correction: "Avant toute action corrective, il faut comprendre la cause réelle de l'écart." },
          { enonce: "Un objectif SMART doit notamment être...", choices: ["Temporellement défini (avec une échéance précise)", "Volontairement flou pour laisser de la marge", "Fixé sans lien avec la stratégie de l'entreprise", "Impossible à mesurer pour éviter la pression"], answer: 0, pointDeVigilance: "Piège : un objectif sans échéance claire n'est pas un objectif SMART.", correction: "Le « T » de SMART impose une échéance précise, indispensable pour mesurer l'atteinte de l'objectif." }
        ]
      },
      quizValidation: {
        seuilValidationPct: 70,
        questions: [
          { q: "Un tableau de bord sert avant tout à...", choices: ["Détecter rapidement les écarts et déclencher des décisions", "Remplacer la comptabilité générale", "Communiquer avec les clients", "Fixer le prix de vente des produits"], answer: 0, explain: "Sa finalité est le pilotage, pas la simple observation." },
          { q: "Un bon indicateur de tableau de bord doit être...", choices: ["Relié à un objectif et facilement mesurable", "Le plus complexe possible", "Calculé une seule fois par an", "Choisi sans lien avec la stratégie"], answer: 0, explain: "Un indicateur utile découle directement d'un objectif." },
          { q: "Que faut-il faire en priorité face à un écart important ?", choices: ["Identifier la cause de l'écart", "Modifier l'objectif immédiatement", "Ignorer l'écart s'il est isolé", "Licencier le responsable du service"], answer: 0, explain: "Le diagnostic précède toujours le plan d'action correctif." },
          { q: "Un plan d'action correctif doit préciser...", choices: ["Les actions, les responsables et les délais", "Uniquement le budget disponible", "Le nom du logiciel utilisé", "La liste des concurrents"], answer: 0, explain: "Sans responsable ni délai, un plan d'action reste une intention." },
          { q: "Le 'S' d'un objectif SMART signifie...", choices: ["Spécifique", "Simple à deviner", "Secret", "Statique"], answer: 0, explain: "SMART = Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini." },
          { q: "Un tableau de bord avec trop d'indicateurs risque de...", choices: ["Noyer l'information utile et ralentir la décision", "Toujours améliorer la prise de décision", "Remplacer le besoin de plan d'action", "Supprimer les écarts automatiquement"], answer: 0, explain: "La surcharge d'indicateurs nuit à la lisibilité et à la réactivité du pilotage." }
        ]
      }
    }
  ];

  root.MonBTS = root.MonBTS || {};
  root.MonBTS.CONFIG = root.MonBTS.CONFIG || {};
  root.MonBTS.CONFIG.CHAPITRES_SEED = CHAPITRES;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = CHAPITRES;
  }
})(typeof window !== "undefined" ? window : globalThis);
