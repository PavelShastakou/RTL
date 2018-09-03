import { Router, Request, Response } from 'express';
import BaseController from '../BaseController';
import ShowsRepository from '../../repository/showsRepository/ShowsRepository';
import ajv, { Ajv } from 'ajv';
import { SHOW_SCHEMA, SHOWS_SCHEMA } from './schema';
import { STATUS_CODES } from '../constants';


class ShowsController extends BaseController {
    ajv: Ajv;
    router: Router;

    constructor() {
        super()

        this.ajv = new ajv();
        this.router = Router();

        this.router.post('/', this.createShow.bind(this));
        this.router.patch('/', this.patchShows.bind(this));
        this.router.get('/:showId', this.getShow.bind(this));
    }

    createShow(req: Request, res: Response) {
        const show = req.body;
        const isValid = this.ajv.validate(SHOW_SCHEMA, show);

        if (!isValid) {
            const errors = this.ajv.errors;
			this.errorResponse(res, STATUS_CODES.BAD_REQUEST, errors);
        } else {
            ShowsRepository.saveShow(show, (error, result) => {
                if (error) {
                    this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
                } else {
                    this.okResponse(res, result)
                }
            })
        }
    }

    patchShows(req: Request, res: Response) {
        const shows = req.body;
        console.log(shows)
        const isValid = this.ajv.validate(SHOWS_SCHEMA, shows);

        if (!isValid) {
            const errors = this.ajv.errors;
			this.errorResponse(res, STATUS_CODES.BAD_REQUEST, errors);
        } else {
            ShowsRepository.patchShows(shows, (error, result) => {
                if (error) {
                    this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
                } else {
                    this.okResponse(res, result)
                }
            })
        }
    }

    getShow(req: Request, res: Response) {
        ShowsRepository.getShow(req.params.showId, (error, result) => {
            if (error) {
                this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
            } else {
                this.okResponse(res, result)
            }
        })
    }
}

export default new ShowsController().router
