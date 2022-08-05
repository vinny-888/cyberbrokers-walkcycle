let startTime; 
let gTime; 
let ctx = null;
let workPos = null;
let speed = 0.67;
// The stick man rig with keyframes

let man = updateRigSettings();

function updateSpeed(){
    let elm = document.getElementById('rigSpeed');
    let val = parseInt(elm.value);
    if(val <= 0){
        val = 1;
    } else if(val >= 100){
        val = 99;
    }
    elm.value = val;
    speed = (100-val)/100;
    man = updateRigSettings(man);
}

function loadRig(){
    ctx = canvas.getContext("2d");
    workPos = {x: 0, y: 0}; // to hold working posints and save having to create them every frame
    requestAnimationFrame(mainLoop); 
}

//===============================================================================
// Animation code
function findKeys(keys, gTime){
    var start = keys[0].time;
    var end = keys[keys.length - 1].time;
    var totalTime = end - start;
    var time = gTime - start; 
    let seconds = (time % totalTime);
    time = seconds;//(seconds + totalTime) % totalTime;
    var index = 0;
    while(index <= keys.length){  
        if(keys[index].time <= time && keys[index+1].time > time){ 
            return index; 
        }
        index ++;
    }
    return -1;
}

const eCurve   = (v, p = 2) =>  v < 0 ? 0 : v > 1 ? 1 : Math.pow(v, p) / (Math.pow(v, p) + Math.pow(1 - v, p));
function tweenKeys(key1, key2, gTime, result = {}){
    var totalTime = key2.time - key1.time;
    result.time = ((((gTime - key1.time) / totalTime) % 1) + 1) % 1;  
    result.time = eCurve(result.time); // add the ease in out
    var totalTime = key2.time - key1.time;
    result.time = ((((gTime - key1.time) / totalTime) % 1) + 1) % 1;        
    if (key1.x !== undefined) { result.x = (key2.x - key1.x) * result.time + key1.x }
    if (key1.y !== undefined) { result.y = (key2.y - key1.y) * result.time + key1.y }
    if (key1.ang !== undefined) { result.ang = (key2.ang - key1.ang) * result.time + key1.ang }
    if (key1.len !== undefined) { result.len = (key2.len - key1.len) * result.time + key1.len }
    if (key1.size !== undefined) { result.size = (key2.size - key1.size) * result.time + key1.size }
    return result;
}

function tweenKeysOld(key1, key2, gTime, result = {}){
    var totalTime = key2.time - key1.time;
    result.time = ((((gTime - key1.time) / totalTime) % 1) + 1) % 1;        
    if (key1.x !== undefined) { result.x = (key2.x - key1.x) * result.time + key1.x }
    if (key1.y !== undefined) { result.y = (key2.y - key1.y) * result.time + key1.y }
    if (key1.ang !== undefined) { result.ang = (key2.ang - key1.ang) * result.time + key1.ang }
    if (key1.len !== undefined) { result.len = (key2.len - key1.len) * result.time + key1.len }
    if (key1.size !== undefined) { result.size = (key2.size - key1.size) * result.time + key1.size }
    return result;
}

const keyResult = {x : 0, y : 0, ang : 0, len : 0, size : 0,time : 0}; // this holds tween results and saves us creating objects each loop

// this function get the end pos of a line at angle and len starting at x,y
function angLine(x, y, ang, len, pos = {}) {
    pos.x = x + Math.cos(ang) * len;
    pos.y = y + Math.sin(ang) * len;
    return pos;
}

// draws a line
function drawLine(x, y, x1, y1) {
    ctx.beginPath();
    ctx.lineTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

// draws a circle
function drawCircle(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}


// Recursively draws a rig.

function drawRig(x, y, ang, time, rig) {
    if(rig.color){
        ctx.strokeStyle = `rgb(${rig.color[0]}, ${rig.color[1]}, ${rig.color[2]})`;
    }
    var x1, y1, ang1, end, index;
    if (rig.ang !== undefined) { // is this an angled line?
        if(rig.keys){  // are there key frames???
            index = findKeys(rig.keys, time);
            // console.log('Index:', index);
            tweenKeys(rig.keys[index], rig.keys[index+1], time, keyResult);
            end = angLine(x, y, ang + keyResult.ang, keyResult.len, workPos);            
            rig.ang = keyResult.ang;
        }else{
            end = angLine(x, y, ang + rig.ang, rig.len, workPos);
        }
        drawLine(x, y, end.x, end.y);
        x1 = end.x;
        y1 = end.y;
        ang1 = ang + rig.ang;
    } else if (rig.size) { // is this the head
        ctx.fillStyle = `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
        if(rig.keys){  // are there key frames???
            index = findKeys(rig.keys, time);
            tweenKeys(rig.keys[index], rig.keys[index+1], time, keyResult);
            drawCircle(x, y, keyResult.size);         
        }else{
            drawCircle(x, y, rig.size);
        }
        x1 = x;
        y1 = y;
        ang1 = ang;
    } else {
        // if rig has a position move to that position to draw parts
        x1 = ang.x !== undefined ? ang.x + x : x;
        y1 = ang.y !== undefined ? ang.y + y : y;
        ang1 = ang;

    }
    // are there any parts attached
    if (rig.parts) {
        // For each part attached to this node
        for (const part of Object.values(rig.parts)) {
            drawRig(x1, y1, ang1, time,part);
        }
    }
}

function mainLoop(time){ 
    if(startTime === undefined){ 
        startTime = time;
    }
    gTime = (time - startTime) / 1000;  // convert time to seconds
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.lineWidth = 5;
    
    drawRig(240, 400, 0, gTime, man);
    
    requestAnimationFrame(mainLoop);  // request the next frame
}