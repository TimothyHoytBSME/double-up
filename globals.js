////////////////
//globals
////////////////

const root = document.documentElement;
const canvas = document.createElement('canvas');
const mainDiv = document.getElementsByTagName('main')[0]
mainDiv.appendChild(canvas)
const ctx = canvas.getContext("2d");
// const theMenuDiv = document.getElementById('themenu')
// const difficultyDiv = document.getElementById('difficulty')
// const gametypeDiv = document.getElementById('gametype')

// difficultyDiv.onchange = ()=>{  
//     // difficulty = difficultyDiv.selectedIndex
//     // if(gameGrids[difficulty*typesOfGoals.length + typeOfGoalNum][0]){
//     //     gameGrid = JSON.parse(JSON.stringify(gameGrids[difficulty*typesOfGoals.length + typeOfGoalNum]))
//     //     currentGoal = goals[difficulty*typesOfGoals.length + typeOfGoalNum]
//     // }else{
//     //     genGrid()
//     // }
// }

// gametypeDiv.onchange = ()=>{
//     // var ind = gametypeDiv.selectedIndex
//     // typeOfGoal = typesOfGoals[ind]
//     // typeOfGoalNum = ind
//     // console.log("game type changed", typeOfGoal)
//     // if(gameGrids[difficulty*typesOfGoals.length + typeOfGoalNum][0]){
//     //     gameGrid = JSON.parse(JSON.stringify(gameGrids[difficulty*typesOfGoals.length + typeOfGoalNum]))
//     //     currentGoal = goals[difficulty*typesOfGoals.length + typeOfGoalNum]
//     // }else{
//     //     genGrid()
//     // }
// }

const startTime = new Date();

var isTouchDevice = false;
var isMobileDevice = false;

if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)) 
    {isMobileDevice = true ;}
    
if(isMobileDevice) {
    console.log('MOBILE DETECTED')
    canvas.style.width = "100%"
    canvas.style.height = "100%"
}

//universal variables
var dvp, ar, brect, wWidth, wHeight, cWidth, cHeight, mX, mY, mdX, mdY, muX, muY;
var mouseDownCan = false; var verticalOrien = false;
var firstFrame = true; 
var clastLapse = 0; var dlastLapse = 0;
var time = 0;
var marg = 10;
const gameRec = [marg, marg,100,100]
var rat = 16/9;


//Mute button setup
var un_mute = document.getElementById('un-mute');
var muteimages = document.getElementsByClassName('muteimage')


un_mute.onclick = function() {
    console.log('toggling sound')
    if(AudioContext){
        console.log('audiocontext detected')
        if (audioContext.state === "suspended") {
            console.log('enabling audio')
            audioContext.resume();
        }
        if(!audioAllowed){
            audioAllowed = true;
            pop_high.play()
        }else{
            audioAllowed = false;
        }
    }
};

