const fs = require('fs');
const PDFParser = require('pdf2json');
const pdfParser = new PDFParser();

const filename = 'example.pdf';

pdfParser.on('pdfParser_dataError', errData => {
  console.error(errData.parserError);
  reject('Parsing Error');
});

pdfParser.on('pdfParser_dataReady', pdfData => {
  console.log(pdfData);
  const pages = pdfData['Pages'];
  let result = [];
  let i = 0;
  for (page of pages) {
    const texts = page['Texts'];
    let contentList = [];
    let formatList = [];

    for (text of texts) {
      const content = decodeURIComponent(text['R'][0]['T']);
      contentList.push(content);
      let formatArray = decodeURIComponent(text['R'][0]['TS']).split(',');
      formatArray = formatArray.map(element => Math.round(element * 10) / 10);
      formatList.push(formatArray.join(','));
    }
    result.push({ contentList, formatList });
  }
  fs.writeFileSync(`./output/${filename.slice(0, filename.length - 4)}.json`, JSON.stringify(result, null, '\t'));
});

pdfParser.loadPDF(`./pdf/${filename}`);
