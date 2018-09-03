import DataStoreFactory from "./DataStoreFactory";
import IDataStore from "./IDataStore";

const databaseEngine: String = process.env['DATABASE_ENGINE'];

console.log(databaseEngine)

class DataStoreProvider {
    getDataStore(): IDataStore {
        return DataStoreFactory.getByDatabaseEngine(databaseEngine);
    }
}

export default new DataStoreProvider();
