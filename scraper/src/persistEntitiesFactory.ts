import { get, wait, makeRequest } from "./util";
import { STATUS_CODES } from "./constants";

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = +process.env.SERVER_PORT;

export function persistEntitiesFactory(path: string) {
    return async function(entities: any) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                hostname: SERVER_HOST,
                port: SERVER_PORT,
                path: path,
                method: "PATCH"
            };

            makeRequest(requestOptions, entities, (error: any, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}
