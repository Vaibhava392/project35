var  dog, normal ,happyDog; 
var  database ,foodS ,foodStock;
var feed, addFood;
var fedTime, lastFed, foodObj

function preload(){
	happyDog=loadImage("images/dogImg1.png")
	normal=loadImage("images/dogImg.png")
}

function setup() {
	database = firebase.database();
  createCanvas(900,900);
   
  dog =createSprite(800, 200, 10,10);
  dog.addImage(normal);
  dog.scale=0.2
  
  foodStock = database.ref('food');
  foodStock.on("value",readStock)

  foodObj = new Food();
  
  feed = createButton("Feed the dog");
  feed.position(800,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background("green")
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  fill("green");
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

  drawSprites();
}
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDog)

  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}