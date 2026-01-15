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
