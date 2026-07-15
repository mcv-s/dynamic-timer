
var timerRunning = false;
var seconds = 0;
var key = localStorage.getItem("timerKey");
if (key === null) {
    key = "mcvs-dynamic-timer-null";
    localStorage.setItem("timerKey", key);
    
}
console.log("Loaded timer key from localStorage: " + key);


const params = new URLSearchParams(window.location.search);
var keyParam = params.get("key");
if (keyParam !== null) {
    key = "mcvs-dynamic-timer-" + keyParam;
    console.log("Set timer key to ", key, " loaded from URL parameter");
}






const button = document.getElementById("ToggleTimer");
const timer = document.getElementById("Timer");
const keyText = document.getElementById("SetKey");

keyText.textContent = "Key: " + key;









function setKey() {
    let input = prompt("Set key to:");
    key = "mcvs-dynamic-timer-" + input;
    localStorage.setItem("timerKey", key);
    keyText.textContent = "Key: " + key;

}








async function getData() {
    const response = await fetch(`https://api.keyval.org/get/${key}`);
    const data = await response.json();

    return data.val;
}




function setData(value) {
    fetch(`https://api.keyval.org/set/${key}/${value}`);
    console.log("Set seconds to: " + value);
}




async function fetch_latest() {
    seconds = (await getData());
    console.log("Fetched latest seconds: " + seconds);
}





// Initialize the timer with the latest value from the server when the page loads
fetch_latest();











function toggleTimer() {

    if (button.textContent === "Start Timer") {
        fetch_latest();
        button.textContent = "Stop Timer";
    }
    else {
        setData(seconds);
        button.textContent = "Start Timer";
    }

    timerRunning = !timerRunning;

}


function setTimer() {
    let input = prompt("Set timer to:");

    seconds = Number(input);
    setData(seconds)

}





function second() {
    if (timerRunning) {
    seconds++;
    }
}





function tick() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    timer.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

setInterval(tick, 10);
setInterval(second, 1000);



setInterval(updateCloud, 5000);





function updateCloud() {
    if (!timerRunning) {
        fetch_latest();
    }

    if (timerRunning) {
        setData(seconds);
    }
}











// hide controls if not focused

const controls = document.querySelector(".controls");

window.addEventListener("focus", () => {
    controls.classList.add("focused");
});

window.addEventListener("blur", () => {
    controls.classList.remove("focused");
});