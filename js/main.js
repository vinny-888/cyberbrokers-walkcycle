let currentIndex = 1;
let gender = 'All';
let talent = 'All';
let originalPixels = [];
let outline = [];
let selection = {
    gender: 'female',
    species: 'Human',
    talent: 'Hacker'
};
let colors = [
    [255, 0, 0], // Red
    [0, 255, 0], // Green
    [127, 127, 255], // Blue
    [255, 255, 0], // Yellow
    [0, 255, 255], // Cyan
    [255, 0, 255], // Magenta
];
let bodyModel = [
    [], // Head
    [], // Body
    [], // Left Arm
    [], // Right Arm
    [], // Left Leg
    [], // Right Leg
];
let bodyMorph = [
    // Head
    5,
    // Body
    4,
    //  Left Arm
    2,
    // Right Arm
    2,
    // Left Leg
    3,
    // Right Leg
    3,
];
let selectPart = 0;
let speedTimeout = null;
window.onload = function() {
    document.getElementById('brokerID').addEventListener('change', ()=>{
        updateBroker();
    })
    document.getElementById('next').addEventListener('click', ()=>{
        getNext();
    })
    document.getElementById('prev').addEventListener('click', ()=>{
        getPrev();
    })
    document.getElementById('part').addEventListener('change', ()=>{
        selectPart = document.getElementById('part').selectedIndex;
    })

    document.getElementById('rigSpeed').addEventListener('change', ()=>{
        updateSpeed();
    });
    
    document.getElementById('rigSpeed').addEventListener('mousedown', ()=>{
        speedTimeout = setInterval(()=>{updateSpeed()}, 100);
    })
    document.getElementById('rigSpeed').addEventListener('mouseup', ()=>{
        clearTimeout(speedTimeout);
    })
    loadGenders();
    loadTalents();
    loadImage();
    renderRight();
    loadRig();
}

function updatePart(){
    let part = document.getElementById('part').value;
}

function updateFilters(){
    gender = document.getElementById('gender').value;
    talent = document.getElementById('talent').value;
}

function getNext(){
    updateFilters();
    let brokerID = findNextBroker();
    updateImageSrc(''+brokerID);
}

function getPrev(){
    updateFilters();
    let brokerID = findPrevBroker();
    updateImageSrc(''+brokerID);
}

function updateImageSrc(brokerID){
    updateImage(brokerID);
    document.getElementById('brokerID').value = brokerID;
    setTimeout(()=>{loadImage();}, 100);
}

function findNextBroker(){
    let brokerID = currentIndex;
    for(let i = currentIndex+1; i < 10000; i++){
        let meta = getMetadata(''+i);
        if((meta.gender == gender || gender == 'All') && (meta.talent == talent || talent == 'All')){
            brokerID = i;
            break;
        }
    }
    currentIndex = brokerID;
    return brokerID;
}

function findPrevBroker(){
    let brokerID = currentIndex;
    for(let i = currentIndex-1; i >= 0; i--){
        let meta = getMetadata(''+i);
        if((meta.gender == gender || gender == 'All') && (meta.talent == talent || talent == 'All')){
            brokerID = i;
            break;
        }
    }
    currentIndex = brokerID;
    return brokerID;
}

function updateImage(index){
    document.getElementById('broker').src = './cyberbrokers/cb-' + index.padStart(5, '0') + '.png';
}

function loadImage(){
    var img = document.getElementById('broker');
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    var pixels = document.getElementById('pixels');
    let html = '';
    for(let x=0; x<img.height; x++){
        html += `<div class="row">`;
        if(!outline[x]){
            outline[x] = [];
        }
        originalPixels[x] = [];
        for(let y=0; y<img.width; y++){
            var pixel = canvas.getContext('2d').getImageData(y, x, 1, 1).data;
            if(!outline[x][y]){
                outline[x][y] = [0,0,0,0];
            }
            if(pixel.join('') != '0000'){
                // console.log(pixel);
                html += `<div id="pixel_${x},${y}" onclick="togglePixel('${x}','${y}')" class="pixel" style="background-color: rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]/255});"></div>`;
                originalPixels[x][y] = pixel;
            } else {
                html += `<div id="pixel_${x},${y}" onclick="togglePixel('${x}','${y}')" class="pixel" style="background-color: #FFC0CB;"></div>`;
                originalPixels[x][y] = [255, 192, 203, 255];
            }
        }
        html += `</div>`;
    }
    pixels.innerHTML = html;
    updateOutline();
}

function renderRight(){
    var pixels = document.getElementById('pixels_right');
    let html = '';
    for(let x=0; x<64; x++){
        html += `<div class="row">`;
        for(let y=0; y<48; y++){
            html += `<div id="pixel_right_${x},${y}" class="pixel" style="background-color: #FFC0CB;"></div>`;
        }
        html += `</div>`;
    }
    pixels.innerHTML = html;
}

function morphRight(){
    let center = 23;
    // 0, 1, 3, 5
    // Head = 0

    bodyModel[0].forEach((pixel)=>{
        let expand = bodyMorph[0];
        for (let i=center-expand; i<center+expand; i++){
            let el = `pixel_right_${pixel.x},${i}`;
            let div = document.getElementById(el);
            div.style.backgroundColor = `rgba(${originalPixels[pixel.x][pixel.y][0]},${originalPixels[pixel.x][pixel.y][1]},${originalPixels[pixel.x][pixel.y][2]},${originalPixels[pixel.x][pixel.y][3]/255})`;
        }
    });

    bodyModel[1].forEach((pixel)=>{
        let expand = bodyMorph[1];
        for (let i=center-expand; i<center+expand; i++){
            let el = `pixel_right_${pixel.x},${i}`;
            let div = document.getElementById(el);
            div.style.backgroundColor = `rgba(${originalPixels[pixel.x][pixel.y][0]},${originalPixels[pixel.x][pixel.y][1]},${originalPixels[pixel.x][pixel.y][2]},${originalPixels[pixel.x][pixel.y][3]/255})`;
        }
    });

    bodyModel[3].forEach((pixel)=>{
        let expand = bodyMorph[3];
        for (let i=center-expand; i<center+expand; i++){
            let el = `pixel_right_${pixel.x},${i}`;
            let div = document.getElementById(el);
            div.style.backgroundColor = `rgba(${originalPixels[pixel.x][pixel.y][0]},${originalPixels[pixel.x][pixel.y][1]},${originalPixels[pixel.x][pixel.y][2]},${originalPixels[pixel.x][pixel.y][3]/255})`;
        }
    });

    bodyModel[5].forEach((pixel)=>{
        let expand = bodyMorph[5];
        for (let i=center-expand; i<center+expand; i++){
            let el = `pixel_right_${pixel.x},${i}`;
            let div = document.getElementById(el);
            div.style.backgroundColor = `rgba(${originalPixels[pixel.x][pixel.y][0]},${originalPixels[pixel.x][pixel.y][1]},${originalPixels[pixel.x][pixel.y][2]},${originalPixels[pixel.x][pixel.y][3]/255})`;
        }
    });
}

function updateOutline(){
    var pixels = document.getElementById('pixels');
    let html = '';
    for(let x=0; x<outline.length; x++){
        html += `<div class="row">`;
        for(let y=0; y<outline[x].length; y++){
            let pixel = outline[x][y];
            if(pixel.join('') == '0000'){
                pixel = originalPixels[x][y];
            }
            // console.log(pixel);
            html += `<div id="pixel_${x},${y}" onclick="togglePixel('${x}','${y}')" class="pixel" style="background-color: rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]/255});"></div>`;
        }
        html += `</div>`;
    }
    pixels.innerHTML = html;
}

function togglePixel(x, y){
    let pixel = document.getElementById(`pixel_${x},${y}`);
    let newPixel = null;
    if(outline[x][y].join('') == '0000'){
        let color = colors[selectPart];
        outline[x][y] = [color[0], color[1], color[2],255];
        newPixel = outline[x][y];
        bodyModel[selectPart].push({x,y});
    } else {
        outline[x][y] = [0,0,0,0];
        newPixel = originalPixels[x][y];
        bodyModel[selectPart].push({x,y});
        const indexOfObject = bodyModel[selectPart].findIndex(object => {
            return JSON.stringify(object) === JSON.stringify({x,y});
        });
        if(indexOfObject != -1){
            bodyModel[selectPart].splice(indexOfObject, 1);
        }
    }
    pixel.style.backgroundColor = `rgba(${newPixel[0]},${newPixel[1]},${newPixel[2]},${newPixel[3]/255})`;
    morphRight();
}

function updateBroker(){
    let brokerID = document.getElementById('brokerID').value;
    updateImageSrc(brokerID);
}

function loadTalents(){
    let species = [];
    let html = '';
    talents.forEach((talent, index) => {
        html+= '<option value="'+talent.talent+'" '+(selection.talent == talent.talent ? 'selected' : '')+'>'+talent.talent+'</option>';
        console.log('Talent['+index+']:', talent.talent, talent.species)
        if(species.indexOf(talent.species) == -1){
            species.push(talent.species);
        }
    });
    document.getElementById('talent').innerHTML += html;

    html = '';
    species.forEach((specie, index)=>{
        html+= '<option value="'+specie+'" '+(selection.species == specie ? 'selected' : '')+'>'+specie+'</option>';
        console.log('Species['+index+']:', specie)
    });
    document.getElementById('species').innerHTML += html;
}

function loadGenders(){
    let html = '';
    ['male', 'female', 'unknown'].forEach((gender) => {
        html+= '<option value="'+gender+'" '+(selection.gender == gender ? 'selected' : '')+'>'+gender+'</option>';
    });
    document.getElementById('gender').innerHTML += html;
}

function getMetadata(brokerID){
    /*{
        "nftId":"1",
        "name":"Enticing Delightful",
        "talent":"Hacker",
        "class":"Hacker",
        "species":"Human",
        "gender":"female",
     }*/
     let nft =  nfts.find((nft)=> nft.nftId == brokerID);



     return nft;
}

window.savePixelMap = function(){
    let key = 'pixelmap_' + selectedWalkCycleIndex + '_' + selectedIndex;
    localStorage.setItem(key, bodyModel);
    console.log('Saved: ', selectedIndex, pixelMap);
}
window.deletePixelMap = function(){
    let key = 'pixelmap_' + selectedWalkCycleIndex + '_' + selectedIndex;
    localStorage.removeItem(key);
    console.log('Deleted: ', selectedIndex, pixelMap);
}
window.loadPixelMap = function(){
    let key = "pixelmap_"+selectedWalkCycleIndex+'_'+selectedIndex;

    console.log('key: ', key);
    let pixelMap = localStorage.getItem(key);
    
}