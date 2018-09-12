import http from "http";
import { STATUS_CODES } from "./constants";


interface RequestOptions {
    hostname: string;
    port: number;
    path: string;
    method: string;
}

function makeRequest(requestOptions: RequestOptions, data: any, callback: Function) {
    let isCallbackCalled = false;
    const stringifiedData = JSON.stringify(data);

    const options = {
        hostname: requestOptions.hostname,
        port: requestOptions.port,
        path: requestOptions.path,
        method: requestOptions.method,
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(stringifiedData)
        }
    };

    const req = http.request(options, res => {
        res.setEncoding("utf8");
        const statusCode = res.statusCode;

        let data = "";
        res.on("data", chunk => {
            data += chunk;
        });
        res.on("end", () => {
            if (!isCallbackCalled) {
                if (
                    statusCode === STATUS_CODES.NOT_FOUND ||
                    statusCode === STATUS_CODES.BAD_REQUEST ||
                    statusCode === 500
                ) {
                    callback(data);
                    isCallbackCalled = true;
                } else {
                    callback(null, data);
                    isCallbackCalled = true;
                }
            }
        });
    });

    req.on("error", e => {
        if (!isCallbackCalled) {
            callback(e);
            isCallbackCalled = true;
        }
    });

    req.write(stringifiedData);
    req.end();
}

function get(url: string, callback: Function) {
    http.get(url, res => {
        const { statusCode } = res;

        let error = statusCode !== 200;

        if (error) {
            // consume response data to free up memory
            res.resume();
            callback({ statusCode });
            return;
        }

        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
            rawData += chunk;
        });
        res.on("end", () => {
            try {
                const parsedData = JSON.parse(rawData);
                callback(null, parsedData);
            } catch (error) {
                callback(error);
            }
        });
    }).on("error", error => {
        callback(error);
    });
}

const DEFAULT_WAIT_TIMEOUT = 2000

async function wait(ms: number = DEFAULT_WAIT_TIMEOUT) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export { get, makeRequest, wait };
