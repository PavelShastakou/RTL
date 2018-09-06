const ACTORS_TABLE = "ACTORS";

export const SAVE_ACTOR = `INSERT INTO ${ACTORS_TABLE} set ?`;
export const GET_ACTOR = `SELECT * FROM ${ACTORS_TABLE} WHERE ACTOR_ID=?`;

export const PATCH_ACTORS = `REPLACE INTO ${ACTORS_TABLE} (actor_id, name, birthday) VALUES ?`;
