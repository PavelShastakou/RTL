import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { wait } from "./util";
import { getActors, persistActors } from "./feature/actor";
import { getShowsPage, persistShows } from "./feature/show";
import {
    internalizeShowsActors,
    persistShowsActors
} from "./feature/showActors";
import { logger } from "./logger";

import { withRepeating } from "./util/hofs";

async function loop() {
    let page = 0;

    while (true) {
        const withRepeatingGetShowsPage = withRepeating(() =>
            getShowsPage(page)
        );

        const { errors, result, succeeded } = await withRepeatingGetShowsPage();

        if (!succeeded) {
            logger.info(`Error retrieving shows of page ${page}`, errors);
            break;
        }

        if (result === null) {
            // Last page
            logger.info(`End of list`);
            break;
        }
        page++;
        const shows = result;

        try {
            await persistShows(shows);
            logger.info(`Shows page: ${page}. Shows data persisted`);
        } catch (error) {
            logger.error(error);
        }

        for (let i = 0; i < shows.length; i++) {
            const show = shows[i];
            const showId = show.show_id;

            const withRepeatingGetActors = withRepeating(() =>
                getActors(showId)
            );

            const {
                succeeded,
                errors,
                result
            } = await withRepeatingGetActors();

            if (!succeeded) {
                logger.error(
                    `Error retrieving actors of show with id: ${page}`,
                    errors
                );
            } else {
                const actors = result;

                try {
                    await persistActors(actors);
                    logger.info(`Shows page: ${page}. Actors data persisted`);
                } catch (error) {
                    logger.error(
                        `Shows page: ${page}. Actors data persisted`,
                        error
                    );
                }

                try {
                    const showsActors = internalizeShowsActors(
                        show.show_id,
                        actors
                    );
                    await persistShowsActors(showsActors);
                    logger.info(`Page: ${page}. Shows actors persisted`);
                } catch (error) {
                    logger.error(error);
                }

                break;
            }
        }
    }
}

loop();
