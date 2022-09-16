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


// располагает рандомно бомбы
function randomBoombs() {
    // располагает рандомно x кординаты
    let x = Math.floor((Math.random() * n)); 
    // располагает рандомно y кординаты
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


// новая игра
function newGame() {
    // збрасываем переменные
    mas = [];
    mas_flags = [];
    flagDead = false;
    firstMove = true;
    count = 0;

    // заполняем переменные заново
    goSapper();
}
newGame();

document.getElementById('buttonReset').onclick = newGame;


// делает территорию рядом над стройка над makePlace();
function makeAroundPlace(i, j) {
    try {mas[i - 1][j] = "full_cell";} catch (e) {} // сверху
    try {mas[i][j + 1] = "full_cell";} catch (e) {} // справо
    try {mas[i + 1][j] = "full_cell";} catch (e) {} // снизу
    try {mas[i][j - 1] = "full_cell";} catch (e) {} // слево

    try {mas[i - 1][j + 1] = "full_cell";} catch (e) {} // сверху справо
    try {mas[i + 1][j + 1] = "full_cell";} catch (e) {} // снизу справо
    try {mas[i + 1][j - 1] = "full_cell";} catch (e) {} // слево снизу
    try {mas[i - 1][j - 1] = "full_cell";} catch (e) {} // сверху слево 
}   

// функцимя открывающая начальное поля
function makePlace(i, j) {
    // функция подсчёта бомб рядом
    let _neighbors_ = neighbors_(i, j);

    // если нет бомб рядом, и клетка пустая, то дальше
    if (_neighbors_ == 0 && mas[i][j] == 0) {
        // заполняем клетку
        mas[i][j] = "full_cell";

        // рекурсия.
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


// функция которая считает соседей
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


// количество бомб
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

// проверка на выигрыш
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


// шифт функция
function shiftFunction(y, x) {
    let neighbors_boomb = neighbors_(y, x);

    if (mas[y][x] == "boomb" && mas_flags[y][x] != "flag") {
        flagDead = true;
        drawField();
        setInterval(alert("вы проиграли"), 300);        
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
    // очищаем поле каждый кадр
	ctx.clearRect(0, 0, canvasWidth, canvasWidth);

    // ввод переменой Image
    var images = new Image();

    totalBomb();

	for (var i = 0; i < n; i++){
		for (var j = 0; j < n; j++){
            // ввод переменой neighbors
            let neighbors = neighbors_(i, j);

            // если это флаг то ставим изображение флага на место
            if (mas_flags[i][j] == "flag") {
                ctx.beginPath()
                images.src = "Images/flag.png";

                ctx.drawImage(images, j * size, i * size, size - 1.5, size - 1.5);
                ctx.closePath();
            } 

            // если это не флаг то красим клетку
            if (mas_flags[i][j] != "flag") {
                // задём цвет пустой клетки 
                ctx.beginPath();   
                
                ctx.fillStyle =  "#C0BEC1";

                ctx.fillRect(j * size, i * size, size - 1.5, size - 1.5);
                ctx.stroke();
                ctx.closePath();               
            }

            // проверка на смерть, если да, показ всез бомб на экран
            if (mas[i][j] == "boomb" && flagDead == true) {
                ctx.beginPath();
                images.src = "Images/boomb.png";
 
                ctx.drawImage(images, j * size, i * size, size - 1.5, size - 1.5);
                ctx.closePath();   
            }

            // если клетка заполненна
            if (mas[i][j] == "full_cell") {
                ctx.beginPath();
                ctx.fillStyle = "#B9B6BF";
                ctx.fillRect(j * size, i * size, size, size);
                ctx.closePath();
                if (mas[i][j] != "boomb" && neighbors <= 8) {
                    // задём цвет заполненной клетки
                    ctx.beginPath();
                    ctx.fillStyle =  "#B9B6BF";
                    ctx.fillRect(j * size, i * size, size, size);
                    ctx.closePath();
                    
                    // изменяет цвет текста при разном количетсво соседях
                    if (neighbors == 1) {ctx.fillStyle = "#008000";}
                    if (neighbors == 2) {ctx.fillStyle = "#FF0000";}
                    if (neighbors == 3) {ctx.fillStyle =  "#EDE0C8";}
                    if (neighbors == 4) {ctx.fillStyle = "#08018D"}
                    if (neighbors == 5) {ctx.fillStyle =  "black";}
                    if (neighbors == 6) {ctx.fillStyle =  "#F67C5F";}
                    if (neighbors == 7) {ctx.fillStyle =  "#F65E3B";}
                    if (neighbors == 8) {ctx.fillStyle =  "red";}   
                        
                    // размер текста 20px
                    ctx.font = "20px Verdana";

                    // размещение текста по середине
                    ctx.textAlign = "center";

                    ctx.fillText(neighbors, (j*size) + (size/2), (i*size) + (size/2) + 5);
                    ctx.stroke();
                    ctx.closePath();
                }                 
            }
		}
	}
}


// ивент по нажатию мыжки
canvas.addEventListener("mousedown", function(event) {
    drawField();
    // х кордината
    let x = event.offsetX;
    // y кордината
    let y = event.offsetY;

    x = Math.floor(x / size);
    y = Math.floor(y / size);

    // левая кнопка мыши
    if (event.button == 0) {
        // если первый ход
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
           
        // если ты нажал на бомбу
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

    // правая  кнопка мыши
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

// выключает контексное меню
function disablecontext(e) {
	var clickedEl = (e == null) ? e.srcElement.tagName : e.target.tagName;
	if (clickedEl == "CANVAS") {
		return false;
	}
}
document.oncontextmenu = disablecontext;