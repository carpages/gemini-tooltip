/* eslint-env qunit */
/*
 * Added for Saucelabs
 * https://github.com/axemclion/grunt-saucelabs#test-result-details-with-qunit
 */
// var log = [];
// var testName;
//
// QUnit.done( function( testResults ) {
//   var tests = [];
//   for ( var i = 0, len = log.length; i < len; i++ ) {
//     var details = log[i];
//     tests.push({
//       name: details.name,
//       result: details.result,
//       expected: details.expected,
//       actual: details.actual,
//       source: details.source
//     });
//   }
//   testResults.tests = tests;
//
//   window.global_test_results = testResults;
// });
// QUnit.testStart( function( testDetails ) {
//   QUnit.log( function( details ) {
//     if ( !details.result ) {
//       details.name = testDetails.name;
//       log.push( details );
//     }
//   });
// });

require([ 'qunit', 'gemini', 'gemini.tooltip' ], function( QUnit, G ) {
  QUnit.start();
  // Phantom JS touch hack
  // https://github.com/Modernizr/Modernizr/issues/1344
  if ( window._phantom ) {
    $( 'html' ).removeClass( 'yes-touch' );
    $( 'html' ).addClass( 'no-touch' );
  }

  // Rounding shortcut
  var R = Math.round;

  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      QUnit.module(name, {[setup][ ,teardown]})
      QUnit.test(name, callback)
      QUnit.expect(numberOfAssertions)
      QUnit.stop(increment)
      QUnit.start(decrement)
    Test assertions:
      assert.ok(value, [message])
      assert.equal(actual, expected, [message])
      assert.notEqual(actual, expected, [message])
      assert.deepEqual(actual, expected, [message])
      assert.notDeepEqual(actual, expected, [message])
      assert.strictEqual(actual, expected, [message])
      assert.notStrictEqual(actual, expected, [message])
      assert.throws(block, [expected], [message])
  */

  /**
   * Helpers
   */
  function visibleInBody( el ) {
    var body = {};
    var elem = {};
    var $body = $( 'body' );
    var $el = $( el );

    body.top = $body.scrollTop();
    body.bottom = body.top + $body.height();
    body.left = $body.scrollLeft();
    body.right = body.left + $body.width();

    elem.top = $el.offset().top;
    elem.bottom = elem.top + $el.height();
    elem.left = $el.offset().left;
    elem.right = elem.left + $el.width();

    return (( elem.bottom <= body.bottom ) && ( elem.top >= body.top )) &&
           (( elem.right <= body.right ) && ( elem.left >= body.left )) &&
           $el.width() > 0 &&
           $el.height() > 0 &&
           ( parseFloat( $el.css( 'opacity' )) > 0 );
  }

  /**
   * CORE
   */
  QUnit.module( 'Core Plugin Tests', {
    beforeEach: function() {
      this.$el = $( '<a href="#"></a>' );
    }
  });

  QUnit.test( 'tooltip() is defined', function( assert ) {
    assert.expect( 1 );

    assert.strictEqual( typeof this.$el.tooltip, 'function' );
  });

  QUnit.test( 'Is chainable', function( assert ) {
    assert.expect( 1 );

    assert.strictEqual( this.$el.tooltip(), this.$el );
  });

  QUnit.test( 'Public access to plugin object', function( assert ) {
    assert.expect( 1 );

    this.$el.tooltip();
    assert.strictEqual( this.$el.data( 'tooltip' ).el, this.$el[0]);
  });

  /**
   * Functionality
   */
  QUnit.module( 'Basic Functionality', {
    beforeEach: function() {
      this.$el = $( '<a href="#"></a>' );
    }
  });

  QUnit.test( 'Adds markup for tip', function( assert ) {
    assert.expect( 2 );

    assert.ok( !this.$el.html());
    this.$el.tooltip({
      tip: 'test'
    });
    assert.ok( !!this.$el.html());
  });

  QUnit.test( 'You can control the tip content', function( assert ) {
    assert.expect( 1 );

    this.$el.tooltip({
      tip: 'test'
    });
    var $tip = this.$el.data( 'tooltip' ).$tip;

    assert.strictEqual( $tip.html(), 'test' );
  });

  QUnit.test( 'You can control the tip content through a data attribute', function( assert ) {
    assert.expect( 1 );

    this.$el.data( 'tip', 'test' );
    this.$el.tooltip();
    var $tip = this.$el.data( 'tooltip' ).$tip;

    assert.strictEqual( $tip.html(), 'test' );
  });

  QUnit.test( 'Add a tooltip extension class', function( assert ) {
    assert.expect( 1 );

    this.$el.tooltip({
      tip: 'test',
      extension: 'tooltip--ext'
    });
    var $tooltip = this.$el.data( 'tooltip' ).$tooltip;

    assert.ok( $tooltip.hasClass( 'tooltip--ext' ));
  });

  QUnit.test( 'Add a tooltip extension class though a data attribute', function( assert ) {
    assert.expect( 1 );

    this.$el.data( 'extension', 'tooltip--ext' );
    this.$el.tooltip({
      tip: 'test'
    });
    var $tooltip = this.$el.data( 'tooltip' ).$tooltip;

    assert.ok( $tooltip.hasClass( 'tooltip--ext' ));
  });

  /**
   * Rendering in the DOM
   */
  var lifecycle = {
    beforeEach: function() {
      this.$el = $( '<div>Test it out</div>' );
      $( '#js-fixture' ).append( this.$el );
    },
    afterEach: function() {
      this.$el.remove();
    }
  };

  /*******************/
  QUnit.module( 'Events', lifecycle );

  QUnit.test( 'Tip appears on hover', function( assert ) {
    assert.expect( 2 );
    var done = assert.async();

    this.$el.tooltip({
      tip: 'test'
    });
    var tip = this.$el.data( 'tooltip' ).$tooltip[0];

    assert.ok( !visibleInBody( tip ));
    this.$el.trigger( 'mouseenter' );
    setTimeout( function() {
      assert.ok( visibleInBody( tip ));
      done();
    }, 500 );
  });

  /*******************/
  QUnit.module( 'Tip Placement', lifecycle );

  QUnit.test( 'Tip appears on left', function( assert ) {
    assert.expect( 2 );
    var done = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: 'test',
      place: 'left'
    });
    var $tip = $el.data( 'tooltip' ).$tooltip;
    $el.trigger( 'mouseenter' );

    setTimeout( function() {
      assert.ok( R( $tip.offset().left + $tip.width()) <= R( $el.offset().left ),
        'Tip is on the left' );
      assert.ok(
        Math.abs(( $tip.offset().top + $tip.height() / 2 ) -
                 ( $el.offset().top + $el.height() / 2 )) < 2,
        'Tip is centered vertically' );
      done();
    }, 500 );
  });

  QUnit.test( 'Tip appears on right', function( assert ) {
    assert.expect( 2 );
    var done = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: 'test',
      place: 'right'
    });
    var $tip = $el.data( 'tooltip' ).$tooltip;
    $el.trigger( 'mouseenter' );

    setTimeout( function() {
      assert.ok( R( $tip.offset().left ) >= R( $el.offset().left + $el.width()),
        'Tip is on the right' );
      assert.ok(
        Math.abs(( $tip.offset().top + $tip.height() / 2 ) -
                 ( $el.offset().top + $el.height() / 2 )) < 2,
        'Tip is centered vertically' );
      done();
    }, 500 );
  });

  QUnit.test( 'Tip appears on top', function( assert ) {
    assert.expect( 2 );
    var done = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: 'test',
      place: 'top'
    });
    var $tip = $el.data( 'tooltip' ).$tooltip;
    $el.trigger( 'mouseenter' );

    setTimeout( function() {
      assert.ok( R( $tip.offset().top ) <= R( $el.offset().top - $el.height()),
        'Tip is on top' );
      assert.ok(
        Math.abs(( $tip.offset().left + $tip.width() / 2 ) -
                 ( $el.offset().left + $el.width() / 2 )) < 2,
        'Tip is centered horizontally' );
      done();
    }, 500 );
  });

  QUnit.test( 'Tip appears on bottom', function( assert ) {
    assert.expect( 2 );
    var done = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: 'test',
      place: 'bottom'
    });
    var $tip = $el.data( 'tooltip' ).$tooltip;
    $el.trigger( 'mouseenter' );

    setTimeout( function() {
      assert.ok( R( $tip.offset().top ) >= R( $el.offset().top + $el.height()),
        'Tip is on bottom' );
      assert.ok(
        Math.abs(( $tip.offset().left + $tip.width() / 2 ) -
                 ( $el.offset().left + $el.width() / 2 )) < 2,
        'Tip is centered horizontally' );
      done();
    });
  });

  /*******************/
  QUnit.module( 'Tip Placement by Attribute', lifecycle );

  QUnit.test( 'Tip appears on left with attribute set', function( assert ) {
    assert.expect( 1 );

    this.$el.data( 'place', 'left' );
    this.$el.tooltip({
      tip: 'test'
    });
    var $tip = this.$el.data( 'tooltip' ).$tooltip;

    this.$el.trigger( 'hover' );
    assert.ok( R( $tip.offset().left + $tip.width()) <= R( this.$el.offset().left ));
  });

  QUnit.test( 'Tip appears on right with attribute set', function( assert ) {
    assert.expect( 1 );

    this.$el.data( 'place', 'right' );
    this.$el.tooltip({
      tip: 'test'
    });
    var $tip = this.$el.data( 'tooltip' ).$tooltip;

    this.$el.trigger( 'hover' );
    assert.ok( R( $tip.offset().left ) >= R( this.$el.offset().left + this.$el.width()));
  });

  QUnit.test( 'Tip appears on top with attribute set', function( assert ) {
    assert.expect( 1 );

    this.$el.data( 'place', 'top' );
    this.$el.tooltip({
      tip: 'test'
    });
    var $tip = this.$el.data( 'tooltip' ).$tooltip;

    this.$el.trigger( 'hover' );
    assert.ok( R( $tip.offset().top ) <= R( this.$el.offset().top - this.$el.height()));
  });

  QUnit.test( 'Tip appears on bottom with attribute set', function( assert ) {
    assert.expect( 1 );

    this.$el.data( 'place', 'bottom' );
    this.$el.tooltip({
      tip: 'test'
    });
    var $tip = this.$el.data( 'tooltip' ).$tooltip;

    this.$el.trigger( 'hover' );
    assert.ok( R( $tip.offset().top ) >= R( this.$el.offset().top + this.$el.height()));
  });

  /*******************/
  QUnit.module( 'Force open and close', lifecycle );

  QUnit.test( 'You can force open the tip on command', function( assert ) {
    assert.expect( 3 );
    var done1 = assert.async();
    var done2 = assert.async();

    var $el = this.$el;
    $el.tooltip({
      tip: 'test'
    });
    var tip = $el.data( 'tooltip' ).$tooltip[0];

    assert.ok( !visibleInBody( tip ));
    $el.tooltip( 'open' );
    setTimeout( function() {
      assert.ok( visibleInBody( tip ), 'Tip was opened' );
      $el.tooltip( 'close' );
      done1();
    }, 500 );
    setTimeout( function() {
      assert.ok( !visibleInBody( tip ), 'Tip was closed' );
      done2();
    }, 1000 );
  });
});
