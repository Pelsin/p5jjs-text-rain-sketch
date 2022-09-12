import p5js from "p5";

function TextRain(p5) {
  const message = "Hello how is it going?";
  const messageSpeed = 1;
  const startPosY = 50;
  const startPosX = 50;
  const letterWidth = 15;
  let video;

  const width = 640;
  const height = 480;

  const threshold = 15;

  var previousPixelState = [];
  var messageState = message.split("").map((letter, index) => ({
    letter,
    posY: startPosY,
    posX: startPosX + index * letterWidth,
  }));

  p5.disableFriendlyErrors = true;

  p5.setup = function setup() {
    p5.pixelDensity(1);
    p5.createCanvas(width, height);
    video = p5.createCapture(p5.VIDEO);
    video.size(width, height);
    video.hide();
  };

  p5.draw = function draw() {
    p5.textSize(40);
    p5.textAlign(p5.CENTER, p5.BOTTOM);
    p5.background(255);
    video.loadPixels();
    p5.image(video, 0, 0, width, height);

    if (previousPixelState.length != 0) {
      messageState.forEach(letterHandler);
    }

    previousPixelState = video.pixels;
    p5.text(Math.floor(p5.getFrameRate()), 100, 100);
  };

  function letterHandler({ letter, posY, posX }, index) {
    p5.text(letter, posX, posY);

    messageState[index] = {
      ...messageState[index],
      posY: getNewPosY(posX, posY),
    };
  }

  function getNewPosY(posX, posY) {
    if (
      colorDistance(
        getPixel(previousPixelState, posX, posY),
        getPixel(video.pixels, posX, posY)
      ) > threshold
    ) {
      return getNewPosY(posX, posY - 2);
    } else {
      return posY + 1;
    }
  }

  function colorDistance(previous, current) {
    return (
      p5.abs(p5.red(previous) - p5.red(current)) +
      p5.abs(p5.green(previous) - p5.green(current)) +
      p5.abs(p5.blue(previous) - p5.blue(current))
    );
  }

  function getPixel(pixels, x, y) {
    let off = (y * width + x) * 1 * 4;
    return [pixels[off], pixels[off + 1], pixels[off + 2], pixels[off + 3]];
  }
}

new p5js(TextRain);
