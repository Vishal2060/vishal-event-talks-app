const fs = require('fs');

const talksData = [
    {
        title: "Introduction to Node.js",
        speakers: ["Alice Smith"],
        category: ["Backend", "JavaScript"],
        duration: 60,
        description: "A comprehensive introduction to Node.js for beginners.",
    },
    {
        title: "Modern CSS Techniques",
        speakers: ["Bob Johnson"],
        category: ["Frontend", "CSS"],
        duration: 60,
        description: "Explore the latest and most effective techniques in CSS styling.",
    },
    {
        title: "JavaScript Best Practices",
        speakers: ["Charlie Brown", "Diana Prince"],
        category: ["Frontend", "JavaScript", "Best Practices"],
        duration: 60,
        description: "Learn about writing clean, maintainable, and efficient JavaScript code.",
    },
    {
        title: "Database Design for Scalability",
        speakers: ["Eve Adams"],
        category: ["Backend", "Database"],
        duration: 60,
        description: "Strategies for designing databases that can handle large amounts of data and traffic.",
    },
    {
        title: "API Design Principles",
        speakers: ["Frank White"],
        category: ["Backend", "API"],
        duration: 60,
        description: "Understanding the core principles of designing robust and user-friendly APIs.",
    },
    {
        title: "Frontend Frameworks Comparison",
        speakers: ["Grace Hopper"],
        category: ["Frontend", "Frameworks"],
        duration: 60,
        description: "A comparison of popular frontend frameworks like React, Angular, and Vue.",
    },
];

let currentTime = new Date();
currentTime.setHours(10, 0, 0, 0); // Set start time to 10:00 AM
currentTime.setDate(22); // Set a dummy date for consistent output if not run on Feb 22
currentTime.setFullYear(2026); // Set a dummy year for consistent output if not run on Feb 22

const schedule = [];
const talkDuration = 60; // minutes
const transitionDuration = 10; // minutes
const lunchDuration = 60; // minutes

talksData.forEach((talk, index) => {
    // Add talk to schedule
    const talkStartTime = new Date(currentTime);
    const talkEndTime = new Date(currentTime.getTime() + talkDuration * 60 * 1000);
    schedule.push({
        ...talk,
        id: `talk-${index}`, // Add a unique ID for easier DOM manipulation
        startTime: talkStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: talkEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    currentTime = new Date(talkEndTime);

    // Add transition after talk, unless it's the last talk
    if (index < talksData.length - 1) {
        // If it's after the 3rd talk, add lunch break
        if (index === 2) {
            const lunchStartTime = new Date(currentTime.getTime() + transitionDuration * 60 * 1000);
            const lunchEndTime = new Date(lunchStartTime.getTime() + lunchDuration * 60 * 1000);
            schedule.push({
                id: `lunch-${index}`, // Add a unique ID
                title: "Lunch Break",
                speakers: [],
                category: ["Break"],
                duration: lunchDuration,
                description: "Enjoy your lunch!",
                startTime: lunchStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: lunchEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
            currentTime = new Date(lunchEndTime);
        } else {
            currentTime = new Date(currentTime.getTime() + transitionDuration * 60 * 1000);
        }
    }
});


const clientJsScript = `
        const scheduleData = ${JSON.stringify(schedule)};

        function renderSchedule(data) {
            const scheduleDiv = document.getElementById('schedule');
            scheduleDiv.innerHTML = ''; // Clear existing content

            data.forEach(item => {
                const talkCard = document.createElement('div');
                talkCard.classList.add('talk-card');
                if (item.category.includes('Break')) {
                    talkCard.classList.add('break');
                }
                // Add category data attribute for easier filtering
                talkCard.dataset.category = item.category.join(' ').toLowerCase();


                const categoriesHtml = item.category.map(cat => '<span class="category">' + cat + '</span>').join('');
                const speakersHtml = item.speakers.length > 0 ? '<div class="speakers">Speaker(s): ' + item.speakers.join(', ') + '</div>' : '';

                talkCard.innerHTML = \`
                    <div class="time">\${item.startTime} - \${item.endTime}</div>
                    <h2>\${item.title}</h2>
                    \${speakersHtml}
                    <div>\${categoriesHtml}</div>
                    <div class="description">\${item.description}</div>
                \`;
                scheduleDiv.appendChild(talkCard);
            });
        }

        function filterSchedule() {
            const searchTerm = document.getElementById('categorySearch').value.toLowerCase();
            const talkCards = document.querySelectorAll('.talk-card');

            talkCards.forEach(card => {
                const categories = card.dataset.category; // Get categories from data attribute
                if (categories && categories.includes(searchTerm)) {
                    card.classList.remove('hidden');
                } else if (card.classList.contains('break')) {
                    card.classList.remove('hidden'); // Always show breaks
                }
                else {
                    card.classList.add('hidden');
                }
            });
        }

        // Initial render
        renderSchedule(scheduleData);

        // Add event listener for search
        document.getElementById('categorySearch').addEventListener('keyup', filterSchedule);
    `;

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Talks Event</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #0056b3;
            text-align: center;
            margin-bottom: 30px;
        }
        .search-container {
            margin-bottom: 20px;
            text-align: center;
        }
        .search-container input {
            width: 80%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        .talk-card {
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 6px;
            margin-bottom: 15px;
            padding: 15px;
            display: flex;
            flex-direction: column;
        }
        .talk-card.break {
            background-color: #e0f7fa;
            border-color: #b2ebf2;
            text-align: center;
            font-style: italic;
        }
        .talk-card h2 {
            color: #0056b3;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .talk-card .time {
            font-weight: bold;
            color: #555;
            margin-bottom: 10px;
        }
        .talk-card .speakers {
            font-style: italic;
            color: #777;
            margin-bottom: 5px;
        }
        .talk-card .category {
            background-color: #007bff;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            margin-right: 5px;
            display: inline-block;
            margin-bottom: 10px;
        }
        .talk-card .description {
            line-height: 1.5;
        }
        .talk-card.hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Technical Talks Schedule</h1>
        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., JavaScript, Backend)">
        </div>
        <div id="schedule">
            <!-- Talks will be rendered here by JavaScript -->
        </div>
    </div>

    <script>
${clientJsScript}
    </script>
</body>
</html>
