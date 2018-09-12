const SHOWS_ACTORS_TABLE = "SHOW_ACTORS";
const ACTORS_TABLE = "ACTORS";
const SHOWS_TABLE = "SHOWS";

export const PATCH_SHOWS_ACTORS = `REPLACE INTO ${SHOWS_ACTORS_TABLE} (show_id, actor_id) VALUES ?`;

export const GET_SHOW_ACTORS = `
    SELECT
        s.SHOW_ID,
        s.NAME AS SHOW_NAME,

        a.ACTOR_ID,
        a.NAME as ACTOR_NAME,
        a.BIRTHDAY
    FROM
        (SELECT * FROM ${SHOWS_TABLE} LIMIT ? OFFSET ?) as s

        LEFT JOIN ${SHOWS_ACTORS_TABLE} sa
            ON s.SHOW_ID = sa.SHOW_ID

        LEFT JOIN ${ACTORS_TABLE} a
            ON sa.ACTOR_ID = a.ACTOR_ID

    ORDER BY
        CONVERT(s.SHOW_ID, SIGNED INTEGER),
        a.BIRTHDAY
`;
