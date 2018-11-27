var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

var url = 'mongodb://127.0.0.1:27017';

/* GET users listing. */

router.get('/',function(req,res,next){
  MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    if(err){
      console.log('连接数据库失败',err);
      res.render('error',{
        message:'链接数据库失败',
        error:err
      });
      return;
    }
    var db = client.db('project');
    db.collection('user').find().toArray(function(err,data){
         if(err){
             console.log("查询用户数据失败",err);
             res.render('error',{
                message:"查询失败",
                error:err
             })
         }else{
              console.log(data);
              res.render('users',{
                  list:data
              });
         }
          client.close();

    })
})

// res.render('users');
});

//登陆操作
router.post('/login',function(req,res){
  //    1.获取前端传递过来的参数；
  
    //  2.验证参数的有效性；
    //  3.链接数据库做验证；

});
module.exports = router;
