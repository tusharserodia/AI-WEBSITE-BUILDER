import express from "express"
import isAuth from "../middleware/isAuth.js";
import { changes, deploy, generateWebsite, getAll, getBySlug, getWebsiteById } from "../controllers/website.controller.js";
// import { generateDemo, getCurrentUser } from "../controllers/user.controller.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, generateWebsite );
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById );
websiteRouter.get("/get-all", isAuth, getAll );
websiteRouter.post("/update/:id", isAuth, changes );
websiteRouter.get("/deploy/:id", isAuth, deploy );
websiteRouter.get("/get-by-slug/:slug", isAuth, getBySlug );

export default websiteRouter;   