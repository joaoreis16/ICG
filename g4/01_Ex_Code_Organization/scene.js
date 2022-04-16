"use strict";

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
// 		J. Madeira - April 2021


// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    renderer: null,
};


// Functions are called
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Render the scene
helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
helper.render(sceneElements);


const tree1 = createTree(1,2,1,2);

tree1.position.x = 2;
tree1.position.z = 1;

sceneElements.sceneGraph.add(tree1);




function createTree(cylinderRadius, cylinderHeight, baseConeRadius, coneHeight) {

    // Creating a model by grouping basic geometries

    // Cylinder centered at the origin

    const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);

    const redMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    const cylinder = new THREE.Mesh(cylinderGeometry, redMaterial);

    cylinder.castShadow = true; 
    cylinder.receiveShadow = true;

    // Move base of the cylinder to y = 0

    cylinder.position.y = cylinderHeight / 2.0;

    // Cone

    const coneGeometry = new THREE.ConeGeometry(baseConeRadius, coneHeight, 32);

    const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    const cone = new THREE.Mesh(coneGeometry, greenMaterial);

    cone.castShadow = true; 
    cone.receiveShadow = true;

    // Move base of the cone to the top of the cylinder

    cone.position.y = cylinderHeight + coneHeight / 2.0;

    // Tree

    var tree = new THREE.Group();

    tree.add(cylinder);

    tree.add(cone);

    return tree;
}


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    // ************************** //
    // Create a ground plane
    // ************************** //
    const planeGeometry = new THREE.PlaneGeometry(6, 6);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;


    // ************************** //
    // Create a cube
    // ************************** //
    // Cube center is at (0,0,0)
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,0,0)' });
    const cubeObject = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cubeObject);

    // Set position of the cube
    // The base of the cube will be on the plane 
    cubeObject.translateY(0.5);

    // Set shadow property
    cubeObject.castShadow = true;
    cubeObject.receiveShadow = true;


    // ************************** //
    // Create a sphere
    // ************************** //
    // Sphere center is at (0,0,0)
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(180,180,255)' });
    const sphereObject = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sceneGraph.add(sphereObject);

    // Set position of the sphere
    // Move to the left and away from (0,0,0)
    // The sphere touches the plane
    sphereObject.translateX(-1.2).translateY(0.5).translateZ(-0.5);

    // Set shadow property
    sphereObject.castShadow = true;


    // ************************** //
    // Create a cylinder
    // ************************** //
    const cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 25, 1);
    const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200,255,150)' });
    const cylinderObject = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    sceneGraph.add(cylinderObject);

    // Set position of the cylinder
    // Move to the right and towards the camera
    // The base of the cylinder is on the plane
    cylinderObject.translateX(0.5).translateY(0.75).translateZ(1.5);

    // Set shadow property
    cylinderObject.castShadow = true;


    var tree_1 = createTree(0.1, 0.4, 0.2, 0.4);

    tree_1.position.x = -2;
    tree_1.position.z = 1;

    sceneGraph.add(tree_1);
}

