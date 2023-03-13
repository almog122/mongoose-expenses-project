const express = require("express");

const router = express.Router();

router.get("/recipesPage/:page", function (req, res) {
    let page = req.params.page;
    
    res.send(recipesPages[page])
});

module.exports = router;