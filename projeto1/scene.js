// ICG - 1st project 
// João Reis, 98474

// const all_imgs = ['img/nbc.jpg', 'img/kfc.png', 'img/einstein.jpg', 'img/bart.png', 'img/andré.png', 'img/peugeot.png', 'img/monalisa.jpg']; 
const all_imgs = ['img/nbc.jpg', 'img/kfc.png', 'img/einstein.jpg', 'img/peugeot.png', 'img/monalisa.jpg']; 
const pixel_map = new Map();
const bar_map = new Map();
const myImg = new Image();
var imgUrl = randomImg();
var form_created = false;

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

    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeObject.receiveShadow = true;

    // button
    createButton(sceneGraph, -100, 0, 'rgb(65,105,225)');

    // main cube
    createMainObject( sceneGraph, 5, 5, 5, 0, 50, 'rgb(250,0,0)' );

    // load image 
    myImg.crossOrigin = "Anonymous";

    myImg.onload = () => {
        const context = document.createElement('canvas').getContext('2d');
        context.drawImage(myImg, 0, 0);

        if (!form_created) {
            createForm(sceneGraph, myImg.width, myImg.height);
            form_created = true;
        }

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

                pixel_map.set(bar_name, height/2);
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

            if (atual_height > height) {
                if (atual_height - 1 < height) {
                    bar.scale.set(1, height, 1);

                } else {
                    atual_height -= 1;
                    bar.scale.set(1, atual_height, 1);
                }
            }

            if (atual_height < height) {
                if (atual_height + 1 > height) {
                    bar.scale.set(1, height, 1);
                   
                } else {
                    atual_height += 1; 
                    bar.scale.set(1, atual_height, 1);
                }
                 
            }

            bar.translateY(0);
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
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: rgb });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cube);

    cube.translateY(h/2);

    cube.position.x = x;
    cube.position.z = z;

    cube.castShadow = true;
    cube.receiveShadow = true; 

    cube.name = "main_cube";
   
}


function createButton(sceneGraph, x, z, rgb) {

    const texture = new THREE.TextureLoader().load( 'textures/textura.png' );
    const cubeGeometry = new THREE.BoxGeometry(50, 3, 20);

    var cubeMaterialArray = [];
    cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterialArray.push( new THREE.MeshPhongMaterial( { map: texture } ) );
    cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    cubeMaterialArray.push( new THREE.MeshPhongMaterial( { color: rgb } ) );
    
    var cubeMaterials = new THREE.MeshFaceMaterial( cubeMaterialArray );

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
    sceneGraph.add(cube);

    cube.translateY(1.5);

    cube.position.x = x;
    cube.position.z = z;

    cube.castShadow = true;
    cube.receiveShadow = true;

    cube.name = "button";
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

var dispX = 4, dispY = 4, dispZ = 4;
function computeFrame(time) {

    const cube = sceneElements.sceneGraph.getObjectByName("main_cube");
    const button = sceneElements.sceneGraph.getObjectByName("button");

    let plane_size = 500/2; 

    if (keyD && cube.position.x < plane_size) {
        cube.translateX(dispX);
    }
    if (keyW && cube.position.z > -plane_size) {
        cube.translateZ(-dispZ);
    }
    if (keyA && cube.position.x > -plane_size) {
        cube.translateX(-dispX);
    }
    if (keyS && cube.position.z < plane_size) {
        cube.translateZ(dispZ);
    }

    if (right && cube.position.x < plane_size) {
        cube.translateX(dispX);
    }
    if (up && cube.position.z > -plane_size) {
        cube.translateZ(-dispZ);
    }
    if (left && cube.position.x > -plane_size) {
        cube.translateX(-dispX);
    }
    if (down && cube.position.z < plane_size) {
        cube.translateZ(dispZ);
    }


    if (!checkPressButton()) {
        button.position.y = 1.5;
        cube.position.y = 2.5;

    } else {
        cube.position.y = 5.5;
        
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

    const button = sceneElements.sceneGraph.getObjectByName("button");
    
    if (checkPressButton()) {
        button.position.y = -1.25;
        click_sound();

    } else {
        button.position.y = 1.5;
    }

    if (times == 1) {
        if (checkPressButton()) {
            changeImage();
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

    if (x > -125 && x < -75 && z < 10 && z > -10) return true
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
