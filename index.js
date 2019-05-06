const got = require('got')
const checkFile = require('check-file')
const cheerio = require('cheerio')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const metaImage = {
  parser(body) {
    if (body) {
      const $ = cheerio.load(body)
      var result = $('meta[property="og:image"]').attr('content')
      if (!result) result = $('meta[property="og:image:url"]').attr('content')
      if (!result) result = $('meta[property="twitter:image"]').attr('content')
      if (!result) result = $('meta[property="twitter:image:src"]').attr('content')
      const extensions = ['jpg', 'jpeg', 'png', 'bmp', 'tif', 'tiff', 'gif']
      if (checkFile(result, extensions)) return result
      else throw 'No valid file'
    } else throw 'No html body'
  },
  async get(url) {
    var { body } = await got(url)
    return metaImage.parser(body)
  }
}

module.exports = metaImage
