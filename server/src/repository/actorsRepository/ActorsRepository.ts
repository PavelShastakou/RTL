import IDataStore from "../../db/iDataStore";
import DataStoreProvider from "../../db/DataStoreProvider";
import Actor from "../../models/actor";
import { SAVE_ACTOR, GET_ACTOR, PATCH_ACTORS } from './queries';


class ActorsRepository {
    dataStore: IDataStore;

    constructor(dataStore: IDataStore) {
        this.dataStore = dataStore;
    }

    saveActor(actor: Actor, done: Function) {
        this.dataStore.executeQuery(SAVE_ACTOR, [actor], done)
    }

    patchActors(actors: Actor[], done: Function) {
        const bulkActors = actors.map(actor => {
            return [actor.actor_id, actor.name, actor.birthday];
        })
        this.dataStore.executeQuery(PATCH_ACTORS, [bulkActors], done)
    }

    getActor(actorId: String, done: Function) {
        this.dataStore.executeQuery(GET_ACTOR, [actorId], done)
    }

}

export default new ActorsRepository(DataStoreProvider.getDataStore())
