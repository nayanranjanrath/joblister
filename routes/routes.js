import { Router } from "express";
import { adduser } from "../controllers/userController.js";
import { avatarUpload } from "../middleware/multer.js";

const routes = Router();


routes.get("/", (req, res) => {
    res.send("Hello World!");
});
routes.post("/register",avatarUpload.single("avatar"), adduser);


export default routes;