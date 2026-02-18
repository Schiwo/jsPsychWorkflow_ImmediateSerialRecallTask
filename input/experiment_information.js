/**
 * Creates and returns the central configuration object for the experiment.
 *
 * This function acts as the main control center for all global settings, including
 * display parameters, timing values, stimuli, response keys, block structure, and
 * instruction screen configuration.
 *
 * Other parts of the code rely on this object to build trials, assemble the timeline,
 * handle counterbalancing, and control the visual appearance of the experiment.
 *
 * Keeping all settings here makes it easy to adjust the experiment without searching
 * through multiple files. For example, to change the number of blocks, you can simply
 * update the 'blocks' parameter below and the rest of the experiment will adapt
 * automatically.
 *
 * @returns {Object} An object containing experiment-wide parameters and settings.
 */
function createExpInfo() {

    let expInfo = {
        // Minimum required width and height for the experiment window (in pixels)
        minWidth: 1200,
        minHeight: 700,

        // Colors used throughout the experiment
        backgroundColor : "#70757a", // Background color of the experiment
        fontColor : "#FFFFFF",       // Main font color
        promptColor : "#C0C0C0",     // Color for prompts
        fdbColorCorrect : "#008000", // Color for correct feedback
        fdbColorIncorrect : "#b30000", // Color for incorrect feedback

        // Token for URL return (used for participant identification or session tracking)
        token : "TEST123",

        // Structure of trials for training and main experiment
        trialStructures: {
            main: ["fixationCross",
                    "word", "word", "word", "word","word", "word",
                    "word", "word", "word", "word","word", "word",
                    "recall"]         // Sequence of trial parts that form a trial in the main blocks
         },

        // Stimuli and response keys
        words: [
            // Musical instruments
            ["piano", "violin", "guitar", "oboe", "drum", "bugle"],
            // Vegetables
            ["turnip", "celery", "onion", "tomato", "potato", "cauliflower"],
            // Fruits
            ["grape", "kiwi", "melon", "blueberry", "lemon", "peach"],
            // Metals
            ["steel", "pewter", "brass", "nickel", "titanium", "silver"],
            // Farm animals
            ["horse", "chick", "mare", "pig", "bull"],
            // Birds
            ["duck", "falcon", "vulture", "partridge", "raven", "white owl", "condor"],
            // Vehicles
            ["airplane", "boat", "car", "subway", "streetcar", "truck"],
            // Alcoholic beverages
            ["cognac", "whisky", "port", "brandy", "vodka", "pineau"],
            // Fish
            ["cod", "halibut", "salmon", "pike", "shark", "yellow pike"],
            // Clothing
            ["hat", "mitten", "bobble cap", "headband", "scarf", "coat"],
            // Sports
            ["tennis", "soccer", "skating", "diving", "hockey", "baseball"],
            // Wild animals
            ["beaver", "ground hog", "fox", "rabbit", "coyote", "roe deer"],
            // Planets
            ["Pluto", "Venus", "Mercury", "Jupiter", "Mars", "Saturn"],
            // Professions
            ["sailor", "plumber", "barman", "chemist", "welder", "tradesman"]

        ],

        trainingWords: [
            "guitar", "tomato", "silver", "condor", "truck", "hockey"      
        ],

        lists: generateStimulusSets(words), // Generate stimulus sets (same and different semantic categories) for the experiment based on the provided word categories

        // Block settings
        blocks : 1,           // Number of main experiment blocks
        trainingblocks : 1,   // Number of training blocks

        // Timing parameters (in milliseconds)
        blockStartDuration : 1000,        // Duration of block start screen
        fixationcrossDuration : 250,      // Duration of fixation cross
        blankDuration: 35,               // Duration of blank screen shown between word stimuli
        wordDuration: 500,               // Duration of word presentation

        // Visual sizes (in pixels)
        stimulusSize : 45,        // Size of target stimuli
        fixationCrossSize : 45,   // Size of fixation cross

        // Instruction navigation keys
        instrKeyForward : "C",   // Key to move forward in instructions
        instrKeyBackward : "X",  // Key to move backward in instructions

        // Instruction screens configuration. Instructions can be easily created with powerpoint using the export to JPG function.
        instructions : {
            instructions1 : {
                folder: "instructions1", // Folder containing instruction images
                file: "Folie",           // Base filename for instruction images
                format: ".JPG",         // File format for instruction images
                length: 3                 // Number of instruction images in this set
                // e.g., instructions\instructions1\Folie1.JPG, instructions\instructions1\Folie2.JPG, instructions\instructions1\Folie3.JPG
            },
            instructions2 : {
                folder: "instructions2",
                file: "Folie",
                format: ".JPG",
                length: 1
            },

            // Additional instruction sets can be added here
            instructions3 : {
                folder: "instructions3",
                file: "Folie",
                format: ".JPG",
                length: 1
            },
            expInformation: {
                folder: "expInformation",
                file: "Folie",
                format: ".JPG",
                length: 1
            }
        }
    }

    // Set CSS root variables for background and font color
    // Here we dynamically set CSS variables to ensure the experiment's appearance (eg background color) matches the specified colors
    var root = document.documentElement;
    root.style.setProperty('--backgroundColor', expInfo.backgroundColor);
    root.style.setProperty('--fontColor', expInfo.fontColor);

    return expInfo
}