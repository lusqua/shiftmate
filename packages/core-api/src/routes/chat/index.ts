import { Hono } from "hono";
import { chatPost } from "./chatPost";

export const chatRoutes = new Hono();

chatRoutes.post("/", chatPost);
