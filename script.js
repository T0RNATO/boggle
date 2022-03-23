import {data} from './words.js'; // Import dictionary (scuff)
var cells = document.getElementsByClassName("gamecell");
var selected = [] // Selected cells
var el;
var sel;
var elid;
var words = 0; // Num of words found
var wordlength = 4; // Minimum word length
var found = []; // Array of found words
var timemax = 0; // Timer length
var tiles = []; // Stored cell values
var wordselects = []; // Store word selected tiles
var dictionary = Object.keys(JSON.parse(data));
document.getElementById("popup").style.opacity = "100%"; // Fade in start menu
document.getElementById("go").addEventListener("tap", check); // Check button

document.addEventListener("keypress", function(evt) {  // Check for Enter key
  if (evt.code == "Enter") {
    check();
  }
});
document.getElementById("copy").addEventListener("tap", () => { // Copy board code
  let clip = ""
  for (let i = 0; i < cells.length; i++) { // Loop through cells
    clip += cells[i].innerText.substring(0, 1); // Add first letter to string (for QU safety)
  }
  navigator.clipboard.writeText(btoa(clip)); // Change to base64 and copy to clipboard
});

document.getElementById("wordlength").oninput = () => { // Min word length slider
  document.getElementById("wordlabel").innerText = document.getElementById("wordlength").value + "+"; // Update slider text
  document.getElementById("wordlabel").style.paddingLeft = (Number(document.getElementById("wordlength").value) - 2) * 98; // and position
}

document.getElementById("time").oninput = () => { // Timer slider
  document.getElementById("timelabel").innerHTML = document.getElementById("time").value < 301 ? document.getElementById("time").value : "<span style='transform: rotate(-90deg); display: inline-block'>8</span>"; // Change slider label text
  document.getElementById("timelabel").style.paddingLeft = (Number(document.getElementById("time").value) - 10) * 1.333333; // and pos
}

document.getElementById("daily").addEventListener("tap", () => {
  document.getElementById("import").value = btoa("Daily");
})

function copyimage(longestword) {
  let canvas = document.createElement("canvas");
  let can = canvas.getContext('2d');
  canvas.width = 600
  canvas.height = 300
  can.fillStyle = '#202124'
  can.fillRect(0, 0, 600, 300)
  can.fillStyle = '#bdc1c6';
  can.font = '20px Open Sans'
  can.fillText(`I found ${words} words of ${wordlength} letters`, 30, 30)
  can.fillText(`or more in ${timemax} seconds!`, 30, 55)
  can.fillText(`My longest word was ${longestword.charAt(0).toUpperCase() + longestword.slice(1)}`, 30, 105)
  can.font = '25px Open Sans'
  for (let i = 0; i < cells.length; i++) {
    if (wordselects[found.indexOf(longestword)].includes(i)) {
      can.fillStyle = '#30db64'
    } else {can.fillStyle = 'white'};
    let mod = Math.floor(i / 5) * 45;
    can.fillRect(i * 45 + 335 - (mod * 5), mod + 20, 40, 40)
    can.fillStyle = 'black'
    can.fillText(tiles[i], i * 45 + 345 - (mod * 5), mod + 50)
  }
  canvas.toBlob((blob) => {
    navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
  });
}

function endmenu(interval) { // Ending popu
  document.getElementById("switchbox").style.display = "none"; // Bring back menu, etc
  document.getElementById("popup").style.display = "block";
  document.getElementById("win").style.display = "inline-block";
  document.getElementById("title").style.marginTop = "70px"
  document.getElementById("go").style.opacity = "0%";
  if (words > 0) {
    let longestword = found.reduce((p, c) => p.length > c.length ? p : c);
    document.getElementById("endtext").innerHTML = `You found ${words} word${+ words == 1 ? "":"s"} of ${wordlength} letters or more in ${timemax} seconds!
    Your longest word was <span style="text-transform: capitalize; font-weight:800">${longestword}</span>
    <table id='longest'>${("<tr>" + "<td class='menucell'>".repeat(5) + "<tr>").repeat(5)}</table>
    <button onclick='copyimage(longestword)'>Copy Image</button>` // Create longest word table
    for (let i = 0; i < document.getElementsByClassName("menucell").length; i++) { // Loop through tiles
      document.getElementsByClassName("menucell")[i].innerText = tiles[i]; // Set letters of table
      if (wordselects[found.indexOf(longestword)].includes(i)) { // If cell is in the longest word
        document.getElementsByClassName("menucell")[i].style.backgroundColor = "#30db64"; // Set to green
      }
    }
  } else {
    document.getElementById("endtext").innerText = "You didn't find any words :("
  }
  clearInterval(interval); // Stop timer
  for (let i = 0; i < selected.length; i++) {
    document.getElementById(selected[i]).style.backgroundColor = "white"
  }
  selected = []
}

function bogglelongest(element, index) {
  
}

// START GAME
function startgame() {
  document.getElementById("end").addEventListener("tap", function() {
    endmenu(timerinterval)
  })
  document.getElementById("popup").style.display = "none"; // Hide menu
  document.getElementById("go").style.opacity = "100%"; // Fade in check button
  document.getElementById("title").style.marginTop = "20px" // Move up title
  timemax = Number(document.getElementById("time").value);
  document.getElementById("timer").innerText = timemax; // Set timer to time left

  if (timemax < 301) {
    var start = Date.now(); // Record timer starting time
    var timerinterval = setInterval(function() { // Start loop every 500ms
      var difference = Date.now() - start; // Get difference from starting time
      document.getElementById("timer").innerText = timemax - Math.floor(difference / 1000); // Update timer with difference
      if (timemax - Math.floor(difference / 1000) == 0) { // If timer reached 0
        endmenu(timerinterval);
      }
    }, 500);
  } else {
    document.getElementById("timer").innerHTML = "<span style='transform: rotate(-90deg); display: inline-block; color: black;'>8</span>";
  }
  
  wordlength = Number(document.getElementById("wordlength").value);
  let importi = document.getElementById("import").value;
  if (importi == btoa('Daily')) {
    Math.seedrandom(Math.floor((((Date.now() / 1000) / 60) / 60) / 24))
    dice = shuffleArray(dice)
    importi = '';
  }
  if (importi == '') { // If no board code provided
    for (let i = 0; i < cells.length; i++) { // Loop through cells
      let random = Math.ceil(Math.random() * 6); // Random num 1-6
      cells[i].innerText = dice[i].charAt(random - 1); // Get one letter from dice using random num
      if (dice[i].charAt(random - 1) == "Q") { // If Q on the dice
        cells[i].innerText = "Qu"; // Make it Qu
      }
      tiles.push(cells[i].innerText); // Internal tiles list
    }
  }
  else {  // Or if there is a code
    for (let i = 0; i < cells.length; i++) {
      let code = atob(importi);
      cells[i].innerText = code.substring(i, i + 1);
      if (code.substring(i, i + 1) == "Q") {
        cells[i].innerText = "Qu";
      }
      tiles.push(cells[i].innerText);
    }
  }
  //tiles.forEach(bogglelongest(element, index))
}

document.getElementById("popupgo").addEventListener("tap", startgame)
document.getElementById("again").addEventListener("tap", () => {
  document.getElementById("switchbox").style.display = "inline-block";
  document.getElementById("win").style.display = "none";
  document.getElementById("output").innerText = "";
  document.getElementById("count").innerText = "Word Count: 0";
  words = 0;
  found = [];
  tiles = [];
  selected = [];
  wordselects = [];
})

function shuffleArray(array) { // Shuffle dice array
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function flash(hex) { // Flash selected tiles in a colour provided
  for (let i = 0; i < selected.length; i++) {
    document.getElementById(selected[i]).style.backgroundColor = hex
  }
  setTimeout(() => { // Reset colour in 200 ms
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "white";
    }
  }, 200);
}

// 25 * 6 sided dice from original boggle
var dice = ["AAAFRS","AAEEEE","AAFIRS","ADENNN","AEEEEM","AEEGMU","AEGMNN","AFIRSY","BJKQXZ","CCENST","CEIILT","CEILPT","CEIPST","DDHNOT","DHHLOR","DHLNOR","DHLNOR","EIIITT","EMOTTT","ENSSSU","FIPRSY","GORRVW","IPRRRY","NOOTUW","OOOTTU"];

function check() { // Check if selected cells are a word
  let word = "";
  for (let i = 0; i < selected.length; i++) { // Loop through selected tiles
    word += tiles[selected[i]]; // Add to string
  }
  word = word.toLowerCase()
  if (!found.includes(word)) { // If word not already found
    if (word.length >= wordlength && dictionary.includes(word)) { // If word correct length and valid
      flash("#30db64") // Flash green
      document.getElementById("output").innerHTML += word + "<br>"; // Add to display words list
      words++;
      document.getElementById("count").innerText = "Word Count: " + words; // Increment word count
      found.push(word) // And internal word list
      wordselects.push(selected);
    }
    else {
      flash("#d14747") // Flash red (invalid word/bad length)
    }
  }
  else {
    flash("#e0c528") // Flash yellow (found already)
  }
  selected = [] // Deselect all tiles
  sel = ""
}

function clicked(event) { // Tile clicked
	sel = Number(selected[selected.length - 1]) // Id of last selected tile
  el = event.currentTarget // Newly selected element
  elid = Number(el.id) // Id of newly selected element
  if (elid == sel) { // If tile clicked is also the last tile clicked,
    document.getElementById(sel).style.backgroundColor = "white"; // Deselect it
    selected.pop()
  }
  else if (!selected.includes(elid)) { // If tile is not already selected
    if (selected.length == 0) { // If no tiles selected
      el.style.backgroundColor = "#31a5f7"; // Select the clicked tile
      selected.push(elid);
    }
    else if (selected.length > 0) { // Or if some tiles are selected
      for (let i = 0; i < 8; i++) { // Loop through 8 possible adjacencies
        if ((sel % 5 == 0 && i == 1) || ((sel - 4) % 5 == 0 && i == 0)) { // If tile is on edge, skip loop (fixes issue)
          continue;
        }
        if (elid == sel + [1, -1, 4, -4, 5, -5, 6, -6][i]) { // If tile is a valid adjacency,
          el.style.backgroundColor = "#31a5f7" // Select it
          selected.push(elid)
        }
      }
    }
  }
}

document.getElementById("game").innerHTML = ("<tr>" + "<td class='gamecell'>".repeat(5) + "<tr>").repeat(5);

for (let i = 0; i < cells.length; i++) { // Loop through tiles
  cells[i].addEventListener("tap", clicked); // Assign them numerical ids (0-24)
  cells[i].id = i;
}
//comment