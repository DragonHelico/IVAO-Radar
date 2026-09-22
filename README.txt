IVAO RADAR — première version prototype
======================================

Contenu
-------
index.html       : page Radar
planning.html    : page ATC Planning
airport.html     : page Airport Board
style.css        : interface commune
radar.js         : carte Leaflet + éléments de démonstration
planning.js      : timeline + slider minute par minute
README.txt       : ce fichier

Important
---------
Cette version est volontairement un PROTOTYPE.

Elle utilise uniquement ce que les fichiers inspecteur fournis permettent de confirmer :
- WebEye IVAO utilise OpenLayers côté interface.
- Le planning utilise une timeline UTC et les positions visibles dans l'inspecteur.
- Les positions visibles dans le planning ont été reprises.
- Les vraies coordonnées/polygones FIR/secteurs n'ont pas été inventés.
- Les réservations et vols de l'Airport Board sont encore des données de démonstration.

La prochaine étape sera de remplacer les données de démonstration par les réponses réseau/API IVAO,
en particulier :
1. géométrie réelle des FIR/secteurs ;
2. avions et ATC en temps réel ;
3. réservations ATC et horaires ;
4. état des positions ouvertes ;
5. départs/arrivées par code OACI ;
6. rafraîchissement périodique des positions ouvertes.

Lancer
------
Ouvrir index.html dans un navigateur moderne.
La carte utilise Leaflet et OpenStreetMap via CDN, donc une connexion Internet est nécessaire
pour la carte et les polices.
