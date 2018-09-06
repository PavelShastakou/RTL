import IDataStore from "../../db/iDataStore";
import DataStoreProvider from "../../db/DataStoreProvider";
import Show from "../../entities/Show";
import { SAVE_SHOW, GET_SHOW, PATCH_SHOWS } from "./queries";

class ShowsRepository {
    dataStore: IDataStore;

    constructor(dataStore: IDataStore) {
        this.dataStore = dataStore;
    }

    saveShow(show: Show, done: Function) {
        this.dataStore.executeQuery(SAVE_SHOW, [show], done);
    }

    patchShows(shows: Show[], done: Function) {
        const bulkShows = shows.map(show => {
            return [show.show_id, show.name];
        });
        this.dataStore.executeQuery(PATCH_SHOWS, [bulkShows], done);
    }

    getShow(showId: String, done: Function) {
        this.dataStore.executeQuery(GET_SHOW, [showId], done);
    }
}

export default new ShowsRepository(DataStoreProvider.getDataStore());
