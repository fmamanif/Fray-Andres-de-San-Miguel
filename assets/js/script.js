// Sidebar
function toggleNav() {
    const sidebar = document.getElementById("mySidebar");

    // Verifica si el sidebar está abierto o cerrado basado en la propiedad transform
    if (sidebar.style.transform === "translateX(0px)") {
        closeSidebar(); // Llama a una función para cerrar el sidebar
    } else {
        openSidebar(); // Llama a una función para abrir el sidebar
    }
}

function openSidebar() {
    const sidebar = document.getElementById("mySidebar");
    const menuBar = document.getElementById("menu-bar");
    sidebar.style.transform = "translateX(0px)"; // Mueve el sidebar hacia dentro
    menuBar.innerHTML = "&times;"; // Cambia el ícono del menú a X
    menuBar.style.fontSize = "40px"; // Ajusta el tamaño del ícono si es necesario
    menuBar.style.color = "#f1f1f1"; // Cambia el color de la X a blanco
    menuBar.style.backgroundColor = "#5a79b9"; // Cambia el fondo del botón al color deseado
}

function closeSidebar() {
    const sidebar = document.getElementById("mySidebar");
    const menuBar = document.getElementById("menu-bar");
    sidebar.style.transform = "translateX(100%)"; // Oculta el sidebar moviéndolo hacia la derecha
    menuBar.innerHTML = "&#9776;"; // Cambia el ícono del menú a hamburguesa
    menuBar.style.fontSize = "30px"; // Ajusta el tamaño del ícono si es necesario
    menuBar.style.color = "#5a79b9"; // Cambia el color del menú hamburguesa a 5a79b9
    menuBar.style.backgroundColor = "transparent"; // Restablece el fondo a transparente
}


// Inicializar el evento click para alternar el estado del sidebar
document.getElementById("menu-bar").onclick = toggleNav;

// Cerrar el sidebar si se hace clic fuera de él
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById("mySidebar");
    const menuBar = document.getElementById("menu-bar");

    // Verifica si el clic fue fuera del sidebar y no es el botón del menú
    if (!sidebar.contains(event.target) && !menuBar.contains(event.target) && sidebar.style.transform === "translateX(0px)") {
        closeSidebar();
    }
});

