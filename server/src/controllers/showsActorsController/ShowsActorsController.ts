import { Router, Request, Response } from 'express';
import BaseController from '../BaseController';
import ShowsRepository from '../../repository/showsRepository/ShowsRepository';
import ajv, { Ajv } from 'ajv';
import { SHOW_ACTORS_SCHEMA } from './schema';
import { STATUS_CODES } from '../constants';
import ShowsActorsRepository from '../../repository/showsActorsRepository/ShowsActorsRepository';


class ShowsActorsController extends BaseController {
    ajv: Ajv;
    router: Router;

    constructor() {
        super()

        this.ajv = new ajv();
        this.router = Router();

        this.router.patch('/', this.patchShowActors.bind(this));
        this.router.get('/', this.getShowActors.bind(this));
    }

    patchShowActors(req: Request, res: Response) {
        const showsActors = req.body;
        const isValid = this.ajv.validate(SHOW_ACTORS_SCHEMA, showsActors);

        if (!isValid) {
            const errors = this.ajv.errors;
			this.errorResponse(res, STATUS_CODES.BAD_REQUEST, errors);
        } else {
            ShowsActorsRepository.patchShowsActors(showsActors, (error, result) => {
                if (error) {
                    this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
                } else {
                    this.okResponse(res, result)
                }
            })
        }
    }

    getShowActors(req: Request, res: Response) {
        const { page } = req.query

        ShowsActorsRepository.getShowsActors(page, (error, result) => {
            if (error) {
                this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
            } else {
                this.okResponse(res, result)
            }
        })
    }
}

export default new ShowsActorsController().router
