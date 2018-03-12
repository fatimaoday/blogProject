var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://mememe:mememe@ds243418.mlab.com:43418/blog').then(function () {
    console.log("Database Connected!")
}).catch(function (error) {
    console.log(error.message)
});

var article = mongoose.model('article', {
    image: String,
    title: String,
    description: String,
    favourite:Boolean,
    category:String
});

var feedback = mongoose.model('feedback', {
    name: String,
    eMail: String,
    message: String,
    checked:Boolean
});
var checkPssword={password:"", result:false}
var password="helloworld"

router.post('/managementApi', function(req, res) {
    checkPssword= req.param('password');
    if (checkPssword.password == password){
        checkPssword.result = true
    }
    else {
        checkPssword.result = false
    }
    res.json(checkPssword)
});

//////////////////////////Pages Rendering///////////////////////////////
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', function(req, res) {
    if (checkPssword.password == password){
        res.render('home');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});
router.get('/about', function(req, res) {
    if (checkPssword.password == password){
        res.render('about');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});
router.get('/favourites', function(req, res) {
    if (checkPssword.password == password){
        res.render('favourites');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});
router.get('/travelling', function(req, res) {
    if (checkPssword.password == password){
        res.render('travelling');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});
router.get('/art', function(req, res) {
    if (checkPssword.password == password){
        res.render('art');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});
router.get('/cooking', function(req, res) {
    if (checkPssword.password == password){
        res.render('cooking');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});
router.get('/technology', function(req, res) {
    if (checkPssword.password == password){
        res.render('technology');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});
router.get('/adminsControlPanel', function(req, res) {
    if (checkPssword.password == "codelab"){
        res.render('adminsControlPanel');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});
router.get('/feedback', function(req, res) {
    if (checkPssword.password == password){
        res.render('feedback');
    }
    else {
        res.send("You're Not Allowed To Access This Page !!");
    }
});

////////////////////////////////////article's network requests//////////////////////////////////////////
router.get('/api',function (req, res) {
    article.find(function (error,articles) {
        articles.reverse();

        var FavouriteArticles = req.param('favourite')
        var categorizedArticles = req.param('category')

        var filteredFavourite = [];
        var filteredArt = [];
        var filteredTravelling = [];
        var filteredCooking = [];
        var filteredTechnology = [];


        for (i = 0; i < articles.length; i++) {
            if (articles[i].favourite)
                filteredFavourite.push(articles[i]);
            if(articles[i].category == 'travelling')
                filteredTravelling.push(articles[i]);
            if(articles[i].category == 'art')
                filteredArt.push(articles[i]);
            if(articles[i].category == 'cooking')
                filteredCooking.push(articles[i]);
            if(articles[i].category == 'technology')
                filteredTechnology.push(articles[i]);
        }

        if(categorizedArticles == 'travelling')
            res.json(filteredTravelling);
        else if (categorizedArticles == 'art')
            res.json(filteredArt);
        else if (categorizedArticles == 'cooking')
            res.json(filteredCooking);
        else if (categorizedArticles == 'technology')
            res.json(filteredTechnology);
        else if (FavouriteArticles == '1')
            res.json(filteredFavourite);
        else
            res.json(articles);

    })
});

router.post('/api', function (req, res) {
    var newArticle = new article(req.param('article'));
    newArticle.save().then(function () {
        res.json({
            isSuccess: true,
            message: "Article Saved!"
        });
    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message
        });
    })
});
router.delete('/api',function (req,res) {
    var id = req.param('id');
    article.findByIdAndRemove(id).then(function () {
        res.json({
            isSuccess: true,
            message: "Article Deleted!"
        });
    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message
        });
    })
});
router.put('/api',function (req,res) {
    var editing = req.param('article');
    article.findByIdAndUpdate(editing._id,editing).then(function () {
        res.json({
            isSuccess: true,
            message: "Article Updated!"
        });
    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message
        });
    });

});

////////////////////////////////feedback page's network requests////////////////////////////////////////

router.post('/infoApi', function (req, res) {
    var newFeedback = new feedback(req.param('feedback'));
    newFeedback.save().then(function () {
        res.json({
            isSuccess: true,
            message: "Feedback Saved!"
        });
    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message
        });
    })
});
router.get('/infoApi',function (req, res) {
    feedback.find(function (error,feedbacks) {
        feedbacks.reverse();
        res.json(feedbacks);
    })
});
router.put('/infoApi',function (req,res) {
    feedback.findByIdAndUpdate(req.param('feedback')._id,req.param('feedback')).then(function () {
        res.json({
            isSuccess: true,
            message: "feedback Updated!"
        });
    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message
        });
    });
});
router.delete('/infoApi',function (req,res) {
    feedback.findByIdAndRemove(req.param('id')).then(function () {
        res.json({
            isSuccess: true,
            message: "feedback Deleted!"
        });
    }).catch(function (error) {
        res.json({
            isSuccess: false,
            message: error.message
        });
    })
});


module.exports = router;
