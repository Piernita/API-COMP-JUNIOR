import { Router } from "express";
import { BookController } from "../controllers/bookCrontroller";
const bookController = new BookController();
const bookRoutes = Router();

bookRoutes.post("/", bookController.createBook);
bookRoutes.get("/", bookController.getBooks);
bookRoutes.get("/:id", bookController.getBookById);
bookRoutes.get("/title/:title", bookController.getBookByTitle);
bookRoutes.get("/publisher/:publisherId", bookController.getBooksByPublisher);
bookRoutes.get("/author/:authorId", bookController.getBooksByAuthor);
bookRoutes.put("/update/:id", bookController.updateBookById);
bookRoutes.delete("/delete/:id", bookController.deleteBookById);

export { bookRoutes };