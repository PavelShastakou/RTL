import { Router, Request, Response } from "express";
import BaseController from "../BaseController";
import ShowsRepository from "../../repository/showsRepository/ShowsRepository";
import ajv, { Ajv } from "ajv";
import {
    POST_SHOW_SCHEMA,
    PATCH_SHOWS_SCHEMA,
    GET_SHOW_SCHEMA
} from "./schema";
import { STATUS_CODES } from "../constants";

class ShowsController extends BaseController {
    ajv: Ajv;
    router: Router;

    constructor() {
        super();

        this.ajv = new ajv();
        this.router = Router();

        this.router.post("/", this.createShow.bind(this));
        this.router.patch("/", this.patchShows.bind(this));
        this.router.get("/:showId", this.getShow.bind(this));
    }

    createShow(req: Request, res: Response) {
        const show = req.body;
        const isValid = this.ajv.validate(POST_SHOW_SCHEMA, show);

        if (!isValid) {
            const errors = this.ajv.errors;
            this.errorResponse(res, errors, STATUS_CODES.BAD_REQUEST);
        } else {
            ShowsRepository.saveShow(show, (error: any, result: any) => {
                if (error) {
                    this.errorResponse(res, error);
                } else {
                    this.okResponse(res, result);
                }
            });
        }
    }

    patchShows(req: Request, res: Response) {
        const shows = req.body;
        const isValid = this.ajv.validate(PATCH_SHOWS_SCHEMA, shows);

        if (!isValid) {
            const errors = this.ajv.errors;
            this.errorResponse(res, errors, STATUS_CODES.BAD_REQUEST);
        } else {
            ShowsRepository.patchShows(shows, (error: any, result: any) => {
                if (error) {
                    this.errorResponse(res, error);
                } else {
                    this.okResponse(res, result);
                }
            });
        }
    }

    getShow(req: Request, res: Response) {
        const queryParams = req.params;

        const isValid = this.ajv.validate(GET_SHOW_SCHEMA, queryParams);

        if (!isValid) {
            this.errorResponse(res, this.ajv.errors, STATUS_CODES.BAD_REQUEST);
        } else {
            ShowsRepository.getShow(req.params.showId, (error: any, result: any) => {
                if (error) {
                    this.errorResponse(res, error);
                } else {
                    this.okResponse(res, result);
                }
            });
        }
    }
}

export default new ShowsController().router;
