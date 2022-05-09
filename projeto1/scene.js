const sceneElements = {
    sceneGraph: null,
    camera: null,
    renderer: null,
};


// ************** //
// squared images //
// ************** //
// 'img/paulo.png';             // 10x10

// 'img/einstein50.jpg';        // 50x50
// 'img/terra.jpg';             // 50x50
// 'img/kfc.png';               // 50x50
// 'img/nbc.jpg';               // 50x50

// 'img/einstein.jpg';          // 100x100
// 'img/lisa150.jpg';           // 150x150
// 'img/azul.jpg';              // 200x200
// 'img/pylance.png';           // 262x257
// 'img/lisa.jpg';              // 300x300

// **************** //
// rectangled images //
// **************** //
// 'img/nike100x50.jpg';        // 100x50
// 'img/nike200x100.jpg';       // 200x100


var imgUrl = 'img/nbc.jpg';

helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners
//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
var up = false, down = false, left = false, right = false;
var space = false; var enter = false;

document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

window.addEventListener('resize', resizeWindow);


// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    var axesHelper = new THREE.AxesHelper( 100 );
    // sceneGraph.add( axesHelper );


    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeObject.receiveShadow = true;


    // button
    createButton(sceneGraph, -200, -200, 'rgb(0,250,0)');

    // cube
    createMainObject( sceneGraph, 5, 5, 5, 20, 20, 'rgb(250,0,0)' );

    const map = new Map();

    // load image 
    const myImg = new Image();
    myImg.crossOrigin = "Anonymous";

    myImg.onload = () => {
        const context = document.createElement('canvas').getContext('2d');
        context.drawImage(myImg, 0, 0);

        var position_x = -(myImg.width/2 + myImg.width/4);
        var position_z = -(myImg.height/2 + myImg.height/4);

        for (let z = 0; z < myImg.height; z++) {
            for (let x = 0; x < myImg.width; x++) {
    
                // get data from image
                const {data} = context.getImageData(x, z, 1, 1);
                let red = data[0];
                let green = data[1];
                let blue = data[2];
                
                // Grey level = 0.299 * red component + 0.587 * green component + 0.114 * blue component [fonte: https://www.stemmer-imaging.com/en/knowledge-base/grey-level-grey-value/ ] 
                let height = (0.299 * red + 0.587 * green + 0.114 * blue);
                let rgb_value = Math.round(height);
                let grey = "rgb("+ rgb_value +","+ rgb_value +","+ rgb_value +")";

                let bar = createBar( sceneGraph, height/3, position_x, position_z, grey );

                map.set(bar, height/3);
                position_x += 1.5;
            }
            position_x = -(myImg.width/2 + myImg.width/4);
            position_z += 1.5;
        }
    }

    console.log(imgUrl);

    myImg.src = imgUrl;

    helper.render(sceneElements); 

    var step = 0; 
    renderScene();
    
    function renderScene() { 
        step += 1; 

        for (const [bar, height] of map.entries()) {

            const b = sceneElements.sceneGraph.getObjectByName( bar );

            if (step <= height) {
                b.scale.set(1, step, 1);
                b.translateY(0.5);
            }
        }

        requestAnimationFrame(renderScene); 
        helper.render(sceneElements); 
    }

}


var index = 0;

function createBar(sceneGraph, h, x, z, rgb) {

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: rgb });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cube);

    cube.translateY(0.5);

    cube.position.x = x;
    cube.position.z = z;

    cube.castShadow = true;
    cube.receiveShadow = true;

    cube.name = "bar"+ index;
    index++;

    return cube.name
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

    const cubeGeometry = new THREE.BoxGeometry(50, 1, 20);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: rgb });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cube);

    cube.translateY(0.5);

    cube.position.x = x;
    cube.position.z = z;

    cube.castShadow = true;
    cube.receiveShadow = true;

    cube.name = "button";
}



var dispX = 8, dispY = 8, dispZ = 8;

function computeFrame(time) {

    const cube = sceneElements.sceneGraph.getObjectByName("main_cube");

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

    if (space) {
        cube.position.y = (10 * Math.abs(Math.sin(300))); 
        space = false
    }

    
    
    // Rendering
    helper.render(sceneElements);

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}



function randomImg() {    
    // const all_imgs = ['img/paulo.png', 'img/einstein50.jpg', 'img/einstein.jpg', 'img/lisa150.jpg', 'img/azul.jpg', 'img/pylance.png', 'img/lisa.jpg', 'img/nike100x50.jpg', 'img/nike200x100.jpg'];
    const all_imgs = ['img/nbc.jpg', 'img/kfc.png', 'img/terra.jpg', 'img/einstein50.jpg']; 
    let random_index = Math.floor(Math.random() * all_imgs.length);
    console.log("A imagem escolhida é "+ all_imgs[random_index])
    imgUrl = all_imgs[random_index];
    return imgUrl;
}

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

        case 32: // space
            space = true;
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

        case 32: // space
            space = false;
            break;

    }
}


document.onkeydown = function(event) {
    event.preventDefault();
    if (event.key === 'Enter') {       // Enter
        randomImg();
        // window.location.reload()
    }

};