
/**
 * Checks whether the participant’s response is correct.
 *
 * This function compares the recorded response to the expected
 * correct response and returns a numeric accuracy code that can
 * be stored in the trial data.
 *
 * @param {Object} data - The jsPsych trial data object
 * @param {String} data.response - The participant's response
 * @param {String} data.correctResp - The correct response for the trial
 * @returns {Number} 1 if the response is correct, 0 otherwise
 */
function checkAccuracy(data) {
  // Log trial data for debugging purposes
  console.log(data);

  // If no response was given, mark as incorrect
  if (!data.response) {
    return 0;
  }

  // Compare response and correct answer (case/accent insensitive)
  if (
    data.response.localeCompare(
      data.correctResp,
      undefined,
      { sensitivity: 'accent' }
    ) === 0
  ) {
    return 1;
  }

  // All other cases are treated as incorrect
  return 0;
}

/**
 * Provides background color feedback for incorrect or missing responses.
 *
 * This function looks at the most recent trial’s accuracy value
 * and changes the page background color if the response was
 * incorrect or missing. No semantic (text) feedback is shown.
 *
 * @returns {String} An empty string, as this function is intended
 *                   to be used as a jsPsych stimulus callback
 */
function fdbStimulus() {
  // Retrieve the most recent trial's data
  const data = jsPsych.data.get().last(1).values()[0];

  // If the response was correct, do not change the background
  if (data.accuracy) {
    return "";
  }

  // Change background color for incorrect or missing responses
  document.body.style.background = expInfo.fdbColorIncorrect;
  return "";
}

/**
 * Provides both background color and semantic (text) feedback.
 *
 * This function evaluates the most recent trial and:
 * - Sets the background color based on accuracy
 * - Returns a feedback message ("Correct!", "Too slow!", or "Wrong")
 *
 * @returns {String} Feedback text to be displayed by jsPsych
 */
function posFdbStimulus() {
  // Retrieve the most recent trial's data
  const data = jsPsych.data.get().last(1).values()[0];

  // Correct response: show positive feedback
  if (data.accuracy) {
    document.body.style.background = expInfo.fdbColorCorrect;
    return "Correct!";
  }

  // No response given: show timeout feedback
  if (data.response == null) {
    document.body.style.background = expInfo.fdbColorIncorrect;
    return "Too slow!";
  }

  // Incorrect response: show negative feedback
  document.body.style.background = expInfo.fdbColorIncorrect;
  return "Wrong";
}

/**
 * Resets the background color to the experiment’s default.
 *
 * This function should be called at the start of a new trial
 * to ensure that feedback colors from the previous trial
 * do not carry over.
 */
function normalBackground() {
  document.body.style.background = expInfo.backgroundColor;
}



/**
 * Generates stimulus sets for an immediate recall task by creating full and mixed category word lists.
 *
 * This function takes a set of categories (each containing words) and:
* 1. Selects half of the categories as full categories
* 2. Creates the other half as mixed categories by combining one word from each remaining category
 *
 * The mixed categories ensure no word is reused across trials.
 *
 * @param {Array<Array<String>>} categories - Array of categories, where each category is an array of words
 * @returns {Object} Object containing:
 *   - {Array<Array<String>>} fullCategories - randomly selected full categories
 *   - {Array<Array<String>>} mixedCategories - mixed arrays, each containing one word from each remaining category
* @throws {Error} If the number of category arrays is odd
 */
function generateStimulusSets(categories) {
  /**
   * Helper function: Shuffles an array in-place using Fisher–Yates algorithm.
   * Creates a copy before shuffling to avoid mutating the original array.
   *
   * @param {Array} arr - Array to shuffle
   * @returns {Array} New shuffled array
   */
  function shuffle(arr) {
    const array = arr.slice(); // Create a shallow copy
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // The number of categories must be even so they can be split equally
  if (categories.length % 2 !== 0) {
    throw new Error("The number of category arrays must be even.");
  }

  const halfCategoryCount = categories.length / 2;

  // Shuffle the input categories to randomize selection
  const shuffledCategories = shuffle(categories);

  // Select the first half of the shuffled categories as full stimulus sets
  const selectedFull = shuffledCategories.slice(0, halfCategoryCount);

  // Extract remaining categories for mixed stimulus set creation
  const remaining = shuffledCategories.slice(halfCategoryCount);

  // Shuffle words within each remaining category to ensure random selection
  // We keep a position pointer for each category and recycle words (reshuffled) if needed.
  const categoryPools = remaining.map((cat) => {
    if (cat.length === 0) {
      throw new Error("Each category must contain at least one word.");
    }
    return {
      words: shuffle(cat),
      index: 0
    };
  });

  // Create one mixed array per remaining category by drawing one word from each remaining category
  // This ensures diversity while preventing word reuse across trials
  const mixedArrays = [];

  for (let i = 0; i < halfCategoryCount; i++) {
    const newArray = [];

    // For each mixed array, select one word from each remaining category
    for (let pool of categoryPools) {
      // Recycle category words (reshuffled) if all words were used once
      if (pool.index >= pool.words.length) {
        pool.words = shuffle(pool.words);
        pool.index = 0;
      }
      newArray.push(pool.words[pool.index]);
      pool.index++;
    }

    mixedArrays.push(newArray);
  }

  // Return both stimulus set types for the experiment
  return {
    fullCategories: selectedFull,
    mixedCategories: mixedArrays
  };
}
