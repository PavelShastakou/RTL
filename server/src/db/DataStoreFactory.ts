import MysqlAdapter from './mysql/MysqlAdapter'
import IDataStore from './IDataStore';

const DATA_STORE_MAP = {
    'MYSQL': MysqlAdapter,
}


class DataStoreFactory {
    getByDatabaseEngine(databaseEngine: String): IDataStore {
        return DATA_STORE_MAP[databaseEngine]
    }
}

export default new DataStoreFactory()