
var soundPlayed = true;
var audioAllowed = false;


var pop_low = document.getElementById('pop_low')
var pop_mid = document.getElementById('pop_mid')
var pop_high = document.getElementById('pop_high')


var AudioContext = (window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext);

var audioContext

if (AudioContext) {
    audioContext = new AudioContext();
    const pop_low_source = audioContext.createMediaElementSource(pop_low);
    const pop_mid_source = audioContext.createMediaElementSource(pop_mid);
    const pop_high_source = audioContext.createMediaElementSource(pop_high);

    pop_low_source.connect(audioContext.destination);
    pop_mid_source.connect(audioContext.destination);
    pop_high_source.connect(audioContext.destination);
}

