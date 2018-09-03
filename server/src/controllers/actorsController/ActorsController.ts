import { Router, Request, Response } from 'express';
import BaseController from '../BaseController';
import ActorsRepository from '../../repository/actorsRepository/ActorsRepository';
import ajv, { Ajv } from 'ajv';
import { ACTOR_SCHEMA, ACTORS_SCHEMA } from './schema';
import { STATUS_CODES } from '../constants';


class ActorsController extends BaseController {
    ajv: Ajv;
    router: Router;

    constructor() {
        super()

        this.ajv = new ajv();
        this.router = Router();

        this.router.post('/', this.createActor.bind(this));
        this.router.get('/:actorId', this.getActor.bind(this));
        this.router.patch('/', this.patchActors.bind(this));
    }

    createActor(req: Request, res: Response) {
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

    patchActors(req: Request, res: Response) {
        const actors = req.body;

        const isValid = this.ajv.validate(ACTORS_SCHEMA, actors);

        if (!isValid) {
            const errors = this.ajv.errors;
			this.errorResponse(res, STATUS_CODES.BAD_REQUEST, errors);
        } else {
            ActorsRepository.patchActors(actors, (error, result) => {
                if (error) {
                    this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
                } else {
                    this.okResponse(res, result)
                }
            })
        }
    }

    getActor(req: Request, res: Response) {
        ActorsRepository.getActor(req.params.actorId, (error, result) => {
            if (error) {
                this.errorResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, error)
            } else {
                this.okResponse(res, result)
            }
        })
    }
}

export default new ActorsController().router
