import IDataStore from "../../db/iDataStore";
import DataStoreProvider from "../../db/DataStoreProvider";
import Show from "../../models/show";
import { PATCH_SHOWS_ACTORS, GET_SHOW_ACTORS } from './queries';


class ShowsActorsRepository {
    dataStore: IDataStore;

    constructor(dataStore: IDataStore) {
        this.dataStore = dataStore;
    }


}

export default new ShowsActorsRepository(DataStoreProvider.getDataStore())
