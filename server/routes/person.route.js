const { Router } = require("express");
const fileUpload = require("express-fileupload");
const userController = require("../controllers/person.controller");
const authenticateToken = require("../middlewares/auth.middleware");

const router = Router();

router.post("/", authenticateToken, fileUpload(), userController.createPerson);

router.post("/:id/pin", authenticateToken, userController.pinnedPerson);

router.get("/:id/networks", userController.getPersonNetworks);

router.get("/:id", userController.getOnePerson);

router.get("/", userController.getPersons);

router.patch(
  "/:id",
  authenticateToken,
  fileUpload(),
  userController.updatePerson
);

router.delete("/:id", authenticateToken, userController.deleteUser);

module.exports = router;
