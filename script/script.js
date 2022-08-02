const search = document.querySelector(".search");
const container = document.querySelector(".container")
const add = document.querySelector(".add");
const ul = document.querySelector(".tasks ul");
const empty = document.querySelector(".empty");
const button = document.querySelector(".delete__btn");

let tasks = [];//Almacen de tareas



const restoreTasks = () => {
    document.addEventListener("DOMContentLoaded", () =>{ // Cuando la pagina se cargue por completo se ejecuta 
        tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Trae los datos del local storage y los reemplaza en el array de tareas
        createElements(); //Se crean los elementos
        
    });
    
    ul.onclick = (e) => { // Al apretar en el boton de eliminar tarea se ejecuta este codigo
        if (e.target.tagName === "BUTTON") { // Si hay una etiqueta Button dentro del ul se ejecuta el codigo
            const deleteId = parseInt(e.target.getAttribute("task-id")); //Trae el id del boton
            tasks = tasks.filter(task => task.id !== deleteId); //Filtra los elementos dejando afuera el id el cual se le hace click, formando un nuevo array
            createElements(); 
        }
    }
}
restoreTasks();

add.onclick = (e) => {
    e.preventDefault(); //Hace que no se recargue la pagina al apretar el boton para agregar nueva tarea
    createTask();
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
