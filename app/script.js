document.addEventListener('DOMContentLoaded', () => {
    // انتخاب عناصر فرم و فهرست‌ها
    const showTaskFormButton = document.getElementById('show-task-form');
    const newTaskForm = document.getElementById('new-task-form');
    const newTaskInput = document.getElementById('new-task-input');
    const taskDescInput = document.getElementById('task-desc');
    const showPriorityButtons = document.getElementById('show-priority-buttons');
    const priorityButtonsContainer = document.querySelector('.priority-buttons');
    const selectedPriorityContainer = document.getElementById('selected-priority');
    const taskPriorityButtons = document.querySelectorAll('.priority-button');
    const tasksList = document.getElementById('tasks-list');
    const completedTasksList = document.getElementById('completed-tasks-list');
    let selectedPriority = 'low';

    // بارگذاری تسک‌ها از Local Storage
    loadTasksFromLocalStorage();

    // نمایش فرم تسک جدید
    showTaskFormButton.addEventListener('click', () => {
        newTaskForm.classList.toggle('hidden');
    });

    // نمایش دکمه‌های اولویت
    showPriorityButtons.addEventListener('click', () => {
        priorityButtonsContainer.classList.toggle('hidden');
    });

    // تنظیم اولویت تسک با کلیک روی دکمه‌های اولویت
    taskPriorityButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedPriority = button.dataset.priority;
            taskPriorityButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            // نمایش اولویت انتخاب شده
            selectedPriorityContainer.innerHTML = `<button type="button" class="priority-button" data-priority="${selectedPriority}">${button.innerText} <span>X</span></button>`;
            
            // پنهان کردن دکمه‌های اولویت
            priorityButtonsContainer.classList.add('hidden');

            // اضافه کردن رویداد حذف تگ
            const removeTagButton = selectedPriorityContainer.querySelector('button span');
            removeTagButton.addEventListener('click', () => {
                selectedPriorityContainer.innerHTML = '';
                selectedPriority = 'low';
            });
        });
    });

    // اضافه کردن تسک جدید با ارسال فرم
    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // جلوگیری از ارسال فرم پیش‌فرض
        const taskText = newTaskInput.value.trim();
        const taskDesc = taskDescInput.value.trim();
        if (taskText !== '') {
            addTask(taskText, taskDesc, selectedPriority); // افزودن تسک جدید
            saveTaskToLocalStorage(taskText, taskDesc, selectedPriority); // ذخیره تسک در Local Storage
            newTaskInput.value = ''; // پاک کردن ورودی نام تسک
            taskDescInput.value = ''; // پاک کردن توضیحات تسک
            selectedPriorityContainer.innerHTML = ''; // پاک کردن اولویت انتخاب شده
            selectedPriority = 'low'; // بازنشانی اولویت به "پایین"
        }
    });

    // تابع افزودن تسک جدید
    function addTask(taskText, taskDesc, taskPriority) {
        const taskItem = document.createElement('li');
        taskItem.classList.add(`priority-${taskPriority}`); // افزودن کلاس اولویت
        
        const taskContent = document.createElement('div');
        taskContent.innerHTML = `<strong>${taskText}</strong><p>${taskDesc}</p>`;

        const priorityLabel = document.createElement('div');
        priorityLabel.classList.add('task-priority');
        priorityLabel.innerText = `اولویت: ${taskPriority === 'low' ? 'پایین' : taskPriority === 'medium' ? 'متوسط' : 'بالا'}`;

        const completeButton = document.createElement('button');
        completeButton.innerHTML = '✔️';
        completeButton.addEventListener('click', () => completeTask(taskItem, taskText, taskDesc, taskPriority));

        const editButton = document.createElement('button');
        editButton.innerHTML = '✏️';
        editButton.addEventListener('click', () => editTask(taskItem, taskText, taskDesc, taskPriority));

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️';
        deleteButton.addEventListener('click', () => {
            deleteTaskFromLocalStorage(taskText);
            taskItem.remove();
        });

        const buttons = document.createElement('div');
        buttons.appendChild(priorityLabel);
        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);
        buttons.appendChild(completeButton);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(buttons);
        tasksList.appendChild(taskItem);
    }

    // تابع تکمیل تسک
    function completeTask(taskItem, taskText, taskDesc, taskPriority) {
        taskItem.classList.add('completed');
        completedTasksList.appendChild(taskItem);
        taskItem.querySelectorAll('button').forEach(button => button.remove());
        markTaskAsCompletedInLocalStorage(taskText);
    }

    // تابع ویرایش تسک
    function editTask(taskItem, taskText, taskDesc, taskPriority) {
        newTaskInput.value = taskText;
        taskDescInput.value = taskDesc;
        selectedPriority = taskPriority;
        selectedPriorityContainer.innerHTML = `<button type="button" class="priority-button" data-priority="${selectedPriority}">${taskPriority} <span>X</span></button>`;
        const removeTagButton = selectedPriorityContainer.querySelector('button span');
        removeTagButton.addEventListener('click', () => {
            selectedPriorityContainer.innerHTML = '';
            selectedPriority = 'low';
        });
        taskItem.remove();
        deleteTaskFromLocalStorage(taskText);
    }

    // ذخیره تسک در Local Storage
    function saveTaskToLocalStorage(taskText, taskDesc, taskPriority) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: taskText, desc: taskDesc, priority: taskPriority, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // بارگذاری تسک‌ها از Local Storage
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.completed) {
                addTaskToCompletedList(task.text, task.desc, task.priority);
            } else {
                addTask(task.text, task.desc, task.priority);
            }
        });
    }

    // حذف تسک از Local Storage
    function deleteTaskFromLocalStorage(taskText) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // علامت‌گذاری تسک به عنوان تکمیل شده در Local Storage
    function markTaskAsCompletedInLocalStorage(taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.text === taskText) {
                task.completed = true;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // افزودن تسک تکمیل شده به لیست تکمیل شده‌ها
    function addTaskToCompletedList(taskText, taskDesc, taskPriority) {
        const taskItem = document.createElement('li');
        taskItem.classList.add(`priority-${taskPriority}`, 'completed'); // افزودن کلاس اولویت و تکمیل شده
        
        const taskContent = document.createElement('div');
        taskContent.innerHTML = `<strong>${taskText}</strong><p>${taskDesc}</p>`;

        const priorityLabel = document.createElement('div');
        priorityLabel.classList.add('task-priority');
        priorityLabel.innerText = `اولویت: ${taskPriority === 'low' ? 'پایین' : taskPriority === 'medium' ? 'متوسط' : 'بالا'}`;

        taskItem.appendChild(taskContent);
        taskItem.appendChild(priorityLabel);
        completedTasksList.appendChild(taskItem);
    }
});
