import {data} from './words.js'; // Import dictionary (scuff)
var cells = document.getElementsByTagName("td")
var selected = [] // Selected cells
var el;
var sel;
var elid;
var words = 0; // Num of words found
var wordlength = 4; // Minimum word length
var found = []; // Array of found words
var timemax = 0; // Timer length
var tiles = []; // Stored cell values
var dictionary = Object.keys(JSON.parse(data));
document.getElementById("popup").style.opacity = "100%"; // Fade in start menu
document.getElementById("go").addEventListener("click", check); // Check button
document.addEventListener("keypress", function(evt) {  // Check for Enter key
  if (evt.code == "Enter") {
    check();
  }
});
document.getElementById("copy").addEventListener("click", () => { // Copy board code
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
  document.getElementById("timelabel").innerText = document.getElementById("time").value; // Change slider label text
  document.getElementById("timelabel").style.paddingLeft = (Number(document.getElementById("time").value) - 10) * 1.333333; // and pos
}

document.getElementById("popupgo").addEventListener("click", () => { // Go button on starting menu
  document.getElementById("popup").style.display = "none"; // Hide menu
  document.getElementById("go").style.opacity = "100%"; // Fade in check button
  document.getElementById("title").style.marginTop = "20px" // Move up title
  timemax = Number(document.getElementById("time").value);
  document.getElementById("timer").innerText = timemax; // Set timer to time left

  var start = Date.now(); // Record timer starting time
  var timerinterval = setInterval(function() { // Start loop every 500ms
    var difference = Date.now() - start; // Get difference from starting time
    document.getElementById("timer").innerText = timemax - Math.floor(difference / 1000); // Update timer with difference
    if (timemax - Math.floor(difference / 1000) == 0) { // If timer reached 0
      document.getElementById("switchbox").style.display = "none"; // Bring back menu, etc
      document.getElementById("popup").style.display = "block";
      document.getElementById("win").style.display = "inline-block";
      document.getElementById("title").style.marginTop = "70px"
      document.getElementById("go").style.opacity = "0%";
      document.getElementById("win").innerText = `You found ${words} word${+ words == 1 ? "":"s"} in ${timemax} seconds!`
      clearInterval(timerinterval); // Stop loop
    }
}, 500);
  
  wordlength = Number(document.getElementById("wordlength").value);
  if (document.getElementById("import").value == '') {
    for (let i = 0; i < cells.length; i++) {
      let random = Math.ceil(Math.random() * 6);
      cells[i].innerText = dice[i].substring(random - 1, random);
      if (dice[i].substring(random - 1, random) == "Q") {
        cells[i].innerText = "Qu";
      }
      tiles.push(cells[i].innerText);
    }
  }
  else {
    for (let i = 0; i < cells.length; i++) {
      let code = atob(document.getElementById("import").value);
      cells[i].innerText = code.substring(i, i + 1);
      if (code.substring(i, i + 1) == "Q") {
        cells[i].innerText = "Qu";
      }
    }
  }
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
var dice = shuffleArray(["AAAFRS","AAEEEE","AAFIRS","ADENNN","AEEEEM","AEEGMU","AEGMNN","AFIRSY","BJKQXZ","CCENST","CEIILT","CEILPT","CEIPST","DDHNOT","DHHLOR","DHLNOR","DHLNOR","EIIITT","EMOTTT","ENSSSU","FIPRSY","GORRVW","IPRRRY","NOOTUW","OOOTTU"]);

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

for (let i = 0; i < cells.length; i++) { // Loop through tiles
  cells[i].addEventListener("click", clicked); // Assign them numerical ids (0-24)
  cells[i].id = i;
}
