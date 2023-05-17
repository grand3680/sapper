let canvas = document.getElementById('main_canvas');
let ctx = canvas.getContext('2d');

var mas = [];
var mas_flags = [];
var timer;
var flagDead = false;
var firstMove = true;

var n = 15; 
var canvasWidth = 500;
var size = canvasWidth / n;


// has random bombs
function randomBoombs() {
    // has randomly x coordinates
    let x = Math.floor((Math.random() * n)); 
    // has randomly y coordinates
    let y = Math.floor((Math.random() * n)); 

    if (mas[y][x] == 3 || mas[y][x] == "boomb") {
        randomBoombs(); 
    } else {
        mas[y][x] = "boomb";   
        drawField();        
    }

}


function CloseWindow() {
    document.getElementById("pWindow").style.display = "none";
	document.getElementById("main_canvas").classList.remove('blur');
}


function goSapper() {
    for (let i = 0; i < n; i++) {
        mas[i] = [];
        mas_flags[i] = [];
        for (let j = 0; j < n; j++) {
            mas[i][j] = 0;
            mas_flags[i][j] = "";
        }
    }
}


// new game
function newGame() {
    // reset the variables
    mas = [];
    mas_flags = [];
    flagDead = false;
    firstMove = true;
    count = 0;

    // re-fill the variables
    goSapper();
}
newGame();

document.getElementById('buttonReset').onclick = newGame;


// makes the area next to the construction site above the makePlace();
function makeAroundPlace(i, j) {
    try {mas[i - 1][j] = "full_cell";} catch (e) {} // from above
    try {mas[i][j + 1] = "full_cell";} catch (e) {} // reference
    try {mas[i + 1][j] = "full_cell";} catch (e) {} // from below
    try {mas[i][j - 1] = "full_cell";} catch (e) {} // left

    try {mas[i - 1][j + 1] = "full_cell";} catch (e) {} // from top to bottom
    try {mas[i + 1][j + 1] = "full_cell";} catch (e) {} // from bottom right
    try {mas[i + 1][j - 1] = "full_cell";} catch (e) {} // from bottom left
    try {mas[i - 1][j - 1] = "full_cell";} catch (e) {} // from top left 
}   

// function opening the initial field
function makePlace(i, j) {
    // Bomb Counting Function Nearby
    let _neighbors_ = neighbors_(i, j);

    // If there are no bombs nearby and the cell is empty, then continue
    if (_neighbors_ == 0 && mas[i][j] == 0) {
        // we fill the cell
        mas[i][j] = "full_cell";

        // recursion.
        try {makePlace(i - 1, j);} catch (e) {}
        try {makePlace(i, j + 1);} catch (e) {}
        try {makePlace(i + 1, j);} catch (e) {}
        try {makePlace(i, j - 1);} catch (e) {}

        try {makePlace(i - 1, j + 1);} catch (e) {}
        try {makePlace(i + 1, j + 1);} catch (e) {}
        try {makePlace(i + 1, j - 1);} catch (e) {}
        try {makePlace(i - 1, j - 1);} catch (e) {}
    } else {
        return;
    }

    if (_neighbors_ == 0 && mas[i][j] == "full_cell") {
        makeAroundPlace(i, j);   
    }  
}


// A function that counts neighbors
function neighbors_(i, j, name = "boomb") {
    let neighbors = 0;
    let _count_ = name;
    let _mas_ = [];

    if (_count_ == "flag")  {_mas_ = mas_flags;}
    if (_count_ == "boomb") {_mas_ = mas;}

    try {if (_mas_[i - 1][j] === _count_) neighbors++;} catch (e) {} // сверху
    try {if (_mas_[i][j + 1] === _count_) neighbors++;} catch (e) {} // справо
    try {if (_mas_[i + 1][j] === _count_) neighbors++;} catch (e) {} // снизу
    try {if (_mas_[i][j - 1] === _count_) neighbors++;} catch (e) {} // слево

    try {if (_mas_[i - 1][j + 1] === _count_) neighbors++;} catch (e) {} // сверху справо
    try {if (_mas_[i + 1][j + 1] === _count_) neighbors++;} catch (e) {} // снизу справо
    try {if (_mas_[i + 1][j - 1] === _count_) neighbors++;} catch (e) {} // слево снизу
    try {if (_mas_[i - 1][j - 1] === _count_) neighbors++;} catch (e) {} // сверху слево 

    return neighbors;
}


// bomb count
function totalBomb() {
    let count_boomb = 0;
    let count_flag = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (mas[i][j] == "boomb") {
                count_boomb++;
            }
        }
    }

    count_flag = count_boomb;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (mas_flags[i][j] == "flag") {
                count_flag--;
            }
        }
    }


    document.getElementById("Boomb_Total").textContent = count_flag;
    return count_boomb;
}

// winnings test
function checkWin() {
    var count = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (mas[i][j] == "full_cell") {
                count++;
            }
        }
    }

    if (count == (n * n) - totalBomb()) {
		document.getElementById("main_canvas").classList.add('blur');
        document.getElementById("pWindow").style.display = "block";
    }
}


// shift function
function shiftFunction(y, x) {
    let neighbors_boomb = neighbors_(y, x);

    if (mas[y][x] == "boomb" && mas_flags[y][x] != "flag") {
        flagDead = true;
        drawField();
        setInterval(alert("you have lost"), 300);        
        return;
    } else if (mas[y][x] == 0 && mas_flags[y][x] != "flag") {
        if (mas[y][x] == 0 && neighbors_boomb == 0) {
            makePlace(y, x);
            mas[y][x] = "full_cell";  
        } else {
            mas[y][x] = "full_cell";  
        }
    }
    drawField();
}


function drawField() {
    // clear the field every frame
	ctx.clearRect(0, 0, canvasWidth, canvasWidth);

    // Enter the Image variable
    var images = new Image();

    totalBomb();

	for (var i = 0; i < n; i++){
		for (var j = 0; j < n; j++){
            // input the neighbors variable
            let neighbors = neighbors_(i, j);

            // If it is a flag, then put the flag image in place
            if (mas_flags[i][j] == "flag") {
                ctx.beginPath()
                images.src = "Images/flag.png";

                ctx.drawImage(images, j * size, i * size, size - 1.5, size - 1.5);
                ctx.closePath();
            } 

            // If it's not a flag, then paint the cage
            if (mas_flags[i][j] != "flag") {
                // the color of the empty cell 
                ctx.beginPath();   
                
                ctx.fillStyle =  "#C0BEC1";

                ctx.fillRect(j * size, i * size, size - 1.5, size - 1.5);
                ctx.stroke();
                ctx.closePath();               
            }

            // check for death, if yes, show all the bombs on the screen
            if (mas[i][j] == "boomb" && flagDead == true) {
                ctx.beginPath();
                images.src = "Images/boomb.png";
 
                ctx.drawImage(images, j * size, i * size, size - 1.5, size - 1.5);
                ctx.closePath();   
            }

            // if the cell is full
            if (mas[i][j] == "full_cell") {
                ctx.beginPath();
                ctx.fillStyle = "#B9B6BF";
                ctx.fillRect(j * size, i * size, size, size);
                ctx.closePath();
                if (mas[i][j] != "boomb" && neighbors <= 8) {
                    // the color of the filled cell
                    ctx.beginPath();
                    ctx.fillStyle =  "#B9B6BF";
                    ctx.fillRect(j * size, i * size, size, size);
                    ctx.closePath();
                    
                    // Changes the color of the text with different number of neighbors
                    if (neighbors == 1) {ctx.fillStyle = "#008000";}
                    if (neighbors == 2) {ctx.fillStyle = "#FF0000";}
                    if (neighbors == 3) {ctx.fillStyle =  "#EDE0C8";}
                    if (neighbors == 4) {ctx.fillStyle = "#08018D"}
                    if (neighbors == 5) {ctx.fillStyle =  "black";}
                    if (neighbors == 6) {ctx.fillStyle =  "#F67C5F";}
                    if (neighbors == 7) {ctx.fillStyle =  "#F65E3B";}
                    if (neighbors == 8) {ctx.fillStyle =  "red";}   
                        
                    // text size 20px
                    ctx.font = "20px Verdana";

                    // text placement in the middle
                    ctx.textAlign = "center";

                    ctx.fillText(neighbors, (j*size) + (size/2), (i*size) + (size/2) + 5);
                    ctx.stroke();
                    ctx.closePath();
                }                 
            }
		}
	}
}


// Event by pressing a mouse button
canvas.addEventListener("mousedown", function(event) {
    drawField();
    // x cordinate
    let x = event.offsetX;
    // y cordinate
    let y = event.offsetY;

    x = Math.floor(x / size);
    y = Math.floor(y / size);

    // left mouse button
    if (event.button == 0) {
        // if the first move
        if (firstMove == true) {
            mas[y][x] = 3;
            try {mas[y - 1][x] = 3;} catch (e) {}
            try {mas[y][x + 1] = 3;} catch (e) {}
            try {mas[y + 1][x] = 3;} catch (e) {}
            try {mas[y][x - 1] = 3;} catch (e) {}

            try {mas[y - 1][x + 1] = 3} catch (e) {}
            try {mas[y + 1][x + 1] = 3} catch (e) {}
            try {mas[y + 1][x - 1] = 3} catch (e) {}
            try {mas[y - 1][x - 1] = 3} catch (e) {}

            for (let k = 0; k < n * 2; k++) {
                randomBoombs();
            }

            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (mas[i][j] == 3) {
                        mas[i][j] = 0;
                    }
                }
            }

            makePlace(y, x);
            drawField();
            totalBomb();
            firstMove = false;
        } 

        if (mas[y][x] == 0 && event.shiftKey != true && flagDead != true) {
            makePlace(y, x);   
            mas[y][x] = "full_cell";     
            drawField();
            checkWin();      
        }
           
        // If you clicked on the bomb
        if (mas[y][x] == "boomb") {
            if (firstMove == false) {
                flagDead = true;
                alert("вы проиграли");   
            }
        } else if (flagDead != true) {
            if (event.shiftKey) {
                let _neighbors_ = neighbors_(y, x);
                let neighbors_flag = neighbors_(y, x, "flag");
                if (_neighbors_ != 0) {
                    if (_neighbors_ == neighbors_flag) {
                        try {shiftFunction(y - 1, x);} catch (e) {}
                        try {shiftFunction(y, x + 1);} catch (e) {}
                        try {shiftFunction(y + 1, x);} catch (e) {}
                        try {shiftFunction(y, x - 1);} catch (e) {}

                        try {shiftFunction(y - 1, x + 1);} catch (e) {}
                        try {shiftFunction(y + 1, x + 1);} catch (e) {}
                        try {shiftFunction(y + 1, x - 1);} catch (e) {}
                        try {shiftFunction(y - 1, x - 1);} catch (e) {}                        
                    }

                }
            }
            setInterval(drawField, 300);
            makePlace(y, x);
            checkWin();
        }
        drawField();
    }   

    // right mouse button
    if (event.button == 2) {
        if (mas[y][x] != "full_cell") {
            if (mas_flags[y][x] == "flag") {
                mas_flags[y][x] = "";
                drawField();
            } else {
                mas_flags[y][x] = "flag";   
                drawField();   
            }
        }
    }     
})      

drawField();

// turns off the context menu
function disablecontext(e) {
	var clickedEl = (e == null) ? e.srcElement.tagName : e.target.tagName;
	if (clickedEl == "CANVAS") {
		return false;
	}
}
document.oncontextmenu = disablecontext;
