import { Request } from "express";

export interface CreatingUser extends Request {
  body: { name: string; email: string; password: string };
}
