-- Eliminar la base de datos si existe y crearla nuevamente
DROP DATABASE IF EXISTS db_booknest;
CREATE DATABASE db_booknest;

USE db_booknest;

-- Eliminar las tablas si existen
DROP TABLE IF EXISTS user_books;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

-- Crear las tablas
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  birth_year INT NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT false
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  publisher VARCHAR(255) NOT NULL,
  pages INT NOT NULL,
  genre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE user_books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  favourite BOOLEAN DEFAULT false NOT NULL,
  status ENUM('favourites','read', 'reading', 'to-read') NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Insertar un usuario administrador por defecto
INSERT INTO users (full_name, email, password, birth_year, username, is_admin)
VALUES
('Admin', 'admin@booknest.com', '$2b$10$ovYoWmwkLeytjyUtmMUQc.ckHfcqpkLekB7NkxlB3/v22Y3cWIlJC', 1990, 'admin', true), 
-- La contraseña del admin es 'admin12345' encriptada con bcrypt
('Camilo Alvarez', 'camiloam20@gmail.com', '$2b$10$qUixULMt7KM4G3MvWkHKAOPsdRdG25Y6hVxEwc0Du4xouOqSoidny', 2001, 'camiloam20', false);
-- La contraseña de este usuario es 'contraseña' encriptada con bcrypt

-- Insertar libros por defecto
INSERT INTO books (image, title, author, publisher, pages, genre, description) 
VALUES
('https://covers.openlibrary.org/b/id/10580435-L.jpg', 'Harry Potter and the Prisoner of Azkaban', 'J. K. Rowling', 'Arthur A. Levine Books: An Imprint of Scholastic Press', 0, 'Fantasy fiction', 'For Harry Potter, it´s the start of another far-from-ordinary year at Hogwarts when the Knight Bus crashes through the darkness and comes to an abrupt halt in front of him.\r\n\r\nIt turns out that Sirius Black, mass-murderer and follower of Lord Voldemort, has escaped – and they say he is coming after Harry.\r\n\r\nIn his first Divination class, Professor Trelawney sees an omen of death in Harry´s tea leaves.\r\n\r\nAnd perhaps most frightening of all are the Dementors patrolling the school grounds with their soul-sucking kiss – in search of fresh victims.\r\n\r\n([source][1])\r\n\r\n\r\n  [1]: https://www.jkrowling.com/book/harry-potter-prisoner-azkaban/'),
('https://covers.openlibrary.org/b/id/8392798-L.jpg', 'Harry Potter and the Chamber of Secrets', 'J. K. Rowling', 'Gallimard - Educa Books', 0, 'Fantasy fiction', 'Throughout the summer holidays after his first year at Hogwarts School of Witchcraft and Wizardry, Harry Potter has been receiving sinister warnings from a house-elf called Dobby.\r\n\r\nNow, back at school to start his second year, Harry hears unintelligible whispers echoing through the corridors.\r\n\r\nBefore long the attacks begin: students are found as if turned to stone.\r\n\r\nDobby´s predictions seem to be coming true.\r\n\r\n[Source][1]\r\n\r\n\r\n  [1]: https://www.jkrowling.com/book/harry-potter-chamber-secrets/'),
('https://covers.openlibrary.org/b/id/10464801-L.jpg', 'The Maze Runner', 'James Dashner', 'Delacroix press', 0, 'Fiction', 'When Thomas wakes up in the lift, the only thing he can remember is his first name.  His memory is blank.  But he´s not alone.  When the lift´s doors open, Thomas finds himself surrounded by kids who welcome him to the Glade--a large, open expanse surrounded by stone walls.  Just like Thomas, the Gladers don´t know why or how they got to the Glade.  All they know is that every morning the stone doors to the maze that surrounds them have opened.  Every night they´ve closed tight.  And every 30 days a new boy has been delivered in the lift.  Thomas was expected.  But the next day, a girl is sent up--the first girl to ever arrive in the Glade.  And more surprising yet is the message she delivers.  Thomas might be more important than he could ever guess.  If only he could unlock the dark secrets buried within his mind.  From the Hardcover edition.'),
('https://covers.openlibrary.org/b/id/6636110-L.jpg', 'The Scorch Trials', 'James Dashner', 'Delcorte Press', 0, 'Science fiction', 'Thomas was sure that escape from the Maze would mean freedom for him and the Gladers. But WICKED isn´t done yet. Phase Two has just begun. The Scorch. The Gladers have two weeks to cross through the Scorch—the most burned-out section of the world. And WICKED has made sure to adjust the variables and stack the odds against them. There are others now. Their survival depends on the Gladers´ destruction—and they´re determined to survive. \r\n\r\nFriendships will be tested. Loyalties will be broken. \r\n\r\nAll bets are off.'),
('https://covers.openlibrary.org/b/id/12329422-L.jpg', 'Maze Runner', 'James Dashner', 'Lectorum Publications, Inc.', 0, 'Children´s fiction', 'Sin descripción'),
('https://covers.openlibrary.org/b/id/9269962-L.jpg',	'A Game of Thrones',	'George R. R. Martin',	'Leya',	0,	'Action & Adventure',	'A Game of Thrones is the first novel in A Song of Ice and Fire, a series of fantasy novels by the American author George R. R. Martin. It was first published on August 1, 1996. The novel won the 1997 Locus Award and was nominated for both the 1997 Nebula Award and the 1997 World Fantasy Award. The novella Blood of the Dragon, comprising the Daenerys Targaryen chapters from the novel, won the 1997 Hugo Award for Best Novella. In January 2011, the novel became a New York Times Bestseller and reached No. 1 on the list in July 2011.'),
('https://covers.openlibrary.org/b/id/12820198-L.jpg', 'Die Verwandlung', 'Franz Kafka', 'Olimpos Yayinlari', 0, 'Fantasy fiction', 'Metamorphosis (German: Die Verwandlung) is a novella written by Franz Kafka which was first published in 1915. One of Kafka´s best-known works, Metamorphosis tells the story of salesman Gregor Samsa, who wakes one morning to find himself inexplicably transformed into a huge insect (German: ungeheueres Ungeziefer, lit. \"monstrous vermin\") and subsequently struggles to adjust to this new condition. The novella has been widely discussed among literary critics, with differing interpretations being offered. In popular culture and adaptations of the novella, the insect is commonly depicted as a cockroach.\r\n\r\nWith a length of about 70 printed pages over three chapters, it is the longest of the stories Kafka considered complete and published during his lifetime. The text was first published in 1915 in the October issue of the journal Die weißen Blätter under the editorship of René Schickele. The first edition in book form appeared in December 1915 in the series Der jüngste Tag, edited by Kurt Wolff.'),
('https://covers.openlibrary.org/b/id/8257991-L.jpg',	'Romeo and Juliet',	'William Shakespeare',	'E. Flammarion',	0,	'Bibliography',	'Romeo and Juliet is a tragedy written by William Shakespeare early in his career about two young Italian star-crossed lovers whose deaths ultimately reconcile their feuding families. It was among Shakespeare\´s most popular plays during his lifetime and, along with Hamlet, is one of his most frequently performed plays. Today, the title characters are regarded as archetypal young lovers.');

-- Insertar relaciones entre usuarios y libros
INSERT INTO user_books (user_id, book_id, favourite, status, rating, review) 
VALUES
(2, 1, 0, 'to-read', NULL, NULL),
(2, 2, 1, 'to-read', NULL, NULL),
(2, 3, 0, 'to-read', NULL, NULL),
(2, 4, 0, 'to-read', NULL, NULL),
(2, 5, 0, 'to-read', NULL, NULL),
(2, 6, 1, 'read', 4, 'Es un gran inicio a la saga de la exitosa serie de HBO, me encanto conocer a fondo a estos personajes.'),
(2, 7, 0, 'reading', NULL, NULL),
(2,	8,	0,'read',	5,	'Un clasico literario.');