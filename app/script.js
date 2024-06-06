// script.js

document.addEventListener('DOMContentLoaded', () => {
    // انتخاب عناصر فرم و فهرست‌ها
    const newTaskForm = document.getElementById('new-task-form');
    const newTaskInput = document.getElementById('new-task-input');
    const taskDescInput = document.getElementById('task-desc');
    const taskPriorityInput = document.getElementById('task-priority');
    const tasksList = document.getElementById('tasks-list');
    const completedTasksList = document.getElementById('completed-tasks-list');

    // اضافه کردن تسک جدید با ارسال فرم
    newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // جلوگیری از ارسال فرم پیش‌فرض
        const taskText = newTaskInput.value.trim();
        const taskDesc = taskDescInput.value.trim();
        const taskPriority = taskPriorityInput.value;
        if (taskText !== '') {
            addTask(taskText, taskDesc, taskPriority); // افزودن تسک جدید
            newTaskInput.value = ''; // پاک کردن ورودی
            taskDescInput.value = ''; // پاک کردن توضیحات
            taskPriorityInput.value = 'low'; // بازنشانی اولویت
        }
    });

    // تابع افزودن تسک جدید
    function addTask(taskText, taskDesc, taskPriority) {
        const taskItem = document.createElement('li');
        taskItem.classList.add(`priority-${taskPriority}`); // افزودن کلاس اولویت
        
        const taskContent = document.createElement('div');
        taskContent.innerHTML = `<strong>${taskText}</strong><p>${taskDesc}</p>`; // افزودن متن تسک و توضیحات

        const completeButton = document.createElement('button');
        completeButton.innerHTML = '✔️';
        completeButton.addEventListener('click', () => completeTask(taskItem)); // افزودن رویداد تکمیل تسک

        const editButton = document.createElement('button');
        editButton.innerHTML = '✏️';
        editButton.addEventListener('click', () => editTask(taskItem, taskText, taskDesc, taskPriority)); // افزودن رویداد ویرایش تسک

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️';
        deleteButton.addEventListener('click', () => taskItem.remove()); // افزودن رویداد حذف تسک

        const buttons = document.createElement('div');
        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);
        buttons.appendChild(completeButton);

        taskItem.appendChild(taskContent);
        taskItem.appendChild(buttons);
        tasksList.appendChild(taskItem); // افزودن تسک به فهرست تسک‌ها
    }

    // تابع تکمیل تسک
    function completeTask(taskItem) {
        taskItem.classList.add('completed'); // افزودن کلاس تکمیل شده
        completedTasksList.appendChild(taskItem); // افزودن تسک به فهرست تسک‌های تکمیل شده
        taskItem.querySelectorAll('button').forEach(button => button.remove()); // حذف دکمه‌ها
    }

    // تابع ویرایش تسک
    function editTask(taskItem, taskText, taskDesc, taskPriority) {
        newTaskInput.value = taskText; // تنظیم متن ورودی
        taskDescInput.value = taskDesc; // تنظیم توضیحات ورودی
        taskPriorityInput.value = taskPriority; // تنظیم اولویت ورودی
        taskItem.remove(); // حذف تسک از فهرست
    }
});
