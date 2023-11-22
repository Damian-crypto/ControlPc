var baseURL = 'not found';
var uuid = 'not found';
var screenHeight = 0;
var screenWidth = 0;
var mouseX = 0;
var mouseY = 0;
const scalingFactor = 0.5;

function loaded(BASE_URL, UUID) {
    baseURL = BASE_URL;
    uuid = UUID;

    var img = document.getElementById("vscreen");
    img.src = `${baseURL}/screenstream`;

    fetch(`${baseURL}/screensize`)
    .then((res) => res.json())
    .then((data) => {
        screenWidth = data['width'];
        screenHeight = data['height'];
        img.style.width = `${screenWidth * scalingFactor}px`;
        img.style.height = `${screenHeight * scalingFactor}px`;
    })
    .catch(alert);

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

    fetch(`${baseURL}/command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uuid: uuid,
            command: 'mouse_singleclick_left',
            x: screenX,
            y: screenY,
        })
    })
    .then((res) => {})
    .catch(alert);
}

function doubleClick(x, y) {
    const [screenX, screenY] = mapScreen(x, y);

    fetch(`${baseURL}/command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uuid: uuid,
            command: 'mouse_doubleclick_left',
            x: screenX,
            y: screenY,
        })
    })
    .then((res) => {})
    .catch(alert);
}

function loadAll() {
    loaded(window.localStorage.getItem('targetURL'), window.localStorage.getItem('uuid'));
}
