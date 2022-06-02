const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e) {
    if (confirm("Tümünü silmek istediğinize emin misiniz ?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}


function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            listItem.setAttribute("style","display : none !important");
        }else{
            listItem.setAttribute("style","display : block");
        }
    });
}


function deleteTodo(e) {
    
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Silindi...","")
    }

}


function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStroage();
    
    todos.forEach(function(todo,index){
        if (todo === deletetodo) {
            todos.splice(index,1);
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}


function loadAllTodosUI() {
    let todos = getTodosFromStroage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
}


function addTodo(e){
    const newTodo = todoInput.value.trim();
    let todos = getTodosFromStroage();
    let isFound = false;

    todos.forEach(function(todo){
        if (newTodo===todo) {
            isFound=true;
        }
    });

    if(isFound){
        showAlert("danger","Çoktan ekledin!"," Gridiğiniz todo zaten mevcut...");
    }else if(newTodo== ""){
        showAlert("danger","Alan boş!"," Lütfen bir todo girin...");
    }else{
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","Tebrikler!"," Todo başarıyla eklenmiştir...");
    }

    e.preventDefault();
}

function getTodosFromStroage() {
    let todos;

    if(localStorage.getItem("todos")===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }   
    return todos;
}

function addTodoToStorage(newTodo){
    let todos =getTodosFromStroage();

    todos.push(newTodo);

    localStorage.setItem("todos",JSON.stringify(todos));

}

function showAlert(type,firstMessage,message){

    const alert =document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.role = "alert";
    alert.innerHTML = `<strong>${firstMessage}</strong>${message}`

    firstCardBody.appendChild(alert);
    setTimeout(function(){
        alert.remove();

    },1000);

}


function addTodoToUI(newTodo){

    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";
    
    listItem.className = "list-group-item d-flex justify-content-between";

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    todoList.appendChild(listItem);

    todoInput.value = "";

}