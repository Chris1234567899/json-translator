
const fs = require('fs');
const { translate } = require('deepl-translator');

var path = process.argv[2];

var sourceLang = process.argv[3];
var targetLang = process.argv[4];

let data = fs.readFileSync(path);
let json = JSON.parse(data);

const delayIncrement = 100;
let delay = 0;


function iterate(o) {
    Object.keys(o).forEach(async function (k) {
        if (o[k] !== null && typeof o[k] === 'object') {
            iterate(o[k]);
            return;
        }
        promises.push(translateText(o, k))
        delay += delayIncrement;
    });
}

function translateText(o, k) {
    return new Promise(resolve => setTimeout(resolve, delay)).then(() =>{
        if (typeof o[k] === "string" && o[k].trim() != "") {
            translate(o[k], targetLang, sourceLang)
                .then(res => {
                    console.log(`Translation: ${res.translation}`)
                    o[k] = res.translation;
                })
                .catch(console.error);
   
        }
        else {
            o[k] = o[k];
        }
    });
}

var promises = [];
iterate(json)

Promise.all(promises).then(() => {
    setTimeout(() => {
       fs.writeFile('./translations/translated-' + targetLang + '.json', JSON.stringify(json), (err) => {
        if (!err) {
            console.log('done');
        }
    }); 
    }, delay + 5000);
    
})











