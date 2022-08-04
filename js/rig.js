let startTime; 
let gTime; 
let ctx = null;
let workPos = null;
let scale = 3;
let size = 10*scale;
let body = size*6;
let arm = size*4;
let leg = size*4;
let neck = size*3;
let head = size*2;
// The stick man rig with keyframes

const man = {
    parts: {
        body: {
            color: colors[1],
            len: body,
            ang: -Math.PI / 2,
            // keys : [
            //   {len : body, ang : -Math.PI * (5 / 8), time : 0},
            //   {len : body, ang : -Math.PI * (3 / 8), time : 1.5},
            //   {len : body, ang : -Math.PI * (5 / 8), time : 3},
            // ],          
            parts: {
                right_arm: {
                    color: colors[3],
                    len: arm,
                    ang: Math.PI * (9 / 8), // 1/8th is 22.5 deg
                    keys : [
                        {len : leg, ang : Math.PI * (9 / 8), time : 0},
                        {len : leg, ang : Math.PI * (8 / 8), time : 1},
                        {len : leg, ang : Math.PI * (7 / 8), time : 2},
                        {len : leg, ang : Math.PI * (8 / 8), time : 3},
                        {len : leg, ang : Math.PI * (9 / 8), time : 4},
                    ],
                    parts : {
                        right_fore_arm : {
                            color: colors[3],
                            len: arm,
                            ang: Math.PI * (7 / 8), // 1/8th is 22.5 deg
                            keys : [
                                {len : leg, ang : -Math.PI * (1 / 8), time : 0},
                                {len : leg, ang : -Math.PI * (3 / 8), time : 1},
                                {len : leg, ang : -Math.PI * (4 / 8), time : 2},
                                {len : leg, ang : -Math.PI * (3 / 8), time : 3},
                                {len : leg, ang : -Math.PI * (1 / 8), time : 4},
                            ],
                        }
                    }
                },
                left_arm: {
                    color: colors[2],
                    len: arm,
                    ang: Math.PI * (7 / 8), // 1/8th is 22.5 deg
                    keys : [
                        {len : leg, ang : Math.PI * (7 / 8), time : 0},
                        {len : leg, ang : Math.PI * (8 / 8), time : 1},
                        {len : leg, ang : Math.PI * (9 / 8), time : 2},
                        {len : leg, ang : Math.PI * (8 / 8), time : 3},
                        {len : leg, ang : Math.PI * (7 / 8), time : 4},
                    ],
                    parts : {
                        left_fore_arm : {
                            color: colors[2],
                            len: arm,
                            ang: Math.PI * (7 / 8), // 1/8th is 22.5 deg
                            keys : [
                                {len : leg, ang : -Math.PI * (4 / 8), time : 0},
                                {len : leg, ang : -Math.PI * (3 / 8), time : 1},
                                {len : leg, ang : -Math.PI * (1 / 8), time : 2},
                                {len : leg, ang : -Math.PI * (3 / 8), time : 3},
                                {len : leg, ang : -Math.PI * (4 / 8), time : 4},
                            ],
                        }
                    }
                },
                neck: {
                    color: colors[0],
                    len: neck,
                    ang: 0,
                    parts: {
                    head: {
                        color: colors[0],
                        size: head,
                    }
                }
                }
            }
        },
        right_leg: {
            color: colors[4],
            len: leg,
            ang: Math.PI * (4 / 8), // 1/8th is 22.5 deg
            keys : [
                {len : leg, ang : Math.PI * (5 / 8), time : 0},
                {len : leg, ang : Math.PI * (4 / 8), time : 1},
                {len : leg, ang : Math.PI * (2 / 8), time : 2},
                {len : leg, ang : Math.PI * (4 / 8), time : 3},
                {len : leg, ang : Math.PI * (5 / 8), time : 4},
            ],
            parts : {
                right_lower_leg : {
                    color: colors[4],
                    len: leg,
                    ang: Math.PI * (7 / 8), // 1/8th is 22.5 deg
                    keys : [
                        {len : leg, ang : Math.PI * (2 / 8), time : 0},
                        {len : leg, ang : Math.PI * (3 / 8), time : 1},
                        {len : leg, ang : 0, time : 2},
                        {len : leg, ang : Math.PI * (1 / 8), time : 3.5},
                        {len : leg, ang : Math.PI * (2 / 8), time : 4},
                    ],
                }
            }
        },
        left_leg: {
            color: colors[5],
            len: leg,
            ang: Math.PI * (3 / 8), // 1/8th is 22.5 deg
            keys : [
                {len : leg, ang : Math.PI * (2 / 8), time : 0},
                {len : leg, ang : Math.PI * (4 / 8), time : 1},
                {len : leg, ang : Math.PI * (5 / 8), time : 2},
                {len : leg, ang : Math.PI * (4 / 8), time : 3},
                {len : leg, ang : Math.PI * (2 / 8), time : 4},
                ],
            parts : {
                left_lower_leg : {
                    color: colors[5],
                    len: leg,
                    ang: Math.PI * (7 / 8), // 1/8th is 22.5 deg
                    keys : [
                        {len : leg, ang : 0, time : 0},
                        {len : leg, ang : Math.PI * (1 / 8), time : 1},
                        {len : leg, ang : Math.PI * (2 / 8), time : 2},
                        {len : leg, ang : Math.PI * (3 / 8), time : 3.5},
                        {len : leg, ang : 0, time : 4},
                    ],
                }
            }
        }
    }
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
function tweenKeysEase(key1, key2, gTime, result = {}){
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

function tweenKeys(key1, key2, gTime, result = {}){
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