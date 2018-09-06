const SHOWS_TABLE = "SHOWS";

export const SAVE_SHOW = `INSERT INTO ${SHOWS_TABLE} set ?`;
export const GET_SHOW = `SELECT * FROM ${SHOWS_TABLE} WHERE SHOW_ID=?`;

export const PATCH_SHOWS = `REPLACE INTO ${SHOWS_TABLE} (show_id, name) VALUES ?`;
