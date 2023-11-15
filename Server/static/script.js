var screenHeight = 0;
var screenWidth = 0;
var mouseX = 0;
var mouseY = 0;
const scalingFactor = 0.5;
// const baseURL = 'http://192.168.1.101:5002';
// const uuid = '0cl';

function loaded() {
    var img = document.getElementById("vscreen");
    img.src = `${baseURL}/screenstream`;

    // fetch(`${baseURL}/screensize`)
    // .then((res) => res.json())
    // .then((data) => {
        const data = [ 1280, 1024 ];
        screenWidth = data[0];
        screenHeight = data[1];
        img.style.width = `${screenWidth * scalingFactor}px`;
        img.style.height = `${screenHeight * scalingFactor}px`;
        console.log(data);
    // })
    // .catch(alert);

    img.addEventListener("mousedown", (evt) => {
        mouseMove(evt.pageX, evt.pageY);
        singleClick(mouseX, mouseY);
    });

    img.addEventListener("dblclick", (evt) => {
        mouseMove(evt.pageX, evt.pageY);
        doubleClick(mouseX, mouseY);
    })
}

function mouseMove(x, y) {
    var img = document.getElementById("vscreen");
    mouseX = x - img.offsetLeft;
    mouseY = y - img.offsetTop;
}

function mapScreen(x, y) {
    var img = document.getElementById("vscreen");
    let imageWidth = img.width;
    let imageHeight = img.height;
    let screenX = (x / imageWidth) * screenWidth;
    let screenY = (y / imageHeight) * screenHeight;

    return [screenX, screenY];
}

function singleClick(x, y) {
    const [screenX, screenY] = mapScreen(x, y);
    // alert(uuid);
    // alert(baseURL);
    // alert(`${screenX}, ${screenY}`);
    
    // fetch('http://192.168.1.101:5002/clicked').then(() => {}).catch(console.warn);
    fetch(`${baseURL}/command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uuid: uuid,
            command: 'singleclick',
            x: screenX,
            y: screenY,
            button: 'left',
        })
    })
    .then((res) => {})
    .catch(alert);
}

function doubleClick(x, y) {
    const [screenX, screenY] = mapScreen(x, y);
    
    // fetch('http://192.168.1.101:5002/clicked').then(() => {}).catch(console.warn);
    fetch(`${baseURL}/dblclick?x=${screenX}&y=${screenY}`)
    .then((res) => {})
    .catch(alert);
}
