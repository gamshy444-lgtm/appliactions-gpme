# Voix off ElevenLabs — Le secret, épisode 1 (45 s)

Deux voix, à générer séparément, puis à poser dans CapCut au temps indiqué. La vidéo a déjà sa musique et ses bruitages, baissés aux moments où l'on parle.

| Début (s) | Voix | Texte | Ton |
|---|---|---|---|
| 0,0 | Narrateur | Deux heures sept. Ta mère t'appelle. | grave, calme |
| 7,0 | Mère | Je dois te dire un truc… avant qu'il le fasse. | chuchotée, paniquée |
| 12,4 | Mère | Ton père… | souffle coupé |
| 14,5 | Mère | …n'est pas ton père. | « père » tombe à 15,3 s, sur le coup sourd |
| 17,5 | Narrateur | Elle a raccroché. | |
| 19,2 | Narrateur | Tu la rappelles. | **nouvelle phrase** |
| 21,05 | Narrateur | Son téléphone est éteint. | « éteint » avant 23,1 s (la lumière s'éteint) |
| 24,0 | Narrateur | Puis ton père t'écrit. | lentement |
| 32,3 | Narrateur | Quelqu'un sonne. | |
| 35,0 | Narrateur | Tu fais quoi ? Vote en commentaire. | |
| 39,2 | Narrateur | Abonne-toi. (on garde seulement ce mot ; bandeau : « Partie 2 demain ») | **nouveau** — finir avant 43,3 s (le téléphone revibre) |

Ce qui a changé par rapport au script de 35 s : une phrase en plus (« Tu la rappelles. »), et tout ce qui suit « Elle a raccroché » est décalé.

Le fichier `le_secret_ep1.srt` contient les mêmes répliques avec leurs temps, à importer dans CapCut si besoin.

## Mode d'emploi ElevenLabs

- Text to Speech, modèle **Eleven v3** (comprend `[whispers]`) ; sinon Multilingual v2 sans les crochets.
- Narrateur : voix d'homme française, grave et posée. Mère : voix de femme française, douce, ~45 ans.
- Réglages de départ : Stability 40 %, Similarity 75 %, Style 25 %.
- **Un fichier par réplique.** Les `...` donnent les pauses : les garder.
- Textes à coller — narrateur : « Deux heures sept... Ta mère t'appelle. » · « Elle a raccroché. » · « Tu la rappelles. » · « Son téléphone est éteint. » · « Puis... ton père t'écrit. » · « Quelqu'un sonne. » · « Tu fais quoi ? Vote en commentaire. » · « Abonne-toi. Mille likes... et tu as la suite. »
- Mère : « [whispers] Je dois te dire un truc... avant qu'il le fasse. » · « [whispers] Ton père... » · « [whispers] ...n'est pas ton père. »
- Dans CapCut : poser chaque fichier au temps du tableau ; si une phrase déborde, accélérer l'audio (1,1× max), ne pas couper la vidéo.

## Voix reçues (8 novembre)

Narrateur : « Nicolas Petit – Deep Narrator ». Mère : « Victoria – Content Creator ». Fichiers dans `voice/`, découpés et calés par `mix.py` (liste `VOICE`). Le bandeau « Abonne-toi » a été avancé à 39,5 s car la phrase dure 3,4 s.

## Version 2 (8 nov., soir)

Ouverture sur l'écran « Maman appelle » + « PARTIE 1 » ; messages raccourcis de 1,2 s ; l'enfant disparaît de la photo ; fin honnête « Abonne-toi · Partie 2 demain » (on ne garde que « Abonne-toi. » de l'audio) ; le téléphone sonne une 2e fois et on lit « Maman » (alors que son téléphone est éteint). Aucune nouvelle voix nécessaire.

## Version 3 : les leçons (style Wil Aime)

L'histoire s'arrête 3 fois pour une leçon du narrateur (fichier `voice/lecons.mp3`). Les temps ci-dessus sont ceux de l'histoire ; dans la vidéo finale (59 s) tout ce qui suit une leçon est décalé. `mix.py` place tout automatiquement : plus rien à caler à la main.
