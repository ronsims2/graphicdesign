//This script will create ios images for 120x120, 240x240 and 360x360 with the proper @1x, @2x, and @3x suffixes.
var maxDim = parseFloat(prompt('What is the max dimension (width or height) you would like?', 1200));
var iconBaseSize = parseFloat(prompt('How big should the the samllest icon side be?', 120));


var ogUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.displayDialogs = DialogModes.NO;

var openDocs = app.documents;

for (var i = 0; i < openDocs.length; i++) {
  //Make sure currenct doc is set to active
  app.activeDocument = openDocs[i];
  var isPortrait = checkIsPortrait(openDocs[i]);
  scaleImageDown(openDocs[i],isPortrait, false, maxDim);
  scaleImageDown(openDocs[i], isPortrait, true, (iconBaseSize * 3));
}

function getSideAndScale(side, maxSide) {
  var s = side;
  var diff = 0;
  if (side > maxSide) {
    diff = side - maxSide;
    s = maxSide;
  }

  var scale = diff ? diff/side : 1;

  return [s, scale];
}

function checkIsPortrait(doc) {
  return doc.height > doc.width
}

function scaleImageDown(doc, isPortrait, makeSquare, side) {
  var height = doc.height;
  var width = doc.width;
  var suffix = '';
  var heightAndScale;
  var widthAndScale;

  if (makeSquare) {
    switch(side) {
      case 240:
      suffix = '@2x';
      break;
      case 360:
      suffix = '@3x';
      break;
      default:
      suffix = '@1x';
    }

    if (isPortrait) {
      //use short side to resize
      widthAndScale = getSideAndScale(doc.width, side);
      height = widthAndScale[1] !== 1 ? doc.height - (doc.height * widthAndScale[1]) : doc.height;
      width = widthAndScale[0];
    }
    else {
      heightAndScale = getSideAndScale(doc.height, side);
      width = heightAndScale[1] !== 1 ? doc.width - (doc.width * heightAndScale[1]) : doc.width;
      height = heightAndScale[0];
    }
    doc.resizeCanvas(width, height, AnchorPosition.MIDDLECENTER);
    exportImg(doc, suffix);
  }//end make square
  else {
    if (isPortrait) {
      heightAndScale = getSideAndScale(doc.height, side);
      width = heightAndScale[1] !== 1 ? doc.width - (doc.width * heightAndScale[1]) : doc.width;
      height = heightAndScale[0];
    }
    else {
      widthAndScale = getSideAndScale(doc.width, side);
      height = widthAndScale[1] !== 1 ? doc.height - (doc.height * widthAndScale[1]) : doc.height;
      width = widthAndScale[0];

      if (height !== doc.height) {
        doc.resizeImage(width, height);
      }

      exportImg(doc, suffix);
    }
  }
}

function exportImg(doc, fileSuffix) {
  var fileName = doc.name.split('.')[0];
  var fileExt = doc.name.split('.')[1];
  var filePath = '~/Desktop' + '/rendered/' + fileName + fileSuffix + '.' + fileExt;
  var f = new File(filePath);

  doc.exportDocument(f, ExportType.SAVEFORWEB);
}
