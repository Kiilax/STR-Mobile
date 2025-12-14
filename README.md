[![pipeline status](https://git.unistra.fr/nidhoggr-25/str-mobile/badges/prod/pipeline.svg)](https://git.unistra.fr/nidhoggr-25/str-mobile/-/commits/prod) [![coverage report](https://git.unistra.fr/nidhoggr-25/str-mobile/badges/release/coverage.svg)](https://git.unistra.fr/nidhoggr-25/str-mobile/-/commits/release)

# STR-Mobile

## Lancement de l'application

1. Les branches fonctionnelles

   - `prod` : Branche de production
   - `release` : Branche de développement

2. Installer les dépendances

   ```bash
   npm install
   ```

3. Démarrer l'application

   ```bash
   npx expo start
   # ou
   npx expo start --tunnel
   ```
4. Créer un fichier `.env` à la racine du projet avec les variables d'environnement nécessaires (voir `Notion : Variables d'environnement`).