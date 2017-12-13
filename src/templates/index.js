const images = require('src/templates/images')

function getFullScreenTemplate (imageData) {
  return {
    type: imageData.type,
    token: 'string',
    backButton: 'HIDDEN',
    title: imageData.title,
    backgroundImage: {
      contentDescription: imageData.description,
      sources: [{
        url: imageData.url
      }]
    },
    image: {
      contentDescription: imageData.description,
      sources: [{
        url: imageData.url
      }]
    },
    textContent: {
      primaryText: {
        text: `<font size="7">${imageData.textContent}</font>`,
        type: 'RichText'
      }
    }
  }
}

function backgroundImage (image, textContent = '') {
  const imageData = images[image]
  return {
    type: 'Display.RenderTemplate',
    template: getFullScreenTemplate({
      description: imageData.description,
      textContent,
      title: '',
      type: 'BodyTemplate1',
      url: images[image].image
    })
  }
}

module.exports = {
  backgroundImage
}
