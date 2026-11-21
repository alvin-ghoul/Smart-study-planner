// 1. Get the form and input elements
const studyForm = document.getElementById("study-form");

const subjectInput = document.getElementById("subject-input");
const taskInput = document.getElementById("task-input");
const priorityInput = document.getElementById("priority-input");
const minutesInput = document.getElementById("minutes-input");

// 2. Get the task list and counters
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const totalMinutes = document.getElementById("total-minutes");

// 3. Load saved tasks from localStorage
const tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

// 4. Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

// 5. Add new study tasks
studyForm.addEventListener("submit", function(e) {

    e.preventDefault();
    console.log("Hello")

    const newTask = {
        id: Date.now(),
        subject: subjectInput.value,
        task: taskInput.value,
        priority: priorityInput.value,
        minutes: Number(minutesInput.value)
    };

    tasks.push(newTask);

    saveTasks();

    studyForm.reset();

    renderTasks();
});

// 6. Delete a finished task
function deleteTask(id) {

    // Remove the selected task
    const updatedTasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    // Update the original tasks array
    tasks.splice(0, tasks.length, ...updatedTasks);

    // Save the updated list
    saveTasks();

    // Refresh the task cards and statistics
    renderTasks();
}

// 7. Display study tasks
function renderTasks() {

    // Clear the task list
    taskList.innerHTML = "";

    // Update the number of remaining tasks
    taskCount.textContent = tasks.length;

    // Calculate total study minutes
    const total = tasks.reduce(function(sum, task) {
        return sum + task.minutes;
    }, 0);

    totalMinutes.textContent = total;

    // Show a message if there are no tasks
    if (tasks.length === 0) {

        taskList.innerHTML = "<p>All caught up! No homework pending.</p>";

    } else {

        // Display every task
        tasks.forEach(function(task) {

            const card = document.createElement("div");

            card.style.background = "#f8fafc";
            card.style.padding = "20px";
            card.style.borderRadius = "12px";
            card.style.border = "1px solid #e2e8f0";
            card.style.marginBottom = "10px";

            // Choose priority color
            let priorityColor;

            if (task.priority === "High") {
                priorityColor = "red";
            }
            else if (task.priority === "Medium") {
                priorityColor = "orange";
            }
            else {
                priorityColor = "green";
            }

            // Create the task card content
            card.innerHTML = `
                <h3>${task.subject}</h3>

                <p>${task.task}</p>

                <p>⏱️ ${task.minutes} minutes</p>

                <p>
                    Priority:
                    <span style="color: ${priorityColor}; font-weight: bold;">
                        ${task.priority}
                    </span>
                </p>

                <button class="delete-btn">
                    Done / Delete
                </button>
            `;

            // Connect the button to deleteTask()
            const deleteButton = card.querySelector(".delete-btn");

            deleteButton.addEventListener("click", function() {
                deleteTask(task.id);
            });

            // Add the card to the page
            taskList.appendChild(card);

        });
    }
}

// 8. Load saved tasks when the page opens
renderTasks();

