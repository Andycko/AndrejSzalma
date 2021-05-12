// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

window.onload = () => {
    document.querySelector("body").classList.remove("preload")
    let negative_scroll = 0;


    const name = document.querySelector('.heading')
    name.onmouseover = () => {
        name.classList.add('animate')
    }
    
    window.onscroll = (e) => {
        name.classList.add('animate')
    }

    const soft = document.querySelector('#soft')
    window.onwheel = (e) => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            disableScroll()
            let val = parseInt(window.getComputedStyle(soft).clipPath.match(/\d+px/g),10)
            if (!(negative_scroll >= window.innerHeight)) {
                soft.style.clipPath = `circle(${val+e.deltaY}px)`
                negative_scroll += e.deltaY
            } else if (e.deltaY < 0){
                soft.style.clipPath = `circle(${val+e.deltaY}px)`
                negative_scroll += e.deltaY
            }
            if (negative_scroll < 0 && val == 0) enableScroll()
        }
    }

}