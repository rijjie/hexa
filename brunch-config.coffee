module.exports = config:

  files:
    javascripts: joinTo:
      'libraries.js': /^vendor/
      'app.js': /^app/
    stylesheets: joinTo: 'app.css'

  plugins:
    appcache:
      manifestFile: 'manifest.appcache'

  server:
    run: yes
