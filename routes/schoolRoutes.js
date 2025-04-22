const express = require("express");
const router = express.Router();
const controller = require("../controllers/schoolController");
const validateSchoolInput = require("../middleware/validateSchoolInput");

router.post("/addSchool", validateSchoolInput, controller.addSchool);
router.get("/listSchools", controller.listSchools);

module.exports = router;
