//console.log("😍😍Suscribete a mi canal😍😍")

const formulario = document.getElementById("formulario")
const listaTarea = document.getElementById("lista-tareas")
const input = document.getElementById("input")
// Acceder siempre al contenido del template
const template = document.getElementById("template").content
const fragment = document.createDocumentFragment()
/*
let tareas = {
    1: {
        id: 1,
        texto: "Bañar",
        estado: false
    },
    2: {
        id: 2,
        texto: "Caminar",
        estado: false
    },
    3: {
        id: 3,
        texto: "Dormir",
        estado: false
    }
}
*/
let tareas = {}

document.addEventListener("DOMContentLoaded", () => {

    // Validando que hayan objetos en el localStorage y si hay, parsearlo y obtenerlo
    if(localStorage.getItem("tareas")){
        tareas = JSON.parse(localStorage.getItem("tareas"))
    }
    pintarTareas()
})

formulario.addEventListener("submit", e => {
    // Cada vez que se quiera evitar el comportamiento por defecto en HTML
    // Se utiliza el e.preventDefault()
    e.preventDefault()

    // Tres alternativas de capturar la información que el usuario escriba en el input
    /*
    console.log(e.target[0].value)
    console.log(e.target.querySelector("input").value)
    console.log(input.value)
    */

    setTarea(e)
})

listaTarea.addEventListener("click", e => {
    btnAccion(e)
})

const setTarea = e => {
    // trim -> función de JavaScript que permite limpiar si el usuario deja vacio
    if(input.value.trim() === ""){
        console.log("Está vacio")
        return // Se sale de la función y no continua con la ejecución de la misma
    }

    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    }

    // En nuestro objeto tareas en el id será igual al de tarea:id y ese objeto contendrá todo lo que tiene tarea
    tareas[tarea.id] = tarea
    //console.log(tareas)

    // Para limpiar o reiniciar el formulario
    formulario.reset()
    // Para que al momento de añadir una tarea, vuelva a seleccionarse el input como espacio para escribir una nueva
    input.focus()

    pintarTareas()
}

const pintarTareas = () => {

    // Almacenando en localStorage las tareas que se tienen
    localStorage.setItem("tareas", JSON.stringify(tareas))


    // Si la lista de tareas está vacia
    if(Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
        <div class="alert alert-danger text-center">
            👍👍 No hay tareas pendientes 👍👍
        </div>
        `      
    return 
    }

    // Limpiando para que no se repitan los objetos al añadir nuevos
    listaTarea.innerHTML = ""

    Object.values(tareas).forEach(tarea => {
        // Primero hacer el clone - REGLA
        const clone = template.cloneNode(true)
        clone.querySelector("p").textContent = tarea.texto

        // Cambiando el fondo, icono y tachar la tarea - Estilos
        if(tarea.estado){
            clone.querySelector(".alert").classList.replace("alert-warning", "alert-primary")
            clone.querySelectorAll(".fas")[0].classList.replace("fa-check-circle", "fa-undo-alt")
            clone.querySelector("p").style.textDecoration = "line-through"
        }

        // Añadiendole un ID a los botones
        clone.querySelectorAll(".fas")[0].dataset.id = tarea.id
        clone.querySelectorAll(".fas")[1].dataset.id = tarea.id
        fragment.appendChild(clone)
    })
    
    listaTarea.appendChild(fragment)
}

const btnAccion = e => {

    // Cambiando el estado de la tarea de false a true
    if(e.target.classList.contains("fa-check-circle")){
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
        //console.log(tareas)
    }

    // Cambiando el estado de la tarea de true a false
    if(e.target.classList.contains("fa-undo-alt")){
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
        //console.log(tareas)
    }

    // Eliminando la tarea al oprimir el botón
    if(e.target.classList.contains("fa-minus-circle")){
        delete tareas[e.target.dataset.id]
        pintarTareas()
        //console.log(tareas)
    }
    // Decirle que solo active los eventos dentro del contenedor
    e.stopPropagation()
}