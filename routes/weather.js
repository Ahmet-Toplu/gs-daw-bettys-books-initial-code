const express = require("express")
const request = require('request')
const router = express.Router()

const apiKey = '833007ce6af90d347d2e5de620596567'

// get request for the weather page
router.get('/', function(req, res, next){
    if (req.query.city == null){
        city = 'london'
    } else {
        city = req.sanitize(req.query.city)
    }
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    request(url, function (err, response, body) {
        if(err){
            next(err)
        } else {
            var weather = JSON.parse(body)
            if (weather!==undefined && weather.main!==undefined) {
                res.render('weather', { weather: weather })
             }
             else {
                res.send ("No data found");
             }
        }
    });
});

// Export the router object so index.js can access it
module.exports = router