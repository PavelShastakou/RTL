import IDataStore from "../../db/iDataStore";
import DataStoreProvider from "../../db/DataStoreProvider";
import ShowActor from "../../entities/ShowActor";
import { PATCH_SHOWS_ACTORS, GET_SHOW_ACTORS } from "./queries";

const SHOWS_PER_PAGE = 10;

class ShowsActorsRepository {
    dataStore: IDataStore;

    constructor(dataStore: IDataStore) {
        this.dataStore = dataStore;
    }

    patchShowsActors(showActors: ShowActor[], done: Function) {
        const bulkShowActors = showActors.map(showActor => {
            return [showActor.show_id, showActor.actor_id];
        });
        this.dataStore.executeQuery(PATCH_SHOWS_ACTORS, [bulkShowActors], done);
    }

    getShowsActors(page: number, done: Function) {
        const limit = SHOWS_PER_PAGE;
        const offset = page * SHOWS_PER_PAGE;

        this.dataStore.executeQuery(
            GET_SHOW_ACTORS,
            [limit, offset],
            (error: any, result: any) => {
                if (error) {
                    done(error);
                } else {
                    done(null, this.reduceRows(result));
                }
            }
        );
    }

    reduceRows(rows) {
        const reducedByShow = rows.reduce((acc, row) => {
            const showId = row.SHOW_ID;
            if (!acc[showId]) {
                acc[showId] = {
                    id: row.SHOW_ID,
                    name: row.SHOW_NAME,
                    cast: []
                };
            }

            acc[showId].cast.push({
                id: row.ACTOR_ID,
                name: row.ACTOR_NAME,
                birthday: row.BIRTHDAY
            });

            return acc;
        }, {});

        return Object.values(reducedByShow);
    }
}

export default new ShowsActorsRepository(DataStoreProvider.getDataStore());
