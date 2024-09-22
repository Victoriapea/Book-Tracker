# BookTracker

BookTracker est une application full stack de gestion de bibliothèque virtuelle, permettant aux utilisateurs de suivre leurs lectures, définir des objectifs et gérer leur collection de livres.

## Fonctionnalités

### Back-end

- Système d'authentification et d'autorisation
- API RESTful
- Stockage des données dans MongoDB
- Tests unitaires

### Front-end

- Interface utilisateur responsive avec Tailwind CSS
- Gestion d'état avec Redux
- Tests unitaires et tests end-to-end avec Cypress

### Fonctionnalités principales

- **Gestion des livres** : Ajouter, modifier et supprimer des livres.
- **Objectifs de lecture** : Définir un objectif de lecture avec des dates de début et de fin.
- **Suivi des lectures** : Suivre le statut des livres (À lire, En cours, Terminé).
- **Visualisation des livres** : Afficher la liste des livres de l'utilisateur avec les détails.
- **Tableau de bord** : Afficher un aperçu des statistiques de lecture.

## Technologies utilisées

### Front-end

- React.js
- Redux
- Tailwind CSS
- Axios
- Jest et React Testing Library
- Cypress

### Back-end

- Node.js
- Express.js
- MongoDB avec Mongoose
- JWT pour l'authentification
- Bcrypt pour le chiffrement des mots de passe
- Jest pour les tests


## Installation et démarrage

### Prérequis

- Node.js
- MongoDB

### Front-end

1. Clonez le repository
2. Dans un terminal, naviguez vers le dossier du front-end :

   ```bash
   cd frontend
   ```

3. Installez les dépendances :

   ```bash
   npm install
   ```

4. Démarrez l'application React :
   ```bash
   npm run dev
   ```

### Back-end

1. Dans un nouveau terminal, naviguez vers le dossier du back-end :

   ```bash
   cd backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env` et configurez vos variables d'environnement :
   ```bash
    MONGO_URI=votre_uri_mongodb
    JWT_SECRET=votre_secret_jwt
    ```

4. Démarrez le serveur :
   ```bash
   npm run dev
   ```

## Tests

### Front-end

Pour exécuter les tests unitaires :

   ```bash
   cd frontend
   npm test
   ```

Pour ouvrir Cypress :
   ```bash
   cd frontend
   npm run test:cypress
   ```

### Back-end
   ```bash
   cd backend
   npm test
   ```


## Pipeline CI/CD
Le projet utilise GitHub Actions pour l'intégration continue. Les tests unitaires et les tests Cypress sont exécutés automatiquement à chaque push sur la branche principale.