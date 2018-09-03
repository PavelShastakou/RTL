interface ExecuteQueryFunction {
    (query: String, params: any, callback: Function): void;
}

interface ExecuteFunctionsFunction {
    (functions: Function[], callback: Function): void;
}



export default interface IDataStore {
    /**
     * Execute single query, wrapped in a transaction
     */
    executeQuery: ExecuteQueryFunction;

    /**
     * Execute multiple functions in parallel, wrapped in a transaction
     */
    executeParallel: ExecuteFunctionsFunction;

    /**
     * Execute multiple functions in series, wrapped in a transaction
     */
    executeSeries: ExecuteFunctionsFunction;
}

