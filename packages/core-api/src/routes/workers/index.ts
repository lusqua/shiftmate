import { Hono } from "hono";
import { workersGet } from "./workersGet";
import { workersPost } from "./workersPost";
import { workerPut } from "./workerPut";
import { workerDeleteHandler } from "./workerDelete";

export const workerRoutes = new Hono();

workerRoutes.get("/", workersGet);
workerRoutes.post("/", workersPost);
workerRoutes.put("/:id", workerPut);
workerRoutes.delete("/:id", workerDeleteHandler);
