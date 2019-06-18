let faceRadius, faceY, dFaceY, upPressed, downPressed 

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(520, 320)
const ctx = canvas.getContext('2d');

faceRadius = 20;
let canvasLength = 520;
let canvasWidth = 320; 
let canvasStartX = 0
let canvasStartY = 0

let pringleHeight = 20;
let pringleWidth = 50;
let pringleStartingXValue = canvasLength + 60;
let pringleCurrentXValue = pringleStartingXValue;
let dPringle = 5;

ctx.fillStyle = '#66cccc';
ctx.fillRect(canvasStartX, canvasStartY, 520, 320);

document.body.innerHTML =	
    `<canvas id="canvas" width="520" height="320"></canvas>	
    <script src="main.js"></script>
    <div id='modal' class='modal'>
    <div class='modal-content'>
    <button class='play-again-button'></span>
        <h1>Play Again</h1>
    </div>
    </div>`


let modal = document.getElementById('modal')    

const keyDownHandler = jest.fn(e => {
    if (e.keyCode === 38) {
        upPressed = true; 
    }
    else if (e.keyCode === 40) {
        downPressed = true;
    }
})

const keyUpHandler = jest.fn(e => {
    if (e.keyCode === 38) {
        upPressed = false;
    }
    else if (e.keyCode === 40) {
        downPressed = false;
    }
});


const draw = jest.fn(async () => {
    drawFace();
    await drawPringle();
    requestAnimationFrame(draw);

    if (upPressed === true) {
        if (faceY - dFaceY > 10 + faceRadius ) {
            faceY -= dFaceY
        }
    }
    else if (downPressed === true) {
        if (faceY + dFaceY < 320 - faceRadius) {
            faceY += dFaceY
        }
    }
})


const toggleModal = jest.fn(() => {
    console.log('modal toggled')
    modal.classList.toggle('show-modal')
    console.log(modal.className)
    if (modal.className === 'modal') {
        document.location.reload();
    }
})

const drawFace = jest.fn(() => {
    ctx.beginPath();
    ctx.arc(30, faceY, faceRadius, Math.PI*2.2 , Math.PI*1.8);
    ctx.lineTo(30, faceY);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
});

const drawPringle = jest.fn(() => {
    return loadImage('pringle.png')
    .then(
        img => {
            console.log('first promise reached' + img)
            return new Promise(res => {
                setTimeout( () => res(img), 10000);
            })
        }
    )    
    .then( 
        img => {
        console.log('second promise has started')
        if (pringleCurrentXValue !== 0) {
            console.log('drawPringle() if-statement reached')
            pringleCurrentXValue -= dPringle
            ctx.drawImage(img, pringleCurrentXValue, canvasWidth/2, pringleWidth, pringleHeight)

        }
        else {
            console.log('drawPringle() else statement reached')
            toggleModal()
            pringleCurrentXValue = pringleCurrentXValue - 1
        }
    })
})

beforeEach(() => {
    faceY = 155
    dFaceY = 10;
    upPressed = false;
    downPressed = false;  
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
    pringleHeight = 20;
    pringleWidth = 50;
    pringleStartingXValue = canvasLength + 60;
    pringleCurrentXValue = pringleStartingXValue;
    dPringle = 5;
});

// test ('pressing the up arrow key movedraws the face up & letting go of up arrow key leaves face in position', () => {
//     let event = new KeyboardEvent('keydown', {keyCode: 38})
//     document.dispatchEvent(event);
//     draw();
//     let event2 = new KeyboardEvent('keyup', {keyCode: 38})
//     document.dispatchEvent(event2);
//     draw();
//     expect(faceY).toBe(145);
// })

// test ('face will not move beyond top canvas border', () => {
//     faceY = 5;
//     loadImage('pringle.png').then((img) => {
//         let event = new KeyboardEvent('keydown', ctx.drawImage(img, pringleCurrentXValue, canvasWidth/2, pringleWidth, pringleHeight));
//         document.dispatchEvent(event); 
//         draw()
//         expect(faceY).toBe(5);
//     })
// })

// test('pressing the down arrow key moves the face down & letting go of down arrow key leaves face in position', () => {
//     let event = new KeyboardEvent('keydown', {keyCode: 40})
//     document.dispatchEvent(event);
//     draw();
//     let event2 = new KeyboardEvent('keyup', {keyCode: 40});
//     document.dispatchEvent(event2); 
//     draw();
//     expect(faceY).toBe(165);
// })

// test('the pringle moves towards the face', () => {
//   test that the pringle moves left after every invocation of draw()
// })

test('the modal appears when the pringle passes the face', () => {
    pringleCurrentXValue = 0
    draw()
    console.log(modal.className)
    expect(modal.className).toBe('modal show-modal')
})