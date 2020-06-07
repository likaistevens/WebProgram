"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var add = function add(a, b) {
  return a + b;
};

alert(add(1, 2));
alert(add(3, 4));

var Person = /*#__PURE__*/function () {
  _createClass(Person, null, [{
    key: "A",
    value: function A() {
      alert('aaa');
    }
  }]);

  function Person() {
    _classCallCheck(this, Person);

    this.bb = 2;
  }

  return Person;
}();

Person.aa = 1;
