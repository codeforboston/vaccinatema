-- needed extensions for geo-based querying
CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;

CREATE TABLE locations (
  id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             VARCHAR
                   (200)  UNIQUE NOT NULL,
  bookinglink      VARCHAR
                   (1000) NOT NULL,
  streetaddress          VARCHAR
                   (1000) NOT NULL,
  city          VARCHAR
                   (100) NOT NULL,
  state          VARCHAR
                   (30) NOT NULL,
  zipcode          VARCHAR
                   (30) NOT NULL,
  serves           VARCHAR
                   (500),
  siteinstructions VARCHAR
                   (2000) NOT NULL,
  daysopen         JSONB  NOT NULL,
  county           VARCHAR
                   (200)  NOT NULL,
  latitude         FLOAT8 NOT NULL,
  longitude        FLOAT8 NOT NULL,
  lastupdated         TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE location_availability (
  id                  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  location_id         INT,
  doses INT NOT NULL DEFAULT 0,
  availabilitytime TIMESTAMP,
  lastupdated         TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_location
  FOREIGN KEY
    (location_id)
  REFERENCES locations
  (id) ON DELETE CASCADE
);

-- function and trigger responsible for managing lastupdated dates for records
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.lastupdated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON location_availability
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();