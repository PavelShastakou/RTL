import IDataStore from "../../db/iDataStore";
import DataStoreProvider from "../../db/DataStoreProvider";
import ShowActor from "../../models/showActor";
import { PATCH_SHOWS_ACTORS, GET_SHOW_ACTORS } from './queries';

const SHOWS_PER_PAGE = 10;


class ShowsActorsRepository {
    dataStore: IDataStore;

    constructor(dataStore: IDataStore) {
        this.dataStore = dataStore;
    }

    patchShowsActors(showActors: ShowActor[], done: Function) {
        const bulkShowActors = showActors.map(showActor => {
            return [showActor.show_id, showActor.actor_id];
        })
        this.dataStore.executeQuery(PATCH_SHOWS_ACTORS, [bulkShowActors], done)
    }

    getShowsActors(page: number, done: Function) {
        const limit = SHOWS_PER_PAGE
        const offset = (page - 1) * SHOWS_PER_PAGE

        this.dataStore.executeQuery(GET_SHOW_ACTORS, [limit, offset], done)
    }


}

export default new ShowsActorsRepository(DataStoreProvider.getDataStore())
