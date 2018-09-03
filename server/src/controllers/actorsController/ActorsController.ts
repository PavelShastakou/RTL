import { Router, Request, Response } from 'express';
import BaseController from '../BaseController';
import ActorsRepository from '../../repository/actorsRepository/ActorsRepository';
import ajv, { Ajv } from 'ajv';
import { ACTOR_SCHEMA } from './schema';
import { STATUS_CODES } from '../constants';


class ActorsController extends BaseController {
    ajv: Ajv;
    router: Router;

    constructor() {
        super()

        this.ajv = new ajv();
        this.router = Router();

        this.router.post('/', this.createShow.bind(this));
        this.router.get('/:showId', this.getShow.bind(this));
    }

    createShow(req: Request, res: Response) {
        const actor = req.body;
        const isValid = this.ajv.validate(ACTOR_SCHEMA, actor);

        if (!isValid) {
            const errors = this.ajv.errors;
			this.errorResponse(res, STATUS_CODES.BAD_REQUEST, errors);
        } else {
            ActorsRepository.saveActor(actor, (error, result) => {
                if (error) {
                    this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
                } else {
                    this.okResponse(res, result)
                }
            })
        }
    }

    getShow(req: Request, res: Response) {
        ActorsRepository.getActor(req.params.showId, (error, result) => {
            if (error) {
                this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
            } else {
                this.okResponse(res, result)
            }
        })
    }
}

export default new ActorsController().router
