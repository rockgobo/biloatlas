// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path')
var Package = require('dgeni').Package

module.exports = new Package('dgeni-example', [
  require('dgeni-packages/base'),
  require('dgeni-packages/jsdoc'),
  require('dgeni-packages/nunjucks'),
  require('dgeni-packages/ngdoc')
])
  .config(function (log, readFilesProcessor, writeFilesProcessor) {
    log.level = 'info'
    readFilesProcessor.basePath = path.resolve(__dirname, '.')

    readFilesProcessor.sourceFiles = [
      { include: 'C:/inetpub/wwwroot/biloAtlas/app/**/*.js',
        exclude: 'C:/inetpub/wwwroot/biloAtlas/app/vendor/**/*.js',
      basePath: '' }
    ]

    writeFilesProcessor.outputFolder = 'C:/inetpub/wwwroot/biloAtlas/build'
  })
  .config(function (templateFinder, templateEngine) {
    // Nunjucks and Angular conflict in their template bindings so change the Nunjucks
    templateEngine.config.tags = {
      variableStart: '{$',
      variableEnd: '$}'
    }

    templateFinder.templateFolders
      .unshift(path.resolve(__dirname, 'templates'))

    templateFinder.templatePatterns = [
      '${ doc.template }',
      '${ doc.id }.${ doc.docType }.template.html',
      '${ doc.id }.template.html',
      '${ doc.docType }.template.html',
      'common.template.html'
    ]
  })
  .config(function (getLinkInfo) {
    getLinkInfo.relativeLinks = true
  })
