-- categories
INSERT INTO "categories" ("name") VALUES
                                      ('Science (Physics)'),       -- Assuming ID 1
                                      ('Self Development'),        -- Assuming ID 2
                                      ('Psychology'),              -- Assuming ID 3
                                      ('Fiction - Science Fiction'), -- Assuming ID 4
                                      ('Fiction - Fantasy'),       -- Assuming ID 5
                                      ('Computer Science'),        -- Assuming ID 6
                                      ('Mathematics'),             -- Assuming ID 7
                                      ('Electrical Engineering'),  -- Assuming ID 8
                                      ('History'),                 -- Assuming ID 9
                                      ('Business & Economics')
                                            ('Philosophy'),               -- ID 11
                                        ('Science (Biology)'),        -- ID 12
                                        ('Fiction - Classic Literature');

-- author
INSERT INTO "authors" ("name") VALUES
                                   ('Stephen Hawking'),         -- Assuming ID 1
                                   ('James Clear'),             -- Assuming ID 2
                                   ('Daniel Kahneman'),         -- Assuming ID 3
                                   ('Frank Herbert'),           -- Assuming ID 4
                                   ('J.K. Rowling'),            -- Assuming ID 5
                                   ('Robert C. Martin'),        -- Assuming ID 6
                                   ('James Stewart'),           -- Assuming ID 7
                                   ('Charles K. Alexander'),    -- Assuming ID 8
                                   ('Yuval Noah Harari'),       -- Assuming ID 9
                                   ('Charles Duhigg'),
                                ('Adam Smith'),               -- ID 11
                                ('Marcus Aurelius'),          -- ID 12
                                ('Charles Darwin'),           -- ID 13
                                ('Dale Carnegie'),            -- ID 14
                                ('George Orwell'),            -- ID 15
                                ('Thomas H. Cormen'),         -- ID 16
                                ('Howard Zinn'),              -- ID 17
                                ('Angela Duckworth')         -- ID 18
                                ('David Halliday'),           -- ID 19
                                ('Alan V. Oppenheim'),        -- ID 20
                                ('Ippho Santosa'),            -- ID 21
                                ('Robert Cialdini'),          -- ID 22
                                ('Aldous Huxley'),            -- ID 23
                                ('Gilbert Strang'),           -- ID 24
                                ('Carl Sagan'),               -- ID 25
                                ('Pramoedya Ananta Toer'),    -- ID 26
                                ('Stuart Russell'),           -- ID 27
                                ('Eric Ries');

-- book
INSERT INTO "books" ("isbn", "title", "description", "year", "authorId", "cover", "is_available", "pages", "language", "categoryId") VALUES
                                                                                                                                         ('9780553380163', 'A Brief History of Time', 'A landmark volume in science writing by one of the great minds of our time, offering a simplified overview of cosmology.', 1988, 1, 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg', true, 256, 'English', 1),
                                                                                                                                         ('9780735211292', 'Atomic Habits', 'An easy & proven way to build good habits & break bad ones, offering a framework for improving every day.', 2018, 2, 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg', true, 320, 'English', 2),
                                                                                                                                         ('9780374533333', 'Thinking, Fast and Slow', 'A fascinating exploration of the two systems that drive the way we think, by a Nobel laureate in economics.', 2011, 3, 'https://covers.openlibrary.org/b/isbn/9780374533333-L.jpg', true, 499, 'English', 3),
                                                                                                                                         ('9780441172719', 'Dune', 'The story of Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange.', 1965, 4, 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg', true, 412, 'English', 4),
                                                                                                                                         ('9780590353427', 'Harry Potter and the Sorcerer''s Stone', 'The first novel in the Harry Potter series, introducing the young wizard Harry Potter and his adventures at Hogwarts School of Witchcraft and Wizardry.', 1997, 5, 'https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg', true, 309, 'English', 5),
                                                                                                                                         ('9780132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'A book that instills the values of a software craftsman and makes you a better programmer—but only if you work at it.', 2008, 6, 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', true, 464, 'English', 6),
                                                                                                                                         ('9781285741550', 'Calculus: Early Transcendentals', 'A comprehensive calculus textbook known for its mathematical precision and accuracy, clarity of exposition, and outstanding examples and problem sets.', 2015, 7, 'https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg', true, 1344, 'English', 7),
                                                                                                                                         ('9780078028229', 'Fundamentals of Electric Circuits', 'A foundational text for electrical engineering students, focusing on the principles of electric circuits.', 2012, 8, 'https://covers.openlibrary.org/b/isbn/9780078028229-L.jpg', true, 976, 'English', 8),
                                                                                                                                         ('9780061122415', 'Sapiens: A Brief History of Humankind', 'A critically acclaimed book that explores the history of Homo sapiens from the Stone Age up to the present day.', 2011, 9, 'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg', true, 464, 'English', 9),
                                                                                                                                         ('9781591846286', 'The Power of Habit: Why We Do What We Do in Life and Business', 'An exploration of the science of habit formation in our lives, companies, and societies.', 2012, 10, 'https://covers.openlibrary.org/b/isbn/9781591846286-L.jpg', true, 400, 'English', 10),
('9780134494166', 'Clean Architecture: A Craftsman''s Guide to Software Structure and Design', 'Practical advice for building software systems that are easy to understand, maintain, and evolve.', 2017, 6, 'https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg', true, 432, 'English', 6),
('9780439064873', 'Harry Potter and the Chamber of Secrets', 'The second novel in the Harry Potter series, where Harry returns to Hogwarts for his second year.', 1999, 5, 'https://covers.openlibrary.org/b/isbn/9780439064873-L.jpg', true, 341, 'English', 5),
('9780140432082', 'The Wealth of Nations', 'A foundational work in classical economics, exploring the principles of political economy.', 1776, 11, 'https://covers.openlibrary.org/b/isbn/9780140432082-L.jpg', true, 1264, 'English', 10),
('9780140449334', 'Meditations', 'A series of personal writings by the Roman Emperor Marcus Aurelius, recording his private notes to himself and ideas on Stoic philosophy.', 2006, 12, 'https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg', true, 304, 'English', 11),
('9780451529060', 'On the Origin of Species', 'A seminal work in scientific literature and a foundation of evolutionary biology.', 1859, 13, 'https://covers.openlibrary.org/b/isbn/9780451529060-L.jpg', true, 560, 'English', 12),
('9780671027032', 'How to Win Friends & Influence People', 'A classic self-help book on interpersonal skills and success.', 1936, 14, 'https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg', true, 288, 'English', 2),
('9780451524935', 'Nineteen Eighty-Four', 'A dystopian novel set in Airstrip One, a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation.', 1949, 15, 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', true, 328, 'English', 13),
('9780262033848', 'Introduction to Algorithms', 'A comprehensive and rigorous introduction to the modern study of algorithms. Often referred to as CLRS.', 2009, 16, 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg', true, 1292, 'English', 6),
('9780062397348', 'A People''s History of the United States', 'A historical account of the United States from the perspective of common people rather than political and economic elites.', 1980, 17, 'https://covers.openlibrary.org/b/isbn/9780062397348-L.jpg', true, 768, 'English', 9),
('9781501111105', 'Grit: The Power of Passion and Perseverance', 'A book about the importance of passion and perseverance for achieving long-term goals.', 2016, 18, 'https://covers.openlibrary.org/b/isbn/9781501111105-L.jpg', true, 352, 'English', 3),

('9780471320005', 'Fundamentals of Physics', 'A classic textbook for university-level physics courses, covering mechanics, waves, thermodynamics, electromagnetism, optics, and modern physics.', 2000, 19, 'https://covers.openlibrary.org/b/isbn/9780471320005-L.jpg', true, 1100, 'English', 1),
('9780138147570', 'Signals and Systems', 'A foundational textbook on signals and systems analysis for electrical engineering students.', 1996, 20, 'https://covers.openlibrary.org/b/isbn/9780138147570-L.jpg', true, 957, 'English', 8),
('9786020324712', '7 Keajaiban Rezeki', 'Buku motivasi tentang bagaimana meraih kesuksesan finansial dan spiritual berdasarkan prinsip-prinsip tertentu.', 2016, 21, 'https://covers.openlibrary.org/b/isbn/9786020324712-L.jpg', true, 260, 'Indonesia', 2),
('9780061241895', 'Influence: The Psychology of Persuasion', 'Explores the psychology of why people say "yes"—and how to apply these understandings.', 2006, 22, 'https://covers.openlibrary.org/b/isbn/9780061241895-L.jpg', true, 320, 'English', 3),
('9780060850524', 'Brave New World', 'A dystopian novel that explores a futuristic World State of genetically modified citizens and an intelligence-based social hierarchy.', 1932, 23, 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg', true, 311, 'English', 4),
('9780980232776', 'Introduction to Linear Algebra', 'A widely used textbook for introductory linear algebra courses, known for its clear explanations and practical examples.', 2016, 24, 'https://covers.openlibrary.org/b/isbn/9780980232776-L.jpg', true, 574, 'English', 7),
('9780345539434', 'Cosmos', 'Based on the acclaimed television series, this book explores the vastness of space, the origins of life, and humanity''s place in the universe.', 1980, 25, 'https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg', true, 384, 'English', 1),
('9789799731234', 'Bumi Manusia', 'Novel pertama dari tetralogi Buru yang mengisahkan perjalanan Minke, seorang priyayi Jawa di awal abad ke-20.', 1980, 26, 'https://covers.openlibrary.org/b/isbn/9789799731234-L.jpg', true, 535, 'Indonesia', 13),
('9780134610993', 'Artificial Intelligence: A Modern Approach', 'A comprehensive, up-to-date introduction to the theory and practice of artificial intelligence.', 2020, 27, 'https://covers.openlibrary.org/b/isbn/9780134610993-L.jpg', true, 1136, 'English', 6),
('9780307887894', 'The Lean Startup', 'How Today''s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses.', 2011, 28, 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg', true, 336, 'English', 10);