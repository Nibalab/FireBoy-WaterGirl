let canvas1, canvas2;
let isDrawing1 = false,
  isDrawing2 = false;

new p5((sketch) => {
  sketch.setup = () => {
    canvas1 = sketch.createCanvas(40, 60);
    canvas1.parent('canvas1');
    canvas1.mousePressed(() => (isDrawing1 = true));
    canvas1.mouseReleased(() => (isDrawing1 = false));

    // Load saved drawing for character 1
    let savedDrawing1 = localStorage.getItem('character1');
    if (savedDrawing1) {
      sketch.loadImage(savedDrawing1, (img) => {
        sketch.image(img, 0, 0, 40, 60);
      });
    }
  };

  sketch.draw = () => {
    if (isDrawing1) {
      sketch.stroke('red');
      sketch.strokeWeight(4);
      sketch.line(sketch.pmouseX, sketch.pmouseY, sketch.mouseX, sketch.mouseY);
    }
  };

  sketch.clearCanvas = () => {
    sketch.clear();
  };
});

new p5((sketch) => {
  sketch.setup = () => {
    canvas2 = sketch.createCanvas(40, 60);
    canvas2.parent('canvas2');
    canvas2.mousePressed(() => (isDrawing2 = true));
    canvas2.mouseReleased(() => (isDrawing2 = false));

    // Load saved drawing for character 2
    let savedDrawing2 = localStorage.getItem('character2');
    if (savedDrawing2) {
      sketch.loadImage(savedDrawing2, (img) => {
        sketch.image(img, 0, 0, 40, 60);
      });
    }
  };

  sketch.draw = () => {
    if (isDrawing2) {
      sketch.stroke('blue');
      sketch.strokeWeight(4);
      sketch.line(sketch.pmouseX, sketch.pmouseY, sketch.mouseX, sketch.mouseY);
    }
  };

  sketch.clearCanvas = () => {
    sketch.clear();
  };
});

function clearDrawing(character) {
  if (character === 1) {
    canvas1.clear();
    localStorage.removeItem('character1');
  } else if (character === 2) {
    canvas2.clear();
    localStorage.removeItem('character2');
  }
}

function saveDrawings() {
  // Save drawing for character 1
  let drawing1 = canvas1.elt.toDataURL();
  localStorage.setItem('character1', drawing1);

  // Save drawing for character 2
  let drawing2 = canvas2.elt.toDataURL();
  localStorage.setItem('character2', drawing2);

  // Redirect to maps page
  window.location.href = '/levels/maps/maps.html';
}
