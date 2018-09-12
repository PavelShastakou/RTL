import { Router, Request, Response } from "express";
import BaseController from "../BaseController";
import ActorsRepository from "../../repository/actorsRepository/ActorsRepository";
import ajv, { Ajv } from "ajv";
import {
    POST_ACTOR_SCHEMA,
    PATCH_ACTORS_SCHEMA,
    GET_ACTOR_SCHEMA
} from "./schema";
import { STATUS_CODES } from "../constants";

class ActorsController extends BaseController {
    ajv: Ajv;
    router: Router;

    constructor() {
        super();

        this.ajv = new ajv();
        this.router = Router();

        this.router.post("/", this.createActor.bind(this));
        this.router.get("/:actorId", this.getActor.bind(this));
        this.router.patch("/", this.patchActors.bind(this));
    }

    createActor(req: Request, res: Response) {
        const actor = req.body;
        const isValid = this.ajv.validate(POST_ACTOR_SCHEMA, actor);

        if (!isValid) {
            const errors = this.ajv.errors;
            this.errorResponse(res, errors, STATUS_CODES.BAD_REQUEST);
        } else {
            ActorsRepository.saveActor(actor, (error: any, result: any) => {
                if (error) {
                    this.errorResponse(res, error);
                } else {
                    this.okResponse(res, result);
                }
            });
        }
    }

    patchActors(req: Request, res: Response) {
        const actors = req.body;

        const isValid = this.ajv.validate(PATCH_ACTORS_SCHEMA, actors);

        if (!isValid) {
            this.errorResponse(res, this.ajv.errors, STATUS_CODES.BAD_REQUEST);
        } else {
            ActorsRepository.patchActors(actors, (error: any, result: any) => {
                if (error) {
                    this.errorResponse(res, error);
                } else {
                    this.okResponse(res, result);
                }
            });
        }
    }

    getActor(req: Request, res: Response) {
        const queryParams = req.params;

        const isValid = this.ajv.validate(GET_ACTOR_SCHEMA, queryParams);

        if (!isValid) {
            this.errorResponse(res, this.ajv.errors, STATUS_CODES.BAD_REQUEST);
        } else {
            ActorsRepository.getActor(queryParams.actorId, (error: any, result: any) => {
                if (error) {
                    this.errorResponse(
                        res,
                        error
                    );
                } else {
                    this.okResponse(res, result);
                }
            });
        }
    }
}

export default new ActorsController().router;
