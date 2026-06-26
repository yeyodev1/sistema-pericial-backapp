import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { CustomError } from "../errors/customError.error";

export function validateSchema(schema: ZodSchema<unknown>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );
        next(new CustomError(`Validation error: ${messages.join(", ")}`, 400));
        return;
      }
      next(error);
    }
  };
}
