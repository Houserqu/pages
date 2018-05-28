import '../stylesheet/main.less'

function lineTable(canvas, data, options){
  var cxt = canvas.getContext("2d");

  // 数据预处理

  console.log(data);

  // data.sort(function(a, b){
  //   return a.x -b.x;
  // })

  // 不同屏幕放大处理
  (function () {
    // 屏幕的设备像素比
    var devicePixelRatio = window.devicePixelRatio || 1;

    // 浏览器在渲染canvas之前存储画布信息的像素比
    var backingStoreRatio = cxt.webkitBackingStorePixelRatio ||
      cxt.mozBackingStorePixelRatio ||
      cxt.msBackingStorePixelRatio ||
      cxt.oBackingStorePixelRatio ||
      cxt.backingStorePixelRatio || 1;

    // canvas的实际渲染倍率
    var ratio = devicePixelRatio / backingStoreRatio;

    canvas.style.width = canvas.width * ratio;
    canvas.style.height = canvas.height * ratio;

    // canvas.width = canvas.width * ratio;
    // canvas.height = canvas.height * ratio;
  })();

  // 绘画曲线
  this.paintLine = function () {
      cxt.beginPath()
      cxt.strokeStyle = "#2CCCE4";
      cxt.lineWidth = 5;
      cxt.moveTo(data[0].x, data[0].y);
      cxt.lineJoin = "round";

    for (let i = 1; i < data.length; i++) {
      cxt.lineTo(data[i].x, data[i].y);
    }

    cxt.stroke();
  }

  // 绘画坐标点
  this.paintPoint = function(){
    data.forEach(item => {
      cxt.fillStyle = "#2CCCE4";
      cxt.beginPath();
      cxt.arc(item.x, item.y, 15, 0, Math.PI * 2, true);
      cxt.closePath();
      cxt.fill();

      cxt.fillStyle = "#FFFFFF";
      cxt.beginPath();
      cxt.arc(item.x, item.y, 10, 0, Math.PI * 2, true);
      cxt.closePath();
      cxt.fill();
    })
  }


  this.paintLine();
  this.paintPoint();
}

var canvas = document.getElementById("myLineTable");
new lineTable(canvas, [
  {x: 20, y:230},
  {x: 200, y:40},
  {x: 400, y:160},
  {x: 600, y:30},
],{
  width: 640, height:280
});