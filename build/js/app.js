notifyIsActive = false
function notify(opts) {
  if (notifyIsActive) return
  notifyIsActive = true
  var title = opts.title || '',
    msg = opts.message || '',
    style = opts.style != '' ? `toast-${opts.style}` : '',
    full = opts.fullWidth || false,
    dur = opts.duration || 3000
  $('#toast')
    .find('.title')
    .text(title)
    .end()
    .find('.text')
    .text(msg)
    .end()
    .addClass(`${style}${full ? ' full-width' : ''}`)
    .fadeIn()
  setTimeout(function() {
    $('#toast').fadeOut(500, function() {
      $('#toast').removeClass(`${style} full-width`)
      notifyIsActive = false
    })
  }, dur)
}

function displayError(message) {
  $('#error')
    .append(
      `<div>
        <span>Error!</span>
        ${message}
      </div>`
    )
    .show()
}

function checkFrame(frame) {
  var html,
    failed = false
  try {
    var doc = frame.contentDocument || frame.contentWindow.document
    html = doc.body.innerHTML
  } catch (e) {
    failed = true
  }

  if (!html) failed = true
  if (failed)
    displayError('Frame loading blocked due to cross-origin prevention')
}

function checkCORS(duration) {
  $('#error')
    .empty()
    .hide()
  if (window.rotationDuration) setTimeout(rotateChannels,Number(duration)*1000)
}
function milliseconds(h,m,s) {
  return ((0*60*60+m*60+s)*1000);
}

function rotateChannels() {
  if (window.rotationChannels) {
    var rotationIndex = null;
    var duration = 10000;
    $('iframe').each(function(i) {
       rotationIndex = $(this).attr('data-rotation-index') || 0
      if (rotationIndex < rotationChannels.length - 1) rotationIndex++
      else rotationIndex = 0
      $(this).attr('data-rotation-index', rotationIndex)
      $(this).attr('src', rotationChannels[rotationIndex].url)
      duration = rotationChannels[rotationIndex].duration;

    })
    checkCORS(duration)
  }
}

$('iframe').each(function(i) {
  $(this)
    .off()
    .on('load error', function() {
      checkFrame(this)
    })
})
checkCORS()
