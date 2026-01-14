# Plan de Test

Ce document recense les tests existants et justifie la stratégie de test actuelle, en soulignant les défis liés au test du reste de l'application.

## 1. Tests Existants

Les tests actuels se concentrent sur les **fonctions utilitaires** et les **modules isolés**. Ces parties du code sont "pures" ou ont des dépendances facilement mockables, ce qui garantit des tests fiables et rapides.

### Utilitaires et Logique Métier

| Fichier                         | Description                                                                   | Couverture | Justification                                                                                 |
| :------------------------------ | :---------------------------------------------------------------------------- | :--------- | :-------------------------------------------------------------------------------------------- |
| `addressConverter-test.ts`    | Conversion et formatage des adresses.                                         | Unit       | Fonction pure sans état, critique pour l'affichage correct des adresses.                     |
| `eventBounds-test.ts`         | Calcul des limites géographiques (bounds) pour la carte.                     | Unit       | Logique mathématique complexe indispensable pour le centrage automatique de la carte.        |
| `rectangleCalculator-test.ts` | Calcul géométrique des rectangles de véhicules à partir des coordonnées. | Unit       | Géométrie critique pour le rendu visuel des véhicules; sujet aux erreurs de calcul manuel. |

### Infrastructure et Stockage

| Fichier                    | Description                                                                                              | Couverture         | Justification                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `asyncStore-test.ts`     | Wrapper autour de `AsyncStorage`. Vérifie la persistance, la lecture et la gestion des erreurs.       | Unit / Integration | Brique infrastructurelle de base; garantit que la persistance des données fonctionne correctement.                                    |
| `imageStorage-test.ts`   | Logique de sauvegarde et récupération des images locales.                                              | Unit               | Gestion critique des fichiers hors-ligne; permet de valider la logique de nommage et d'écrasement sans manipuler de vrais fichiers.   |
| `fileDownloader-test.ts` | Logique de téléchargement de fichiers.                                                                 | Unit               | Assure que la logique de téléchargement gère bien les erreurs et les chemins d'accès.                                              |
| `proxyApi-test.ts`       | Client API. Vérifie la construction des requêtes et la gestion des réponses HTTP (200, 404, erreurs). | Unit               | Point d'entrée unique de l'API; permet de simuler tous les codes d'erreur HTTP (400, 404, 500) difficiles à reproduire manuellement. |

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
