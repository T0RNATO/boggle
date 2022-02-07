import {data} from '/words.js';
var cells = document.getElementsByTagName("td")
var selected = []
var el;
var sel;
var elid;
var words = 0;
var wordlength = 0;
var found = [];
var dictionary = Object.keys(JSON.parse(data));
document.getElementById("go").addEventListener("click", check);
document.getElementsByClassName("switch")[0].addEventListener("click", function() {
  if (wordlength == 0) {
    wordlength = 1;
    document.getElementsByClassName("switch")[0].style.setProperty('--location', '50px');
  }
  else {
    wordlength = 0;
    document.getElementsByClassName("switch")[0].style.setProperty('--location', '-50px');
  }
})
document.addEventListener("keypress", function(evt) {
  if (evt.code == "Enter") {
    check();
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function flash(hex) {
  for (let i = 0; i < selected.length; i++) {
    document.getElementById(selected[i]).style.backgroundColor = hex
  }
  setTimeout(() => {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "white";
    }
  }, 200);
}

var dice = shuffleArray(["AAAFRS","AAEEEE","AAFIRS","ADENNN","AEEEEM","AEEGMU","AEGMNN","AFIRSY","BJKQXZ","CCENST","CEIILT","CEILPT","CEIPST","DDHNOT","DHHLOR","DHLNOR","DHLNOR","EIIITT","EMOTTT","ENSSSU","FIPRSY","GORRVW","IPRRRY","NOOTUW","OOOTTU"]);

function check() {
	for (var i = 0; i < cells.length; i++) {
		cells[i].style.backgroundColor = "white"
	}
  var word = "";
  for (let i = 0; i < selected.length; i++) {
    word += document.getElementById(selected[i]).innerText;
  }
  word = word.toLowerCase()
  if (!found.includes(word)) {
    if (word.length > wordlength + 2 && dictionary.includes(word)) {
      flash("#30db64")
      document.getElementById("output").innerHTML += word + "<br>";
      words++;
      document.getElementById("count").innerText = "Word Count: " + words;
      found.push(word)
    }
    else {
      flash("#d14747")
    }
  }
  else {
    flash("#e0c528")
  }
  selected = []
  sel = ""
}

function clicked(event) {
	sel = Number(selected[selected.length - 1])
  el = event.currentTarget
  elid = Number(el.id)
  if (elid == sel) {
    document.getElementById(sel).style.backgroundColor = "white";
    selected.pop()
  }
  else if (!selected.includes(elid)) {
    if (selected.length == 0) {
      el.style.backgroundColor = "#31a5f7";
      selected.push(elid);
    }
    else if (selected.length > 0) {
      for (let i = 0; i < 8; i++) {
        if (elid == sel + [1, -1, 4, -4, 5, -5, 6, -6][i]) {
          el.style.backgroundColor = "#31a5f7"
          selected.push(elid)
        }
      }
    }
  }
}

for (let i = 0; i < cells.length; i++) {
  var random = Math.ceil(Math.random() * 6);
	cells[i].innerText = dice[i].substring(random - 1, random);
  if (dice[i].substring(random - 1, random) == "Q") {
    cells[i].innerText = "Qu";
  }
  cells[i].addEventListener("click", clicked);
  cells[i].id = i;
}