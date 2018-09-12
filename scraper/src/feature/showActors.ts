import { persistEntitiesFactory } from "../persistEntitiesFactory";
import { InternalActor } from "./actor";

class InternalShowActor {
    show_id: string;
    actor_id: string;
}

function internalizeShowsActors(
    showId: string,
    actors: InternalActor[]
): InternalShowActor[] {
    return actors.map(actor => {
        return {
            show_id: showId,
            actor_id: actor.actor_id
        };
    });
}

const persistShowsActors = persistEntitiesFactory("/showsActors");

export { internalizeShowsActors, persistShowsActors };
