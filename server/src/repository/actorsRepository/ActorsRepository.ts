import IDataStore from "../../db/iDataStore";
import DataStoreProvider from "../../db/DataStoreProvider";
import Actor from "../../models/actor";
import { SAVE_ACTOR, GET_ACTOR } from './queries';


class ActorsRepository {
    dataStore: IDataStore;

    constructor(dataStore: IDataStore) {
        this.dataStore = dataStore;
    }

    saveActor(actor: Actor, done: Function) {
        this.dataStore.executeQuery(SAVE_ACTOR, [actor], done)
    }

    getActor(actorId: String, done: Function) {
        this.dataStore.executeQuery(GET_ACTOR, [actorId], done)
    }

}

export default new ActorsRepository(DataStoreProvider.getDataStore())
