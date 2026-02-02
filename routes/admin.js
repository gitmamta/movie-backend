const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Admin-only route
router.get("/admin", auth("Admin"), (req, res) => {
    
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
