//Variables
const trafficCanvas = document.getElementById('traffic-chart');
const alertContainer = document.getElementById('alert');
const trafficNavLinks = document.querySelectorAll('.traffic-nav-link');
const dailyCanvas = document.getElementById('daily-chart');
const mobileCanvas = document.getElementById('mobile-chart');
const user = document.getElementById("userField");
const message = document.getElementById("messageField");
const send = document.getElementById("send");
const notificationDot = document.querySelector('.notification-dot');
const bellIcon = document.querySelector('.bell-icon');
const dropdown = document.querySelector('.notification-dropdown');
const closeButtons = document.querySelectorAll('.close-notification');

const trafficDataSets = {
    Hourly: [750, 1250, 1000, 2000, 1500, 1750, 1250, 1850, 2250, 1500, 2500],
    Daily: [500, 1000, 750, 1500, 1000, 1250, 900, 1400, 1600, 1200, 1800],
    Weekly: [300, 600, 500, 800, 700, 900, 650, 950, 1100, 850, 1300],
    Monthly: [200, 400, 350, 600, 500, 700, 450, 750, 900, 650, 1000]
};

const members = ["Victoria Chambers", "Dylan Bird", "Dawn Wood", "Dan Oliver"];
const userInput = document.getElementById("userField");
const suggestions = document.getElementById("suggestions");


//Time Delay for Notification Dot 
setTimeout(() => {
  notificationDot.classList.add('show');
}, 1500);

bellIcon.addEventListener('click', () => {
  const hasNotifications = dropdown.querySelectorAll('.notification').length > 0;
  if (hasNotifications) {
    dropdown.classList.toggle('show');
  }
});


//allows user to close individiual notifications
closeButtons.forEach(button => {
  button.addEventListener('click', e => {
    e.target.parentElement.remove();

    saveRemainingNotifications();

    //green Dot is removed if no notifications remain
    const remaining = document.querySelectorAll('.notification-dropdown .notification');
    if (remaining.length === 0) {
      document.querySelector('.notification-dot').classList.remove('show');
      dropdown.classList.remove('show');
    }
  });
});


//Time Delay for Alert Banner
setTimeout(() => {
    alertContainer.innerHTML = `
        <div class="alert-banner" style="opacity: 0; transform: translateY(-100%);">
            <p><strong>Alert:</strong> You have <strong>3</strong> overdue tasks to complete</p>
            <p class="alert-banner-close">x</p>
        </div>
    `;

    const banner = document.querySelector('.alert-banner');

    requestAnimationFrame(() => {
        setTimeout(() => {
            banner.style.opacity = '';
            banner.style.transform = '';
            banner.classList.add('show');
        }, 20);
    });

    banner.addEventListener('click', e => {
        if (e.target.classList.contains("alert-banner-close")) {
            banner.style.display = "none";
        }
    });
}, 1500);

//Line Chart Data
let trafficData = {
    labels: ["16-22", "23-29", "30-5", "6-12", "13-19", "20-26", "27-3",
    "4-10", "11-17", "18-24", "25-31"],
    datasets: [{
        data: [750, 1250, 1000, 2000, 1500, 1750, 1250, 1850, 2250, 1500,
        2500],
        backgroundColor: 'rgba(116, 119, 191, .3)',
        borderWidth: 1,
    }]
};

let trafficOptions = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'rgba(112, 104, 201, .5)',
    fill: true,
    aspectRatio: 2.5,
    animation: {
        duration: 500,
        easing: 'easeOutQuad'
    },
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};

let trafficChart = new Chart(trafficCanvas, {
    type: 'line',
    data: trafficData,
    options: trafficOptions
    });


//Code for changing the line chart when different time length is clicked
trafficNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        const dataset = trafficDataSets[link.textContent];

        if (dataset) {
            trafficChart.data.datasets[0].data = dataset;
            trafficChart.update();
        }
    });
});

//Bar Chart Data
const dailyData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [{
    label: '# of Hits',
    data: [75, 115, 175, 125, 225, 200, 100],
    backgroundColor: '#7477BF',
    borderWidth: 1
    }]
};

const dailyOptions = {
    scales: {
        y: {
            beginAtZero: true
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};

const dailyChart = new Chart(dailyCanvas, {
    type: 'bar',
    data: dailyData,
    options: dailyOptions
});

//Doughnut Chart Data
const mobileData = {
    labels: ["Desktop", "Tablet", "Phones"],
    datasets: [{
        label: '# of Users',
        data: [2000, 550, 500],
        borderWidth: 0,
        backgroundColor: [
            '#7477BF',
            '#78CF82',
            '#51B6C8'
        ]
    }]
};

const mobileOptions = {
    aspectRatio: 1.9,
    plugins: {
        legend: {
            position: 'right',
            labels: {
                boxWidth: 20,
                fontStyle: 'bold'
            }
        }
    }
};

let mobileChart = new Chart(mobileCanvas, {
    type: 'doughnut',
    data: mobileData,
    options: mobileOptions
});

//Send Button for Messages 
send.addEventListener('click', (e) => {
  e.preventDefault(); //Stops page from reloading

  // ensure user and message fields are filled out
  if (user.value === "" && message.value === "") {
    alert("Please fill out user and message fields before sending");
  } else if (user.value === "") {
    alert("Please fill out user field before sending");
  } else if (message.value === "") {
    alert("Please fill out message field before sending");
  } else {
    alert(`Message successfully sent to: ${user.value}`);
      user.value = "";
      message.value = "";
  }
});

//Autofill for members in message to field
userInput.addEventListener("input", () => {
  const input = userInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (input === "") return;

  const matches = members.filter(name => name.toLowerCase().includes(input));

  matches.forEach(match => {
    const li = document.createElement("li");
    li.textContent = match;
    li.classList.add("suggestion-item");

    li.addEventListener("click", () => {
      userInput.value = match;
      suggestions.innerHTML = "";
    });

    suggestions.appendChild(li);
  });
});

//Code to remember notifications not closed yet, saves that to local storage
function saveRemainingNotifications() {
  const notifications = Array.from(document.querySelectorAll('.notification-dropdown .notification'))
    .map(notif => notif.innerHTML);
  localStorage.setItem('savedNotifications', JSON.stringify(notifications));
}

function loadSavedNotifications() {
  const saved = JSON.parse(localStorage.getItem('savedNotifications'));
  if (saved && saved.length > 0) {
    const container = document.querySelector('.notification-dropdown');
    container.innerHTML = '';
    saved.forEach(html => {
      const div = document.createElement('div');
      div.classList.add('notification');
      div.innerHTML = html;
      container.appendChild(div);
    });

    document.querySelectorAll('.close-notification').forEach(button => {
      button.addEventListener('click', e => {
        e.target.parentElement.remove();
        saveRemainingNotifications();
        const remaining = document.querySelectorAll('.notification-dropdown .notification');
        if (remaining.length === 0) {
          notificationDot.classList.remove('show');
          dropdown.classList.remove('show');
        }
      });
    });

    notificationDot.classList.add('show');
  }
}

loadSavedNotifications();

//Saves the users preferences from toggle switches to localStorage
function saveToggleStates() {
  const emailToggle = document.getElementById('emailToggle').checked;
  const profileToggle = document.getElementById('profileToggle').checked;
  const timezone = document.getElementById('timezone').value;

  const toggleStates = {
    email: emailToggle,
    profile: profileToggle,
    timezone: timezone
  };

  localStorage.setItem('toggleStates', JSON.stringify(toggleStates));
}


//Load toggle states from localStorage
function loadToggleStates() {
  const saved = JSON.parse(localStorage.getItem('toggleStates'));
  if (!saved) return;

  document.getElementById('emailToggle').checked = saved.email;
  document.getElementById('profileToggle').checked = saved.profile;
  document.getElementById('timezone').value = saved.timezone;
}

document.getElementById('save').addEventListener('click', () => {
  saveToggleStates();
});

//resets all toggles to default 
document.getElementById('cancel').addEventListener('click', () => {
  document.getElementById('emailToggle').checked = false;
  document.getElementById('profileToggle').checked = false;
  document.getElementById('timezone').selectedIndex = 0; 
  localStorage.removeItem('toggleStates');
});


loadToggleStates();


