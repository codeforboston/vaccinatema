CREATE TABLE locations (
  id               INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name             VARCHAR
(200)  UNIQUE NOT NULL,
  bookinglink      VARCHAR
(1000) NOT NULL,
  address          VARCHAR
(1000) NOT NULL,
  serves           VARCHAR
(500),
  siteinstructions VARCHAR
(2000) NOT NULL,
  daysopen         JSONB  NOT NULL,
  county           VARCHAR
(200)  NOT NULL,
  latitude         FLOAT8 NOT NULL,
  longitude        FLOAT8 NOT NULL,
  availabilitydetails VARCHAR
(1000),
  lastupdated         TIMESTAMPTZ NOT NULL DEFAULT NOW
()
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp
()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW
();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_timestamp
BEFORE
UPDATE ON locations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp
();
