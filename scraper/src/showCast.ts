import { getShowsPage } from './shows'
import { STATUS_CODES, get, wait, makeRequest } from './util'


const url = `http://api.tvmaze.com/shows/1?embed[]=cast`


async function getCast(showId) {
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
                const mappedCast = result._embedded.cast.map(castMember => {
                    return {
                        actor_id: castMember.id,
                        name: castMember.name,
                        birthday: castMember.birthday,
                    }
                })
                resolve({
                    cast: mappedCast
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

async function handleShowsPage(shows) {
    shows.forEach
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


            async function loopShows() {
                for (let i = 0; i < shows.length; i++) {
                    const show = shows[i]

                    const { shouldWait, cast } = await getCast(show.show_id)

                    await persistActors(cast)
                }
            }

            loopShows()

        }
    }
}

loop()