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

Cette section détaille les scénarios de test fonctionnels pour valider le comportement de l'application du point de vue de l'utilisateur final. Les colonnes "Résultat obtenu" et "Test réussi" sont à remplir lors de l'exécution des tests.

---

### A. Écran d'Accueil et Scan QR Code Initial

**Prérequis** : Application installée (aucun événement associé), serveur accessible selon le test.

| Fonctionnalité | Action de l'utilisateur | Résultat attendu | Résultat obtenu | Test réussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Premier lancement | Lancer l'application | Le logo "Stras Ta Route" s'affiche, le scanner QR Code s'ouvre automatiquement, la caméra est active | | |
| Scan QR valide (sync) | Scanner un QR Code de synchronisation valide | Message "Connexion en cours", redirection vers l'onglet Carte, la carte se centre sur l'événement, les zones/parcours/équipements s'affichent | | |
| Scan QR valide (planning) | Scanner un QR Code "Planning" avec teamId | Message "Connexion en cours", redirection vers Carte, l'onglet "Planning" affiche les actions de l'équipe | | |
| Scan QR invalide | Scanner un QR Code non reconnu (ex: URL web) | Modal d'erreur "Le QR Code scanné est invalide", le scanner reste ouvert | | |
| Scan serveur injoignable | Scanner un QR Code valide (serveur hors ligne) | Message de chargement, puis modal d'erreur "Aucune adresse IP du QR Code n'est joignable" | | |
| Relancement avec événement | Fermer et relancer l'application (événement déjà associé) | Pas de scanner QR, redirection directe vers Carte, données restaurées | | |

---

### B. Onglet Carte

**Prérequis** : Avoir scanné un QR Code type "Evénement" et avoir récupéré l'événement (avec équipements) souhaité.

| Fonctionnalité | Action de l'utilisateur | Résultat attendu | Résultat obtenu | Test réussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Affichage carte | Naviguer vers l'onglet "Carte" | La carte Google Maps s'affiche, zones en polygones, parcours en polylignes, équipements avec marqueurs | | |
| Centrage position | Appuyer sur le bouton "Centrer sur moi" | La carte se centre sur la position actuelle, point bleu visible | | |
| Interaction équipement | Appuyer sur un marqueur d'équipement | Modal d'actions s'ouvre, nom de l'équipement affiché, boutons d'action disponibles | | |
| Changement statut équipement | Appuyer sur "Marquer comme déposé" dans le modal | Le statut change, la couleur du marqueur change (rouge vers vert) | | |
| Points à sécuriser sur carte | Naviguer vers Carte (avec points créés) | Les points à sécuriser sont affichés avec des marqueurs rouges | | |

---

### C. Onglet Points à Sécuriser

**Prérequis** : Avoir scanné un QR Code type "Evénement" et avoir récupéré l'événement souhaité.

| Fonctionnalité | Action de l'utilisateur | Résultat attendu | Résultat obtenu | Test réussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Liste vide | Naviguer vers "Points à sécuriser" (aucun point créé) | Message "Aucun point à sécuriser disponible", bouton "+" visible en bas à droite | | |
| Création point | Appuyer sur "+", remplir commentaire, prendre photo, valider | Formulaire s'ouvre, le point apparaît dans la liste et sur la carte | | |
| Détails d'un point | Appuyer sur un point dans la liste | Écran de détails s'ouvre, images en carrousel, commentaire et adresse affichés | | |
| Modification commentaire | Appuyer sur l'icône d'édition, modifier le texte, valider | Modal d'édition s'ouvre, le commentaire est mis à jour | | |
| Ajout image | Appuyer sur "Ajouter une image", choisir Caméra/Galerie | Options affichées, l'image est ajoutée au carrousel | | |
| Suppression point | Appuyer sur l'icône poubelle d'un point | Le point est supprimé de la liste et disparaît de la carte | | |

---

### D. Onglet Événement (Synchronisation)

**Prérequis** : Avoir scanné un QR Code type "Evénement" et avoir récupéré l'événement souhaité.

| Fonctionnalité | Action de l'utilisateur | Résultat attendu | Résultat obtenu | Test réussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Affichage avec événement | Naviguer vers "Événement" (événement associé) | Statut de synchronisation affiché, nombre de points à synchroniser, boutons "Envoyer" et "Dissocier" visibles | | |
| Synchronisation points | Appuyer sur "Envoyer les points" (serveur accessible) | Indicateur de chargement, message de succès, compteur passe à 0 | | |
| Sync erreur réseau | Appuyer sur "Envoyer les points" (serveur hors ligne) | Message d'erreur affiché, les points restent en local (non perdus) | | |
| Rescanner même événement | Scanner le même QR Code | Les données sont rafraîchies, pas de message d'erreur | | |
| Scanner autre événement | Scanner un QR Code pour un autre événement | Modal d'erreur "Ce QR Code correspond à un événement différent", l'événement actuel reste associé | | |
| Dissociation | Appuyer sur "Dissocier", confirmer | Modal de confirmation, données locales effacées, retour à l'accueil avec scanner QR | | |

---

### E. Onglet Planning (Actions Équipe)

**Prérequis** : Avoir scanné un QR Code type "Evénement" (sans scan "Planning") et avoir récupéré l'événement souhaité.

| Fonctionnalité | Action de l'utilisateur | Résultat attendu | Résultat obtenu | Test réussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Affichage sans équipe | Naviguer vers "Planning" | Message invitant à scanner un QR "Planning", bouton "Aller à la synchronisation" visible | | |

---


**Prérequis** : Avoir scanné un QR Code type "Planning" et avoir récupéré l'événement et le planning de l'équipe souhaitée.

| Fonctionnalité | Action de l'utilisateur | Résultat attendu | Résultat obtenu | Test réussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Liste des actions | Naviguer vers "Planning" (équipe associée) | Liste des actions affichée ("Poser cet équipement"/"Retirer cet équipement"), nom équipement visible, icône verte/rouge | | |
| Navigation vers équipement | Appuyer sur une action de la liste | Redirection vers Carte, carte centrée sur l'équipement, modal d'actions s'ouvre | | |
| Marquer "Poser cet équipement" | Appuyer sur la checkbox d'une action "Poser cet équipement" | Action marquée comme effectuée (checkée), planning mis à jour et synchronisé | | |
| Marquer "Retirer cet équipement" | Appuyer sur la checkbox d'une action "Retirer cet équipement" | Action marquée comme effectuée, planning mis à jour et synchronisé | | |
| Décocher action | Appuyer sur checkbox d'une action déjà effectuée | L'action revient à l'état "non effectué", statut équipement restauré | | |

---

### F. Cas Limites et Robustesse

| Fonctionnalité | Action de l'utilisateur | Résultat attendu | Résultat obtenu | Test réussi |
|----------------|------------------------|------------------|-----------------|-------------|
| Perte connexion sync | Couper le réseau pendant une synchronisation | Message d'erreur approprié, données locales non corrompues | | |
| Permission caméra refusée | Tenter d'ouvrir le scanner QR (permission non accordée) | Message demandant d'accorder la permission OU Afficher une erreur | | |
| Permission localisation refusée | Appuyer sur "Centrer sur ma position" (permission non accordée) | Message indiquant que la localisation est désactivée, carte reste fonctionnelle | | |
| Arrière-plan et reprise | Mettre l'app en arrière-plan, attendre, revenir | Les données sont toujours présentes, aucune perte d'état | | |
| Rotation écran | Faire pivoter l'appareil (portrait/paysage) | L'interface ne doit pas être pivotée | | |
