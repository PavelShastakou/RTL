import { Response } from "express";
import { STATUS_CODES } from "./constants";

export default class BaseController {
    protected okResponse(res: Response, result: any): void {
        res.status(STATUS_CODES.OK).send(result);
    }

    protected errorResponse(res: Response, code: number, result: any): void {
        res.status(code).send(result);
    }
}
