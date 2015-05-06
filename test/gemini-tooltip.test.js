requirejs.config({
  baseUrl: '../',
  paths: {
    'underscore':        'bower_components/underscore/underscore',
    'jquery':            'bower_components/jquery/dist/jquery',
    'jquery.boiler':     'bower_components/jquery-boiler/jquery.boiler',
    'gemini':            'bower_components/gemini-loader/gemini',
    'gemini.support':    'bower_components/gemini-support/gemini.support'
  }
});

require(['gemini', 'gemini.tooltip'], function(G) {
  QUnit.start();
  // Phantom JS touch hack
  // https://github.com/Modernizr/Modernizr/issues/1344
  if (window._phantom) {
    $('html').removeClass('yes-touch');
    $('html').addClass('no-touch');
  }

  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  /**
   * Helpers
   */
  function withinviewport(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) &&
           (parseFloat($(elem).css('opacity')) > 0);
  }

  /**
   * CORE
   */
  QUnit.module('Core Plugin Tests', {
    beforeEach: function() {
      this.$el = $('<a href="#"></a>');
    }
  });

  QUnit.test('tooltip() is defined', function(assert) {
    assert.expect(1);

    assert.strictEqual(typeof this.$el.tooltip, 'function');
  });

  QUnit.test('Is chainable', function(assert) {
    assert.expect(1);

    assert.strictEqual(this.$el.tooltip(), this.$el);
  });

  QUnit.test('Public access to plugin object', function(assert) {
    assert.expect(1);

    this.$el.tooltip();
    assert.strictEqual(this.$el.data('tooltip').el, this.$el[0]);
  });

  /**
   * Functionality
   */
  QUnit.module('Basic Functionality', {
    beforeEach: function() {
      this.$el = $('<a href="#"></a>');
    }
  });

  QUnit.test('Adds markup for tip', function (assert) {
    assert.expect(2);

    assert.ok(!this.$el.html());
    this.$el.tooltip({
      tip: 'test'
    });
    assert.ok(!!this.$el.html());
  });

  QUnit.test('You can control the tip content', function(assert) {
    assert.expect(1);

    this.$el.tooltip({
      tip: 'test'
    });
    var $tip = this.$el.data('tooltip').$tip;

    assert.strictEqual($tip.html(), 'test');
  });

  QUnit.test('You can control the tip content through a data attribute', function(assert) {
    assert.expect(1);

    this.$el.data('tip', 'test');
    this.$el.tooltip();
    var $tip = this.$el.data('tooltip').$tip;

    assert.strictEqual($tip.html(), 'test');
  });

  QUnit.test('Add a tooltip extension class', function(assert) {
    assert.expect(1);

    this.$el.tooltip({
      tip: 'test',
      extension: 'tooltip--ext'
    });
    var $tooltip = this.$el.data('tooltip').$tooltip;

    assert.ok($tooltip.hasClass('tooltip--ext'));
  });

  QUnit.test('Add a tooltip extension class though a data attribute', function(assert) {
    assert.expect(1);

    this.$el.data('extension', 'tooltip--ext');
    this.$el.tooltip({
      tip: 'test'
    });
    var $tooltip = this.$el.data('tooltip').$tooltip;

    assert.ok($tooltip.hasClass('tooltip--ext'));
  });

  /**
   * Rendering in the DOM
   */
  var lifecycle = {
    beforeEach: function() {
      this.$el = $('<div>Test it out</div>');
      $('#js-fixture').append(this.$el);
    },
    afterEach: function() {
      this.$el.remove();
    }
  };

  /*******************/
  QUnit.module('Events', lifecycle);

  QUnit.test('Tip appears on hover', function(assert) {
    assert.expect(2);
    var done = assert.async();

    this.$el.tooltip({
      tip: 'test'
    });
    var tip = this.$el.data('tooltip').$tooltip[0];

    assert.ok(!withinviewport(tip));
    this.$el.trigger('mouseenter');
    setTimeout(function() {
      assert.ok(withinviewport(tip));
      done();
    }, 500);
  });

  /*******************/
  QUnit.module('Tip Placement', lifecycle);

  QUnit.test('Tip appears on left', function(assert) {
    assert.expect(2);
    var done = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: "test",
      place: "left"
    });
    var $tip = $el.data('tooltip').$tooltip;
    $el.trigger('mouseenter');

    setTimeout(function() {
      assert.ok($tip.offset().left + $tip.width() <= $el.offset().left,
        'Tip is on the left');
      assert.ok(
        Math.abs(($tip.offset().top + $tip.height() / 2) -
                 ($el.offset().top + $el.height() / 2)) < 2,
        'Tip is centered vertically');
      done();
    }, 500);
  });

  QUnit.test('Tip appears on right', function(assert) {
    assert.expect(2);
    var done = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: "test",
      place: "right"
    });
    var $tip = $el.data('tooltip').$tooltip;
    $el.trigger('mouseenter');

    setTimeout(function() {
      assert.ok($tip.offset().left >= $el.offset().left + $el.width(),
        'Tip is on the right');
      assert.ok(
        Math.abs(($tip.offset().top + $tip.height() / 2) -
                 ($el.offset().top + $el.height() / 2)) < 2,
        'Tip is centered vertically');
      done();
    }, 500);
  });

  QUnit.test('Tip appears on top', function(assert) {
    assert.expect(2);
    var done = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: "test",
      place: "top"
    });
    var $tip = $el.data('tooltip').$tooltip;
    $el.trigger('mouseenter');

    setTimeout(function() {
      assert.ok($tip.offset().top <= $el.offset().top - $el.height(),
        'Tip is on top');
      assert.ok(
        Math.abs(($tip.offset().left + $tip.width() / 2) -
                 ($el.offset().left + $el.width() / 2)) < 2,
        'Tip is centered horizontally');
      done();
    }, 500);
  });

  QUnit.test('Tip appears on bottom', function(assert) {
    assert.expect(2);
    var done = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: "test",
      place: "bottom"
    });
    var $tip = $el.data('tooltip').$tooltip;
    $el.trigger('mouseenter');

    setTimeout(function() {
      assert.ok($tip.offset().top >= $el.offset().top + $el.height(),
        'Tip is on bottom');
      assert.ok(
        Math.abs(($tip.offset().left + $tip.width() / 2) -
                 ($el.offset().left + $el.width() / 2)) < 2,
        'Tip is centered horizontally');
      done();
    });
  });

  /*******************/
  QUnit.module('Tip Placement by Attribute', lifecycle);

  QUnit.test('Tip appears on left with attribute set', function(assert) {
    assert.expect(1);

    this.$el.data('place', 'left');
    this.$el.tooltip({
      tip: "test"
    });
    var $tip = this.$el.data('tooltip').$tooltip;

    this.$el.trigger('hover');
    assert.ok($tip.offset().left + $tip.width() <= this.$el.offset().left);
  });

  QUnit.test('Tip appears on right with attribute set', function(assert) {
    assert.expect(1);

    this.$el.data('place', 'right');
    this.$el.tooltip({
      tip: "test"
    });
    var $tip = this.$el.data('tooltip').$tooltip;

    this.$el.trigger('hover');
    assert.ok($tip.offset().left >= this.$el.offset().left + this.$el.width());
  });

  QUnit.test('Tip appears on top with attribute set', function(assert) {
    assert.expect(1);

    this.$el.data('place', 'top');
    this.$el.tooltip({
      tip: "test"
    });
    var $tip = this.$el.data('tooltip').$tooltip;

    this.$el.trigger('hover');
    assert.ok($tip.offset().top <= this.$el.offset().top - this.$el.height());
  });

  QUnit.test('Tip appears on bottom with attribute set', function(assert) {
    assert.expect(1);

    this.$el.data('place', 'bottom');
    this.$el.tooltip({
      tip: "test"
    });
    var $tip = this.$el.data('tooltip').$tooltip;

    this.$el.trigger('hover');
    assert.ok($tip.offset().top >= this.$el.offset().top + this.$el.height());
  });

  /*******************/
  QUnit.module('Force open and close', lifecycle);

  QUnit.test('You can force open the tip on command', function(assert) {
    assert.expect(3);
    var done1 = assert.async();
    var done2 = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: 'test'
    });
    var tip = $el.data('tooltip').$tooltip[0];

    assert.ok(!withinviewport(tip));
    $el.tooltip('open');
    setTimeout(function() {
      assert.ok(withinviewport(tip), 'Tip was opened');
      $el.tooltip('close');
      done1();
    }, 500);
    setTimeout(function() {
      assert.ok(!withinviewport(tip), 'Tip was closed');
      done2();
    }, 1000);
  });

});
