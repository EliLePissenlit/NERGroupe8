const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_for_dev';

// Middleware
app.use(cors());
app.use(express.json());

// Base de données en mémoire (pour simplifier)
let users = [
  {
    id: '1',
    email: 'admin@test.com',
    password:
      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Admin User',
  },
];

let tasks = [
  {
    id: '1',
    title: 'Tâche exemple',
    description: 'Description de la tâche exemple',
    status: 'todo',
    priority: 'medium',
    assignedTo: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Token d'accès requis" });
  }

  return jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }

    req.user = user;
    return next();
  });
};

// Routes d'authentification
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: 'Email, mot de passe et nom sont requis' });
    }

    // Vérifier si l'utilisateur existe déjà
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: 'Utilisateur déjà existant' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
    };

    users.push(user);

    // Générer le token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email et mot de passe sont requis' });
    }

    // Trouver l'utilisateur
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Identifiants invalides' });
    }

    // Générer le token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes des tâches
app.get('/api/tasks', authenticateToken, (req, res) => {
  return res.json(tasks);
});

app.get('/api/tasks/:id', authenticateToken, (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }

  return res.json(task);
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  try {
    const {
      title,
      description = '',
      priority = 'medium',
      assignedTo,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Le titre est requis' });
    }

    const task = {
      id: uuidv4(),
      title,
      description,
      status: 'todo',
      priority,
      assignedTo: assignedTo || req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(task);

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  try {
    const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    const { title, description, status, priority, assignedTo } = req.body;
    const existingTask = tasks[taskIndex];

    tasks[taskIndex] = {
      ...existingTask,
      title: title || existingTask.title,
      description:
        description !== undefined ? description : existingTask.description,
      status: status || existingTask.status,
      priority: priority || existingTask.priority,
      assignedTo: assignedTo || existingTask.assignedTo,
      updatedAt: new Date().toISOString(),
    };

    return res.json(tasks[taskIndex]);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tâche non trouvée' });
  }

  tasks.splice(taskIndex, 1);

  return res.status(204).send();
});

// Routes des utilisateurs
app.get('/api/users', authenticateToken, (req, res) => {
  const usersWithoutPasswords = users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
  }));

  return res.json(usersWithoutPasswords);
});

// Route de santé
app.get('/health', (req, res) => {
  return res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs 404
app.use((req, res) => {
  return res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;