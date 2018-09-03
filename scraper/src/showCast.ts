import { STATUS_CODES, get, wait, makeRequest } from './util'


const url = `http://api.tvmaze.com/shows/1?embed[]=cast`
const getShowsByPageUrl = (page) => `http://api.tvmaze.com/shows?page=${page}`

function mapActor(actor) {
    return {
        actor_id: String(actor.id),
        name: actor.name,
        // TODO: Make table column nullable
        birthday: actor.birthday || '1000-01-01',
    }
}

function mapShow(show) {
    return {
        show_id: String(show.id),
        name: show.name
    }
}

function mapShowsActors(showId, actors) {
    return actors.map(actor => {
        return {
            show_id: showId,
            actor_id: actor.actor_id,
        }
    })
}

async function getShowsPage(page) {
    return new Promise((resolve, reject) => {
        const url = getShowsByPageUrl(page)

        get(url, (error, result) => {
            if (error) {
                if (error.statusCode === STATUS_CODES.TOO_MANY_REQUESTS) {
                    resolve({
                        shouldWait: true
                    })
                }
                if (error.statusCode === STATUS_CODES.NOT_FOUND) {
                    resolve({
                        isEndOfList: true
                    })
                }
                reject(error)
            } else {
                const shows = result.map(mapShow)

                resolve({
                    shouldWait: false,
                    isEndOfList: false,
                    shows
                })
            }
        })
    })
}

async function getActors(showId) {
    return new Promise((resolve, reject) => {
        const url = `http://api.tvmaze.com/shows/${showId}?embed[]=cast`

        get(url, (error, result) => {
            if (error) {
                if (error.statusCode === STATUS_CODES.TOO_MANY_REQUESTS) {
                    resolve({
                        shouldWait: true
                    })
                }
                reject(error);
            } else {
                const actors = result._embedded.cast
                    .map(castMember => castMember.person)
                    .map(mapActor)

                resolve({
                    actors
                })
            }
        })
    })
}

async function persistActors(actors) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/actors',
            method: 'PATCH'
        }

        makeRequest(requestOptions, actors, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

async function persistShowsActors(showsActors) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/showsActors',
            method: 'PATCH'
        }

        makeRequest(requestOptions, showsActors, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

async function persistShowsPage(shows) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/shows',
            method: 'PATCH'
        }

        makeRequest(requestOptions, shows, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}



async function loop() {
    let shouldStop = false;
    let page = 0

    while (true) {
        console.log(`Page: ${page}`)

        const { shouldWait, isEndOfList, shows } = await getShowsPage(page);

        if (isEndOfList) {
            console.log(`End of list`)
            break;
        } else if (shouldWait) {
            console.log(`Waiting ${2000}`)
            await wait(2000);
        } else {
            page++

            try {
                await persistShowsPage(shows);
            } catch (error) {
                console.error(error)
            }
            console.log(`Page: ${page}. Shows persisted`)

            for (let i = 0; i < shows.length; i++) {
                const show = shows[i]

                while (true) {
                    const { shouldWait, actors } = await getActors(show.show_id)

                    console.log(actors)

                    if (shouldWait) {
                        console.log(`Waiting ${2000}`)
                        await wait(2000);
                    } else {
                        const showsActors = mapShowsActors(show.show_id, actors)

                        try {
                            await persistActors(actors)
                        } catch (error) {
                            console.error(error)
                        }
                        console.log(`Page: ${page}. Actors persisted`)

                        try {
                            await persistShowsActors(showsActors)
                        } catch (error) {
                            console.error(error)
                        }
                        console.log(`Page: ${page}. Shows actors persisted`)

                        break
                    }
                    // break
                }
                // break;
            }
            // break;
        }
    }
}

loop()