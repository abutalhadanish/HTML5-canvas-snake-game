gridSize = 50;
gridColumns = 10;
gridRows = 10;

game = {
    canvas: document.createElement("canvas"),
    is_halted: false,
    score: 0,
    start: function(){
        this.canvas.width = gridColumns*gridSize;
        this.canvas.height = gridRows*gridSize;
        this.context = this.canvas.getContext("2d");
        document.body.append(this.canvas);
        this.interval = setInterval(updateGame, 250);
        this.actionQueue = [];
    },
    clearFrame: function(){
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height)
    },
    over: function(){
        clearInterval(this.interval);
        this.context.fillStyle = "#ff000066";
        this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#1122cccc";
        this.context.fillRect(10,this.canvas.height/3,this.canvas.width-20, this.canvas.height/3);
        this.context.strokeStyle= "white";
        this.context.textAlign='center';
        this.context.font = "80px Arial";
        this.context.strokeText("Game Over",this.canvas.width/2,this.canvas.height/2);
        this.context.font = "20px Arial";
        this.context.fillStyle="#ccc"
        this.context.fillText("Press ENTER key to restart",this.canvas.width/2,this.canvas.height/2+40);
        this.is_halted = true;
    }
}

food_model = function(x, y, color= "red"){
    this.x = 0;
    this.y = 0;
    this.location = [0,0];
    this.color = color;
    this.relocateFood = function(){
        this.location = [getRandomInRange(0,gridRows-1), getRandomInRange(0, gridColumns-1)];
        if (snake.inTheBody(this.location))
        {
            this.relocateFood();
        }

    }
    this.drawCurrentState = function(){
        ctx = game.context;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle=("#844");
        // ctx.fillRect(this.location[1]*this.width, this.location[0]*this.height, this.width, this.height);
        ctx.arc(this.location[1]*gridSize+gridSize/2, this.location[0]*gridSize+gridSize/2, gridSize/2, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}
snake_model = function(color= "blue"){
    this.trace = [];
    this.color = color;
    this.direction = "Right"
    this.drawCurrentState = function(){
        ctx = game.context;
        ctx.fillStyle = this.color;
        for (i=0; i<this.trace.length; i++ )
        {
            if (i == this.trace.length-1)
                ctx.fillStyle = "#444";
            ctx.fillRect(this.trace[i][1]*gridSize+1, this.trace[i][0]*gridSize+1, gridSize-2, gridSize-2);
        }
    }
    this.inTheBody = function(coords){
        for (i=0; i<this.trace.length; i++ )
        {
            if (coords[0] == this.trace[i][0] && coords[1] == this.trace[i][1])
                return true;
        }
        return false;
    }
}

function startGame(){
     game.start();
     food = new food_model(30,30, "lightgreen");
     snake = new snake_model("#447");
     snake.trace.push([gridRows/2, gridColumns/2-1]) //Initialize snake position in these two middle coordinates
     snake.trace.push([gridRows/2, gridColumns/2])
     food.relocateFood();
}

function updateGame() {
    snakeHead = snake.trace[snake.trace.length-1];
    snakeTail = snake.trace[0];
    while (keyPressed = game.actionQueue.shift()){
        if(keyPressed == "Up" || keyPressed == "Down"){
            if (snake.direction != "Up" && snake.direction != "Down")
            {
                snake.direction = keyPressed;
                break;
            }
        }
        else {
            if (snake.direction != "Left" && snake.direction != "Right")
            {
                snake.direction = keyPressed;
                break;
            }
        }
    }
    updatedSnakeHead=[]
    switch(snake.direction){
        case "Right": updatedSnakeHead[0] = snakeHead[0]; updatedSnakeHead[1] = wrapAroundNumber(snakeHead[1]+1, gridColumns)
                    break;
        case "Left": updatedSnakeHead[0] = snakeHead[0]; updatedSnakeHead[1] = wrapAroundNumber(snakeHead[1]-1, gridColumns)
                    break;
        case "Up": updatedSnakeHead[0] = wrapAroundNumber(snakeHead[0]-1, gridRows); updatedSnakeHead[1] = snakeHead[1];
                    break;
        case "Down": updatedSnakeHead[0] = wrapAroundNumber(snakeHead[0]+1, gridRows); updatedSnakeHead[1] = snakeHead[1];
                    break;
    }
    if (updatedSnakeHead[0] == food.location[0] && updatedSnakeHead[1] == food.location[1]){
        food.relocateFood();
        game.score+=10;
        document.getElementById("score").getElementsByTagName("span")[0].innerHTML= game.score;
    }
    else {
        snake.trace.shift();
    }
    if(snake.inTheBody(updatedSnakeHead)){
        game.over();
        return;
    }
    snake.trace.push(updatedSnakeHead);
    game.clearFrame();
    food.drawCurrentState();
    snake.drawCurrentState();
}


function getRandomInRange(min, max) {
    return Math.floor(Math.random()*(max-min)+min);
}

function wrapAroundNumber(n, max){
    return (n%max+max)%max;
}

document.addEventListener("keydown", function(e){
    if (game.is_halted && e.key=="Enter"){
        game.is_halted = false;
        delete food;
        delete snake;
        startGame();
    }
    if (e.key == "ArrowDown"){
        game.actionQueue.push("Down")
    }
    if (e.key == "ArrowUp"){
        game.actionQueue.push("Up")
    }
    if (e.key == "ArrowRight"){
        game.actionQueue.push("Right")
    }
    if (e.key == "ArrowLeft"){
        game.actionQueue.push("Left")
    }
})


/******
 * TODO
 * (v) Ensure that the food doesn't land on snake itself
 * (v) shift grid to food model/remove grid
 * (v) add logic to game over if it collides with own body
 * (v) pushing multiple control at once, both should apply (action queue)
 * (v) replace width and height with single gridsize
 * make snake run faster as it grow
 * make function for matching 2d array
 * (v) if snake moving to right, prevent it from directly moving left... and handle similar cases
 * (v) make snalke head differrent coloured
 * (v) secure this js
 * (v) center align game over message
 * (x) add some halt in game over message
 * display score
 ******/