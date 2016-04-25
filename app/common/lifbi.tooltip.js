/**
 * Created by CMatyas on 09.12.2015.
 */
$('body').mousemove(function (event) {
  var eventDoc, doc, body
  event = event || window.event; // IE-ism

  // If pageX/Y aren't available and clientX/Y are,
  // calculate pageX/Y - logic taken from jQuery.
  // (This is to support old IE)
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document
    doc = eventDoc.documentElement
    body = eventDoc.body

    event.pageX = event.clientX +
      (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
      (doc && doc.clientLeft || body && body.clientLeft || 0)
    event.pageY = event.clientY +
      (doc && doc.scrollTop || body && body.scrollTop || 0) -
      (doc && doc.clientTop || body && body.clientTop || 0)
  }

  // $('#tooltip').css('left',event.clientX+18).css('top',event.clientY+10)
  $('#tooltip').css('left', event.pageX + 18).css('top', event.pageY + 10)
})

var lifbi = {
  tooltip: {
    showTooltip: function (text) {
      $('#tooltip').html('<span>' + text + '</span>').show()
    },
    hideTooltip: function () {
      $('#tooltip').hide()
    }
  }
}
