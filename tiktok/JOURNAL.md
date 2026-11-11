# Journal du projet TikTok — Wilfried

Tout ce qui a été dit et décidé, dans l'ordre. On s'en sert pour réviser ensemble.

## Le brief (Wilfried)

- Objectif : créer un compte TikTok intéressant et attractif.
- Analyser les comptes TikTok qui marchent le mieux **avec l'IA, sans que les gens sachent que c'est de l'IA**.
- Trouver le sujet qui touche le plus de monde. Cible : **~10 000 vues sur la première vidéo**.
- Retour sur le premier test : les idées sont bonnes, surtout **l'appel au début** et le principe des **épisodes** (série à suspense avec vote).
- Ce qui manque : **plus d'animation**, un rendu **plus premium**, des **sons**, des **emojis**, une **voix off** (un « bonhomme » qui parle). La voix sera faite avec **ElevenLabs**.
- « Si pour ça il te faut des skills, on va en mettre. »

## Ce qui a été produit avant (autre conversation)

- « Le secret », épisode 1, version premium : 35 s (au lieu de 45 s).
- Personnage stylisé dans une chambre de nuit, téléphone qui vibre, plongée dans l'écran, appel avec ondes, mots qui sortent du flou, flash rouge au choc, lumière + ombre de deux pieds sous la porte, emojis (👩🏽 ❤️ 🙂 🚪 🔒 👇), sons (vibrations, souffle, montée, coup sourd, battements, bips, sonnette).
- Prévu ensuite : version premium de « L'inconnu », puis les épisodes 2 avec les deux suites A et B.

### Script voix off (ElevenLabs), calé à la seconde

| t (s) | Voix | Texte |
|---|---|---|
| 0 | Narrateur, grave et calme | « Deux heures sept. Ta mère t'appelle. » |
| 7 | Mère, chuchotée, paniquée | « Je dois te dire un truc… avant qu'il le fasse. » |
| 12,4 | Mère | « Ton père… » (pause) « …n'est pas ton père. » |
| 16,6 | Narrateur | « Elle a raccroché. Son téléphone est éteint. » |
| 20 | Narrateur, lentement | « Puis ton père t'écrit. » |
| 27,5 | Narrateur | « Quelqu'un sonne. » |
| 30,2 | Narrateur | « Tu fais quoi ? Vote en commentaire. » |

## Session du 8 novembre 2026

- Wilfried installe le plugin **lemo-opuscar@lemolab** (films faits entièrement en code, 66 styles).
  Installé et vérifié dans Claude Code (`claude plugin list` → enabled).
- Décision : refaire « Le secret » épisode 1 avec lemo-opuscar, **même script, même timing**.
- Style choisi : **Papier découpé lumineux** (Paper-cut Lightbox) — chambre en couches de papier rétroéclairées, personnage en silhouette.
- Voix : **sous-titres seulement** dans la vidéo ; les voix ElevenLabs sont ajoutées ensuite dans CapCut.
- Format : vertical 1080×1920, 30 i/s, français.
- **Correction de Wilfried : « j'avais dit 45 s ».** Le 35 s venait d'une suggestion de Claude, pas de lui. Passage à **45 s**, avec du vrai contenu en plus :
  il rappelle sa mère → « Injoignable » ; un message de plus du père (« Tu dors ? ») ; le choix A/B reste 7 s à l'écran pour voter.
  Nouveau timing de voix off : `le-secret-ep1/VOIX-OFF.md` (une phrase ajoutée : « Tu la rappelles. »).
- Fin ajoutée : le téléphone revibre à 43,3 s, avec la lumière chaude de la mère (alors que son téléphone est éteint) → accroche pour l'épisode 2.

## À faire ensuite

- [ ] Wilfried regarde la vidéo avec le son et donne son avis.
- [ ] Décider : la fin où la mère « rappelle » est-elle gardée pour l'épisode 2 ?
- [ ] Générer les 2 voix ElevenLabs (narrateur + mère) et les poser dans CapCut.
- [ ] Même traitement pour « L'inconnu ».
- [ ] Préparer l'épisode 2 du « Secret » en deux versions (A : il ouvre / B : il se cache).

## Retour de Wilfried après visionnage (8 nov.)

- « On vient de regarder, c'était incroyable. »
- Question : qu'est-ce qu'on peut rajouter, honnêtement et durement, pour que ce soit plus interactif et un peu mieux ? Est-ce que les gens vont regarder ?
- Réponse de Claude (résumé) : les 2 premières secondes sont le vrai risque ; le passage des messages (24–33 s) est un peu long ; « 1 000 likes = la suite » est risqué pour un compte neuf ; ajouter un indice caché (la photo de famille) pour faire revoir et commenter ; utiliser le sondage natif TikTok et répondre en vidéo aux commentaires pour l'épisode 2.
- Wilfried valide les points (« t'as raison totalement »). Rappel : c'est Wilfried, frère d'Inès (« Willem » = erreur de dictée).
- Lancé : ouverture directe sur l'écran « Maman appelle » + « Partie 1 » ; indice caché (l'enfant disparaît de la photo de famille à la fin).
- En attente : choix de la phrase de fin (A « Abonne-toi. La suite demain. » / B « Abonne-toi. C'est toi qui choisis la suite. ») + nouvel audio ElevenLabs de cette phrase.
- Wilfried mentionne « Wil Aime sur YouTube ». Trouvé : chaîne « Wil Aime » (@wilaime2158), courts-métrages en français (thriller psychologique, relations, sketchs) : ~336 000 abonnés, ~19 M de vues, 26 vidéos (~730 000 vues en moyenne), aucune vidéo publiée sur les 12 derniers mois (données vidIQ). À confirmer : est-ce sa chaîne ?
- Correction : Wil Aime, ce n'est PAS Wilfried. Wilfried veut s'inspirer de son style (des vidéos très appréciées, beaucoup commentées sur Facebook à l'époque).
- Analyse de la chaîne (vidIQ) : top = « Comment sortir de la Friendzone » 3,7 M, « Comment ne pas perdre le respect de ta copine » 2,6 M, « L'art de la tromperie » 1,8 M + partie 2 1,5 M, « Comment mater une fille sans que ta copine te crame » 1,6 M.
  Recette : sujet de couple que tout le monde vit ; titre « Comment… » (faux tutoriel) ; un narrateur sûr de lui qui donne une définition qu'on retient ; une démonstration ; un retournement final (le téléphone qui sonne une 2e fois = commentaire le plus liké, 9 000 likes) ; des séries en plusieurs parties ; budget minuscule, tout repose sur le texte.
- Proposition : « Comment survivre à un Vu » (original, même mécanique, pas ses histoires ni ses répliques).
- Wilfried : « Je prends la vidéo que mon frère a faite, refais-la avec ce que je viens de te dire… reprendre ses erreurs, refaire mieux, et rajouter le petit truc de nouveau. »
  → Version 2 du « Secret » : ouverture directe sur l'écran du téléphone + « PARTIE 1 », passage des messages raccourci, indice caché (l'enfant disparaît de la photo), fin honnête « Abonne-toi · Partie 2 demain », et la touche Wil Aime : le téléphone sonne une 2e fois et on lit « Maman » alors que son téléphone est éteint.
- Wilfried (énervé) : « le côté Wil Aime, il est où ? » → il avait raison : seule la 2e sonnerie venait de son style.
  Ajouté : titre « COMMENT SAVOIR SI TA FAMILLE TE MENT » (faux tutoriel) + 3 leçons dites par le narrateur (voix Nicolas Petit, fichier voice/lecons.mp3), écrites en papier pendant que l'histoire se met au ralenti :
  1. « À 2 h du matin… personne n'appelle pour prendre de tes nouvelles. »
  2. « Un secret ne disparaît jamais. Il change juste de propriétaire. »
  3. « Celui qui sonne à 2 h… sait déjà que tu es réveillé. »
  Durée : ~59 s (les leçons ajoutent ~14 s).
- Wilfried valide la v3 (« la vidéo est bonne »). Priorité : publier sur TikTok avec titre + description, puis demain : la partie 2.
- Publication automatique impossible : Metricool n'a aucun réseau connecté. Wilfried publie à la main depuis son téléphone (texte prêt dans PUBLICATION.md).

## 8 novembre (soir) — Partie 1 publiée
- Wilfried a publié la partie 1 sur TikTok (« c'est carré »). Objectif : 3 parties, 4 si ça plaît.
- Demande : la partie 2 avec tout ce qui a été dit (style Wil Aime, leçons, défauts corrigés), en faisant attention aux tokens.
- Script de la partie 2 écrit : `le-secret-ep2/SCRIPT.md` (deux débuts A/B selon le vote, suite commune, leçons 4 et 5). En attente : les voix ElevenLabs + le résultat du vote.
- Question : un connecteur TikTok Studio pour publier à sa place ? Réponse : pas de connecteur TikTok Studio ; le connecteur TikTok for Business sert aux publicités ; la voie possible = connecter TikTok dans Metricool.
- Wilfried refuse de donner sa clé API ElevenLabs (respecté) : il enverra les fichiers audio.
- Demande : utiliser « Imagine… » dans la narration pour que les gens se projettent → ajouté au script de la partie 2.
- Metricool : TikTok connecté (compte « historiax25 »). Publication programmée possible via Metricool.
- Partie 2 en production (2 versions A/B). Les leçons ont été générées avec Victoria par erreur : Wilfried doit les refaire avec Nicolas.

## 9 novembre — refonte visuelle
- Wilfried : « les dessins sont pas ouf ». 5 styles testés sur la même scène (`tiktok/styles-test/`) : film réaliste, anime sombre, roman graphique, animation 3D, papier découpé premium.
- Générateurs : Canva (3 images, puis quota épuisé), vidIQ (2 images, 44 crédits sur 100).
- Wilfried choisit le **style 1 (film réaliste)**. Claude génère les 2 images clés (photo avec l'enfant découpé ✓, main sur la fenêtre). Wilfried génère les autres avec les descriptions de `le-secret-ep2/IMAGES.md`. Crédits vidIQ quasiment épuisés (12 restants).
- Wilfried : « va voir les vidéos de Wil Aime ». Analyse complémentaire (transcription « Comment mater une fille… » + commentaires « L'art de la tromperie ») :
  1. Le narrateur, c'est le personnage lui-même, à la 1re personne, un « génie » qui pense son plan en temps réel (« elle m'a cramé, j'ai très peu de temps… il me faut une diversion »).
  2. Une phrase signature répétée et recopiée par les fans : « Chaque détail compte », « Je ne suis pas un simple trompeur… je suis un perfectionniste ».
  3. Le retournement « l'arroseur arrosé » : celui qui contrôle tout se fait piéger.
  4. Musique et montage très calés (« une symphonie », « digne de Nolan »), peu de dialogues, ralentis.
  5. Wil Aime a annoncé son retour en avril 2026 (court-métrage au cinéma) : sa communauté est de nouveau active.
  Idées retenues pour la suite : partie 3 racontée à la 1re personne par le faux père (le manipulateur), avec une phrase signature à nous, et un arroseur arrosé.
- Wilfried : Wil Aime s'inspire de « Murder » (How to Get Away with Murder). Confirmé par un commentaire sous « Comment sortir de la Friendzone » : il a repris la première scène de la série (la prof qui entre en retard et donne un cours magistral) pour faire son cours sur la friendzone.
  Recette « Murder » : un cours magistral qui donne des règles + chaque règle illustrée par une scène ; un flash-forward au début (la nuit du drame), puis « X heures plus tôt » ; chaque épisode en révèle un peu plus ; une prof charismatique qui domine tout ; un cliffhanger à la fin.
  À appliquer : ouvrir chaque partie par un flash-forward de 2 s (ex. la main sur la fenêtre) puis « 3 MINUTES PLUS TÔT » ; les leçons deviennent des « règles » d'un cours ; un narrateur-prof.
- Wilfried : « ou inspire-toi de YOU, qui parle dans sa tête ». Idée retenue pour la partie 3 : le narrateur (voix de Nicolas, qui dit « tu » et « Imagine… » depuis l'épisode 1) se révèle être le faux père, qui observe le garçon depuis le début. Monologue intérieur à la YOU : calme, poli, inquiétant. Phrase de révélation proposée : « Tu croyais que c'était une voix dans ta tête ? Non. Depuis le début… c'était moi. »
- Wilfried valide : partie 3 « comme Wil Aime, avec de l'intrigue ». Script écrit : le-secret-ep3/SCRIPT.md (le narrateur = le faux père, monologue façon YOU, règles 6 et 7, sirènes, arroseur arrosé, appel à la partie 4).
- Wilfried (remarque juste) : dans YOU, Joe parle de relations amoureuses ; Wil Aime aussi (friendzone, couple, tromperie). Notre série « Le secret » est un thriller familial : le style colle, pas le thème.
  Proposition : finir « Le secret » en 3 parties (public déjà engagé), puis lancer une 2e série sur les relations amoureuses, façon YOU + Wil Aime.
- Wilfried précise : le narrateur doit être comme « l'âme de l'homme » (sa voix intérieure, ce qu'il ressent vraiment), dans le style YOU / Wil Aime, sur les relations amoureuses. Concept proposé : « L'âme d'un homme ».
- Wilfried valide le concept « L'âme d'un homme ». Épisode 1 « Il faut qu'on parle » écrit : ame-d-un-homme-ep1/SCRIPT.md.
- Wilfried : « fais un truc comme ça en reprenant notre idée de secret de famille ». Partie 3 réécrite au format « âme » : l'âme du faux père (voix de Nicolas = le narrateur des parties 1-2) commente pendant qu'il sourit ; la mère le piège (« Bonsoir, chéri. ») et son âme se tait. Fichier : le-secret-ep3/SCRIPT.md (v2). La série « L'âme d'un homme » reste en réserve.
- Wilfried précise le style de voix off voulu : à la 1re personne, comme une confidence (« Je sentais que c'était bizarre depuis quelque temps. Ma mère n'adressait plus la parole à mon père… comme vivre un couple déchiré »). Partie 3 réécrite (v3) : le fils, devenu adulte, raconte cette nuit-là (storytime).
- Wilfried : penser à la scène de BoJack Horseman (l'enfant devant la télé qui entend ses parents se disputer). Ajouté en ouverture de la partie 3 : souvenir d'enfance, le fils montait le son de la télé ; dispute étouffée qui sert d'indice (« Il a le droit de savoir ! » / « Jamais. »).
- Scène BoJack trouvée (S2E1 « Brand New Couch » : la dispute des parents couvre la réponse de son héros à la télé). Impossible de la regarder (YouTube/Netflix bloqués ici) : analyse via articles. Adaptée à l'envers : la télé couvre la dispute, et le nom du vrai père est couvert par des rires de télé.
- Wilfried : « et il entend un gros bruit derrière ». Ajouté : un fracas (assiette contre le mur, chaise qui tombe) pendant la dispute ; le petit sursaute, ne se retourne pas, monte le son.
- Wilfried : « fais tout un épisode avec 3 parties mais une vraie intrigue ». Histoire complète écrite : serie-qui-ment-le-mieux/HISTOIRE.md (vrai père = l'oncle Daniel, cartes postales écrites par le père, la mère qui découpait les photos et a tout organisé, le fils qui avait tout entendu). En attente de validation avant les voix et les images.
- Wilfried valide l'histoire (« ouais pas mal »). Kit de production de la partie 1 : serie-qui-ment-le-mieux/P1_PRODUCTION.md (3 voix, 6 images).

## 11 novembre — bilan
- Wilfried : « la vidéo n'a pas du tout marché… on va changer de concept, du tout. »
- À récupérer : vues, durée moyenne de visionnage, % qui regardent jusqu'au bout, likes/commentaires (TikTok Studio → Analyses de la vidéo).
- **Nouveau concept : HISTORIA** — l'actu expliquée en 60 s, avec de vraies images et de vraies infos. 1re vidéo : « Imagine : Teddy Riner président » (candidature annoncée le 9 nov. 2026 dans Le Parisien). Script sourcé : historia/teddy-riner/SCRIPT.md.
- Wilfried a refusé d'ouvrir l'accès réseau à Wikimedia Commons : il fournira les photos lui-même.
- Historia / Teddy Riner : réseau ouvert à Wikimedia (accepté par Wilfried) → 12 photos libres + 3 envoyées par Wilfried (smoking Cannes 2016, médaille Rio, JO 2012). Crédits : historia/teddy-riner/photos/CREDITS.txt.
- Wilfried : texte plus drôle, petites blagues et références actuelles ; fin : « abonnez-vous » + « dites-nous qui on imagine président la prochaine fois ». Texte réécrit (timeline.js), Wilfried génère la voix sur ElevenLabs.
- Wilfried : plutôt « Que se passe-t-il si Teddy Riner devient président ? » : du concret (ce qui change pour toi), avec des blagues sur ce concret, pas sur sa taille. Texte réécrit (timeline.js).
- Wilfried veut une vidéo qui oriente vers la gauche et montre que le programme de Riner n'est pas convaincant. Texte réécrit en analyse critique assumée (« notre avis »), faits exacts, sans consigne de vote pour un parti. Conseil donné : ne pas présenter un avis comme de l'info neutre (crédibilité de la chaîne).
- Wilfried : orienter « sans le dire explicitement ». Texte final : angle critique porté par des questions et des faits, sans « notre avis » ni consigne de vote.
- Wilfried : « recommence à zéro, fais tout ce que je t'ai dit » → texte final (Imagine + présentation Historia + 5 points concrets + blagues sur le concret + angle critique implicite + appel aux commentaires, à la prochaine personnalité et à l'abonnement), avec réglages ElevenLabs.

## 11 nov. — Historia : 3 directions artistiques
- Retour de Wilfried : typo, couleurs et rectangles oui/non pas premium, photos à améliorer.
- Proposé 3 directions sur les mêmes images : A Éditorial (serif italique + or), B Gen-Z (Unbounded + vert acide), C République (Fraunces + bleu nuit/rouge).
- Nouveau module de vote : carte « sondage » en verre dépoli avec barres. Bug sous-titres bloqués sur « 60 secondes » corrigé.
- En attente : son choix A / B / C.

## 11 nov. — Historia : choix B + vidéo finale
- Wilfried choisit la **B** (Unbounded, vert acide). Demande : remplacer le rouge par la couleur opposée au jaune → violet électrique #8A4DFF. Typo B validée.
- Musique demandée : « Tombolo » de Kalash → à ajouter directement dans TikTok (droits + son lié à la tendance). Le fichier contient voix + bruitages + tic-tac du timer.
- Corrigé : accroche « 2027 » lisible (bandeau sombre + pastille violette), textes qui débordaient, logo HISTORIA coupé.
- Livré : historia_teddy_riner.mp4 (63,5 s) + PUBLICATION.md.

## 11 nov. — Historia : photo de profil
- Wilfried demande une pdp. 3 propositions en style B : (1) H + anneau timer 60 s, (2) H noir sur vert + pastille 60s, (3) logo HISTORIA + « L'actu en 1 min ». Conseillé : 1.

## 11 nov. — Historia #1 programmée
- Wilfried : « on fait ça ». Vidéo programmée via Metricool sur historiax25, ce soir 19h (Paris), en mode notification (autoPublish false) pour qu'il ajoute Tombolo dans TikTok avant de publier. Légende + hashtags + crédits inclus.

- Wilfried poste lui-même maintenant (13h). Le post Metricool de 19h reste en place (il a refusé que je le passe en brouillon) : ignorer la notif ou le supprimer. Ce soir : nouvelle vidéo Historia.

- Son Tombolo ajouté par Wilfried lui-même. Pas de brouillon Metricool nécessaire.
- Idée épisode 2 (ce soir) : **Bally Bagayoko** (écrit « balybayoko » / « Bali by Haiku » en dictée).

- Maison Arc (ancienne marque bijoux) : terminé. Nouvelle DA Historia partout.
- Metricool historiax25 relie maintenant : TikTok historiax25, Facebook (page 1434029753132395, encore « Maison Arc »), Instagram (@maboutique.bijouxvoyage), YouTube. Aucun outil ne permet de changer nom/photo d'une page → guidé Wilfried pour le faire dans Facebook.

- 15h37 : Teddy programmé via Metricool pour 15h45 — YouTube Short (auto, sans musique), Instagram Reel @historiax225 et Facebook Reel (notification → Wilfried ajoute Tombolo). Ajout auto de musique Instagram refusé par l'API (Authorization Error). L'ancien post TikTok 19h reste à ignorer.

- 15h45 : Teddy publié sur YouTube Short (vaoOdmu1VmE), Facebook Reel, Instagram Reel (sans musique).
- Nouvelle règle de publication : YouTube + Facebook = Claude via Metricool (limite 20 posts/mois → ~10 vidéos) ; Instagram + TikTok = Wilfried à la main (avec son tendance).
- Correction : Instagram PAS publié (mode notification, pas d'appli Insta). Teddy en ligne seulement sur TikTok, Facebook et YouTube. Wilfried postera Insta à la main.

- Bannière YouTube (2560×1440) + couverture Facebook (1640×624) + bio Insta (BIO.md), style B.
- Légende Insta + idée sondage en story donnés. RDV 17h pour l'épisode Bally Bagayoko.

- Vidéo de présentation Historia (23 s, sans voix, texte à l'écran) : média politique, mais on parle de tout (éco, société, monde, sport). Bio Insta : Wilfried doit la coller lui-même (pas d'outil pour modifier un profil).

- 16h46 : présentation programmée 16h52 en auto sur YouTube, Facebook, Instagram, TikTok (4 posts Metricool). Prochain sujet à décider (Bally Bagayoko ou autre).
- 16h52 : présentation PUBLIÉE sur les 4 (Insta reel Dfm2NmOjuNh, TikTok 7706942493002042646, YouTube nnUo2vycz6o, Facebook 1493391462688340). La publication auto Insta + TikTok via Metricool fonctionne.

- Bally : Wilfried veut un meilleur hook + nouvelle typo (Unbounded rejeté pour les chiffres). Ajout sous-titres mot à mot (karaoké), hook visage net + « CE MAIRE VEUT METTRE TON SMIC À… 1 700 € ». 2 typos proposées : TikTok Sans / Archivo Black. Rien publié tant qu'il n'a pas validé.

- 18h05 : sous-titres recalés avec un vrai alignement forcé (espeak-ng + DTW, tools/falign.py) — l'alignement par syllabes était faux. Bally programmée 18h30 (4 réseaux, version corrigée), MC Pao programmée 21h30 (4 réseaux, motion design sans photo de lui : aucune photo libre). Sans musique aujourd'hui (test). Objectif : 2 000 vues.
