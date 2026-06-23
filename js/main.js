document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  document.querySelector('.start-button').addEventListener('click', startContest);
  document.querySelector('.regenerate-button').addEventListener('click', regenerateContest);
  document.querySelector('.end-button').addEventListener('click', endContest);
});

let timerInterval;
let totalTime = 60; // Default timer duration in minutes

function startContest() {
  console.log('Starting the contest...');
    const selectedTag =
        document.getElementById('tag-select').value;
    const selectedPattern = document.getElementById('pattern-select').value;
    allWell = false;
    if(selectedTag !== 'None') {
        loadQuestions(selectedTag, 'topic')
            .then(() => {
                document.querySelector('.timer').classList.remove('hidden');
                startTimer();
            })
            .catch(error => {
                console.error('Failed to load questions:', error);
            })
        allWell = true;
    }
    else if(selectedPattern!=='None') {
        loadQuestions(selectedPattern, 'pattern')
            .then(() => {
                document.querySelector('.timer').classList.remove('hidden');
                startTimer();
            })
            .catch(error => {
                console.error('Failed to load questions:', error);
            });
        allWell = true;
    }
    else {
        alert('Either Topic or Pattern need to be selected');
    }
  
  // Hide the start button and duration input
    if(allWell) {
        document.querySelector('.start-button').style.display = 'none';
        document.querySelector('.input-container').style.display = 'none';

        // Show the regenerate and end buttons
        document.querySelector('.regenerate-button').style.display = 'inline-block';
        document.querySelector('.end-button').style.display = 'inline-block';
    }
  // Show the timer and start it
  // document.querySelector('.timer').classList.remove('hidden');
  // startTimer();
}

function regenerateContest() {
  console.log('Regenerating contest...');
    const selectedTag =
        document.getElementById('tag-select').value;
    const selectedPattern = document.getElementById('pattern-select').value;
    allWell = false;
    if(selectedTag !== 'None') {
        loadQuestions(selectedTag, 'topic')
            .then(() => {
                document.querySelector('.timer').classList.remove('hidden');
                startTimer();
            })
            .catch(error => {
                console.error('Failed to load questions:', error);
            })
        allWell = true;
    }
    else if(selectedPattern!=='None') {
        loadQuestions(selectedPattern, 'pattern')
            .then(() => {
                document.querySelector('.timer').classList.remove('hidden');
                startTimer();
            })
            .catch(error => {
                console.error('Failed to load questions:', error);
            });
        allWell = true;
    }
    else {
        alert('Either Topic or Pattern need to be selected');
    }
}

function endContest() {
  console.log('Ending the contest...');
  
  // Show the start button and duration input
  document.querySelector('.start-button').style.display = 'inline-block';
  document.querySelector('.input-container').style.display = 'block';
  
  // Hide the regenerate and end buttons
  document.querySelector('.regenerate-button').style.display = 'none';
  document.querySelector('.end-button').style.display = 'none';
  
  // Hide the timer and stop it
  document.querySelector('.timer').classList.add('hidden');
  stopTimer();
  
  // Clear the questions
  document.querySelector('.question-list').innerHTML = '';
}

function loadQuestions(tag,type) {
    return fetch(`https://leetcode-contest-generator-backend.onrender.com/api/tag/${encodeURIComponent(tag)}?type=${encodeURIComponent(type)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {

            const data =
                result.data.problemsetQuestionList.questions;
            console.log(data)
            const easyQuestions = data.filter(
                q => q.difficulty.toLowerCase() === 'easy'
            );

            const mediumQuestions = data.filter(
                q => q.difficulty.toLowerCase() === 'medium'
            );

            const hardQuestions = data.filter(
                q => q.difficulty.toLowerCase() === 'hard'
            );

             const selectedDifficulties = {
                easy: document.getElementById("easyCheckbox").checked,
                medium: document.getElementById("mediumCheckbox").checked,
                hard: document.getElementById("hardCheckbox").checked
            };
            console.log(selectedDifficulties.easy+ " "+selectedDifficulties.medium);
            let easyCount = 0;
            let mediumCount = 0;
            let hardCount = 0;

            if (selectedDifficulties.easy &&
                selectedDifficulties.medium &&
                selectedDifficulties.hard) {
                easyCount = 1;
                mediumCount = 2;
                hardCount = 1;
            }
            else if (selectedDifficulties.easy &&
                selectedDifficulties.medium) {
                easyCount = 1;
                mediumCount = 3;
            }
            else if (selectedDifficulties.medium &&
                selectedDifficulties.hard) {
                mediumCount = 3;
                hardCount = 1;
            }
            else if (selectedDifficulties.easy &&
                selectedDifficulties.hard) {
                easyCount = 2;
                hardCount = 2;
            }
            else if (selectedDifficulties.easy) {
                easyCount = 4;
            }
            else if (selectedDifficulties.medium) {
                mediumCount = 4;
            }
            else if (selectedDifficulties.hard) {
                hardCount = 4;
            }

            const questionList = [
                ...getRandomQuestions(easyQuestions, easyCount),
                ...getRandomQuestions(mediumQuestions, mediumCount),
                ...getRandomQuestions(hardQuestions, hardCount)
            ];

            const formattedQuestions =
                questionList.map(q => ({
                    title: q.title,
                    url: `https://leetcode.com/problems/${q.titleSlug}/`,
                  difficulty: q.difficulty
                }));

            displayQuestions(formattedQuestions);
        })
        .catch(error => {
            console.error(
                'Error loading questions:',
                error
            );
        });
}

// function loadQuestions() {
//   console.log('Loading questions...');
//   fetch('data/questions.json')
//       .then(response => {
//           console.log('Fetch response:', response);
//           return response.json();
//       })
//       .then(data => {
//           console.log('Questions data:', data);
//           const easyQuestions = data.filter(q => q.difficulty === 'EASY');
//           const mediumQuestions = data.filter(q => q.difficulty === 'MEDIUM');
//           const hardQuestions = data.filter(q => q.difficulty === 'HARD');
//
//           console.log('Easy questions:', easyQuestions);
//           console.log('Medium questions:', mediumQuestions);
//           console.log('Hard questions:', hardQuestions);
//
//           const easyQuestion = getRandomQuestions(easyQuestions, 1);
//           const mediumQuestionsSelected = getRandomQuestions(mediumQuestions, 2);
//           const hardQuestion = getRandomQuestions(hardQuestions, 1);
//
//           const questionList = [...easyQuestion, ...mediumQuestionsSelected, ...hardQuestion];
//           console.log('Selected questions:', questionList);
//
//           const formattedQuestions = questionList.map(q => ({
//               title: q.title,
//               url: `https://leetcode.com/problems/${q.titleSlug}/` // Correct URL construction
//           }));
//
//           console.log('Formatted questions:', formattedQuestions);
//           displayQuestions(formattedQuestions);
//       })
//       .catch(error => console.error('Error loading questions:', error));
// }

function displayQuestions(questions) {
  console.log('Displaying questions:', questions);
  const questionListDiv = document.querySelector('.question-list');
  questionListDiv.innerHTML = '';
  
  questions.forEach((q, index) => {
      console.log('Creating question item:', q);
      const questionItem = document.createElement('div');
      questionItem.className = 'question-item';
      
      const questionLink = document.createElement('a');
      questionLink.href = q.url;
      questionLink.target = '_blank';
      questionLink.textContent = q.title;
      questionLink.difficulty = q.difficulty;
      
      const markButton = document.createElement('button');
      markButton.className = 'tick-button';
      markButton.textContent = 'Mark as Solved';
      markButton.onclick = () => toggleSolved(index);

      questionLink.className = questionLink.difficulty.toLowerCase();
      
      questionItem.appendChild(questionLink);
      questionItem.appendChild(markButton);
      questionListDiv.appendChild(questionItem);
  });
}

function toggleSolved(index) {
  console.log('Toggling solved state for question index:', index);
  const questions = document.querySelectorAll('.question-item');
  const question = questions[index];
  if (question.classList.contains('solved')) {
      question.classList.remove('solved');
  } else {
      question.classList.add('solved');
  }
}

function getRandomQuestions(questions, count) {
  console.log('Shuffling and selecting questions...');
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function startTimer() {
  const durationInput = document.getElementById('duration');
  totalTime = parseInt(durationInput.value) || 60; // Default to 60 minutes if input is invalid
  let time = totalTime * 60; // Convert minutes to seconds
  updateTimerDisplay(time);

  timerInterval = setInterval(() => {
      if (time <= 0) {
          clearInterval(timerInterval);
          alert('Time is up!');
      } else {
          time--;
          updateTimerDisplay(time);
      }
  }, 1000);
}

function updateTimerDisplay(time) {
  const minutes = String(Math.floor(time / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
  clearInterval(timerInterval);
}
