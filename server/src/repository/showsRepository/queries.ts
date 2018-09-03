const SWOWS_TABLE = 'SHOWS';

export const SAVE_SHOW = `INSERT INTO ${SWOWS_TABLE} set ?`;
export const GET_SHOW = `SELECT * FROM ${SWOWS_TABLE} WHERE SHOW_ID=?`;

export const PATCH_SHOWS = `REPLACE INTO ${SWOWS_TABLE} (show_id, name) VALUES ?`