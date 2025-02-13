


-- Table des Jeux
CREATE TABLE GAME (
    id_game SERIAL PRIMARY KEY,
    id_igdb INT NULL,
    description TEXT NULL,
    category_game VARCHAR(50) NOT NULL,
    genre VARCHAR(50) NOT NULL
);

-- Table des Challenges
CREATE TABLE CHALLENGE (
    id_challenge SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    rules TEXT NOT NULL,
    category_challenge VARCHAR(50) NOT NULL,
    video_url TEXT NULL,
    comment TEXT NULL,
    id_game INT NOT NULL REFERENCES GAME(id_game),
    id_account INT NOT NULL REFERENCES ACCOUNT(id_account)
);

-- Table des Comptes Utilisateurs
CREATE TABLE ACCOUNT (
    id_account SERIAL PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    id_rank INT NOT NULL REFERENCES RANKING(id_rank)
);

-- Table des Votes
CREATE TABLE VOTE (
    id_account INT NOT NULL REFERENCES ACCOUNT(id_account),
    id_challenge INT NOT NULL REFERENCES CHALLENGE(id_challenge),
    note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
    PRIMARY KEY (id_account, id_challenge)
);

-- Table des Commentaires
CREATE TABLE COMMENT (
    id_account INT NOT NULL REFERENCES ACCOUNT(id_account),
    id_challenge INT NOT NULL REFERENCES CHALLENGE(id_challenge),
    text TEXT NOT NULL,
    PRIMARY KEY (id_account, id_challenge)
);

-- Table des Participations
CREATE TABLE PARTICIPATE (
    id_account INT NOT NULL REFERENCES ACCOUNT(id_account),
    id_challenge INT NOT NULL REFERENCES CHALLENGE(id_challenge),
    PRIMARY KEY (id_account, id_challenge)
);

-- Table des Récompenses
CREATE TABLE RECEIVE (
    id_account INT NOT NULL REFERENCES ACCOUNT(id_account),
    id_badge INT NOT NULL REFERENCES BADGE(id_badge),
    PRIMARY KEY (id_account, id_badge)
);

-- Table des Badges
CREATE TABLE BADGE (
    id_badge SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL
);

