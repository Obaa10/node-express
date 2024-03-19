import express from "express";

import utils from "./utils/index.js";

const router = express.Router();

router.use("/util", utils);

export default router;
