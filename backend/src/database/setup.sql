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

-- Creazione Tabella Gatti 
CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    image_url TEXT,
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

-- inserimento di un gatto
INSERT INTO cats (name, description, lat, lng, image_url, user_id) 
VALUES (
    'Gatto Rosso', 
    'Avvistato vicino al parco. È **molto affamato**.', 
    41.9028, 
    12.4964, 
    'uploads/gatto-test.jpg',
    1
);
-- commento finto
INSERT INTO comments (content, user_id, cat_id) 
VALUES ('Vado subito a portargli dei croccantini!', 1, 1);
