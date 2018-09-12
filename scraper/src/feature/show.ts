import { persistEntitiesFactory } from "../persistEntitiesFactory";
import { get } from "../util";
import { STATUS_CODES } from "../constants";
import { RepeatableFunction, RepeatableFunctionResult } from "../util/hofs";

const getShowsByPageUrl = (page: number) => `http://api.tvmaze.com/shows?page=${page}`;

class ExternalShow {
    id: string;
    name: string;
}
class InternalShow {
    show_id: string;
    name: string;
}

function internalizeShow(show: ExternalShow): InternalShow {
    return {
        show_id: String(show.id),
        name: show.name
    };
}

const getShowsPage: RepeatableFunction = async function(page: number) {
    return new Promise<RepeatableFunctionResult>((resolve, reject) => {
        const url = getShowsByPageUrl(page);

        get(url, (error: any, result: any) => {
            if (error) {
                if (error.statusCode === STATUS_CODES.TOO_MANY_REQUESTS) {
                    resolve({
                        error: true,
                        result: null,
                    });
                }
                if (error.statusCode === STATUS_CODES.NOT_FOUND) {
                    resolve({
                        error: false,
                        result: null,
                    });
                }
                reject(error);
            } else {
                const shows = result.map(internalizeShow);

                resolve({
                    error: false,
                    result: shows,
                });
            }
        });
    });
};

const persistShows = persistEntitiesFactory("/shows");

export { getShowsPage, persistShows };
