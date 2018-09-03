
import { STATUS_CODES, get, makeRequest, wait } from './util'

// External
const getShowsByPageUrl = (page) => `http://api.tvmaze.com/shows?page=${page}`
// Local
const patchShowsUrl = `http://127.0.0.1:3000/shows`



function mapShow(show) {
    return {
        show_id: String(show.id),
        name: show.name
    }
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

export async function getShowsPage(page) {
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
            await persistShowsPage(shows);
            console.log(`Page: ${page}. Persisted`)
        }
    }
}

loop()

