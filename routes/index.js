var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).json({shell: "OK"});
});
router.get('/wowza-ini', function (req, res, next) {
    res.status(200).json({shell: "OK"});
});

router.get('/gstream-ini', function (req, res, next) {
    res.status(200).json({shell: "OK"});
});

module.exports = router;
