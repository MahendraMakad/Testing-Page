const MAX_SIZE = 500;
let scale = 2;
var originalHeight, originalWidth;
const fileInput = document.getElementById('file-input');
const sharpenedCanvas = document.getElementById('sharpened-canvas');
const sharpenedCtx = sharpenedCanvas.getContext('2d');

let img; // store original image object outside the draw function

//add eventListner to JPG and PNG download buttons
document.querySelector("#imageJPG").addEventListener("click", downloadImage);
document.querySelector("#imagePNG").addEventListener("click", downloadImage);

fileInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    img = new Image();
    img.onload = function () {
      let width, height;
      originalHeight = img.height;
      originalWidth = img.width;
      if (img.width > img.height) {
        width = Math.min(img.width, MAX_SIZE);
        height = img.height * (width / img.width);
      } else {
        height = Math.min(img.height, MAX_SIZE);
        width = img.width * (height / img.height);
      }

      sharpenedCanvas.width = width;
      sharpenedCanvas.height = height;
      //sharpenedCtx.drawImage(img, 0, 0, width, height);
      sharpenedCtx.drawImage(img, 0, 0, 302, 200);
    }

    img.src = e.target.result;
  }

  reader.readAsDataURL(file);
});


let ocWidth = sharpenedCanvas.width;
let ocHeight = sharpenedCanvas.height;

let sharpnessDisplay = document.querySelector(".sharpness");
let sharpSlider = document.querySelector("#sharpSlider");

sharpSlider.addEventListener("input", updateSharpness);

function updateSharpness() {
  scale = sharpSlider.value / 4;
  sharpnessDisplay.textContent = scale;
  window.setTimeout(draw, 1);
}

function draw() {
  sharpenedCanvas.width = ocWidth * scale;
  sharpenedCanvas.height = ocHeight * scale;

  sharpenedCtx.scale(scale, scale);
  sharpenedCtx.clearRect(0, 0, ocWidth, ocHeight);
  sharpenedCtx.drawImage(img, 0, 0, 302, 200); // redraw original image after scaling canvas
}

draw();


function downloadImage(event) {
  console.log("download starts");
  var modifiedCanvas = document.createElement('canvas');
  modifiedCanvas.width = originalWidth;
  modifiedCanvas.height = originalHeight;
  var modifiedCtx = modifiedCanvas.getContext('2d');
  modifiedCtx.drawImage(sharpenedCanvas, 0, 0, sharpenedCanvas.width, sharpenedCanvas.height, 0, 0, originalWidth, originalHeight);
  modifiedCtx.globalCompositeOperation = 'destination-in';
  //modifiedCtx.rect(0, 0, originalWidth, originalHeight);
  //modifiedCtx.fill();
  var downloadLink = document.createElement('a');
  if (event.target.id === 'imageJPG') {
    downloadLink.download = 'my-image.jpg';
    downloadLink.href = modifiedCanvas.toDataURL('image/jpeg');
  } else if (event.target.id === 'imagePNG') {
    downloadLink.download = 'my-image.png';
    downloadLink.href = modifiedCanvas.toDataURL('image/png');
  }
  downloadLink.click();
}
