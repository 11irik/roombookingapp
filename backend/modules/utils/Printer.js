var { exec } = require("child_process");
const fs = require('fs')
const path = require('path');

let fontpath = "./properties/font.ttf"
const PDFDocument = require('pdfkit');

function print(text) {
    const pdf = new PDFDocument(
        {
            layout: 'portrait',
            size: [150, 1000], // a smaller document for small badge printers,
            margin: 5
        }
    );
    //todo
    pdf.pipe(fs.createWriteStream('/temp/output.pdf'));
    pdf
        .font(fontpath)
        .fontSize(10)
        .text(text);

    pdf.end();
    //fixme add async
    setTimeout(p, 2000)
}

function p(st) {
    console.log('ПЕЧАТЬ')

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



