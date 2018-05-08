var express = require('express');
var app = express();
var path=require('path')
const {ObjectId} = require('mongodb');
var router = express.Router();

var userAuth = require('./user_controller/userVerify.js')
var orderFs=require("./db_controller/dbOrders.js")
var shopFs=require("./db_controller/dbShop.js")

var publicPath=path.resolve(__dirname, "static"	);
app.use(express.static(publicPath))

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var session=require('express-session')
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}
app.use(session(sess))


var MongoClient = require('mongodb').MongoClient;
var db,shop;
var dbURL="mongodb://pets1:pets1@localhost:27017/pamperedpetsdb"


MongoClient.connect(dbURL, 
					function(err, database) {
  if(err) throw err;

  db=database.db("pamperedpetsdb")
 
  // Start the application after the database connection is ready
  app.listen(8000);
  console.log("Listening on port 8000");
});

app.get('/', function(req, res){
  res.sendFile(`${publicPath}/index.html`);
});

app.get('/adminLogin',function (req,res) {
  res.sendFile(`${publicPath}/adminLogin.html`)
  /* body... */
})
app.get('/shop',function (req, res) {
	   var query={}
      findMenuItems(res,query)
})


app.get('/shops', function (req, res) {
  console.log('/shops from admin')
  if(req.session.user)
    res.sendFile(`${publicPath}/adminMenu.html`)
  else
    res.sendFile(`${publicPath}/adminLogin.html`)
})

//demo orders.html, only valid user can access orders.html
app.get('/orders', function(req,res) {
  console.log('/orders')
  if(req.session.user)
    res.sendFile(`${publicPath}/orders.html`)
  else
    res.sendFile(`${publicPath}/login.html`)
})


//demo destroy session when get /logout
app.get('/logout', function(req,res) {
  req.session.destroy(function(){
    console.log('destroy the session')
    res.redirect('/adminLogin')
  })
  /* body.... */
})
app.get('/showOrders',function(req,res){
var query={}
      findOrderItems(res,query)
})

app.get('/shops', function(req,res){
  if(req.session.user)
    res.sendFile()
})
var getDb = function() {
  return db
};

var getPublicPath=function(){
  return publicPath
}
module.exports.getDb=getDb
module.exports.getPublicPath=getPublicPath


app.post("/updateShop", function(req,res){
  console.log(req.body)
  var data=req.body
  var query={_id: ObjectId(data._id)}
  var update={$set:{itemName:data.itemName, description:data.description,
    price: data.price, imgName:data.imgName}}

    shopFs.updateShop(res, query, update)
})

app.post("/appt", function(req,res){
  var firstName=req.body.first_name
  var lastName=req.body.last_name
  var userEmail=req.body.appt_email
  var phoneNum=req.body.phone_num
  var dropOff=req.body.drop_off
  var pickUp=req.body.pick_up

  console.log(firstName+" "+lastName+" "+appt_email+" "+phone_num+" "+drop_off+" "+pick_up)
})

app.use('/adminLogin', userAuth)
  
app.post("/login",function (req,res) {
  if(req.session.user)     {
    res.redirect('/index.html')
  console.log('login with post')
} else
console.log('incorrect')

 }) 

function findShopItems(res,query)
{
  console.log(query)
  db.collection("shop").find(query).toArray(function (err,results) {
 
    console.log(results)
    
    res.json(results)
  })

}

function findOrderItems(res,query)
{

  db.collection("orders").find(query).toArray(function (err,results) {
 
    console.log(results)
    
    res.writeHead(200);
    res.end(JSON.stringify(results))
  })
}
var getDb = function() {
  return db
};
var getPublicPath=function(){
  return publicPath
};
module.exports.getDb=getDb
module.exports.getPublicPath=getPublicPath
