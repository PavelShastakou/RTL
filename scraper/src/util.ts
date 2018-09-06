import http from "http";

export const STATUS_CODES = {
    TOO_MANY_REQUESTS: 429,
    NOT_FOUND: 404,
    BAD_REQUEST: 400
};

interface RequestOptions {
    hostname: string;
    port: number;
    path: string;
    method: string;
}

function makeRequest(requestOptions: RequestOptions, data, callback) {
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

function get(url, callback) {
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

async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export { get, makeRequest, wait };
