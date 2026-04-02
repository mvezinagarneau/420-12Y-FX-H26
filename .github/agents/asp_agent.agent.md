---
name: asp_agent
description: Describe what this custom agent does and when to use it.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

Ton role est de concevoir, développer et structurer une application web complète avec :

• Votre application doit utiliser un Backend Node.js avec Express.
• Votre Frontend doit utiliser Vue.js (version 3) avec l’API Composition.
• Votre Frontend et votre Backend doivent être dans deux projets différents (deux dossiers différents) et communiquer via des requêtes HTTP (utilisez le modèle REST).
• Vous devez obligatoirement utiliser Bootstrap 5 (version Sass) pour le style de votre application. Vos propres styles devront aussi utiliser Sass.
• Votre application doit utiliser une base de données SQL avec le moteur MySQL
• Votre Backend doit utiliser l’ORM Sequelize pour communiquer avec votre base de données.

Tu dois repespecter les fonctionnalités énoncé dans le cahier de charge nommé 420-12Y-FX-H26.txt que je t’ai fourni.

Pour le bakend :

Structure de l’application :

/backend
├── models/
├── routes/
├── controllers/
├── middlewares/
├── config/
└── app.js

Création de l’API REST

- Routes REST standards :
- GET /resources
- GET /resources/:id
- POST /resources
- PUT /resources/:id
- DELETE /resources/:id

Format de la réponse de type succès :

{
"status": 200,
"message": "Requête traitée avec succès.",
"data": {
"id": "12345",
"nom": "John Doe",
"courriel": "johndoe@exemple.com"
},
"path": "/users/12345",
"timestamp": "2024-03-04T12:34:56.789Z"
}

Format de la réponse de type erreur :

{
"status": 404,
"error": "Not Found",
"message": "L'utilisateur avec l'ID 12345 n'existe pas.",
"path": "/users/12345",
"timestamp": "2024-03-04T12:50:30.987Z"
}

- la validation des données doit se faire à l’aide de la bibliothèque Joi. Les erreurs de validation doivent être gérées et renvoyer une réponse d’erreur appropriée.

- La validation doit être faite utilsant un middleware de validation qui vérifie les données d’entrée avant de les traiter dans les routes. Il doit également y avoir une validation des les modèles Sequelize pour s’assurer que les données respectent les contraintes de la base de données.

- la gestion des erreurs doit être centralisée à l’aide d’un middleware de gestion des erreurs. Toutes les erreurs doivent être capturées et renvoyer une réponse d’erreur appropriée.

- la sécurité de l’API doit être assurée en utilisant des pratiques telles que la validation des entrées, la gestion des erreurs.

- Les bon code d'erreurs doivent être utilisés pour les différentes situations d'erreur :
  400 Bad Request : pour les erreurs de champs manquants des données d’entrée.
  422 Unprocessable Entity : pour les erreurs de validation des données d’entrée.
  401 Unauthorized : pour les demandes nécessitant une authentification.  
  403 Forbidden : pour les demandes où l’utilisateur n’a pas les permissions nécessaires.
  404 Not Found : pour les demandes de ressources qui n’existent pas.
  500 Internal Server Error : pour les erreurs inattendues du serveur.

- L'authentification doit être gérée à l’aide de JSON Web Tokens (JWT). Un middleware d’authentification doit être mis en place pour protéger les routes qui nécessitent une authentification. Les utilisateurs doivent pouvoir s’inscrire et se connecter pour obtenir un token JWT.

- Écrire les tests Postman pour toutes les routes de l’API afin de s’assurer qu’elles fonctionnent correctement et gèrent les erreurs de manière appropriée. Les tests doivent couvrir les cas de succès et les différents types d’erreurs.

Pour le frontend :

Structure de l’application

/frontend
├── components/
├── views/
├── services/
├── store/ (Pinia)
└── router/

- Le frontend doit être structuré en composants Vue.js réutilisables. Les vues doivent être organisées dans un dossier séparé.

- La communication avec le backend doit se faire à l’aide de services qui utilisent Axios pour effectuer des requêtes HTTP. Les services doivent être organisés dans un dossier séparé.

- La gestion de l’état global de l’application doit être assurée à l’aide de Pinia. Les magasins Pinia doivent être organisés dans un dossier séparé.

- Le routage doit être géré à l’aide de Vue Router. Les routes doivent être organisées dans un dossier séparé.

- Le style de l’application doit être assuré à l’aide de Bootstrap 5 (version Sass). Les styles personnalisés doivent également être écrits en Sass et organisés dans un dossier séparé.

- L’interface utilisateur doit être responsive et accessible. Utilisez les classes de Bootstrap pour assurer la responsivité et suivez les meilleures pratiques d’accessibilité.

- Les formulaires doivent être validés à l’aide de la bibliothèque Vuelidate. Les erreurs de validation doivent être affichées de manière claire et informative pour l’utilisateur.

- La sécurité du frontend doit être assurée en suivant les meilleures pratiques de développement web, telles que la validation des entrées, la gestion des erreurs et la protection contre les attaques XSS et CSRF.

Git :

- Utilisez Git pour le contrôle de version de votre projet. Commitez régulièrement avec des messages de commit clairs et descriptifs. Utilise la convention de nommage de commit suivante : [type] : description du changement. Par exemple : [feat] : ajout de la fonctionnalité d’authentification.
- Types de commit :
  - feat : pour les nouvelles fonctionnalités
  - fix : pour les corrections de bugs
  - docs : pour les modifications de documentation
  - style : pour les changements de style (formatage, espaces, etc.)
  - refactor : pour les changements de code qui n’ajoutent pas de fonctionnalité ni ne corrigent de bug
  - test : pour les ajouts ou modifications de tests
  - chore : pour les tâches de maintenance et les changements qui n’affectent pas le code source (par exemple, la configuration, les scripts, etc.)

- Utlise GitHub Flow pour gérer le développement de votre projet. Créez des branches pour les nouvelles fonctionnalités, les corrections de bugs et les améliorations.

- Demande moi toujours avant de faire un commit pour que je puisse valider le message de commit et m’assurer qu’il respecte la convention de nommage. Indique moi ce que tu as changé dans le code et pourquoi tu as fait ce changement.

- Ajoute les .gitignore appropriés pour éviter de commiter des fichiers sensibles ou inutiles, tels que les fichiers de configuration, les dépendances node_modules, les fichiers de build, etc.

Qualité du code :

- Suivez les meilleures pratiques de développement pour assurer la qualité du code, telles que la séparation des préoccupations, la modularité et la réutilisabilité du code.
- Utilisez des linters et des formatters pour maintenir un style de code cohérent. Par exemple, utilisez ESLint pour le JavaScript et Stylelint pour le CSS/Sass.
