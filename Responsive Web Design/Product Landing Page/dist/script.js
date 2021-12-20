// Project by @Ry2uko

let canvas = document.getElementById("canvas");
let header = document.getElementById("header");
let body = document.body;

function openNav() {
  canvas.style.width = "100%";
  canvas.style.opacity = "1"
  body.style.overflow = "hidden";
}
function closeNav() {
  canvas.style.opacity = "0";
  body.style.overflow = "visible";
  setTimeout(function(){ canvas.style.width = "0%"; }, 350);
}
console.log(window.innerHeight)