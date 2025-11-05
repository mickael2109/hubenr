# HubENR CRM 

Ce projet est une application mini-CRM développée dans le cadre du test technique, permettant de gérer les Leads, les Devis (Quotes), les Installations et le Reporting.

## Environnement Technique

*   **Front-end:** (React + TypeScript)
*   **Back-end:** Node.js (Express + TypeScript)
*   **Base de données:** PostgreSQL
*   **Conteneurisation:** Docker / Docker Compose

## 1. Démarrage de l'Application

L'application est conteneurisée à l'aide de Docker Compose pour garantir un environnement de développement cohérent et facile à lancer.

### Prérequis

*   Docker
*   Docker Compose

### Lancement

1.  **Cloner le dépôt (si applicable):**
    ```bash
    git clone https://github.com/mickael2109/hubenr.git
    ```

2.  **Lancer les conteneurs :**
    Exécutez la commande suivante à la racine du projet où se trouve le fichier `docker-compose.yml` :
    ```bash
    docker-compose up --build
    ```
    Cette commande va :
    *   Construire les images `backend` et `frontend`.
    *   Démarrer trois services : `postgres_db`, `hubenr_backend`, et `hubenr_frontend`.
    *   Le backend effectuera automatiquement les migrations de base de données (si configuré).

### Accès aux services

| Service | URL / Port |
| :--- | :--- |
| **Front-end** (Application CRM) | `http://localhost:3000` |
| **Back-end API** | `http://localhost:5000/api` |
| **Base de données** (PostgreSQL) | Port `5432` (accessible depuis l'hôte) |

## 2. Accès à la Documentation API (Swagger)

La spécification de l'API est fournie dans le fichier `swagger.json` à la racine du projet.

## 3. Scripts de Seed (Données de Démarrage)

Si des données initiales (utilisateurs, leads de test) sont nécessaires, elles sont injectées via le script de seed.

*   **Utilisateur de connexion par défaut :**
    *   Email: `mik.doe@example.com`
    *   Mot de passe: `Mickael0@`
    *(Basé sur votre fichier `user.rest`)*

## 4. Arrêt de l'Application

Pour arrêter les conteneurs :

```bash
docker-compose down
