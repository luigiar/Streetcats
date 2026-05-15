--  Pulizia 
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS cats;
DROP TABLE IF EXISTS users;

--  Creazione Tabella Utenti
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Creazione Tabella Gatti
CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'Segnalato',
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  Creazione Tabella Commenti
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cat_id INTEGER REFERENCES cats(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--  Popolamento Dati di Test 
INSERT INTO users (username, email, password_hash) 
VALUES (
    'tester', 
    'tester@streetcats.com', 
    '$2b$10$QBU3QNB0ekD.m2nDgdlwjeV6OzZd06TwucxUyJYlhLb29Ct9mS3U.'
);

--inserimento di un gatto test
INSERT INTO cats (title, description, latitude, longitude, image_url, user_id) 
VALUES (
    'Gatto Nero', 
    'Avvistato vicino ai dipartimenti. È **molto affamato**, dategli dei croccantini!', 
    40.8382,
    14.1834,
    'uploads/gatto-test.jpg',
    1
);
-- commento finto
INSERT INTO comments (content, user_id, cat_id) 
VALUES ('Vado subito a portargli dei croccantini!', 1, 1);
