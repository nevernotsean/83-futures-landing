function createTitles(e) {
  var titleCount = 5;

  var $el = $(this),
    $parent;

  $el.wrap('<span class="mouse-track-container"></span>');
  $parent = $el.parent();

  for (var i = 0; i < titleCount; i++) {
    var clone = $el.clone();

    clone.addClass('mouse-track').attr('data-distance', i);

    $parent.append(clone);
  }

  if (window.innerWidth < 768) {
    window.addEventListener('scroll', function(e) {
      var x = window.innerWidth / 2;
      var y = window.scrollY % (this.window.innerWidth * 2); // 800
      var alt = ((window.scrollY - y) / (this.window.innerWidth * 2)) % 2;
      if (alt == 0) y = this.window.innerWidth * 2 - y;

      updateElements($parent, x, y);
    });
  } else {
    window.addEventListener('mousemove', function(e) {
      var x = e.clientX;
      var y = e.clientY;

      updateElements($parent, x, y);
    });
  }
}

function updateElements(parent, x, y) {
  var els = parent.find('.mouse-track');
  var newX = linearmap(x, 0, window.innerWidth, -1, 1);
  var newY = linearmap(y, 0, window.innerHeight, -1, 1);

  var spacing = 30;
  var opacityStep = 1 / els.length;

  TweenMax.set(els, {
    x: function(i, el) {
      return newX * i * spacing;
    },
    y: function(i, el) {
      return newY * i * spacing;
    },
    opacity: function(i, el) {
      return (1 - i * opacityStep) / 2;
    },
    scale: function(i) {
      return 1 + (i * opacityStep) / 4;
    }
  });
}

function linearmap(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

const handleScroll = e => {
  TweenMax.to('.desktop nav .site-logo', 0.2, {
    transformOrigin: 'top left',
    scale: window.scrollY > 100 ? 0.5 : 1
  });
};

const handleResize = e => {
  const { innerHeight, innerWidth } = window;

  if (innerWidth > 1024) {
    $('body').addClass('desktop');
  } else {
    $('body').removeClass('desktop');
  }
};

const runTicker = () => {
  const amount = $('.ticker-inner .box:not(.clone)').length;

  const getLength = () => {
    let length = 0;
    $('.ticker-inner .box:not(.clone)').each(function() {
      length = length + $(this).outerWidth();
    });

    return length;
  };

  const clones1 = $('.ticker-inner .box')
    .clone()
    .addClass('clone');

  clones1.appendTo('.ticker-inner');

  TweenMax.fromTo(
    '.ticker-inner',
    amount * 8,
    {
      x: '0%'
    },
    {
      x: -getLength() + 'px',
      repeat: -1,
      ease: 'linear'
    }
  );
};

const handleRegistration = () => {
  // registration form
  var $registerForm = $('#registerForm');

  // handle submit
  $registerForm.submit(function(e) {
    e.preventDefault();
    handleSuccess();
    var formData = $registerForm.serialize();

    var request = $.ajax({
      type: 'POST',
      url: $registerForm.attr('action'),
      data: formData,
      success: handleSuccess,
      error: handleErr
    });
  });

  const handleSuccess = e => {
    // console.log(e);
    $('.modal').modal('hide');
    $('#registrationSuccess').modal();
  };

  const handleErr = e => {
    console.log(e);
  };
};

const handleVerification = () => {
  var form = $('#verifyForm');
  var failCount = 0;

  form.submit(function(e) {
    e.preventDefault();
    var formData = form.serialize();

    var request = $.ajax({
      type: 'POST',
      url: form.attr('action'),
      data: formData,
      success: handleSuccess,
      error: handleErr
    });

    // handleSuccess();
    // handleErr();
  });

  const handleSuccess = e => {
    failCount = 0;
    console.log(e);
    $('.modal').modal('hide');
    $('#verifySuccess').modal();
  };

  const handleErr = e => {
    failCount = failCount + 1;

    console.log(e);

    $('.modal').modal('hide');

    if (failCount == 1) {
      // $('#verifyFail pre').html(e.responseText);
      $('#verifyFail').modal();
    }

    if (failCount == 2) {
      // $('#verifyFailTwo pre').html(e.responseText);
      $('#verifyFailTwo').modal();
      failCount = 0;
    }
  };
};

$(document).ready(function() {
  $('.big-title').each(createTitles);

  // ticker animation
  runTicker();

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  handleResize();

  handleRegistration();
  handleVerification();

  if (window.location.hash) {
    var hash = window.location.hash;
    var isModal = $(hash).hasClass('modal');
    if (isModal) {
      $(hash).modal('toggle');
    }
  }

  $('a').on('click', function(event) {
    if (this.hash !== '') {
      event.preventDefault();
      var hash = this.hash;

      $('html, body').animate({ scrollTop: $(hash).offset().top }, 800, function() {
        window.location.hash = hash;
      });
    }
  });

  $('.modal').on('hide.bs.modal', function(e) {
    $('html').css({ overflow: 'scroll' });
  });

  $('.modal').on('shown.bs.modal', function(e) {
    $('html').css({ overflow: 'hidden' });
  });
});
