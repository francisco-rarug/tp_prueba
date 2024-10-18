import Usuario from "./usuario.js";

const nombreElemento = document.getElementById("nombre");
const apellidoElemento = document.getElementById("apellido");

const loginBtn = document.getElementById("login");
if (loginBtn) {
    loginBtn.onclick = login;
} else {
    actualizarTexto();
}


let nombre = "";
let apellido = ""

function obtenerValoresActuales() {
    nombre = nombreElemento.value;
    apellido = apellidoElemento.value;
}
function login() {

    obtenerValoresActuales();
    const usuario = new Usuario(nombre, apellido);

    localStorage.clear();
    let usuarios = [];


    usuarios.push(usuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    window.location.href = "../Secciones/principal.html";
}
function actualizarTexto() {
    const datos = document.getElementById("datos");
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuario = "";
    usuarios.forEach(element => {
        usuario += element.nombre + " " + element.apellido
    });
    datos.innerText = usuario;
}