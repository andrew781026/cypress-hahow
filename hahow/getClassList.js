const cheerio = require('cheerio');

const getClassList = (html) => {

    const $ = cheerio.load(html);

    return $('div > li a').map((i, el) => {

        return {
            text: $(el).find('.item.flex-1').text().replace('\n', '').trim().replace(/[<>]/ig, '~'),
            href: $(el).attr('href')
        };
    }).get(); // retrieve all elements matched by the Cheerio object
};

module.exports = getClassList;
