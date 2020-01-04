/**
 * 随机整数
 */
var Util = {
  random: function(max) {
    return Math.floor(Math.random() * max);
  }
};

/**
 * 简易Promise
 */
var Promise = {
  fns: [],
  then: function(fn) {
    this.fns.push(fn);
    return this;
  },
  resolve: function() {
    if (this.fns.length == 0) return;
    var fn = this.fns.splice(0, 1);
    fn[0] && fn[0].call(this);
  }
};

/**
 * 随机滚动
 * container 容器元素
 */
function scrollTopBottom(container) {
  var num = Util.random(10);
  for (var i = 0; i < num; i++) {
    (function(count) {
      Promise.then(function() {
        var direction,		//滚动方向
          destination,		//滚动的目标位置
          current,			//当前滚动距离
          slide = 0;		//滚动距离
        destination = Util.random(2000);	
        current = container.scrollTop;		
        direction = Util.random(3);
        (function moveInner() {
          switch (direction) {
            case 0:				//向上滚动
              current += 10;
              break;
            case 1:				//向下滚动
              current -= 10;
              if (current < 0) current = 0;
              break;
            default:			//保持原地
              break;
          }
          slide += 10;			//执行滚动
		  console.log(count, slide, current, destination);
          container.scrollTop = current;
          if (slide <= destination && current > 0) {
            window.requestAnimationFrame(moveInner);	//顺滑的滚动
          } else {
            Promise.resolve(); 	//执行下一个动作
          }
        })();
      });
    })(i);
  }
  Promise.resolve();		//开始滚动
}

/**
 * document.documentElement
 * document.body
 */
// setTimeout(function() {
  // scrollTopBottom(document.documentElement);
// }, 2000);

/**
 * 点击
 */
function click() {
  var links = document.querySelectorAll("img"),		//指定要触发的元素
	x = Util.random(window.outerWidth),				//随机X坐标
    y = Util.random(document.body.scrollHeight),	//随机Y坐标
	clientY = y > window.outerHeight ? (y - window.outerHeight) : y;
  var event = new MouseEvent("click", {
    bubbles: true,		//能够冒泡
    cancelable: true,	//可以取消事件
    view: window,		//窗口
    clientX: x,
    clientY: clientY,	//相对于视口的垂直偏移
    pageX: x,
    pageY: y			//包含垂直滚动的偏移
  });
  [].forEach.call(links, function(value, key) {
    var rect = value.getBoundingClientRect();
	//判断当前坐标是否在元素范围内
	if(x >= rect.left && x<=rect.right && y>=rect.top && y<=rect.bottom) {
	  console.log(x, y);
	  value.dispatchEvent(event);		//派发事件
	}
  });
}

function runClick() {
  for (var j = 0; j < 50; j++) {
    (function(j) {
      setTimeout(function() {
        click(); 		//随意点击页面
      }, 2000 * j);		//不集中在一个时间执行
    })(j);
  }
}

//runClick();

/**
 * 竖屏翻页
 */
var identifier = 0,
  eventType = ["touchstart", "touchmove", "touchend"];
function slide(container) {
  var x = Util.random(window.outerWidth),
    y = 300,
    currying = touch(container, x, y);
  currying(eventType[0]);
  currying(eventType[1]);
  currying(eventType[2]);
}
function touch(container, x, y) {
  var interval = 100; 				//滑动距离
  return function(type) {
    identifier++;
    if (type == eventType[1]) {		//touchmove事件更改Y坐标
      y -= interval;
    }
    var t = new Touch({
      identifier: identifier,
      target: container,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y
    });
    console.log(`${identifier}, ${type} x: ${x}, y: ${y}`);
    var event = new TouchEvent(type, {
      touches: [t],
      targetTouches: [t]
    });
    container.dispatchEvent(event);
  };
}

/**
 * 假设滑动插件是swiper.js
 * 那么取其容器作为slide()的参数传入
 */
setInterval(function() {
  slide(document.querySelector(".swiper-container"));
}, 2000);



