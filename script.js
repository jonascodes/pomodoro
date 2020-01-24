// add on-click event listeners
const btnWorktimeUp = document.querySelector('#btn-worktime-up');
btnWorktimeUp.addEventListener('click', (e) => {
        ProcessClick(e.target.id)
});
const btnWorktimeDown = document.querySelector('#btn-worktime-down');
btnWorktimeDown.addEventListener('click', (e) => {
        ProcessClick(e.target.id)
});
const btnBreaktimeUp = document.querySelector('#btn-breaktime-up');
btnBreaktimeUp.addEventListener('click', (e) => {
        ProcessClick(e.target.id)
});
const btnBreaktimeDown = document.querySelector('#btn-breaktime-down');
btnBreaktimeDown.addEventListener('click', (e) => {
        ProcessClick(e.target.id)
});
const btnStop = document.querySelector('#btn-stop');
btnStop.addEventListener('click', (e) => {
        ProcessClick(e.target.id)
});
const btnPlay = document.querySelector('#btn-play');
btnPlay.addEventListener('click', (e) => {
        ProcessClick(e.target.id)
});
const btnReset = document.querySelector('#btn-reset');
btnReset.addEventListener('click', (e) => {
        ProcessClick(e.target.id)
});
const btnAudio = document.querySelector('#audio');
btnAudio.addEventListener('click', (e) => {
        ProcessClick(e.target.id)
});

// set initial work timer in seconds
let work_time = 25;
let work_time_default = 25;

// set initial break timer in seconds
let break_time = 5;
let break_time_default = 5;

// initialization
// set status (stopped, running, paused)
var wav_ride = new Audio('./ride.wav');
let sound = "off";
let status = "stopped";
let phase = "work";
let timer_start_value = work_time * 60;
let timer_value = timer_start_value;
UpdateTimeDisplay(timer_value);

// control what happens when a button is clicked
function ProcessClick(btnID) {
    if (btnID == "btn-reset") {
        Reset();
    }
    if (btnID == "btn-play") {
        if (status == "stopped" || status == "paused"){
            // StartTimer();
            // ChangePlayIcon("running");
            status = "running";
            timer_start_time = Date.now();
            timer_start_value = timer_value;
            StartTimer();
            DisplayPhase(phase);
            SetPlayIcon("pause");
        } else if (status == "running"){
            // PauseTimer();
            // ChangePlayIcon("paused");
            // PauseTimer();
            status = "paused";
            DisplayPhase(phase);
            SetPlayIcon("play");
        }
    }
    if (btnID == "btn-stop") {
        if (status == "running" || status == "paused") {
            Stop();
        }
    }
    if (btnID == "btn-worktime-up") {
        if (status == "stopped"){
            WorktimeUp();
        }
    }
    if (btnID == "btn-worktime-down") {
        if (status == "stopped"){
            WorktimeDown();
        }
    }
    if (btnID == "btn-breaktime-up") {
        if (status == "stopped"){
            BreaktimeUp();
        }
    }
    if (btnID == "btn-breaktime-down") {
        if (status == "stopped"){
            BreaktimeDown();
        }
    }
    if (btnID == "audio") {
        ToggleAudio();
    }                         
}

function ToggleAudio() {
    if (sound == "off") {
        sound = "on";
        document.getElementById("audio").innerHTML = '<i class="fa fa-bell-o"></i>';
    } else {
        sound = "off";
        document.getElementById("audio").innerHTML = '<i class="fa fa-bell-slash-o"></i>';
    }
}

// Start the timer
function StartTimer() {
    if (status == "running") {
        timer_value = timer_start_value - Math.floor((Date.now() - timer_start_time) / 1000);
        if (timer_value <= 0) {
            SwitchPhase();
        }
        UpdateTimeDisplay(timer_value);        
        setTimeout(StartTimer, 500);
        DisplayPhase(phase);
    }
}

// swith between work and break
function SwitchPhase() {
    if (phase == "work") {
        phase = "break";
        timer_start_value = break_time * 60;
        timer_start_time = Date.now();
        timer_value = timer_start_value - Math.floor((Date.now() - timer_start_time) / 1000);
    } else if (phase == "break") {
        phase = "work";
        timer_start_value = work_time * 60;
        timer_start_time = Date.now();
        timer_value = timer_start_value - Math.floor((Date.now() - timer_start_time) / 1000);
    }
    if (sound == "on") {
        wav_ride.play();
    }
}

// Display The current phase
function DisplayPhase(p) {
    var myText = "&nbsp;";
    if (status == "running") {    
        if (p == "work") {myText = "working...";}
        if (p == "break") {myText = "coffee break";}
    } else if (status == "paused") {
        myText = "paused";
    }
    document.querySelector('#grid-status').textContext = ""; 
    document.querySelector('#grid-status').innerHTML = myText; 
}


// Change Worktime by 1 Minute, max 99, min 1
function WorktimeUp() {
    if (work_time < 99) {
        work_time = work_time + 1;
        document.querySelector('#worktime').textContent = work_time;
    }
    timer_value = work_time * 60;
    UpdateTimeDisplay(timer_value);
}
function WorktimeDown() {
    if (work_time > 1) {
        work_time = work_time - 1;
        document.querySelector('#worktime').textContent = work_time;
    }
    timer_value = work_time * 60;
    UpdateTimeDisplay(timer_value);
}
function BreaktimeUp() {
    if (break_time < 99) {
        break_time = break_time + 1;
        document.querySelector('#breaktime').textContent = break_time;
    }
}
function BreaktimeDown() {
    if (break_time > 1) {
        break_time = break_time - 1;
        document.querySelector('#breaktime').textContent = break_time;
    }
}

// Reset
function Reset() {
    work_time = work_time_default;    
    break_time = break_time_default;
    document.querySelector('#worktime').textContent = work_time;
    document.querySelector('#breaktime').textContent = break_time;
    timer_start_value = work_time * 60;
    timer_value = timer_start_value;
    UpdateTimeDisplay(timer_value);
    status = "stopped";
    phase = "work";
    DisplayPhase(phase);
    SetPlayIcon("play");
}

// Stop
function Stop() {
    document.querySelector('#worktime').textContent = work_time;
    document.querySelector('#breaktime').textContent = break_time;
    timer_start_value = work_time * 60;
    timer_value = timer_start_value;
    UpdateTimeDisplay(timer_value);
    status = "stopped";
    phase = "work";
    DisplayPhase(phase);
    SetPlayIcon("play");
}

// Update the timer value on screen
function UpdateTimeDisplay(s) {
    hours = AddLeadingZero(String(Math.floor(s / 3600)));
    minutes = AddLeadingZero(String(Math.floor((s - hours * 3600)/60)));
    seconds = AddLeadingZero(String(s - 3600 * hours - 60 * minutes)); 
    document.querySelector('#grid-timer').textContent = hours + ":" + minutes + ":" + seconds 
} 

function AddLeadingZero(str) {
    if (str.length == 1) {
        return "0" + str;
    } else {
        return str;
    }
}

function SetPlayIcon(icon) {
    if (icon == "pause") {
        document.getElementById("btn-play").innerHTML = '<i id="icon-play" class="fa fa-pause"></i>';
    } else if (icon == "play") {
        document.getElementById("btn-play").innerHTML = '<i id="icon-play" class="fa fa-play"></i>';
    }

}
