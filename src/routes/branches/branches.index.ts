import { createRouter } from "@/lib/create-app";

import * as handlers from "./branches.handlers";
import * as routes from "./branches.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch, handlers.patch);

export default router;
