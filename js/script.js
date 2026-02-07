const todayMoodDiv = document.getElementById('todayMood');
const calendarDiv = document.getElementById('calendar');
const moodChartCtx = document.getElementById('moodChart');
const datePicker = document.getElementById('datePicker');
const journalInput = document.getElementById('journalInput');

let moods = [];

const moodColors = {
  '😊 Happy': '#4CAF50',
  '😐 Neutral': '#FFC107',
  '😔 Sad': '#2196F3',
  '😡 Angry': '#F44336',
  '😴 Tired': '#9E9E9E',
  'Not set': '#fff0f5'
};

const todayDateStr = new Date().toISOString().split('T')[0];
datePicker.value = todayDateStr;


function loadMoods() {
  const saved = localStorage.getItem("moods");
  moods = saved ? JSON.parse(saved) : [];

  updateSelectedDate();
  generateCalendar();
  drawChart();
}



function saveToStorage() {
  localStorage.setItem("moods", JSON.stringify(moods));
}



function updateSelectedDate() {
  const selectedMood = moods.find(
    m => m.date === datePicker.value
  );

  todayMoodDiv.textContent =
    `Selected date mood: ${selectedMood ? selectedMood.mood : 'Not set'}`;

  journalInput.value =
    selectedMood?.journal || "";
}



window.setMood = function(mood) {

  const selectedDate = datePicker.value;

  let entry = moods.find(m => m.date === selectedDate);

  if (!entry) {
    entry = { date: selectedDate, mood, journal: "" };
    moods.push(entry);
  } else {
    entry.mood = mood;
  }

  saveToStorage();
  loadMoods();
}



window.saveJournal = function() {
  const selectedDate = datePicker.value;
  const journalText = journalInput.value;

  let entry = moods.find(m => m.date === selectedDate);

  if (!entry) {
    entry = { date: selectedDate, mood: "Not set", journal: journalText };
    moods.push(entry);
  } else {
    entry.journal = journalText;
  }

  saveToStorage();
  alert("Journal saved!");
  loadMoods();
}



function generateCalendar() {
  calendarDiv.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {

    const dateStr =
      new Date(year, month, day)
        .toISOString()
        .split('T')[0];

    const moodEntry =
      moods.find(m => m.date === dateStr);

    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.textContent = day;

    dayDiv.style.backgroundColor =
      moodEntry
        ? moodColors[moodEntry.mood]
        : "#fff0f5";

    if (moodEntry?.journal) {
      const dot = document.createElement("div");
      dot.className = "journal-dot";
      dayDiv.appendChild(dot);
    }

    dayDiv.onclick = () => {
      datePicker.value = dateStr;
      updateSelectedDate();
    };

    calendarDiv.appendChild(dayDiv);
  }
}



function drawChart() {

  const sorted =
    [...moods].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

  const labels =
    sorted.map(m => m.date);

  const data =
    sorted.map(m => {
      switch (m.mood) {
        case '😊 Happy': return 5;
        case '😐 Neutral': return 4;
        case '😴 Tired': return 3;
        case '😔 Sad': return 2;
        case '😡 Angry': return 1;
        default: return 0;
      }
    });

  if (window.moodChart)
    window.moodChart.destroy();

  window.moodChart =
    new Chart(moodChartCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Mood Over Time',
          data,
          fill: true,
          backgroundColor: 'rgba(255,64,129,0.2)',
          borderColor: '#ff4081',
          tension: 0.3,
          pointRadius: 6
        }]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
}

/* ===== INIT ===== */

loadMoods();
datePicker.addEventListener("change", updateSelectedDate);
