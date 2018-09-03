gridSize = 30;
game = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.append(this.canvas);
        this.interval = setInterval(updateGame, 150);
        this.gridColumns = this.canvas.width/gridSize;
        this.gridRows = this.canvas.height/gridSize;
    },
    clearFrame: function(){
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height)
    },
}

food_model = function(x, y, color= "red"){
    this.x = 0;
    this.y = 0;
    this.width = gridSize;
    this.height = gridSize;
    this.location = [0,0];
    this.color = color;
    this.relocateFood = function(){
        this.location = [getRandomInRange(0,game.gridRows-1), getRandomInRange(0, game.gridColumns-1)];
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
        ctx.arc(this.location[1]*this.width+this.width/2, this.location[0]*this.height+this.height/2, this.width/2, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}
snake_model = function(color= "blue"){
    this.width = gridSize;
    this.height = gridSize;
    this.trace = [];
    this.color = color;
    this.direction = "Right"
    this.drawCurrentState = function(){
        ctx = game.context;
        ctx.fillStyle = this.color;
        for (i=0; i<this.trace.length; i++ )
        {
            ctx.fillRect(this.trace[i][1]*this.width+1, this.trace[i][0]*this.height+1, this.width-2, this.height-2);
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
     snake.trace.push([game.gridRows/2, game.gridColumns/2-1]) //Initialize snake position in these two middle coordinates
     snake.trace.push([game.gridRows/2, game.gridColumns/2])
     food.relocateFood();
}

function updateGame() {
    snakeHead = snake.trace[snake.trace.length-1];
    snakeTail = snake.trace[0];
    updatedSnakeHead=[]
    switch(snake.direction){
        case "Right": updatedSnakeHead[0] = snakeHead[0]; updatedSnakeHead[1] = wrapAroundNumber(snakeHead[1]+1, game.gridColumns)
                    break;
        case "Left": updatedSnakeHead[0] = snakeHead[0]; updatedSnakeHead[1] = wrapAroundNumber(snakeHead[1]-1, game.gridColumns)
                    break;
        case "Up": updatedSnakeHead[0] = wrapAroundNumber(snakeHead[0]-1, game.gridRows); updatedSnakeHead[1] = snakeHead[1];
                    break;
        case "Down": updatedSnakeHead[0] = wrapAroundNumber(snakeHead[0]+1, game.gridRows); updatedSnakeHead[1] = snakeHead[1];
                    break;
    }
    if(snake.inTheBody(updatedSnakeHead)){
        alert("Game Over !!!");
    }
    snake.trace.push(updatedSnakeHead);
    if (updatedSnakeHead[0] == food.location[0] && updatedSnakeHead[1] == food.location[1]){
        food.relocateFood();
        // add extra score
    }
    else {
        snake.trace.shift();
    }
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
    if (e.key == "ArrowDown"){
        if (snake.direction != "Up")
            snake.direction = "Down";
    }
    if (e.key == "ArrowUp"){
        if (snake.direction != "Down")
            snake.direction = "Up";
    }
    if (e.key == "ArrowRight"){
        if (snake.direction != "Left")
            snake.direction = "Right";
    }
    if (e.key == "ArrowLeft"){
        if (snake.direction != "Right")
            snake.direction = "Left";
    }
})


/******
 * TODO
 * (v) Ensure that the food doesn't land on snake itself
 * (v) shift grid to food model/remove grid
 * add logic to game over if it collides with own body
 * pushing multiple control at once, both should apply
 * replace width and height with single gridsize
 * make snake run faster as it grow
 * make function for matching 2d array
 * (v) `if snake moving to right, prevent it from directly moving left... and handle similar cases
 */