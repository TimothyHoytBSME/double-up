
const Version = "1.0-alpha-doubleup"


var backColor = [20,20,20];
var gridDims = [8,6]


var gridSize = [1,1] //gets calculated
var size = 10;  //gets calculated
var selected = [-1,-1]  //gets calculated
var target = [-1,-1]    //gets calculated
var pieceSize = 1; //gets calculated
var textW = 1;  //gets calculated
var textH = 10 //gets calculated
var gameCent = [] //gets calculated
var gameGrid = [] //gets calculated
var newBox = [] //gets calculated
var menuBox = [] //gets calculated
var returnBox = [] //gets calculated
var gameActive = true; //gets calculated
var chain = [] //gets calculated
// var difficulty = 0 //gets calculated
// var difficulties = ["EASY","CHALLENGE","IMPOSSIBLE"]
var score = 0//[0,0,0,0,0,0,0,0,0]; //gets calculated
var justScored = false; //gets calculated

const vals = [
    "1","2","4","8","16","32","64","128","256","512",
    "1K","2K","4K","8K","16K","32K","64K","128K","256K","512K",
    "1M","2M","4M","8M","16M","32M","64M","128M","256M","512M",
    "1B","2B","4B","8B","16B","32B","64B","128B","256B","512B",
    "1T","2T","4T","8T","16T","32T","64T","128T","256T","512T",
    "1Q","2Q","4Q","8Q","16Q","32Q","64Q","128Q","256Q","512Q"
]

const colors = [
    [64,0,0],[64,64,0],[0,64,0],[0,64,64],[0,0,64],[64,0,64],[64,80,0],[0,64,80],[80,0,64],[64,64,64],
    [72,0,0],[72,72,0],[0,72,0],[0,72,72],[0,0,72],[72,0,72],[72,86,0],[0,72,86],[86,0,72],[72,72,72],
    [78,0,0],[78,78,0],[0,78,0],[0,78,78],[0,0,78],[78,0,78],[78,92,0],[0,78,92],[92,0,78],[78,78,78],
    [84,0,0],[84,84,0],[0,84,0],[0,84,84],[0,0,84],[84,0,84],[84,98,0],[0,84,98],[98,0,84],[84,84,84],
    [90,0,0],[90,90,0],[0,90,0],[0,90,90],[0,0,90],[90,0,90],[90,104,0],[0,90,104],[104,0,90],[90,90,90],
    [96,0,0],[96,96,0],[0,96,0],[0,96,96],[0,0,96],[96,0,96],[96,110,0],[0,96,110],[110,0,96],[96,96,96],
]

for(var i=0; i<6; i++){
    var b1 = 150
    var b2 = 180
    var m = 12
    var row = [[b1+i*m,0,0],[b1+i*m,b1+i*m,0],[0,b1+i*m,0],[0,b1+i*m,b1+i*m],
               [0,0,b1+i*m],[b1+i*m,0,b1+i*m],[b1+i*m,b2+i*m,0],[0,b1+i*m,b2+i*m],[b2+i*m,0,b1+i*m],[b1+i*m,b1+i*m,b1+i*m]]
}

//Main Animation Loop
const mainLoop = function(){
    const currTime = new Date();
    const lapse = currTime - startTime
    ctx.fillStyle = "rgb(0, 0, 0)"; ctx.fillRect(0, 0, cWidth, cHeight);

    /////////////////////////draw/////////////////////////

    fillRec(gameRec, colText(backColor))
    
    gameCent = [gameRec[0]+gameRec[2]/2, gameRec[1] + gameRec[3]/2]

    if(gameActive){

        if(verticalOrien){
            gridSize[0] = gridDims[1]
            gridSize[1] = gridDims[0]
            marg = gameRec[2]/60;
            size = (gameRec[2]-marg*2)/gridSize[0]
        }else{
            gridSize[1] = gridDims[1]
            gridSize[0] = gridDims[0]
            marg = gameRec[3]/60;
            size = (gameRec[3]-marg*2)/gridSize[1]
        }

        for(var i = 0; i<gridSize[0]; i++){
            for(var j = 0; j<gridSize[1]; j++){
                
                const gridSizePix = [gridSize[0]*size, gridSize[1]*size]
                var gridPos = [gameCent[0]-gridSizePix[0]/2, gameCent[1]-gridSizePix[1]/2]
                var piece = [1,1,1]
                var isInChain = false
                if(verticalOrien){
                    piece = gameGrid[j][gridSize[0]-i-1]
                    isInChain = includesPoint(chain,[j,gridSize[0]-i-1])
                }else{
                    piece = gameGrid[i][j]
                    gridPos = [gridPos[0], gridPos[1]]
                    isInChain = includesPoint(chain,[i,j])
                }
                pieceSize = size-marg;
                const pieceLeft = gridPos[0]+i*size+marg/2
                const pieceTop = gridPos[1]+j*size+marg/2

                if(isInChain){
                    fillRec([ pieceLeft-2, pieceTop-2, pieceSize+4, pieceSize+4], "white")
                }

                fillRec([ pieceLeft, pieceTop, pieceSize, pieceSize], colText(colors[piece.valInd]))

                if(piece.valInd||(piece.valInd === 0)){
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    var tSize = (vals[piece.valInd].length < 4)? pieceSize/2 : pieceSize/3
                    fillText(pieceLeft+pieceSize/2, pieceTop+pieceSize/2, vals[piece.valInd], tSize, "white")
                    ctx.textAlign = 'left'
                    ctx.textBaseline = 'bottom'
                }
                

                if(mouseDownCan){
                    if(((mdX >= pieceLeft)&&(mdX <= (pieceLeft+pieceSize)))&&((mdY >= pieceTop)&&(mdY <= (pieceTop+pieceSize)))){
                        if(verticalOrien){
                            selected = [j, gridSize[0]-i-1]
                        }else{
                            selected = [i,j]
                        }
                        if((!includesPoint(chain,selected))){
                            chain.push([...selected])
                            soundPlayed = false
                        }
                    }

                    var hitzone = 0.8
                    var hitmarg = pieceSize*(1-hitzone)/2
                    if(((mX >= (pieceLeft+hitmarg))&&(mX <= (pieceLeft+pieceSize-hitmarg)))&&((mY >= (pieceTop+hitmarg))&&(mY <= (pieceTop+pieceSize-hitmarg)))){
                        
                        if(verticalOrien){
                            target = [j,gridSize[0]-i-1]
                        }else{
                            target = [i,j]
                        }
                        if((!includesPoint(chain,target))&&(chain.length>0)){
                            const prev = chain[chain.length-1]
                            const choices = getNeighbors(prev)

                            if(includesPoint(choices,target)){
                                const prevValInd = gameGrid[prev[0]][prev[1]].valInd
                                const targValInd = gameGrid[target[0]][target[1]].valInd
                                if(chain.length == 1){
                                    if(prevValInd==targValInd){
                                        chain.push([...target])
                                        soundPlayed = false
                                    }
                                }else if(prevValInd==(targValInd-1)){
                                    chain.push([...target])
                                    soundPlayed = false
                                }
                                
                            }
                        }else if(chain.length>0){
                            var done = false
                            while(!done){
                                if(arrEq(chain[chain.length-1],target)){
                                    done = true
                                }else{
                                    chain.pop()
                                }
                            }
                            
                        }
                    }
                }else{
                    selected = [-1,-1]
                    target = [-1,-1]
                }
            }
        }
    }else{
        console.log('Game Paused')
    }


    /////////////////////////////text/////////////////////////////////////
    
    if(verticalOrien){
        textW = gameRec[2]/5
    }else{
        textW = gameRec[3]/5
    }
    
    const textXoff = textW/8
    textH = textW*0.375

    if(gameActive){
        
        newBox = [gameRec[0]+textXoff, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(newBox[0], newBox[1]+newBox[3], "NEW", newBox[3], "black")
        fillText(newBox[0], newBox[1]+newBox[3], "NEW", newBox[3], "white")

        menuBox = [gameRec[0]+gameRec[2]-textXoff*1.5-textW, gameRec[1]+gameRec[3]-textH, textW, textH]
        shadowText(menuBox[0], menuBox[1]+menuBox[3], "MENU", menuBox[3], "black")
        fillText(menuBox[0], menuBox[1]+menuBox[3], "MENU", menuBox[3], "white")

        ctx.textAlign = "center"
        ctx.textBaseline = 'middle'
        if(verticalOrien){
            shadowText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1]-textH, "SCORE", textH*0.75, "black")
            fillText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1]-textH, "SCORE", textH*0.75, "white")
            shadowText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1], score.toString(), textH*0.75, "black")
            fillText(gameCent[0]+textH*4, gameRec[3]/10+gameRec[1], score.toString(), textH*0.75, "white")

            // shadowText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1], difficulties[difficulty], textH*0.75, "black")
            // fillText(gameCent[0]-textH*4, gameRec[3]/10+gameRec[1], difficulties[difficulty], textH*0.75, "white")

        }else{
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*3, "SCORE", textH*0.75, "white")
            shadowText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*2, score.toString(), textH*0.75, "black")
            fillText(gameRec[2]/13+gameRec[0], gameCent[1]-textH*2, score.toString(), textH*0.75, "white")

            // shadowText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*3, difficulties[difficulty], textH*0.75, "black")
            // fillText(-gameRec[2]/13+gameRec[0]+gameRec[2], gameCent[1]-textH*3, difficulties[difficulty], textH*0.75, "white")
        }
        ctx.textAlign = "left"
        ctx.textBaseline = 'bottom'
        
    }else{
        //paused
        returnBox = [gameRec[0]+gameRec[2]-textXoff*5-textW, gameRec[1]+gameRec[3]-textH, textW*2, textH]
        shadowText(returnBox[0], returnBox[1]+returnBox[3], "RETURN", returnBox[3], "black")
        fillText(returnBox[0], returnBox[1]+returnBox[3], "RETURN", returnBox[3], "white")

        ctx.textAlign = 'center'
        var message1 = "Combine two adjecent like tiles to double up".toUpperCase()
        shadowText(gameCent[0], gameCent[1]-gameRec[3]/3, message1, textH/3, "black")
        fillText(gameCent[0], gameCent[1]-gameRec[3]/3, message1, textH/3, "white")

        var message2 = "Continue the chain with higher numbers".toUpperCase()
        shadowText(gameCent[0], gameCent[1]+textH-gameRec[3]/3, message2, textH/3, "black")
        fillText(gameCent[0], gameCent[1]+textH-gameRec[3]/3, message2, textH/3, "white")
        ctx.textAlign = 'left'
    }

    //////////////////////////////////////////cursor////////////////////////////
    if(!isMobileDevice){
        fillCir([mX, mY, 12], 'rgba(0,0,0,0.5)')
        fillCir([mX, mY, 10], 'rgba(255,255,255,0.5)')
    }


    if((!soundPlayed)&&(audioAllowed)){
        
        if(chain.length == 0){
            if(justScored){
                pop_high.play();
                justScored = false;
            }else{
                pop_low.play();
            }
        }else{
            pop_mid.play();
        }
        
        soundPlayed = true;
    }

    //////////////////////////////next frame////////////////////////////////
    window.requestAnimationFrame(mainLoop);
    dlastLapse = lapse;
}


const checkRelease = function(){
    if(gameActive){
        if(chain.length > 0){
            soundPlayed = false
        }

        if(chain.length >1){
            justScored = true
            var last = chain[chain.length -1]
            var lastInd = gameGrid[last[0]][last[1]].valInd
            var newInd = lastInd+1
            gameGrid[last[0]][last[1]].valInd = newInd
            score+= (lastInd+1)*(lastInd+1)
            for(var i=0; i<(chain.length-1); i++){
                var p = chain[i]
                gameGrid[p[0]][p[1]].valInd = floor(random()*3)

            }
            saveGame()
        }
        

        selected = [-1,-1]
        target = [-1,-1]
        chain = []
    }
}

const doNew = function(){
    
    if (confirm('This will erase your score. Are you sure?')) {
        score = 0;
        genGrid()
    }
}


const click = function(){
    if(gameActive){


        if((mdX > (newBox[0]))&&(mdY > newBox[1])&&(mdX < (newBox[0]+newBox[2]))&&(mdY<(newBox[1]+newBox[3]))){
            console.log("new clicked")
            doNew()
        }


        if((mdX > (menuBox[0]))&&(mdY > menuBox[1])&&(mdX < (menuBox[0]+menuBox[2]))&&(mdY<(menuBox[1]+menuBox[3]))){
            console.log("menu clicked")
            gameActive = false;
            // theMenuDiv.style.visibility = "visible"
        }


    }else{
        if((mdX > (returnBox[0]))&(mdY > returnBox[1])&&(mdX < (returnBox[0]+returnBox[2]))&&(mdY<(returnBox[1]+returnBox[3]))){
            console.log("return clicked")
            // theMenuDiv.style.visibility = "hidden"
            gameActive = true;
        }
    }
}

const genGrid = function(){

    console.log('generating new grid')
    gameGrid = []

    const ranGrid = function(){
        for(var i=0; i<gridDims[0]; i++){
            const row = []
            for(var j=0; j<gridDims[1]; j++){
                var piece = []
                piece = {
                    valInd: floor(random()*4)
                }
                row.push(piece)
            }
            gameGrid.push(row)
        }

        
    }

    ranGrid()

    console.log('grid', gameGrid)

    genGoal()
    saveGame()
}

var goalAttempts = 0;
const maxGoalAttempts = 10;

const genGoal = function(){
    goalAttempts++

    if(goalAttempts > maxGoalAttempts){
        goalAttempts = 0
        console.error('MAX GOAL ATTEMPTS REACHED, NEW GRID')
        genGrid()
        return
    }

    
}



const saveGame = function(){
    const gameObj = {
        "gameGrid": deepClone(gameGrid),
        "score": score,
        "gridDims": [...gridDims],
    }

    const gameString = JSON.stringify(gameObj)
    window.localStorage.setItem(Version,gameString)
    console.log("GAME SAVED")
}


const loadGameDataIfAble = function(){
    if (!(localStorage.getItem(Version) === null)) {
        const gameObj = JSON.parse(window.localStorage.getItem(Version))
        score = gameObj.score
        gridDims = [...gameObj.gridDims]
        gameGrid = deepClone(gameObj.gameGrid)

        console.log('GAME LOADED FROM STORAGE')
    }else{
    
        genGrid()
    }
}

loadGameDataIfAble()




