import { persistEntitiesFactory } from "../persistEntitiesFactory";
import { get } from "../util";
import { STATUS_CODES } from "../constants";
import { RepeatableFunction, RepeatableFunctionResult } from '../util/hofs'

class ExternalActor {
    id: string;
    name: string;
    birthday: string;
}
class InternalActor {
    actor_id: string;
    name: string;
    birthday: string;
}

function internalizeActor(actor: ExternalActor): InternalActor {
    return {
        actor_id: String(actor.id),
        name: actor.name,
        // TODO: Make table column nullable
        birthday: actor.birthday || "1000-01-01"
    };
}

const getActors: RepeatableFunction = async function(showId: string) {
    return new Promise<RepeatableFunctionResult>((resolve, reject) => {
        const url = `http://api.tvmaze.com/shows/${showId}/cast`;

        get(url, (error: any, result: any) => {
            if (error) {
                if (error.statusCode === STATUS_CODES.TOO_MANY_REQUESTS) {
                    resolve({
                        error: true,
                        result: null,
                    });
                }
                reject(error);
            } else {
                const actors = result
                    .map((castMember: any) => castMember.person)
                    .map(internalizeActor);

                resolve({
                    error: false,
                    result: actors,
                });
            }
        });
    });
}

const persistActors = persistEntitiesFactory("/actors");

export { InternalActor, getActors, persistActors };
