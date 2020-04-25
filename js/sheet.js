VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "boo".
var sheet = document.getElementById("sheet")
var renderer = new VF.Renderer(sheet, VF.Renderer.Backends.CANVAS);

// Size our SVG:
renderer.resize(100, 200);

// And get a drawing context:
var context = renderer.getContext();

// Create a stave at position 10, 40 of width 400 on the canvas.
var stave = new VF.Stave(0, 40, 100);

// Add a clef and time signature.
stave.addClef("treble");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();


function renderNote(playedNotes) {
    context.clearRect(0, 0, 200, 200);
    // Render voice
    var notes = [
        // A quarter-note C.
        new VF.StaveNote({ clef: "treble", keys: playedNotes, duration: "q" })
    ];

    playedNotes.forEach((note, i) => {
        if (note.length > 3) {
            notes[0].addAccidental(i, new VF.Accidental("#"))
        }
    })


    stave.setContext(context).draw();

    // Create a voice in 4/4 and add the notes from above
    var voice = new VF.Voice({ num_beats: 1 });
    voice.addTickables(notes);

    // Format and justify the notes to 400 pixels.
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 200);

    voice.draw(context, stave);
}