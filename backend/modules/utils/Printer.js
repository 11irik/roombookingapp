var { exec } = require("child_process");
const fs = require('fs')

let fontpath = (__dirname+ '/DejaVuSans.ttf');
const PDFDocument = require('pdfkit');

function print(text) {
    const pdf = new PDFDocument(
        {
            layout: 'portrait',
            size: [150, 1000], // a smaller document for small badge printers,
            margin: 5
        }
    );
    console.log('ПЕЧАТЬ')
    //todo
    pdf.pipe(fs.createWriteStream('./output.pdf'));
    pdf
        .font(fontpath)
        .fontSize(10)
        .text(text);

    pdf.end();
    p()
}

function p() {
    let fun = `lp output.pdf`

    exec(fun, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

module.exports = {
    print,
}



