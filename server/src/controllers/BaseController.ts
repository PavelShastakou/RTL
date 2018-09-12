import { Response, NextFunction } from "express";
import { STATUS_CODES } from "./constants";

const PAGE_NOT_FOUND_MESSAGE = "Page not found";

export default class BaseController {
    protected okResponse(
        res: Response,
        result: any,
        statusCode: number = STATUS_CODES.OK
    ): void {
        res.status(statusCode).send(result);
    }

    protected errorResponse(
        res: Response,
        result: any,
        statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR
    ): void {
        res.status(statusCode).send(result);
    }

    static handleNotFound(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        res.status(STATUS_CODES.NOT_FOUND).send(PAGE_NOT_FOUND_MESSAGE);
    }
}
