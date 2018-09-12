import { Router, Request, Response } from "express";
import BaseController from "../BaseController";
import ajv, { Ajv } from "ajv";
import { PATCH_SHOW_ACTORS_SCHEMA, GET_SHOW_ACTORS_SCHEMA } from "./schema";
import { STATUS_CODES } from "../constants";
import ShowsActorsRepository from "../../repository/showsActorsRepository/ShowsActorsRepository";

class ShowsActorsController extends BaseController {
    ajv: Ajv;
    router: Router;

    constructor() {
        super();

        this.ajv = new ajv({ coerceTypes: true });
        this.router = Router();

        this.router.patch("/", this.patchShowActors.bind(this));
        this.router.get("/", this.getShowActors.bind(this));
    }

    patchShowActors(req: Request, res: Response) {
        const showsActors = req.body;
        const isValid = this.ajv.validate(
            PATCH_SHOW_ACTORS_SCHEMA,
            showsActors
        );

        if (!isValid) {
            const errors = this.ajv.errors;
            this.errorResponse(res, errors, STATUS_CODES.BAD_REQUEST);
        } else {
            ShowsActorsRepository.patchShowsActors(
                showsActors,
                (error: any, result: any) => {
                    if (error) {
                        this.errorResponse(res, error);
                    } else {
                        this.okResponse(res, result);
                    }
                }
            );
        }
    }

    getShowActors(req: Request, res: Response) {
        const queryParams = req.query;

        console.log(queryParams);

        const isValid = this.ajv.validate(GET_SHOW_ACTORS_SCHEMA, queryParams);

        if (!isValid) {
            const errors = this.ajv.errors;
            this.errorResponse(res, errors, STATUS_CODES.BAD_REQUEST);
        } else {
            const page = queryParams.page;

            ShowsActorsRepository.getShowsActors(
                page,
                (error: any, result: any) => {
                    if (error) {
                        this.errorResponse(res, error);
                    } else {
                        this.okResponse(res, result);
                    }
                }
            );
        }
    }
}

export default new ShowsActorsController().router;
