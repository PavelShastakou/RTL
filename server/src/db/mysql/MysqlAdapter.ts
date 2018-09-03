import * as async from 'async';
import { pool } from './connectionPool';
import IDataStore from '../IDataStore';

class MysqlAdapter implements IDataStore {
	private performInTransaction(functionToPerform, callback) {

		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err);
				callback(err);
				return;
			}

			connection.beginTransaction(function(transactionError) {

				if (transactionError) {
					connection.rollback(function(rollbackError) {
						connection.release();
						// We'll loose transaction error in case rollback also fires error
						callback(rollbackError || transactionError);
					});
					return;
				}

				functionToPerform(connection, callback);
			});
		});
	}

	private executeFunctions(asyncMethod, functions, callback) {

		function transactionContent(connection, callback) {

			functions = functions.map((func) => func.bind(null, connection));

			async[asyncMethod](functions, function(seriesError, result) {
				if (seriesError) {
					connection.rollback(function(rollbackError) {
						connection.release();
						callback(rollbackError || seriesError);
					});
					return;
				}

				connection.commit(function(commitError) {
					if (commitError) {
						connection.rollback(function(rollbackError) {
							connection.release();
							// We'll loose commit error in case rollback also fires error
							callback(rollbackError || commitError);
						});
						return;
					}

					connection.release();
					callback(null, result);
				});
			});
		}

		this.performInTransaction(transactionContent, callback);
	}

	public executeQuery(query: String, params: any, callback: Function) {

		function transactionContent(connection, callback) {
			connection.query(query, params, (queryError, result) => {
				if (queryError) {
					connection.rollback(function (rollbackError) {
						connection.release();
						// We'll loose query error in case rollback also fires error
						callback(rollbackError || queryError);
					});
					return;
				}

				connection.commit(function (commitError) {
					if (commitError) {
						connection.rollback(function (rollbackError) {
							connection.release();
							// We'll loose commit error in case rollback also fires error
							callback(rollbackError || commitError);
						});
						return;
					}

					connection.release();
					callback(null, result);
				});
			});
		}

		this.performInTransaction(transactionContent, callback);
	}

	public executeSeries(functions, callback) {
		return this.executeFunctions('series', functions, callback)
	}

	public executeParallel(functions, callback) {
		return this.executeFunctions('parallel', functions, callback)
	}

}

export default new MysqlAdapter();
