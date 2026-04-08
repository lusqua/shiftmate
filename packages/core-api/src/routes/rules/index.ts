import { Hono } from "hono";
import { rulesGet } from "./rulesGet";
import { rulesPost } from "./rulesPost";
import { rulePut } from "./rulePut";
import { ruleDeleteHandler } from "./ruleDelete";

export const rulesRoutes = new Hono();

rulesRoutes.get("/", rulesGet);
rulesRoutes.post("/", rulesPost);
rulesRoutes.put("/:id", rulePut);
rulesRoutes.delete("/:id", ruleDeleteHandler);
