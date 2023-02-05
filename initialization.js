
////////////////
//universal initialization
///////////////////

readWindowSize();
canvas.id = "theCanvas"; canvas.oncontextmenu = () => {return false;}
checkVerticalOrien(); sizeCanvas();
window.addEventListener('resize', sizeCanvas, true);
window.requestAnimationFrame(mainLoop);
console.log('App Started')