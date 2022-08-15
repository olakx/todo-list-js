const search = document.querySelector(".search");
const container = document.querySelector(".container")
const add = document.querySelector(".add");
const ul = document.querySelector(".tasks ul");
const empty = document.querySelector(".empty");
const button = document.querySelector(".delete__btn");
const removeAll = document.querySelector(".remove__all");
const title1 = document.querySelector(".title1");
const title2 = document.querySelector(".title2");
const completed__tasks = document.querySelector(".completed__tasks");
const tasksDiv = document.querySelector(".tasks");
const remove__all = document.querySelector(".remove__all");


let tasks = [];//Almacen de tareas



let notifications = (texto, color) => {
    Toastify({ // Notificacion de eliminado de todas las tareas
        text: `${texto}`,
        style: {
            background: `${color}`
        },  
        duration : 2000
        }).showToast();
}


const showTasks = (task, completed, button) =>{ //Funcion que muestra o no muesta elementos segun el caso
    tasksDiv.style.display = `${task}`;
    completed__tasks.style.display = `${completed}`;
    remove__all.style.display = `${button}`;
}

title1.onclick = () => { // Muesta tareas pendientes
    showTasks("block","none","flex")
}

title2.onclick = () => { //Muesta las tareas ya completadas
    showTasks("none", "block", "none")
}


const loadTasks = async () => { //Fetch que llama al json local para pintar las tareas ya completadas
    try{
        const call = await fetch('script/completedTasks.json');
        const data = await call.json();

        const completed__tasksUl = document.querySelector(".completed__tasks ul")
        for (const tasks of data){ //Recorre cada objeto del json 
            const li = document.createElement("li")
            const tareas = tasks.task //Busca la propiedad task dentro de los objetos
            li.innerHTML = `<p>${tareas}`
            completed__tasksUl.appendChild(li)
        }
    }catch{
        document.write("ERROR")
    }
}
loadTasks()


let removeAllTasks = () => { //Boton que remueve todas las tareas en caso de haberlas 
    removeAll.onclick = () =>{
    if (tasks.length > 0){ 
        tasks = []
        clearHTML();
        localStorage.clear();
        empty.style.display = "block" //Vuelve el mensaje de no hay tareas pendientes
        notifications("Tareas eliminadas correctamente", "linear-gradient(to right, #622b73, #c6226e)")
        } else return notifications("No hay tareas para elminar ", "linear-gradient(to right, #200122, #6f0000)" )
    }
}



const restoreTasks = () => {
    document.addEventListener("DOMContentLoaded", () =>{ // Cuando la pagina se cargue por completo se ejecuta 
        tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Trae los datos del local storage y los reemplaza en el array de tareas
        createElements(); //Se crean los elementos
        completed__tasks.style.display = "none";
    });
    ul.onclick = (e) => { // Al apretar en el boton de eliminar tarea se ejecuta este codigo
        if (e.target.tagName === "BUTTON") { // Si hay una etiqueta Button dentro del ul se ejecuta el codigo
            const deleteId = parseInt(e.target.getAttribute("task-id")); //Trae el id del boton
            tasks = tasks.filter(task => task.id !== deleteId); //Filtra los elementos dejando afuera el id el cual se le hace click, formando un nuevo array
            createElements();
            notifications("Tarea eliminada correctamente", "linear-gradient(to right, #642b73, #c6426e)");
        }
    }
    removeAllTasks();
}
restoreTasks();


add.onclick = (e) => {
    e.preventDefault(); //Hace que no se recargue la pagina al apretar el boton para agregar nueva tarea
    createTask();
    showTasks("block","none","flex");
}




const createTask = () => {
    const input = search.value // Valor del input
    if (input === ""){ // Si no hay tarea se ejecuta un error
        showError("Ingrese una tarea");
        return;
    }
    const taskObj = { //Se crea el objeto que sera enviado al localStorage
        input,
        id: Date.now()
    }
    tasks = [...tasks, taskObj] //Se remplaza el array con los elementos dentro + el objeto nuevo
    createElements();
    search.value = ""; //Una vez se agrege una nueva tarea se limpia el input 
    notifications("Tarea agregada correctamente", "linear-gradient(to right, #4ecdc4, #556270)")
}



const createElements = () => { // Se crean los elementos
    clearHTML();// Limpia los elementos

    if (tasks.length > 0) { //Si hay un valor en el array se ejecuta el codigo
        empty.style.display = "none" //Se esconde el texto de "No tienes tareas pendientes"
        tasks.forEach(input => {
            const li = document.createElement('li');
            li.innerHTML = `<p>${input.input}</p> <button class="delete__btn" task-id="${input.id}">X</button>`; // Se crean las etiquetas con los valores con las propiedades del objeto 
            ul.prepend(li);
        });
    }
    addLocalStorage(); // Se agrega a local storage el array
}

const clearHTML = () => {
    ul.innerHTML = '';
}

const addLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

const showError = (error) => { //Funcion que crea un mensaje de error si el usuario no ingresa una tarea
    const msg = document.createElement("a");
    msg.textContent = error;
    msg.classList = "error"
    container.append(msg);

    setTimeout(() => { //Tiempo hasta que desaparesca el error 
        msg.remove();
    },1000);
}

