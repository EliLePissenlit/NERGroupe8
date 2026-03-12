# taskmanagement

## Installation et lancement
### Backend
- Prérequis (Node, npm…)
- Commandes :
  - `cd backend`
  - `npm install`
  - `npm run dev`

### Frontend
- Commandes :
  - `cd frontend`
  - `npm install`
  - `npm start`

### Login
username : admin@test.com 
password : password

# Init

Nous avons commencé par créer le dépôt GitHub du projet, puis mis en place une règle de protection sur la branche `main` afin d’imposer le passage par des pull requests.

Nous avons ensuite créé les premières branches de travail :
- `dev` : branche temporaire de développement général (qui sera ensuite supprimée au profit de branches plus explicites) ;
- `devDevops` : branche dédiée à la mise en place du pipeline CI/CD et des aspects DevOps ;
- `devTests` : branche dédiée à l’écriture et à la configuration des tests ;
- `readme` : branche réservée à la rédaction et à l’amélioration de la documentation.

Enfin, nous avons créé des issues pour suivre chaque fonctionnalité et chaque étape importante du projet (backend, frontend, tests, CI/CD, documentation, etc.).


# tests:

### Tests frontend – Login

Nous avons mis en place plusieurs tests unitaires sur le composant `Login` (frontend) à l’aide de Vitest et React Testing Library.

1. **Affichage du formulaire de connexion**  
   Ce test vérifie que le formulaire affiche correctement les champs de saisie pour l’email et le mot de passe.  
   Le composant est rendu dans un `MemoryRouter` afin de supporter `useNavigate`, puis nous contrôlons la présence des champs via `getByLabelText`.

2. **Login réussi (appel de `login` et redirection)**  
   Dans ce scénario, nous mockons la fonction `login` du contexte d’authentification pour qu’elle renvoie `{ success: true }`.  
   Le test remplit les champs avec `admin@test.com` / `password`, soumet le formulaire, puis vérifie que :
   - `login` est appelé avec les bonnes valeurs,
   - `useNavigate` est appelé avec l’URL `/dashboard`, ce qui confirme la redirection après une authentification réussie.

3. **Login échoué (affichage d’un message d’erreur)**  
   Nous testons également le cas où `login` renvoie `{ success: false, error: "Identifiants invalides" }`.  
   Le test soumet le formulaire et vérifie que le message d’erreur correspondant est bien affiché à l’écran.

### Problèmes rencontrés lors des tests Login

- **Problème `useNavigate()`**  
  Au début, les tests échouaient avec l’erreur :  
  `useNavigate() may be used only in the context of a <Router> component.`  
  Le composant `Login` utilise `useNavigate` de React Router, qui nécessite d’être rendu à l’intérieur d’un composant Router.  
  **Solution** : nous avons modifié les tests pour rendre `Login` à l’intérieur d’un `MemoryRouter` et mocker `useNavigate` lorsque nécessaire.

- **Recherche par placeholder au lieu de label**  
  Le premier test utilisait `getByPlaceholderText(/email/i)`, alors que les champs du formulaire ne possèdent pas d’attribut `placeholder` mais des labels (`<label htmlFor="email">Email</label>`).  
  **Solution** : nous avons remplacé ces sélecteurs par `getByLabelText`, ce qui correspond mieux à la structure réelle du formulaire.

---

### Tests backend – API Tasks et Users

Côté backend, nous avons utilisé **Jest** et **Supertest** pour tester l’API Express.

1. **Tests sur `/api/tasks`**
   - **GET `/api/tasks` sans token → 401**  
     Vérifie que la route des tâches est protégée par le middleware d’authentification et qu’un appel sans token renvoie bien un statut `401`.
   - **GET `/api/tasks` avec token → 200 + liste**  
     À l’aide d’un helper de connexion (`loginAsAdmin`), nous récupérons un token en appelant `/api/auth/login` avec `admin@test.com` / `password`, puis appelons `/api/tasks` avec le header `Authorization: Bearer <token>`.  
     Le test vérifie que le statut est `200` et que la réponse est un tableau de tâches.
   - **POST `/api/tasks` sans titre → 400**  
     Vérifie la validation backend : lorsqu’on envoie une tâche sans champ `title`, l’API renvoie un statut `400` avec le message d’erreur `Le titre est requis`.
   - **PUT `/api/tasks/:id` inexistant → 404**  
     Teste la mise à jour d’une tâche qui n’existe pas. Le backend doit répondre avec `404` et le message `Tâche non trouvée`.
   - **DELETE `/api/tasks/:id` inexistant → 404**  
     Même logique pour la suppression : suppression d’un id inexistant doit renvoyer `404` et `Tâche non trouvée`.

2. **Tests sur `/api/users`**
   - **GET `/api/users` avec token → 200 + utilisateurs sans mot de passe**  
     À partir d’un token admin, nous appelons `/api/users` et vérifions que :
     - le statut est `200`,
     - la réponse est un tableau,
     - les objets utilisateurs ne contiennent pas le champ `password` (le backend filtre les mots de passe avant de renvoyer les données).

### Problèmes rencontrés lors des tests backend

- **“Your test suite must contain at least one test”**  
  Au tout début, notre fichier de test backend ne contenait encore aucun `it(...)`, ce qui provoquait cette erreur Jest.  
  **Solution** : ajouter au moins un test (même simple) dans le fichier pour que Jest puisse exécuter la suite.

### Problèmes rencontrés lors des tests backend

- **“Your test suite must contain at least one test”**  
  Au départ, notre fichier de tests backend était créé mais ne contenait encore aucun `it(...)`, ce qui provoquait cette erreur Jest.  
  **Solution** : ajouter au moins un test (même simple) dans le fichier afin que Jest puisse exécuter la suite.

- **“Cannot find module './helpers' from 'backend/__test__/tasks.test.js'”**  
  Nous avions modifié nos tests pour factoriser la logique de connexion dans un module `helpers`, mais ce fichier n’existait pas encore. Le fichier de test essayait donc de faire `require("./helpers")` vers un module introuvable.  
  **Solution** : création de `backend/__test__/helpers.js` exportant `app` (l’instance Express) et la fonction `loginAsAdmin`, désormais utilisée par tous les tests backend.

### Tests E2E avec Selenium

Nous avons mis en place un test E2E avec Selenium dans `tests/e2e/selenium/login.e2e.js`.  
Ce test ouvre un navigateur Chrome, se rend sur `http://localhost:3000`, remplit le formulaire de connexion avec `admin@test.com` / `password`, clique sur **“Se connecter”** et vérifie que la redirection vers le tableau de bord fonctionne.

Pour exécuter ce test :

1. Lancer le backend :  
   `cd backend && npm run dev`
2. Lancer le frontend :  
   `cd frontend && npm start`
3. Lancer le test Selenium :  
   `cd tests/e2e/selenium && npm run e2e:login`

Ce scénario valide de bout en bout l’enchaînement frontend + backend (authentification et navigation jusqu’au dashboard).

## Partie DevOps (Rayane Belkassi)

Dans ce projet, je me suis occupé de la partie DevOps.
Mon objectif était de mettre en place un pipeline CI afin d’automatiser certaines vérifications du projet.

J’ai configuré un workflow GitHub Actions situé dans le dossier `.github/workflows/ci.yml`.
Ce pipeline se déclenche automatiquement lorsqu’il y a un **push** ou une **Pull Request** vers la branche `main`.

Le pipeline effectue plusieurs étapes :

* installation des dépendances du **backend** et du **frontend**
* vérification du code avec **ESLint**
* exécution des tests si des tests sont présents

J’ai également configuré **ESLint** pour le backend et le frontend afin de détecter les erreurs de code ou les problèmes de syntaxe.

### Problèmes rencontrés

Pendant la mise en place, plusieurs difficultés sont apparues :

* conflits de dépendances lors de l’installation d’ESLint sur le frontend
* certaines erreurs détectées par ESLint dans le code (variables inutilisées, règles React, indentation)
* ajustements nécessaires dans le fichier `ci.yml` pour gérer correctement les dossiers `backend` et `frontend`

Actuellement, le pipeline fonctionne correctement et se lance automatiquement.
Certaines exécutions apparaissent encore en échec car les **tests ne sont pas encore complètement implémentés** par la partie Tests du projet.

- **“Cannot find module './helpers' from 'backend/__test__/tasks.test.js'”**  
  Nous avions ajouté des appels à `require("./helpers")` dans nos tests pour centraliser la logique de connexion (fonction `loginAsAdmin`), mais le fichier `helpers.js` n’existait pas encore dans `backend/__test__/`.  

  **Solution** : créer un fichier `backend/__test__/helpers.js` qui exporte `app` (le serveur Express) et la fonction `loginAsAdmin` utilisée par tous les tests backend.

