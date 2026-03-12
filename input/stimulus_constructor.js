/**
 * Constructs a jsPsych trial object based on the specified trial part type and stimulus information.
 *
 * This function creates trial objects for different parts of an immediate recall trial (e.g., trial start,
 * fixation cross, word presentation, and recall prompt). It extracts stimulus parameters from the trial list,
 * constructs the visual HTML elements for the stimuli, and assembles
 * a jsPsych-compatible trial object with all necessary parameters and data logging.
 *
 * @param {Object} expInfo - The experiment information object containing stimulus sets, timings, and configuration.
 * @param {string} trialPart - The type of trial part to construct (e.g., "fixationcross", "target", "feedback").
 * @param {Array} list - The trial list containing factor levels for the current trial (or null for non-stimulus trials).
 * @param {number} trialNr - The trial number within the current block.
 * @param {number} blockNr - The block number.
 * @param {boolean} training - Whether this is part of a training block. Defaults to false.
 * @returns {Object} A jsPsych trial object configured for the specified trial part.
 */
function stimulusConstructor(expInfo, trialPart, list, elementNr, trialNr, blockNr, training=false) {
  // --- Extract stimulus parameters from the trial list ---
  // If a trial list is provided, extract the relation condition and determine the corresponding word list.
  if (list) {  
    // Word relation (0 = related, 1 = unrelated)
    relation = list[trialNr][0];
    // Previous conditions
    previousConditions = [
      list.slice(0, trialNr).filter((trial) => trial[0] == 0).length, // Number of related trials so far
      list.slice(0, trialNr).filter((trial) => trial[0] == 1).length // Number of unrelated trials so far
    ];
    // Current wordList
    if (training) {
      wordList = expInfo.trainingWords;
    } else {
      wordList = (relation === 0)
        ? expInfo.sameRelationWords[previousConditions[0]]  // Get next wordList from same relation set based on how many related trials have been shown so far
        : (expInfo.differentRelationWords)[previousConditions[1]]; //Get next wordList from different relation set based on how many unrelated trials have been shown so far
    }
    // Current word
    if (trialPart == "word") {
      console.log(wordList);
      
      wrappedElementNr = (elementNr-2) % wordList.length;
      currentWord = wordList[wrappedElementNr]; // The current word displayed to the participant
      // Create visual position indicator with dots
      let positionIndicator = "<div style=\"margin-top:15px; text-align:center;\">";
      for (let i = 0; i < wordList.length; i++) {
        const dotColor = (i === wrappedElementNr) ? "#000" : "#ccc";
        const dotSize = (i === wrappedElementNr) ? "12px" : "8px";
        positionIndicator += "<span style=\"display:inline-block; width:" + dotSize + "; height:" + dotSize + "; border-radius:50%; background-color:" + dotColor + "; margin:0 3px; vertical-align:middle;\"></span>";
      }
      positionIndicator += "</div>";
      // Format word Display with appropriate styling and visual position indicator
      wordDisplay = "<div style=\"font-size:" + expInfo.stimulusSize + "px;\">" + 
                    currentWord +
                    positionIndicator +
                    "</div>";
    } else if (trialPart == "recall") {
      recallDisplay = "<div style=\"font-size:" + expInfo.stimulusSize + "px; width:50px\">" + expInfo.recallInstruction +  "</div>";
    }
  }

  // --- Construct the appropriate trial object based on trial part type ---
  // Different trial parts have different configurations.

  if (trialPart == "trialStart") {
    // Display a self-paced trial start screen
    trialObject = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<div style=\"font-size:" + expInfo.stimulusSize + "px;\">" + "Continue when ready" +  "</div>",
      choices: ["Start Trial"]
    };

  } else if (trialPart == "fixationCross") {
    // Display a fixation cross (+) for a fixed duration with no response collection.
    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<div style=\"font-size:" + expInfo.fixationCrossSize + "px;\">" + "+" +  "</div>",
      choices: "NO_KEYS",
      trial_duration: expInfo.fixationcrossDuration
    };

  } else if (trialPart == "word") {
    // Display a word that the participant should read out loudly and remember for later recall. No response collection during this phase.
    trialObject = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: wordDisplay,
      choices: "NO_KEYS",
      trial_duration: expInfo.wordDuration,
      post_trial_gap: expInfo.blankDuration
    };

  } else if (trialPart == "recall") {
    // Display the recall instruction and start audio recording to capture the participant's verbal recall of the words. The trial ends when the recording duration is reached or when the participant clicks the "Done" button.
    trialObject = {
      type: jsPsychHtmlAudioResponse,
      stimulus: recallDisplay,
      recording_duration: expInfo.recordingDuration,
      show_done_button: true
    }

  } 

  // --- Attach trial data for logging and analysis ---
  // Initialize the data object for this trial.
  trialObject.data = {};
  // Record the trial number within the block.
  trialObject.data.trial = trialNr;
  // Record the block number.
  trialObject.data.block = blockNr;
  // Record the trial part type for later analysis.
  trialObject.data.trialPart = trialPart
  // If stimulus information is available, log relation and presented words.
  if(list) {
    trialObject.data.relation = (relation == 0)? "same":"mixed";
    trialObject.data.wordList = wordList;
      if (trialPart == "word") {
         trialObject.data.currentWord = currentWord;
      }
    }
  // --- Apply skim mode adjustments ---
  // If in skim mode (testing), set all trial durations to 0 for rapid execution.
  if (skimMode) {
    if (trialObject.data != "recall") {
      trialObject.trial_duration = 0;
    }
  }

  return trialObject;
}
