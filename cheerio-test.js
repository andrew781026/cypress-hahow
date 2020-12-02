const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('./html/menu.html').toString();

const $ = cheerio.load(html);

const ss = $('div > li a').map((i, el) => {

    return {
        text: $(el).find('.item.flex-1').text().replace('\n', '').trim().replace(/[<>]/ig, '~'),
        href: $(el).attr('href')
    };
}).get(); // retrieve all elements matched by the Cheerio object

console.log('length=', ss.length);
console.log('ss=', ss);
