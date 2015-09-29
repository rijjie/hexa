module.exports = config:

  files:
    javascripts: joinTo: 'app.js'
    stylesheets: joinTo: 'app.css'

  plugins:
    appcache:
      manifestFile: 'manifest.appcache'

  server:
    run: yes
