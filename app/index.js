/* Eine Einführung zur leeren Vorlage finden Sie in der folgenden Dokumentation:
 http://go.microsoft.com/fwlink/?LinkID=397704
 So debuggen Sie Code beim Seitenladen in Ripple oder auf Android-Geräten/-Emulatoren: Starten Sie die App, legen Sie Haltepunkte fest, 
 und führen Sie dann "window.location.reload()" in der JavaScript-Konsole aus. */

/* globals alert $:true Camera:true */

;(function () {
  'use strict'

  document.addEventListener('deviceready', onDeviceReady.bind(this), false)

  function onDeviceReady () {
    // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
    document.addEventListener('pause', onPause.bind(this), false)
    document.addEventListener('resume', onResume.bind(this), false)

    // TODO: Cordova wurde geladen. Führen Sie hier eine Initialisierung aus, die Cordova erfordert.

    /** ****************************
    *       GEOLOCATION TEST
    *******************************/

    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    var onSuccess = function (position) {
      $('#geolocation').html('<p>Latitude: ' + position.coords.latitude + '</p>' +
        '<p>Longitude: ' + position.coords.longitude + '</p>' +
        '<p>Altitude: ' + position.coords.altitude + '</p>' +
        '<p>Accuracy: ' + position.coords.accuracy + '</p>' +
        '<p>Altitude Accuracy: ' + position.coords.altitudeAccuracy + '</p>' +
        '<p>Heading: ' + position.coords.heading + '</p>' +
        '<p>Speed: ' + position.coords.speed + '</p>' +
        '<p>Timestamp: ' + position.timestamp + '</p>')
    }

    // onError Callback receives a PositionError object
    //
    function onError (error) {
      alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n')
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError)

    /** ****************************
    *           Camera TEST
    *******************************/
    $('#buttonPicture').click(function () {
      navigator.camera.getPicture(onImageSuccess, onImageFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.CAMERA
      })
    })

    function onImageSuccess (imageData) {
      var image = document.getElementById('myImage')
      image.src = 'data:image/jpeg;base64,' + imageData
    }

    function onImageFail (message) {
      alert('Failed because: ' + message)
    }
  }

  function onPause () {
    // TODO: Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
  }

  function onResume () {
    // TODO: Diese Anwendung wurde erneut aktiviert. Stellen Sie hier den Anwendungszustand wieder her.
  }
})()
