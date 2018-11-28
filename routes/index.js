var express = require('express');
var router = express.Router();

/* GET home page. */
//首页
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// 登陆页面
router.get('/login.html',function(req,res,next){
  res.render('login');
});

//注册页面
router.get('/register.html',function(req,res){
  res.render('register')
})

//品牌页面
router.get('/brand.html',function(req,res){
  res.render('brand');
});
//手机页面
router.get('/phone.html',function(req,res){
  res.render('phone');
});


module.exports = router;
