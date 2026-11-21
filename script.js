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
const completedCount = document.getElementById("completed-count");

// 3. Load saved tasks from localStorage
const tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

// 4. Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

// 5. Add new study tasks
studyForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const newTask = {
        id: Date.now(),
        subject: subjectInput.value.trim(),
        task: taskInput.value.trim(),
        priority: priorityInput.value,
        minutes: Number(minutesInput.value),
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    studyForm.reset();

    renderTasks();
});

// 6. Toggle task completion status (mark as done / pending)
function toggleTask(id) {

    // Find the clicked task
    const task = tasks.find(function(t) {
        return t.id === id;
    });

    if (task) {
        // Toggle the completed boolean
        task.completed = !task.completed;

        // Save and re-render the task list
        saveTasks();
        renderTasks();
    }
}

// Alias toggleComplete for convenience
const toggleComplete = toggleTask;

// 7. Delete a task permanently
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

// 8. Display study tasks
function renderTasks() {

    // Clear the task list
    taskList.innerHTML = "";

    // Filter remaining (not completed) tasks
    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    });

    // Filter completed tasks
    const doneTasks = tasks.filter(function(task) {
        return Boolean(task.completed);
    });

    // Update the number of remaining tasks
    taskCount.textContent = remainingTasks.length;

    // Update completed tasks count if element exists
    if (completedCount) {
        completedCount.textContent = doneTasks.length;
    }

    // Calculate total study minutes for remaining tasks
    const total = remainingTasks.reduce(function(sum, task) {
        return sum + task.minutes;
    }, 0);

    totalMinutes.textContent = total;

    // Show a message if there are no tasks at all
    if (tasks.length === 0) {

        taskList.innerHTML = "<p>All caught up! No homework pending.</p>";

    } else {

        // Display every task
        tasks.forEach(function(task) {

            const isDone = Boolean(task.completed);
            const card = document.createElement("div");
            card.className = isDone ? "task-card completed" : "task-card";

            card.style.background = isDone ? "#f1f5f9" : "#f8fafc";
            card.style.padding = "20px";
            card.style.borderRadius = "12px";
            card.style.border = isDone ? "1px solid #cbd5e1" : "1px solid #e2e8f0";
            card.style.marginBottom = "10px";
            card.style.opacity = isDone ? "0.85" : "1";
            card.style.transition = "all 0.2s ease";

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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h3 style="${isDone ? 'text-decoration: line-through; color: #64748b;' : ''}">
                        ${task.subject}
                    </h3>

                    <span style="background: ${isDone ? '#10b981' : '#6366f1'}; color: white; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold;">
                        ${isDone ? "✓ Done" : "Pending"}
                    </span>
                </div>

                <p style="${isDone ? 'text-decoration: line-through; color: #64748b;' : ''}; margin-bottom: 8px;">
                    ${task.task}
                </p>

                <p style="${isDone ? 'color: #64748b;' : ''}; margin-bottom: 4px;">
                    ⏱️ ${task.minutes} minutes
                </p>

                <p style="${isDone ? 'color: #64748b;' : ''}; margin-bottom: 12px;">
                    Priority:
                    <span style="color: ${priorityColor}; font-weight: bold;">
                        ${task.priority}
                    </span>
                </p>

                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="done-btn" style="background: ${isDone ? '#64748b' : '#10b981'}; padding: 10px 16px; font-size: 14px;">
                        ${isDone ? "↩ Mark as Pending" : "✓ Mark as Done"}
                    </button>

                    <button class="delete-btn" style="background: #ef4444; padding: 10px 16px; font-size: 14px;">
                        Delete
                    </button>
                </div>
            `;

            // Connect the buttons to functions
            const doneButton = card.querySelector(".done-btn");
            doneButton.addEventListener("click", function() {
                toggleTask(task.id);
            });

            const deleteButton = card.querySelector(".delete-btn");
            deleteButton.addEventListener("click", function() {
                deleteTask(task.id);
            });

            // Add the card to the page
            taskList.appendChild(card);

        });
    }
}

// 9. Load saved tasks when the page opens
renderTasks();
