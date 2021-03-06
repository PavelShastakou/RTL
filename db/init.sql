DROP TABLE IF EXISTS SHOWS;
DROP TABLE IF EXISTS ACTORS;
DROP TABLE IF EXISTS SHOW_ACTORS;

CREATE TABLE SHOWS (
    SHOW_ID varchar(32),
    NAME varchar(255),
    PRIMARY KEY (SHOW_ID)
);

CREATE TABLE ACTORS (
    ACTOR_ID varchar(32),
    NAME varchar(255),
    BIRTHDAY date,
    PRIMARY KEY (ACTOR_ID)
);

CREATE TABLE SHOW_ACTORS (
    SHOW_ID varchar(32),
    ACTOR_ID varchar(32),
    PRIMARY KEY (SHOW_ID, ACTOR_ID)
);

