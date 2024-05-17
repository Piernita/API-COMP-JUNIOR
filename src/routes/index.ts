import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authorRoutes } from "./author.routes";
import { publisherRoutes } from "./publisher.routes";
import { categoryRoutes } from "./category.routes";
import { employeeRoutes } from "./employee.routes";
import { bookRoutes } from "./book.routes"
import { loanRoutes } from "./loan.routes"
import { authenticationRoutes } from "./authentication.routes"
import { authenticationMiddleware } from "../middlewares/authenticationMiddleware";
import { roleRoutes } from "./roles.routes";
import { permissionRoutes } from "./permission.routes";
 
const routes = Router();

routes.use("/auth", authenticationRoutes)

routes.use(authenticationMiddleware);

routes.use("/users", userRoutes);
routes.use("/authors", authorRoutes);
routes.use("/publishers", publisherRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/employees", employeeRoutes);
routes.use("/books", bookRoutes);
routes.use("/loans", loanRoutes);
routes.use("/roles", roleRoutes);
routes.use("/permissions", permissionRoutes);


export { routes };