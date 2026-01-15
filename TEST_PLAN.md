Convertir en pdf une fois totalement fini : https://www.markdowntopdf.com/

# Plan de Test

Ce document recense les tests existants et justifie la stratégie de test actuelle, en soulignant les défis liés au test du reste de l'application.

## 1. Tests Existants

Les tests actuels se concentrent sur les **fonctions utilitaires** et les **modules isolés**. Ces parties du code sont "pures" ou ont des dépendances facilement mockables, ce qui garantit des tests fiables et rapides.

### Détail des Fonctions Testées

Voici la liste exhaustive des fonctions couvertes par les tests unitaires, avec leurs signatures et la justification du test.

#### A. Utilitaires et Logique Métier

| Fichier / Module | Fonction | Signature | Scénarios Testés | Justification |
| :--- | :--- | :--- | :--- | :--- |
| **`addressConverter`** | `convertToAddress` | `(coords: Coordinates) => Promise<string \| undefined>` | - Succès (retourne l'adresse)<br>- Erreur (gère l'exception API) | Transformation critique pour l'affichage humain des lieux. |
| | `convertToCoordinates` | `(address: string) => Promise<Coordinates \| undefined>` | - Succès (retourne lat/long)<br>- Erreur (gère l'exception API) | Indispensable pour placer une adresse sur la carte. |
| **`eventBounds`** | `calculateEventBounds` | `(event: Event \| null) => Region \| null` | - Event null/vide<br>- Zones seules<br>- Parcours seuls<br>- Points d'intérêt seuls<br>- Mixte<br>- Delta minimum (0.01) | Algorithme complexe de géométrie pour centrer la carte. Les cas limites (vide, point unique) sont fréquents. |
| **`rectangleCalculator`** | `getVehicleRect` | `(placement: EquipmentPlacement) => Coordinates[] \| null` | - Véhicule valide (calcule 4 coins)<br>- Équipement introuvable<br>- Coordonnées insuffisantes | Garantit que les véhicules sont dessinés correctement (rectangles orientés) et non comme de simples points. |

#### B. Infrastructure et Stockage

| Fichier / Module | Fonction | Signature | Scénarios Testés | Justification |
| :--- | :--- | :--- | :--- | :--- |
| **`AsyncStore`** | `get<T>` | `(key: Keys, defaultValue: T) => Promise<T>` | - Item existe (parse JSON)<br>- Item inexistant (retourne default)<br>- Erreur de lecture | Lecture robuste de la configuration/état local. |
| | `set<T>` | `(key: Keys, value: T) => Promise<void>` | - Succès (stringify JSON)<br>- Gestion d'erreur | Écriture sécurisée pour éviter la corruption de données. |
| | `update<T>` | `(key: Keys, initial: T, updater: (prev: T) => T) => Promise<T>` | - Mise à jour atomique simulée | Permet de modifier une partie de l'état sans tout écraser. |
| | `remove` | `(key: Keys) => Promise<void>` | - Suppression simple | Nettoyage propre des données. |
| | `clear` | `() => Promise<void>` | - Vidage complet | Réinitialisation (ex: dissociation). |
| **`ImageStorage`** | `save` | `(uri: string) => Promise<string \| null>` | - Écrasement (fichier existant)<br>- Nouveau fichier<br>- Erreur copie | Gestion complexe du système de fichiers (déplacement, suppression préalable). Critique pour le mode hors-ligne. |
| | `remove` | `(uri: string) => Promise<boolean \| undefined>` | - Fichier existant<br>- Fichier inexistant<br>- Erreur suppression | Évite l'accumulation de fichiers orphelins. |
| **`FileDownloader`** | `download` | `(url: string, endpoint: string) => Promise<string>` | - Succès (200 + sauvegarde)<br>- Nom de fichier (Content-Disposition)<br>- Erreur Réseau<br>- Erreur HTTP (404...) | Brique de base pour récupérer les assets. Doit être résiliente aux pannes réseau. |
| **`ProxyApi`** | `request` | `(url: string, endpoint: string, options: any) => Promise<any>` | - 200 OK<br>- 404 Not Found<br>- Erreur logique API (`success: false`)<br>- 204 No Content | Centralise la gestion des erreurs API. Essentiel pour uniformiser le comportement de l'app face au serveur. |
| | `get`, `post`, `patch`, `delete` | `(helpers)` | - Vérification des méthodes HTTP et headers | Wrappers syntaxiques pour simplifier les appels. |

---

## 2. Défis du Test sur le Reste de l'Application

Le reste de l'application (écrans, hooks de synchronisation, composants UI complexes) présente une complexité de test significativement plus élevée pour les raisons suivantes :

### A. Dépendances Matérielles Fortes

L'application repose massivement sur des fonctionnalités natives du téléphone qui sont difficiles à reproduire dans un environnement de test Node.js (Jest) :

- **Caméra / Scanner QR** : Le flux principal dépend du scan physique d'un QR code. Mocker la caméra et le résultat du scan nécessite une configuration lourde de mocks natifs (`jest-expo`).
- **Système de Fichiers** : L'utilisation de `expo-file-system` pour gérer les images et les logs demande de simuler un système de fichiers entier.

### B. État Global et Interdépendances (Zustand)

L'architecture utilise plusieurs stores Zustand interconnectés (`useEventIdStore`, `useUrlStore`, `useTeamActionsStore`, etc.).

- **Couplage fort** : Le hook central `useSynchronization` orchestre des interactions complexes entre ces stores.
- **Persistance** : La plupart des stores sont persistés via `AsyncStore`. Isoler un test unitaire nécessite de réinitialiser/mocker proprement l'état global et la persistance entre chaque test pour éviter les "effets de bord" (flaky tests).

### C. UI Complexe (map)

L'écran principal utilise une carte interactive (`react-native-maps`).

- **Impossible à rendre avec Jest** : Les composants de carte natifs ne peuvent pas être rendus par Jest (qui utilise JSDOM/Node). Ils doivent être entièrement mockés, ce qui vide le test de sa substance (on teste le mock, pas la carte).
- **Interactions Utilisateur** : Tester les gestes (zoom, pan, clic sur un marqueur) requiert des outils de test E2E (comme Detox ou Appium) qui nécessitent une infrastructure dédiée (émulateurs Android/iOS) non présente actuellement.

### D. Nature Asynchrone et Temps Réel

La logique de synchronisation implique des boucles de tentatives (`checkIps`), des timeouts et des requêtes réseau en chaîne. 

**Instabilité** : Les tests impliquant des timers et des promesses en chaîne sont souvent instables ("flaky") et difficiles à déboguer.

---

## 3. Tests Utilisateur (Manuels)

Cette section détaille les scénarios de test fonctionnels pour valider le comportement de l'application du point de vue de l'utilisateur final. Les colonnes "Resultat obtenu" et "Test reussi" sont a remplir lors de l'execution des tests.

---

### A. Ecran d'Accueil et Scan QR Code Initial

**Prerequis** : Application fraichement installee (aucun evenement associe), serveur accessible selon le test.

| Fonctionnalite | Action de l'utilisateur | Resultat attendu | Resultat obtenu | Test reussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Premier lancement | Lancer l'application | Le logo "Stras Ta Route" s'affiche, le scanner QR Code s'ouvre automatiquement, la camera est active | | |
| Scan QR valide (sync) | Scanner un QR Code de synchronisation valide | Message "Connexion en cours", redirection vers l'onglet Carte, la carte se centre sur l'evenement, les zones/parcours/equipements s'affichent | | |
| Scan QR valide (planning) | Scanner un QR Code "Planning" avec teamId | Message "Connexion en cours", redirection vers Carte, l'onglet "Planning" affiche les actions de l'equipe | | |
| Scan QR invalide | Scanner un QR Code non reconnu (ex: URL web) | Modal d'erreur "Le QR Code scanne est invalide", le scanner reste ouvert | | |
| Scan serveur injoignable | Scanner un QR Code valide (serveur hors ligne) | Message de chargement, puis modal d'erreur "Aucune adresse IP du QR Code n'est joignable" | | |
| Relancement avec evenement | Fermer et relancer l'application (evenement deja associe) | Pas de scanner QR, redirection directe vers Carte, donnees restaurees | | |

---

### B. Onglet Carte

**Prerequis** : Evenement associe avec zones, parcours et equipements.

| Fonctionnalite | Action de l'utilisateur | Resultat attendu | Resultat obtenu | Test reussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Affichage carte | Naviguer vers l'onglet "Carte" | La carte Google Maps s'affiche, zones en polygones, parcours en polylignes, equipements avec marqueurs | | |
| Centrage position | Appuyer sur le bouton "Centrer sur moi" | La carte se centre sur la position actuelle, point bleu visible | | |
| Zoom evenement | Appuyer sur le bouton "Zoom evenement" | La carte s'ajuste pour afficher toutes les zones/parcours | | |
| Interaction equipement | Appuyer sur un marqueur d'equipement | Modal d'actions s'ouvre, nom de l'equipement affiche, boutons d'action disponibles | | |
| Changement statut equipement | Appuyer sur "Marquer comme depose" dans le modal | Le statut change, la couleur du marqueur change (rouge vers vert), modal se ferme | | |
| Points a securiser sur carte | Naviguer vers Carte (avec points crees) | Les points a securiser sont affiches avec des marqueurs rouges | | |

---

### C. Onglet Points a Securiser

**Prerequis** : Evenement associe.

| Fonctionnalite | Action de l'utilisateur | Resultat attendu | Resultat obtenu | Test reussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Liste vide | Naviguer vers "Points a securiser" (aucun point cree) | Message "Aucun point a securiser disponible", bouton "+" visible en bas a droite | | |
| Creation point | Appuyer sur "+", remplir commentaire, prendre photo, valider | Formulaire s'ouvre, le point apparait dans la liste et sur la carte | | |
| Details d'un point | Appuyer sur un point dans la liste | Ecran de details s'ouvre, images en carrousel, commentaire et adresse affiches | | |
| Modification commentaire | Appuyer sur l'icone d'edition, modifier le texte, valider | Modal d'edition s'ouvre, le commentaire est mis a jour | | |
| Ajout image | Appuyer sur "Ajouter une image", choisir Camera/Galerie | Options affichees, l'image est ajoutee au carrousel | | |
| Suppression point | Appuyer sur l'icone poubelle d'un point | Le point est supprime de la liste et disparait de la carte | | |

---

### D. Onglet Evenement (Synchronisation)

**Prerequis** : Variable selon le test.

| Fonctionnalite | Action de l'utilisateur | Resultat attendu | Resultat obtenu | Test reussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Affichage sans QR | Naviguer vers "Evenement" (aucun evenement associe) | Message invitant a scanner un QR Code, bouton "Scanner un QR Code" visible | | |
| Affichage avec evenement | Naviguer vers "Evenement" (evenement associe) | Statut de synchronisation affiche, nombre de points a synchroniser, boutons "Envoyer" et "Dissocier" visibles | | |
| Synchronisation points | Appuyer sur "Envoyer les points" (serveur accessible) | Indicateur de chargement, message de succes, compteur passe a 0 | | |
| Sync erreur reseau | Appuyer sur "Envoyer les points" (serveur hors ligne) | Message d'erreur affiche, les points restent en local (non perdus) | | |
| Rescanner meme evenement | Scanner le meme QR Code | Les donnees sont rafraichies, pas de message d'erreur | | |
| Scanner autre evenement | Scanner un QR Code pour un autre evenement | Modal d'erreur "Ce QR Code correspond a un evenement different", l'evenement actuel reste associe | | |
| Dissociation | Appuyer sur "Dissocier", confirmer | Modal de confirmation, donnees locales effacees, retour a l'accueil avec scanner QR | | |

---

### E. Onglet Planning (Actions Equipe)

**Prerequis** : Variable selon le test.

| Fonctionnalite | Action de l'utilisateur | Resultat attendu | Resultat obtenu | Test reussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Affichage sans equipe | Naviguer vers "Planning" (evenement sans teamId) | Message invitant a scanner un QR "Planning", bouton "Aller a la synchronisation" visible | | |
| Liste des actions | Naviguer vers "Planning" (equipe associee) | Liste des actions affichee (DROPOFF/REMOVE), nom equipement visible, icone verte/rouge | | |
| Navigation vers equipement | Appuyer sur une action de la liste | Redirection vers Carte, carte centree sur l'equipement, modal d'actions s'ouvre | | |
| Marquer DROPOFF | Appuyer sur la checkbox d'une action DROPOFF | Action marquee comme effectuee (barree/grisee), statut equipement passe a "DROPPED_OFF" | | |
| Marquer REMOVE | Appuyer sur la checkbox d'une action REMOVE | Action marquee comme effectuee, statut equipement passe a "REMOVED" | | |
| Decocher action | Appuyer sur checkbox d'une action deja effectuee | L'action revient a l'etat "non effectue", statut equipement restaure | | |

---

### F. Cas Limites et Robustesse

| Fonctionnalite | Action de l'utilisateur | Resultat attendu | Resultat obtenu | Test reussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Perte connexion sync | Couper le reseau pendant une synchronisation | Message d'erreur approprie, donnees locales non corrompues | | |
| Permission camera refusee | Tenter d'ouvrir le scanner QR (permission non accordee) | Message demandant d'accorder la permission | | |
| Permission localisation refusee | Appuyer sur "Centrer sur ma position" (permission non accordee) | Message indiquant que la localisation est desactivee, carte reste fonctionnelle | | |
| Arriere-plan et reprise | Mettre l'app en arriere-plan, attendre, revenir | Les donnees sont toujours presentes, aucune perte d'etat | | |
| Rotation ecran | Faire pivoter l'appareil (portrait/paysage) | L'interface s'adapte, aucune perte de donnees, carte fonctionnelle | | |
