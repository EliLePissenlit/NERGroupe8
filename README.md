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

### Tests du composant de connexion (Login)

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