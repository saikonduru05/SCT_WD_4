TO-DO WEBAPPLICATION

OVERVIEW:
Focus is a modern and interactive task management web application that helps users organize their daily tasks efficiently.
The application allows users to create tasks with a due date and time, receive reminders, track progress, and manage productivity in a visually appealing interface.
This project is built using HTML, CSS, and JavaScript and stores task data locally in the browser.

FEATURES:
Create and manage tasks
Set due date and alarm time
Notification reminders for tasks
Custom alarm sounds
Progress tracking based on completed tasks
Mark tasks as completed
Delete tasks easily
Overdue task detection
Modern aurora animated UI design
Local storage support to save tasks even after page refresh

TECHNOLOGIES USED
HTML5 – Structure of the web application
CSS3 – Styling and UI animations
JavaScript (ES6) – Application logic and task management
Web Notifications API – Task reminder notifications
Web Audio API – Alarm sounds
Local Storage – Persistent task data storage
How the Application Works
The user enters a task title, due date, and alarm time.
The task is added to the task list and stored in local storage.
The system continuously checks for tasks whose due time matches the current time.
When the time arrives:
A notification reminder is shown.
An alarm sound is played.
Users can mark tasks as completed or delete them.
A progress bar updates automatically based on completed tasks.

PROJECT STRUCTURE:
Focus Task Manager
│
├── index.html      # Main structure of the application
├── style.css       # UI styling and animations
├── script.js       # Application logic
└── README.md       # Project documentation

FUTURE IMPROVEMENTS:
Cloud storage support
User authentication
Mobile app integration
Task categories and priorities
Dark/Light theme toggle
