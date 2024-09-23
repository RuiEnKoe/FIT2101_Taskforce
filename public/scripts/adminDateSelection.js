const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const firebaseConfig = {
  apiKey: "AIzaSyC8CHnMDOEQvZJ_hLCRzVLfe56MtGBea5c",
  authDomain: "fit2101-taskforce-app.firebaseapp.com",
  projectId: "fit2101-taskforce-app",
  storageBucket: "fit2101-taskforce-app.appspot.com",
  messagingSenderId: "235153486631",
  appId: "1:235153486631:web:55c7e9dc0730a36040ef02",
  measurementId: "G-LRZX1T9DE1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
console.log(firebaseApp);
const db = firebaseApp.firestore();
const auth = firebase.auth();

let selectedStartDate = null;
let selectedEndDate = null;

let curr_month = new Date().getMonth();
let curr_year = new Date().getFullYear();

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getFebDays(year) {
  return isLeapYear(year) ? 29 : 28;
}

function generateCalendar(calendar, month, year, isStartCalendar) {
  const calendar_days = calendar.querySelector('.calendar-days');
  calendar_days.innerHTML = '';

  const calendar_header_year = calendar.querySelector('#year');
  const month_picker = calendar.querySelector('#month-picker');

  const days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  month_picker.innerHTML = month_names[month];
  calendar_header_year.innerHTML = year;

  const first_day = new Date(year, month, 1);

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    const day = document.createElement('div');
    if (i >= first_day.getDay()) {
      const date = i - first_day.getDay() + 1;
      day.classList.add('calendar-day-hover', 'has-date');
      day.innerHTML = date;

      const selectedDate = isStartCalendar ? selectedStartDate : selectedEndDate;
      if (selectedDate && selectedDate.day === date && selectedDate.month === month && selectedDate.year === year) {
        day.classList.add('selected');
      }

      day.addEventListener('click', function() {
        const dayNumber = parseInt(day.innerHTML, 10);
        const prevSelected = isStartCalendar ? selectedStartDate : selectedEndDate;
        if (prevSelected) {
          prevSelected.element.classList.remove('selected');
        }
        day.classList.add('selected');
        if (isStartCalendar) {
          selectedStartDate = { day: dayNumber, month, year, element: day };
      } else {
          selectedEndDate = { day: dayNumber, month, year, element: day };
      }
      });
    }
    calendar_days.appendChild(day);
  }
}

function goBack() {
  window.location.href = "user.html";
}

function generateMonthList() {
  const monthList = document.getElementById('monthList');
  monthList.innerHTML = '';
  month_names.forEach((name) => {
    const monthElement = document.createElement('div');
    monthElement.className = 'month-element';  
    monthElement.innerHTML = name;
    monthList.appendChild(monthElement);
  });
}


function openModal() {
  document.getElementById('monthPickerModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('monthPickerModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const startCalendar = document.getElementById('start-calendar');
  const endCalendar = document.getElementById('end-calendar');

  const updateCalendar = (calendar, isStartCalendar) => {
    generateCalendar(calendar, curr_month, curr_year, isStartCalendar);
  };

  updateCalendar(startCalendar, true);
  updateCalendar(endCalendar, false);

  startCalendar.querySelector('#prev-year').addEventListener('click', function() {
    curr_year--;
    updateCalendar(startCalendar, true);
  });

  startCalendar.querySelector('#next-year').addEventListener('click', function() {
    curr_year++;
    updateCalendar(startCalendar, true);
  });

  endCalendar.querySelector('#prev-year').addEventListener('click', function() {
    curr_year--;
    updateCalendar(endCalendar, false);
  });

  endCalendar.querySelector('#next-year').addEventListener('click', function() {
    curr_year++;
    updateCalendar(endCalendar, false);
  });

  generateMonthList();

  document.getElementById('closeBtn').addEventListener('click', closeModal);


  const month_picker_start = startCalendar.querySelector('#month-picker');
  const month_picker_end = endCalendar.querySelector('#month-picker');

  month_picker_start.addEventListener('click', () => {
    openModal();
    document.getElementById('monthList').onclick = (event) => {
      let selectedMonth = event.target.innerHTML;
      let index = month_names.indexOf(selectedMonth);
      curr_month = index;
      updateCalendar(startCalendar, true);
      closeModal();
    };
  });

  month_picker_end.addEventListener('click', () => {
    openModal();
    document.getElementById('monthList').onclick = (event) => {
      let selectedMonth = event.target.innerHTML;
      let index = month_names.indexOf(selectedMonth);
      curr_month = index;
      updateCalendar(endCalendar, false);
      closeModal();
    };
  });
});

function zeroPad(value) {
  return String(value).padStart(2, '0');
}

function saveData(){
  // Check if dates are selected
  if (!selectedStartDate || !selectedEndDate) {
    alert('Please select start and end dates.');
    return;
  }

  // Format the selected dates
  const startDate = new Date(`${selectedStartDate.year}-${zeroPad(selectedStartDate.month + 1)}-${zeroPad(selectedStartDate.day)}T00:00:00`);
  const endDate = new Date(`${selectedEndDate.year}-${zeroPad(selectedEndDate.month + 1)}-${zeroPad(selectedEndDate.day)}T00:00:00`);

  // Check if startDate is before or equal to endDate
  if (startDate > endDate) {
    alert("Start date should be before or the same as the end date.");
    return;
  }

  // Convert the dates to strings
  const startDateStr = startDate.toISOString();
  const endDateStr = endDate.toISOString();

  // Save to localStorage
  localStorage.setItem('startDate', startDateStr);
  localStorage.setItem('endDate', endDateStr);
  window.location.href = "adminOverallCont.html";
}

// Check if user is logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    alert('Please login or register an account. You will be redirected to the login page.');
    window.location.href = "login.html";
  } else {
    console.log('User logged in: ', user);
  }
});