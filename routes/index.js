var express = require('express');
var router = express.Router();
var imgDownload = require('image-downloader');
const fs = require('fs');
const request = require('request');
const imageDownloader = require('node-image-downloader')

/* GET home page. */
// var formidable = require("express-formidable")
// router.use(formidable());
var db = 'mongodb+srv://admin:ndthinh1410@cluster0.ikuee.mongodb.net/testmongo?retryWrites=true&w=majority'
var mongo = require('mongoose')
const {json} = require("express");

mongo.connect(db).catch(err => {
    console.log("Da xay ra loi" + err)
})
var postSchema = new mongo.Schema({
    urlImage: 'String',
    title: 'String',
    description: 'String',
    time: 'String'
})
var commentSchema = new mongo.Schema({
    name: 'String',
    email: 'String',
    comment: 'String'
})
var Post = mongo.model('post', postSchema);
var Comment = mongo.model('comment', commentSchema);

router.get('/', function (req, res, next) {

    Post.find({}, (err, data) => {
        res.render('index', {data: data});
    })
});

// router.post("/more-post", async function (req, res) {
//     var limit = 3;
//     var startFrom = parseInt(req.fields.startFrom);
//     var users = await Post.find({})
//         .sort({"_id": -1})
//         .skip(startFrom)
//         .limit(limit)
//
//     res.json(users);
//     console.log(users)
// })
// router.post('/showDetail',function (req,res){
//     res.render('showDetail')
// })

router.post("/addPosts", (req, res) => {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let time = hours + ":" + minutes
    //
    var content = req.body.content;
    var url = req.body.url;
    var date = req.body.date;
    var title = req.body.title;
    // console.log(date)
    // console.log(url)
    // console.log(content)

    const post = new Post({
        urlImage: url,
        description: content,
        time: date,
        title: title
    })
    post.save(function (err) {
        res.render('addPost')
    })
})
router.get('/addPosts', (req, res) => {

    res.render('addPost')

})
router.post("/update", (req, res) => {
    var id = req.body.idUpdate;
    Post.findById(id, (err, data) => {
        res.render('update', {data: data})
        console.log(data)

    })

})
router.post("/updatePost", (req, res) => {
    var id = req.body.id;
    var content = req.body.content;
    var url = req.body.url;
    var time = req.body.time;
    var title = req.body.title;
    console.log(id)
    console.log(content)
    Post.findByIdAndUpdate(id, {description: content, urlImage: url, time: time, title: title}, (err, data) => {
        res.render('update', {data: data})
        console.log(data)
    })


})

router.post("/delete", (req, res) => {
    var id = req.body.idDelete;
    Post.findByIdAndRemove(id, (err, data) => {
        res.render("index")
    })
})
router.post('/showDetail', function (req, res) {
    var id = req.body.id;
    Post.findById(id, (err, data) => {
        res.render("showDetail", {data: data})
        // console.log(data)
        // console.log(id)
    })
})
// takePhoto
router.post('/download-image', (req, res) => {
    const date_ob = Date.now();
    var image = req.body.imageName;
    // console.log(image)
    imageDownloader({
        imgs: [
            {
                uri: `${image}`,
                filename: date_ob
            }
        ],
        dest: './images', //destination folder
    })
        .then((info) => {
            res.send('Thanh cong')
        })
        .catch((error, response, body) => {
            console.log('something goes bad!')
            console.log(error)
        })


})
router.get('/getAll', function (req, res) {

    Post.find({}, (err, data) => {
        res.send((data))
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
    })
})

module.exports = router;
