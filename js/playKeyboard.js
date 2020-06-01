

// toggles 
let space_to_record = false;

function playKeyboard() {

	let pressColor = '#1BC0EA'; //color when key is pressed
	let visualKeyboard = document.getElementById('keyboard');
	let src;
	let recording = false;
	let tones = ["Piano", "Organ", "Acoustic", "EDM", "Custom"];


	var __audioSynth = new AudioSynth();
	__audioSynth.setVolume(1);
	var __octave = 4; //sets position of middle C, normally the 4th octave
	let selectSound = {
		value: 0 //piano
	};

	var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	if (isMobile) {
		var evtListener = ['touchstart', 'touchend'];
		document.querySelector(".info").innerText = ("this Application works best on Large Screen with Physical Keyboard.");
		document.querySelector("main").style.width = "90vh";
		document.body.style.transform = "rotate(90deg)";
		// return; 
	} else {
		var evtListener = ['mousedown', 'mouseup'];
		document.querySelector(".info").innerText = `${tones[selectSound.value]} - ${__octave} `;
	}

	let dark = false;
	document.querySelector('.dark').addEventListener('click', function (e) {
		dark = !dark;
		this.style.backgroundColor = dark ? "#eee" : "#111";
		document.body.style.background = dark ? "#111" : "#fff";
		document.querySelector('canvas').style.filter = dark ? "invert(1)" : "invert(0)";
	})
	let sheet = true;
	document.querySelector('.sheet_toggle').addEventListener('click', function (e) {
		sheet = !sheet;
		this.style.backgroundColor = sheet ? "#aaa" : "#00bcd4";
		document.querySelector('canvas').style.display = sheet ? "block" : "none";
		document.querySelector('.record .file').style.minHeight = sheet ? "3em" : "0";
	})


	document.addEventListener('keydown', (e) => {
		if (e.keyCode == 37)
			__octave = Math.max(__octave - 1, 1);
		if (e.keyCode == 39)
			__octave = Math.min(__octave + 1, 9);

		if (e.keyCode == 38)
			selectSound.value = (selectSound.value + 1) % 5;
		if (e.keyCode == 40)
			selectSound.value = (selectSound.value - 1) >= 0 ? (selectSound.value - 1) : 4;

		if (e.keyCode == 32 && space_to_record) { // [space] start / stop recording 
			recording ? stopRecording() : startRecording();
			recording = !recording;
		}

		document.querySelector(".info").innerText = `${tones[selectSound.value]} - ${__octave} `;

	})

	// Key bindings, notes to keyCodes.
	var keyboard = {

		/* ~ */
		192: 'A#,-2',

		/* 2 */
		50: 'C#,-1',

		/* 3 */
		51: 'D#,-1',

		/* 5 */
		53: 'F#,-1',

		/* 6 */
		54: 'G#,-1',

		/* 7 */
		55: 'A#,-1',

		/* 9 */
		57: 'C#,0',

		/* 0 */
		48: 'D#,0',

		/* = */
		187: 'F#,0',

		/* Q */
		81: 'C,-1',

		/* W */
		87: 'D,-1',

		/* E */
		69: 'E,-1',

		/* R */
		82: 'F,-1',

		/* T */
		84: 'G,-1',

		/* Y */
		89: 'A,-1',

		/* U */
		85: 'B,-1',

		/* I */
		73: 'C,0',

		/* O */
		79: 'D,0',

		/* P */
		80: 'E,0',

		/* [ */
		219: 'F,0',

		/* ] */
		221: 'G,0',

		/* A */
		65: 'G#,0',

		/* S */
		83: 'A#,0',

		/* F */
		70: 'C#,1',

		/* G */
		71: 'D#,1',

		/* J */
		74: 'F#,1',

		/* K */
		75: 'G#,1',

		/* L */
		76: 'A#,1',

		/* " */
		222: 'C#,2',


		/* Z */
		90: 'A,0',

		/* X */
		88: 'B,0',

		/* C */
		67: 'C,1',

		/* V */
		86: 'D,1',

		/* B */
		66: 'E,1',

		/* N */
		78: 'F,1',

		/* M */
		77: 'G,1',

		/* , */
		188: 'A,1',

		/* . */
		190: 'B,1',

		/* / */
		191: 'C,2',

	};

	var reverseLookupText = {};
	var reverseLookup = {};

	// Create a reverse lookup table.
	for (var i in keyboard) {

		var val = i;

		switch (i | 0) { //some characters don't display like they are supposed to, so need correct values

			case 187: //equal sign
				val = 61; //???
				break;

			case 219: //open bracket
				val = 91; //left window key
				break;

			case 221: //close bracket
				val = 93; //select key
				break;

			case 188://comma
				val = 44; //print screen
				break;
			//the fraction 3/4 is displayed for some reason if 190 wasn't replaced by 46; it's still the period key either way
			case 190: //period
				val = 46; //delete
				break;

			default:
				val = i;
				break;

		}

		reverseLookupText[keyboard[i]] = val;
		reverseLookup[keyboard[i]] = i;

	}

	// Keys you have pressed down.
	var keysPressed = [];
	var pressedNotes = [];

	// Generate keyboard
	var iKeys = 0;
	var iWhite = 0;
	var notes = __audioSynth._notes; //{C, C#, D....A#, B}

	for (var i = -1; i <= 1; i++) {
		for (var n in notes) {
			var thisKey = document.createElement('div');
			if (n.length > 1) { //adding sharp sign makes 2 characters
				thisKey.className = 'black key'; //2 classes
			} else {
				thisKey.className = 'white key';
				iWhite++;
			}

			var label = document.createElement('div');
			label.className = 'label';

			let s = getDispStr(n, i, reverseLookupText);

			label.innerHTML = '<b class="keyLabel">' + s + '</b>' + '<br /><br />';
			thisKey.appendChild(label);
			thisKey.setAttribute('ID', 'KEY_' + n + ',' + i);
			thisKey.addEventListener(evtListener[0], (function (_temp) { return function (e) { e.preventDefault(); fnPlayKeyboard({ keyCode: _temp }); } })(reverseLookup[n + ',' + i]));
			visualKeyboard[n + ',' + i] = thisKey;
			visualKeyboard.appendChild(thisKey);

			iKeys++;
		}
	}

	visualKeyboard.style.width = iWhite * 40 + 'px';

	window.addEventListener(evtListener[1], function () { n = keysPressed.length; while (n--) { fnRemoveKeyBinding({ keyCode: keysPressed[n] }); } });


	// Detect keypresses, play notes.

	var fnPlayKeyboard = function (e) {

		var i = keysPressed.length;
		while (i--) {
			if (keysPressed[i] == e.keyCode) {
				return false;
			}
		}
		keysPressed.push(e.keyCode);

		if (sheet) {

			pressedNotes = [];
			keysPressed.forEach(key => {
				let modKey = keyboard[key].split(',');
				modKey[1] = Number(modKey[1]) + 4;
				modKey = modKey.join('/');
				pressedNotes.push(modKey);
			})

			renderNote(pressedNotes);
		}

		if (keyboard[e.keyCode]) {
			if (visualKeyboard[keyboard[e.keyCode]]) {
				visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = pressColor;
				visualKeyboard[keyboard[e.keyCode]].style.transform = 'rotateX(-10deg) translateZ(-1px)';
				visualKeyboard[keyboard[e.keyCode]].style.boxShadow = 'none';
			}
			var arrPlayNote = keyboard[e.keyCode].split(',');
			var note = arrPlayNote[0];
			var octaveModifier = arrPlayNote[1] | 0;
			fnPlayNote(note, __octave + octaveModifier);
		} else {
			return false;
		}

	}
	// Remove key bindings once note is done.
	var fnRemoveKeyBinding = function (e) {

		var i = keysPressed.length;
		while (i--) {
			if (keysPressed[i] == e.keyCode) {
				if (visualKeyboard[keyboard[e.keyCode]]) {
					visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode]].style.transform = 'rotateX(0deg) translateZ(0px)';
					visualKeyboard[keyboard[e.keyCode]].style.boxShadow = '';
				}
				keysPressed.splice(i, 1);
			}
		}

	}
	// Generates audio for pressed note and returns that to be played
	var fnPlayNote = function (note, octave) {

		src = __audioSynth.generate(selectSound.value, note, octave, 2);
		container = new Audio(src);
		container.addEventListener('ended', function () { container = null; });
		container.addEventListener('loadeddata', function (e) { e.target.play(); });
		container.autoplay = false;
		container.setAttribute('type', 'audio/wav');
		container.load();
		return container;

	};

	//returns correct string for display
	function getDispStr(n, i, lookup) {

		if (n == 'A#' && i == -2) {
			return "~";
		}
		else {
			return String.fromCharCode(lookup[n + ',' + i]);
		}

	}
	window.addEventListener('keydown', fnPlayKeyboard);
	window.addEventListener('keyup', fnRemoveKeyBinding);
}
