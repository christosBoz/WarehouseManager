

CREATE TABLE IF NOT EXISTS location  (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          shelf INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS item (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      name TEXT NOT NULL,
                      description TEXT,
                      quantity INTEGER NOT NULL,
                      image_path TEXT,
                      location_id INTEGER NOT NULL,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      status TEXT NOT NULL,
                      FOREIGN KEY (location_id) REFERENCES location(id)
);


CREATE TABLE IF NOT EXISTS inventory_transaction (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     item_id INTEGER NOT NULL,
     delta INTEGER NOT NULL,
     reason TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS jobs (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,

                                    parent_job_id INTEGER,

                                    name TEXT NOT NULL,

                                    job_type TEXT NOT NULL,          -- RESIDENTIAL, COMMERCIAL, etc
                                    status TEXT NOT NULL,            -- PLANNED, ACTIVE, COMPLETED
                                    priority TEXT NOT NULL,          -- LOW, NORMAL, HIGH, URGENT

                                    description TEXT,

                                    start_date DATE,                 -- when work starts
                                    end_date DATE,                   -- when work ends

                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                    gross_pay INTEGER
);




-- ALTER TABLE jobs
-- ADD COLUMN gross_pay INT;

-- INSERT INTO location (id, shelf) VALUES
--                                      (1, 1),
--                                      (2, 2),
--                                      (3, 3),
--                                      (4, 4),
--                                      (5, 5),
--                                      (6, 6),
--                                      (7, 7),
--                                      (8, 8);