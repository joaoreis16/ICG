// ICG - 1st project 
// João Reis, 98474

// const all_imgs = ['img/nbc.jpg', 'img/kfc.png', 'img/einstein.jpg', 'img/bart.png', 'img/andré.png', 'img/peugeot.png', 'img/monalisa.jpg']; 
const all_imgs = ['img/nbc.jpg', 'img/kfc.png', 'img/einstein.jpg', 'img/peugeot.png', 'img/monalisa.jpg']; 
const pixel_map = new Map();
const bar_map = new Map();
const myImg = new Image();
var imgUrl = randomImg();
var form_created = false;
var show_video = false;

const sceneElements = {
    sceneGraph: null,
    camera: null,
    renderer: null,
};

helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);


// ////////////////////////////////////////////// MAIN FUNCTION /////////////////////////////////////////////////////////////

function load3DObjects(sceneGraph) {

    const planeGeometry = new THREE.PlaneGeometry(300, 200);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeObject.receiveShadow = true;

    // change button
    createButton(sceneGraph, -100, 0, 'rgb(65,105,225)', "button", 'textures/change.png');

    // upload button
    createButton(sceneGraph, 100, 0, 'rgb(65,105,225)', "upload", 'textures/upload.png');

    // main cube
    let hex_color = document.getElementById("color").value;
    createMainObject( sceneGraph, 10, 10, 10, 0, 50, hex_color );

    // load image 
    myImg.crossOrigin = "Anonymous";

    myImg.onload = () => {
        const context = document.createElement('canvas').getContext('2d');
        context.drawImage(myImg, 0, 0);

        if (!form_created) {
            createForm(sceneGraph, myImg.width, myImg.height);
            form_created = true;
        }


        console.log( myImg.height,  myImg.width)

        for (let z = 0; z < myImg.height; z++) {
            for (let x = 0; x < myImg.width; x++) {
    
                // get data from image
                const {data} = context.getImageData(x, z, 1, 1);
                let red = data[0];
                let green = data[1];
                let blue = data[2];
                
                // Grey level = 0.299 * red component + 0.587 * green component + 0.114 * blue component 
                // [fonte: https://www.stemmer-imaging.com/en/knowledge-base/grey-level-grey-value/ ] 
                let height = (0.299 * red + 0.587 * green + 0.114 * blue);
                let rgb_value = Math.round(height);
                let grey = "rgb("+ rgb_value +","+ rgb_value +","+ rgb_value +")";

                let key = z +"_"+ x;
                let bar_name = bar_map.get(key);

                bar = sceneElements.sceneGraph.getObjectByName(bar_name);
                bar.material.color.set( grey );

                if (height < 1) pixel_map.set(bar_name, 1);
                else pixel_map.set(bar_name, height/4);
            }
        }
    }

    myImg.src = imgUrl;

    helper.render(sceneElements); 
    renderAnimation();
     
    function renderAnimation() { 

        for (const [bar_name, height] of pixel_map.entries()) {

            const bar = sceneElements.sceneGraph.getObjectByName( bar_name );
            let atual_height = bar.scale.y;

            let rgb_value = Math.round(atual_height * 4)
            let grey = "rgb("+ rgb_value +","+ rgb_value +","+ rgb_value +")";
            bar.material.color.set( grey );

            if (atual_height > height) {
                if (atual_height - 1 < height) {
                    bar.scale.set(1, height, 1);

                } else {
                    atual_height -= 1;
                    bar.scale.set(1, atual_height, 1);
                }
                bar.translateY(-1/2);
            }

            if (atual_height < height) {
                if (atual_height + 1 > height) {
                    bar.scale.set(1, height, 1);
                   
                } else {
                    atual_height += 1; 
                    bar.scale.set(1, atual_height, 1);
                }
                bar.translateY(1/2);
            }

        }

        requestAnimationFrame(renderAnimation); 
        helper.render(sceneElements); 
    }

}

// ////////////////////////////////////////////// CREATE OBJECTS 3D /////////////////////////////////////////////////////////////
var index = 0;

function createBar(sceneGraph, x, z, rgb) {

    const barGeometry = new THREE.BoxGeometry(1, 1, 1);
    const barMaterial = new THREE.MeshPhongMaterial({ color: rgb });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    sceneGraph.add(bar);

    bar.translateY(0.5);

    bar.position.x = x;
    bar.position.z = z;

    bar.castShadow = true;
    bar.receiveShadow = true;

    bar.name = "bar"+ index;
    index++;

    return bar.name
}


function createMainObject(sceneGraph, a, b, h, x, z, rgb) {
    
    const cubeGeometry = new THREE.BoxGeometry(a, h, b);
    var cubeMaterial = [];
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cube);

    cube.translateY(h/2);

    cube.position.x = x;
    cube.position.z = z;

    cube.castShadow = true;
    cube.receiveShadow = true; 

    cube.name = "main_cube";
   
}


function createButton(sceneGraph, x, z, rgb, name, textura) {

    const texture = new THREE.TextureLoader().load( textura );
    const cubeGeometry = new THREE.BoxGeometry(50, 3, 20);

    var cubeMaterial = [];
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { map: texture } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterial.push( new THREE.MeshPhongMaterial( { color: rgb } ) );

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cube);

    cube.translateY(1.5);

    cube.position.x = x;
    cube.position.z = z;

    cube.castShadow = true;
    cube.receiveShadow = true;

    cube.name = name;
}

function createForm(sceneGraph, width, height) {

    var position_x = -(width/2 + width/4);
    var position_z = -(width/2 + height/4);

    for (let z = 0; z < height; z++) {
        for (let x = 0; x < width; x++) {

            let bar = createBar( sceneGraph, position_x, position_z, 'rgb(0,0,0)' );
            let key = z +"_"+ x;
            bar_map.set(key, bar);
            
            position_x += 1.5;
        }
        position_x = -(width/2 + width/4);
        position_z += 1.5;
    }
}


// ///////////////////////////////////////////// ANIMATIONS AND INTERACTIONS /////////////////////////////////////////////////////////////

var dispX = 10, dispY = 10, dispZ = 10;
function computeFrame(time) {

    const cube = sceneElements.sceneGraph.getObjectByName("main_cube");
    const button = sceneElements.sceneGraph.getObjectByName("button");
    const upload_button = sceneElements.sceneGraph.getObjectByName("upload");

    let x = cube.position.x; let z = cube.position.z;

    let plane_size_x = 300/2 - 10; 
    let plane_size_z = 200/2 - 10;

    if (keyD && cube.position.x < plane_size_x) {
        cube.translateX(dispX);
    }
    if (keyW && cube.position.z > -plane_size_z) {
        cube.translateZ(-dispZ);
    }
    if (keyA && cube.position.x > -plane_size_x) {
        cube.translateX(-dispX);
    }
    if (keyS && cube.position.z < plane_size_z) {
        cube.translateZ(dispZ);
    }

    if (right && cube.position.x < plane_size_x) {
        cube.translateX(dispX);
    }
    if (up && cube.position.z > -plane_size_z) {
        cube.translateZ(-dispZ);
    }
    if (left && cube.position.x > -plane_size_x) {
        cube.translateX(-dispX);
    }
    if (down && cube.position.z < plane_size_z) {
        cube.translateZ(dispZ);
    }

    if (!checkPressButton() && !checkPressUploadButton()) {
        button.position.y = 1.5;
        upload_button.position.y = 1.5;
        cube.position.y = cube.geometry.parameters.height/2;

    } else {
        cube.position.y = 8;
        
    }
    
    helper.render(sceneElements);
    requestAnimationFrame(computeFrame);
}

var step = 0;
var times = 0;

function jump() {
    step += 0.5; 

    const cube = sceneElements.sceneGraph.getObjectByName("main_cube");

    cube.position.y = (20 * Math.abs(Math.sin(step)));


    if (step < 3) {
        helper.render(sceneElements);
        requestAnimationFrame(jump);

    } else {
        times = 0;
        step = 0;
        pressButton();
    }

}

function pressButton() {
    times += 1;
    
    if (checkPressButton()) {
        const button = sceneElements.sceneGraph.getObjectByName("button");
        button.position.y = -1.25;
        click_sound();

    } else if (checkPressUploadButton()) {
        const upload_button = sceneElements.sceneGraph.getObjectByName("upload");
        upload_button.position.y = -1.25;
        click_sound();

    } else {
        const button = sceneElements.sceneGraph.getObjectByName("button");
        button.position.y = 1.5;
    }

    if (times == 1) {
        if (checkPressButton()) {
            changeImage();

        } else if (checkPressUploadButton()) {
            document.getElementById("userImage").click();
        }
        helper.render(sceneElements);
        requestAnimationFrame(pressButton)
    }
}

var keyD = false, keyA = false, keyS = false, keyW = false;
var up = false, down = false, left = false, right = false;

document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;


        case 37: // left
            left = true;
            break;
        case 38: // up
            up = true;
            break;
        case 39: // right
            right = true;
            break;
        case 40: // down
            down = true;
            break;


        case 32: // Space
            jump();
            break;
    }
}
function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;


        case 37: // left
            left = false;
            break;
        case 38: // up
            up = false;
            break;
        case 39: // right
            right = false;
            break;
        case 40: // down
            down = false;
            break;

    }
}

window.addEventListener('resize', resizeWindow);

function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}


// ////////////////////////////////////////////// OTHER FUNCTIONS /////////////////////////////////////////////////////////////

function randomImg() {    
    // Para garantir que não repete imagens
    if (imgUrl != undefined) {
        const index = all_imgs.indexOf( imgUrl );
        if (index > -1) {
            all_imgs.splice(index, 1);
        }
    }

    let random_index = Math.floor(Math.random() * all_imgs.length);

    if (imgUrl != undefined) {
        all_imgs.push(imgUrl);
    }

    imgUrl = all_imgs[random_index];
    return imgUrl;
}


function checkPressButton() {
    const cube = sceneElements.sceneGraph.getObjectByName("main_cube");

    let x = cube.position.x; let z = cube.position.z;

    if (x > -130 && x < -70 && z < 15 && z > -15) return true
    return false
}

function checkPressUploadButton() {
    const cube = sceneElements.sceneGraph.getObjectByName("main_cube");

    let x = cube.position.x; let z = cube.position.z;

    if (x > 70 && x < 130 && z < 15 && z > -15) return true
    return false
}

function click_sound() {

    const listener = new THREE.AudioListener();
    sceneElements.camera.add( listener );
    const sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load( 'sounds/click.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume( 0.5 );
        sound.play();
    });

}

function changeImage() {
    myImg.src = randomImg();
}

function uploadImage(evt) {
    let files = evt.target.files;
    let f = files[0];
    if (f) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var img = new Image();
            img.src = event.target.result;
    
            img.onload = function(el) {
                var elem = document.createElement('canvas');
                elem.width = 50;
                elem.height = 50;
    
                var ctx = elem.getContext('2d');
                ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
    
                var srcEncoded = ctx.canvas.toDataURL('image/png', 1);
    
                myImg.src = srcEncoded;
                all_imgs.push(srcEncoded)
            }
        }
        
        reader.readAsDataURL(f);
    }
}

document.getElementById('userImage').addEventListener('change', uploadImage, false);
document.getElementById('skin').addEventListener('change', uploadSkin, false);
document.getElementById('color').addEventListener('change', changeColor, false);

function uploadSkin(evt) {
    let files = evt.target.files;
    let f = files[0];
    if (f) {
        var reader = new FileReader();

        reader.onload = function(event) {
            var img = new Image();
            img.src = event.target.result;
    
            img.onload = function(el) {
                const cube = sceneElements.sceneGraph.getObjectByName("main_cube");

                const loader = new THREE.TextureLoader();
                const material = new THREE.MeshPhongMaterial( {map: loader.load(img.src)} );
                cube.material = material;
                cube.needsUpdate = true; 
            }
        }
        
        reader.readAsDataURL(f);
    }
}

function changeTexture(textura, texture_top) {
    const cube = sceneElements.sceneGraph.getObjectByName("main_cube");
    if (texture_top != '') {
        console.log("tem textura no topo")
        let src = "textures/"+ textura;
        let src_top = "textures/"+ texture_top;

        const loader = new THREE.TextureLoader();
        var cubeMaterial = [];
        cubeMaterial.push( new THREE.MeshPhongMaterial( { map:  loader.load(src) } ) );
        cubeMaterial.push( new THREE.MeshPhongMaterial( { map:  loader.load(src) } ) );
        cubeMaterial.push( new THREE.MeshPhongMaterial( { map:  loader.load(src_top) } ) );
        cubeMaterial.push( new THREE.MeshPhongMaterial( { map:  loader.load(src) } ) );
        cubeMaterial.push( new THREE.MeshPhongMaterial( { map:  loader.load(src) } ) );
        cubeMaterial.push( new THREE.MeshPhongMaterial( { map:  loader.load(src) } ) );

        cube.material = cubeMaterial;
        cube.needsUpdate = true;

    } else {
        let src = "textures/"+ textura;

        const loader = new THREE.TextureLoader();
        const material = new THREE.MeshPhongMaterial( {map: loader.load(src)} );
        cube.material = material;
        cube.needsUpdate = true;
    } 
}

function changeColor() {
    let hex_color = document.getElementById("color").value;

    const cube = sceneElements.sceneGraph.getObjectByName("main_cube");
    const material = new THREE.MeshPhongMaterial( {color: hex_color} );
    cube.material = material;
    cube.needsUpdate = true; 
}


let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector(".userImage");

camera_button.addEventListener('click', async function() {
   	let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
	video.srcObject = stream;
    
    camera = document.getElementById('video');
    camera.style.display = 'inline';

    camera = document.getElementById('start-camera');
    camera.style.display = 'none';

    camera = document.getElementById('click-photo');
    camera.style.display = 'inline';

});

click_button.addEventListener('click', function() {
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

    var img = new Image();
    img.src = image_data_url;

    img.onload = function(el) {
        var elem = document.createElement('canvas');
        elem.width = 50;
        elem.height = 50;

        var ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

        var srcEncoded = ctx.canvas.toDataURL('image/png', 1);

        myImg.src = srcEncoded;
        all_imgs.push(srcEncoded)
    }
});