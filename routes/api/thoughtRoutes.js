const router = require("express").Router();

const {
  getAllThoughts,
  getSingleThought,
  createThought,
  deleteThought,
  updateThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thoughtController.js");

router.route("/").get(getAllThoughts).post(createThought);

router.route("/:userId").delete(deleteThought);
router.route("/:thoughtId").get(getSingleThought).put(updateThought)

router.route("/:thoughtId/reactions").post(addReaction);
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);


module.exports = router;
