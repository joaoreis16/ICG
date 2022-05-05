const sceneElements = {
    sceneGraph: null,
    camera: null,
    renderer: null,
};


helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners
//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
var up = false, down = false, left = false, right = false, space = false;
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
    sceneGraph.add( axesHelper );


    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    planeObject.receiveShadow = true;

    // cube

    createMainObject( sceneGraph, 5, 5, 5, 20, 20, 'rgb(250,0,0)' );

    
    // load image 
    const myImg = new Image();
    myImg.crossOrigin = "Anonymous";

    myImg.onload = () => {
        const context = document.createElement('canvas').getContext('2d');
        context.drawImage(myImg, 0, 0);
        
        var position_x = -(myImg.width/2 + myImg.width/4);
        var position_z = -(myImg.height/2 + myImg.height/4);

        for (let x = 0; x < myImg.width; x++) {
            for (let z = myImg.height; z > 0; z--) {
                const {data} = context.getImageData(x, z, 1, 1);
                let red = data[0];
                let green = data[1];
                let blue = data[2];
                
                // Grey level = 0.299 * red component + 0.587 * green component + 0.114 * blue component [fonte: https://www.stemmer-imaging.com/en/knowledge-base/grey-level-grey-value/ ] 
                let height = (0.299 * red + 0.587 * green + 0.114 * blue);
                let rgb_value = Math.round(height);
                let grey = "rgb("+ rgb_value +","+ rgb_value +","+ rgb_value +")";

                createCube( sceneGraph, height/3, position_x, position_z, grey );
                position_x += 1.5;
            }
            position_x = -(myImg.width/2 + myImg.width/4);
            position_z += 1.5;
        }
    }

    // myImg.src = 'img/paulo.png';         // 10x10
    // myImg.src = 'img/einstein50.jpg';      // 50x50
    // myImg.src = 'img/einstein.jpg';      // 100x100
    // myImg.src = 'img/azul.jpg';          // 200x200
    // myImg.src = 'img/lisa.jpg';          // 300x300

    myImg.src = 'img/nike100x50.jpg';          // 100x50
    // myImg.src = 'img/nike200x100.jpg';          // 200x100

}


function createCube(sceneGraph, h, x, z, rgb) {

    const cubeGeometry = new THREE.BoxGeometry(1, h, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: rgb });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cube);

    cube.translateY(h/2);

    cube.position.x = x;
    cube.position.z = z;

    cube.castShadow = true;
    cube.receiveShadow = true;

    cube.name = "cube";
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



var step = 0;
var dispX = 5, dispY = 5, dispZ = 5;

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
        /* cube.position.x = cube.position.x + (10 * Math.cos(step)); 
        cube.position.y = cube.position.y + (10 * Math.abs(Math.sin(step)));  */
        space = false
    }
    
    // Rendering
    helper.render(sceneElements);

    // Call for the next frame
    requestAnimationFrame(computeFrame);
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