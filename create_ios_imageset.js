//This script will create ios images for 120x120, 240x240 and 360x360 with the proper @1x, @2x, and @3x suffixes.
var maxDim = parseFloat(prompt('What is the max dimension (width or height) you would like?', 1200));
var iconBaseSize = parseFloat(prompt('How big should the the samllest icon side be?', 120));


var ogUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.displayDialogs = DialogModes.NO;

var openDocs = app.documents;

for (var i = 0; i < openDocs.length; i++) {
  if (i === 0) {
    alert(openDocs[i].fullName);
    alert(openDocs[i].path);
    alert(openDocs[i].name);
    alert(openDocs[i].height);
    alert(openDocs[i].width);
  }

  var isPortrait = checkIsPortrait(openDocs[i]);
  scaleImageDown(openDocs[i],isPortrait, false);

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

function scaleImageDown(doc, isPortrait, makeSquare) {
  var height = 0;
  var width = 0;
  if (isPortrait) {
    var heightAndScale = getSideAndScale(doc.height, maxDim);
    var width = doc.width - (doc.width * heightAndScale[1]);
    doc.resizeImage();
  }
  else {

  }
}

function exportImg(doc, fileSuffix) {
  var fileNameArray = doc.fullName.split('/');
  var fileName = doc.name.split('.')[0];
  var fileExt = doc.name.split('.')[1];
  var opts = new JpegSaveOptions();
  var f = File(var saveToLoc = `${doc.path}/rendered/${fileName}${fileSuffix}.${fileExt}`);
  doc.exportDocument(f, ExportType.SAVEFORWEB, {
    format: SaveDocumentType.JPEG,
    optimized: false,
    quality: 70
  });
}
