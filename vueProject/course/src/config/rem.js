(function () {
  function a() {
    // clientWidth=width(样式中设置的)+左padding+右padding-垂直滚动条宽度。
    var b = document.documentElement.clientWidth;
    b = b > 750 ? 750 : b;
    var c = b / 750 * 100;
    document.getElementsByTagName("html")[0].style.fontSize = c + "px"
  }

  a();
  window.onresize = a
})();
