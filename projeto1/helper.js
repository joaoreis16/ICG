
const helper = {

    initEmptyScene: function (sceneElements) {

        // Create the 3D scene
        sceneElements.sceneGraph = new THREE.Scene();

        // Add camera
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(0, 100, 50); // 0 ,50, 50
        camera.lookAt(0, 0, 0);


        // Add ambient light
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
        sceneElements.sceneGraph.add(ambientLight);

        // Add spotlight (with shadows)
        const spotLight = new THREE.SpotLight('rgb(255, 255, 255)', 0.8);
        spotLight.position.set(-80, 250, 200);
        sceneElements.sceneGraph.add(spotLight);

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;

        spotLight.name = "light";

        // Spotlight Helper
        const spotLightHelper = new THREE.SpotLightHelper( spotLight, 'rgb(225, 0, 0)');
        sceneElements.sceneGraph.add( spotLightHelper );

        // Create renderer (with shadow map)
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor('rgb(255, 255, 150)', 1.0);
        renderer.setSize(width, height);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;


        // Add the rendered image in the HTML DOM
        const htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls( camera, renderer.domElement );
    },

    render: function render(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    },
};