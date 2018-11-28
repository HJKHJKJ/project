var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
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

//登陆操作  location:3000/users/login
router.post('/login',function(req,res){
  //    1.获取前端传递过来的参数；
     
     var username = req.body.name;
     var password = req.body.pwd;

    if(!username){
      res.render('error',{
        message:'用户名不能为空',
        error:new Error('用户名不能为空')
      })
      return;
    }

    if(!password){
      res.render('error',{
        message:'密码不能为空',
        error:new Error('密码不能为空')
      })
      return;
    }

    // 链接数据库做验证:
    MongoClient.connect(url,{useNewUrlParser:true},function
      (err,client){
        if(err){
          console.log('链接失败',err);
          res.render('error',{
            message:'链接失败',
            error:err
          })
          return
        }

        var db = client.db('project');
        // db.collection('user').find({
        //   username:username,
        //   password:password
        // }).count(function(err,num){
        //   if(err){
        //     console.log('查询失败',err);
        //     res.render('error',{
        //       message:'查询失败',
        //       error:err
        //     })
        //   }else if(num > 0){
        //       //登陆成功；
        //       res.render('index');
        //       // 注意：当前url地址是 location:3000/users/login.
        //       //如果直接使用 render(); 页面地址是不会改变的；

        //       //登陆成功，写入 cookie;
        //       res.cookie('nickname',);
        //       res.redirect('/');
        //   }else{
        //     res.render('error',{
        //       message:'登陆失败',
        //       error:new Error('登陆失败')
        //     })
        //   }

        //   client.close();

        // })


          db.collection('user').find({
            username:username,
            password:password
          }).toArray(function(err,data){
            if(err){
              console.log('查询失败',err);
              res.render('error',{
                message:'查询失败',
                error:err
              })
            }else if(data.length <= 0){
              res.render('error',{
                 message:'登陆失败',
                 error:new Error('登陆失败')
              })
            }else{
              //登陆成功
              //cookie 的操作
              res.cookie('nickname',data[0].nickname,{
                maxAge: 10 * 60 * 1000
              })

              res.redirect('/');
            }
            client.close();
                        
          })
      })

    //  res.send('');
    //  2.验证参数的有效性；
    //  3.链接数据库做验证；

});


//注册操作  location:300/users/register
router.post('/register',function(req,res){
    var name = req.body.name;
    var nickname = req.body.nickname;
    var pwd = req.body.pwd;
    var age = parseInt(req.body.age);
    var sex = req.body.sex;
    var isAdmin = req.body.isAdmin === '是' ? true:false;

    MongoClient.connect(url,{useNewUrlParser:true},function(err,
      client){
          if(err){
            res.render('error',{
              message:'链接失败',
              error:err
            })
            return;
          }


          var db = client.db('project');
          async.series([
            function(cb){
                db.collection('user').find({username:name}).count
                (function(err,num){
                  if(err){
                    cb(err);
                  }else if(num > 0){
                    //这个人已经注册过了；
                    cb(new Error('已经注册'));
                  }else{
                    cb(null);
                  }
                })
            },
            function(cb){
                db.collection('user').insertOne({
                  username:name,
                  password:pwd,
                  nickname:nickname,
                  age:age,
                  sex:sex,
                  isAdmin:isAdmin
                },function(err){
                  if(err){
                    cb(err);
                  }else{
                    cb(null);
                  }
                })
            }
          ],function(err,result){
               if(err){
                 res.render('error',{
                   message:'错误',
                   error:err
                 })
               } else{
                 res.redirect('/login.html');
               }
               //不管成功还是失败都得做一个关闭的操作；
               client.close();
          })
    })

    // console.log(name,pwd,age,sex,isAdmin)
    // MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    //   if(err){    
    //       res.render('error',{
    //         message:'链接失败',
    //         error:err

    //   })
    //   return;
    //   }    
    //   var db = client.db('project');
    //   db.collection('user').insertOne({
    //     username:name,
    //     password:pwd,
    //     nickname:nickname,
    //     age:age,
    //     sex:sex,
    //     isAdmin:isAdmin
      
    //   },function(err){
    //     if(err){
    //       console.log('注册失败');
    //       res.render('error',{
    //         message:'注册失败',
    //         error:err
    //       })
    //     }else{
    //       //注册成功，跳转到登陆页面；
    //       res.redirect('/login.html');
    //     }
    //     client.close();
    //   })
    // })
})




module.exports = router;
