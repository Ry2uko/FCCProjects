// Project by @Ry2uko

function check_result(btn, ctm) { // Function for the 'view result' button
  children_arr = btn.parentElement.children;
  for(let i = 0; i < children_arr.length; i++) {
    if(children_arr[i].className.split(" ")[0] === "result-div") {
      if(btn.innerText.toLowerCase() === "view result") {
        children_arr[i].style.display = "block";
        if(typeof ctm === "undefined") {
          btn.style.backgroundColor = "var(--orange)";
        } else if(ctm === "error") {
          btn.style.backgroundColor = "var(--grey)";
        }
        btn.innerText = "Hide Result";
      } else {
        children_arr[i].style.display = "none";
        if(typeof ctm === "undefined") {
          btn.style.backgroundColor = "var(--lightblue)";
        } else if(ctm === "error") {
          btn.style.backgroundColor = "var(--red)";
        }
        btn.innerText = "View Result";
      }
    }
  }
}
function rand_result1(btn, range) {
  children_arr = btn.parentElement.children;
  for(let i = 0; i < children_arr.length; i++) {
    if(children_arr[i].className.split(" ")[0] === "result-div") {
      if(btn.innerText.toLowerCase() === "hide result") {
        for(let j = 0; j < children_arr[i].children.length; j++) {
          if(children_arr[i].children[j].className.split(" ")[0] === "result") {
            randnum = Math.floor(Math.random() * (range[1] + 1 - range[0]) + range[0]);
            children_arr[i].children[j].innerText = randnum;
          }
        }
      }
    }
  }
}