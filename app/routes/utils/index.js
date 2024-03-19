import express from "express";

import auth from "./../../utils/middleware/authentication.js";
import media from "./media.js";

const router = express.Router();

router.use(auth);
router.use("/media", media);

export default router;
