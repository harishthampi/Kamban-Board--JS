const textAreaRef = document.querySelector('.left-section .textarea');
const addRef = document.querySelector('.action-wrapper .add');
const deleteEnableRef = document.querySelector('.action-wrapper .delete')
const modalRef = document.querySelector('.modal');
const taskWrapperRef = document.querySelector('.task-wrapper');
const categoryRefs = document.querySelectorAll('.right-section .category');
const deleteIconRefs = document.querySelectorAll('.task-wrapper .task .task-delete-icon');
const categoryFilterRef = document.querySelector('header .category-wrapper');

const task = JSON.parse(localStorage.getItem('task')||[]);

addRef.addEventListener('click',(event) =>{
    toggleFunction();
})

function toggleFunction() { // Function to Toggle Display Hide and UnHide the input TaskBox
    if(modalRef.classList.contains('hide')){
        modalRef.classList.remove('hide')
    }else{
        modalRef.classList.add('hide')
    }
}
categoryRefs.forEach((categoryRef) =>{
    categoryRef.addEventListener('click',(event) =>{
        removeAllSelection();
        categoryRef.classList.add('selected');
    })
})

function removeAllSelection (){
    categoryRefs.forEach((categoryRef) =>{
        categoryRef.classList.remove('selected');
    })
}
//function to add the new Task into the taskList also on to LocalStorage
function addTaskToData(newTask){
    task.push(newTask);
    localStorage.setItem('task',JSON.stringify(task));
}
// the function fetch the data from taskList and render on the screen at the time of load
function renderTask(){
    task.forEach((taskItem) =>{
        createTask(taskItem)
    })
}
renderTask();

textAreaRef.addEventListener('keydown',(event) =>{
    if(event.key == "Enter"){
        const selectedCategory = document.querySelector('.right-section .category.selected')
        const selectedCategoryName = selectedCategory.getAttribute('data-category');
        const newTask = {
            id:Math.random(),
            category:selectedCategoryName,
            title:event.target.value
        }

        addTaskToData(newTask);
        event.target.value="";
        createTask(newTask);
        removeAllSelection();
        toggleFunction();
    } 
})

function createTask(newTask){
    //Logic to create newTask Modal whenever Enter key is pressed
    const taskRef =  document.createElement('div');
    taskRef.className = 'task';
    taskRef.dataset.id = `${newTask.id}`;
    taskRef.innerHTML = 
        `
        <div class="category"  data-category = ${newTask.category}></div>
        <div class="id">${newTask.id}</div>
        <div class="title"><textarea class="textarea">${newTask.title} </textarea></div>
        <div class="task-delete-icon"><i class="fa-solid fa-trash"></i></div>
        `;
        taskWrapperRef.appendChild(taskRef);
        /* create a reference to the delete button
         but in this logic we create an eventListener to every task which is not optimal solution
        const taskDeleteRef = taskRef.querySelector('.task .task-delete-icon .fa-trash')
        taskDeleteRef.addEventListener('click',(event) =>{
            taskDeleteRef.closest('.task').remove();
        }) */

        //Any edit in task title field 
        const titleRef = taskRef.querySelector('.title textarea');
        titleRef.addEventListener('change',(event) =>{
                const updatedTitle = event.target.value;
                const currentId = taskRef.dataset.id;
                updateData(updatedTitle,currentId);
        })
}

function updateData(updatedTitle,currentId){
    const index = task.findIndex((item) => Number(item.id) === Number(currentId));
    task[index].title = updatedTitle;
    localStorage.setItem('task',JSON.stringify(task))
}


/* Delete Functionality
instead of attaching an eventListener on every Delete Icon.Used taskWrapperRef (event Bubbling)*/
taskWrapperRef.addEventListener('click',(event) =>{
    if(event.target.classList.contains('fa-trash')){
        event.target.closest('.task').remove();
        deleteFromTasks(event.target.closest('.task').dataset.id);
    }
    if(event.target.classList.contains('category')){
        currentPriority = event.target.dataset.category;
        const changedPriority = updatePriority(currentPriority);
        event.target.dataset.category = changedPriority;

    }
})

function updatePriority(currentPriority){
    const priorityList = ['p1','p2','p3','p4']
    const priorityIdx = priorityList.findIndex((item) => item === currentPriority);
    const nextPriority = (priorityIdx+1)%4
    return priorityList[nextPriority];
}

//Function to delete the respective Task from the taskList and LocalStorage
function deleteFromTasks(deletedTaskId){
const selectedTaskIdx = task.findIndex((taskItem) => Number(taskItem.id) === Number(deletedTaskId));
task.splice(selectedTaskIdx,1);
localStorage.setItem('task',JSON.stringify(task))
}


categoryFilterRef.addEventListener('click',(event) =>{
    const selectedCategory = event.target.dataset.category;
    const taskListRefs = document.querySelectorAll('.task-wrapper .task');
    taskListRefs.forEach((taskItem) =>{
        taskItem.classList.remove('hide');
        const currentPriority = taskItem.querySelector('.category').dataset.category
        if(selectedCategory !== currentPriority){
            taskItem.classList.add('hide');
            console.log(taskItem)
        }
    }) 
})

//delete function enabling toggle feature - if deleteEnabled we can delete and edit the title 
deleteEnableRef.addEventListener('click',(event) =>{
    if(!event.target.classList.contains('delete-enabled')){
        event.target.classList.add('delete-enabled');
        /*to reduce the code Option 2 - created a dataset to differentiate if delete is enabled or not
        if enabled in CSS just get the reference of delete icon and change the display property  and update the pointer-event:all to edit the title*/
        taskWrapperRef.dataset.deleteEnabled = true;
        // toggleDelete(true);
        console.log(textAreaRef.value)
    }
    else{
        event.target.classList.remove('delete-enabled');
        taskWrapperRef.dataset.deleteEnabled = false;
        // toggleDelete(false);

    }
})
/*Option - 1
get the reference of all the deleteIcon and if delete feature is enabled display property of deleteIcon is block else none
function toggleDelete(visibility){
    const deleteIconRefs = document.querySelectorAll('.task-delete-icon')
    
    deleteIconRefs.forEach((deleteIconRef) =>{
        console.log(deleteIconRef)
        deleteIconRef.style.display = visibility? "block" : "none";
    })
}
*/

//SearchBar Option

const searchRef =  document.querySelector('.search-box input');
searchRef.addEventListener('keyup',(event) =>{
    const searchItem = event.target.value.toLowerCase();
    taskWrapperRef.innerHTML="";
    task.forEach((item) =>{
        const currentItem = item.title.toLowerCase();
        const taskId = String(item.id)
        if(currentItem.trim() ===""||currentItem.includes(searchItem)||taskId.includes(searchItem)){
            createTask(item)
        }
    })
})


