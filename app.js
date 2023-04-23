const settingsForm = document.getElementById('settings-form');
const currentSetElement = document.getElementById('current-set');
const totalHitsElement = document.getElementById('total-hits');

let workoutInProgress = false;
let totalHits = 0;
let synth = window.speechSynthesis;

const programs = {
  program1: {
    name: 'Program 1',
    hitTypes: ['jab', 'cross', 'hook', 'upper cut'],
    probabilities: [0.4, 0.3, 0.2, 0.1],
  },
  program2: {
    name: 'Program 2',
    hitTypes: ['jab', 'cross', 'hook', 'upper cut'],
    probabilities: [0.3, 0.4, 0.2, 0.1],
  },
  program3: {
    name: 'Kickbox',
    hitTypes: ['jab', 'cross', 'hook', 'upper cut', 'elbow', 'kick'],
    probabilities: [0.25, 0.2, 0.2, 0.15,0.1,0.1],
  },
};

settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!workoutInProgress) {
    workoutInProgress = true;
    const maxHits = document.getElementById('max-hits').value;
    const rounds = document.getElementById('rounds').value;
    const roundTime = document.getElementById('round-time').value;
    const restTime = document.getElementById('rest-time').value;
    const timeBetween = document.getElementById('between-time').value;
    const programSelect = document.getElementById('program-select');
    const programKey = programSelect.value;
    const program = programs[programKey];
    startWorkout(maxHits, rounds, roundTime, restTime, timeBetween, program);
  }
});

async function startWorkout(maxHits, rounds, roundTime, restTime, timeBetween, program) {
  const hitTypes = program.hitTypes;
  const probabilities = program.probabilities;
  
  for (let round = 1; round <= rounds; round++) {
    currentSetElement.textContent = `Round ${round} of ${rounds}`;
    const roundTimerElement = document.createElement('div');
    roundTimerElement.classList.add('timer');
    currentSetElement.after(roundTimerElement);

    let remainingTime = roundTime;
    const timerId = setInterval(() => {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      roundTimerElement.textContent = `Time remaining: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      remainingTime--;
      if (remainingTime < 0) {
        clearInterval(timerId);
        roundTimerElement.remove();
      }
    }, 1000);

    const sets = Math.floor(roundTime / timeBetween);
    for (let i = 1; i <= sets; i++) {
      const setHits = generateSet(hitTypes, maxHits, probabilities);
      speak(setHits.join(' '));
      console.log(setHits);
      totalHits += setHits.length;
      await wait(timeBetween * 1000);

      totalHitsElement.textContent = `Total hits: ${totalHits}`;
    }

    if (round < rounds) {
      speak(`Rest for ${restTime} seconds`);
      await wait(restTime * 1000);
    }
  }

  workoutInProgress = false;
  speak('Workout complete');
}





function generateSet(hitTypes, maxHits, probabilities = []) {
  const hits = [];
  const setLength = Math.floor(Math.random() * maxHits) + 1;
  for (let i = 0; i < setLength; i++) {
    let typeIndex;
    if (probabilities.length > 0) {
      // Use probabilities array to determine the type
      const rand = Math.random();
      let probSum = 0;
      for (typeIndex = 0; typeIndex < hitTypes.length; typeIndex++) {
        probSum += probabilities[typeIndex];
        if (rand <= probSum) {
          break;
        }
      }
    } else {
      // No probabilities specified, use uniform distribution
      typeIndex = Math.floor(Math.random() * hitTypes.length);
    }
    hits.push(hitTypes[typeIndex]);
  }
  return hits;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

