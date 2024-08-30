document.addEventListener("DOMContentLoaded", function () {
    fetch("../includes/menu.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-placeholder").innerHTML = data;

            // Inicializar eventos después de que el menú se haya cargado
            document.getElementById("menu-bar").onclick = toggleNav;

            document.getElementById("submenu-toggle").onclick = function(e) {
                e.preventDefault(); // Evita que el enlace recargue la página
                const submenu = document.getElementById("submenu");
                if (submenu.style.display === "block") {
                    submenu.style.display = "none";
                } else {
                    submenu.style.display = "block";
                }
            };

            // Cerrar el sidebar si se hace clic fuera de él
            document.addEventListener('click', function(event) {
                const sidebar = document.getElementById("mySidebar");
                const menuBar = document.getElementById("menu-bar");
                const submenu = document.getElementById("submenu");
                const submenuToggle = document.getElementById("submenu-toggle");

                // Verifica si el clic fue fuera del sidebar, fuera del submenú y no es el botón del menú
                if (!sidebar.contains(event.target) && 
                    !menuBar.contains(event.target) && 
                    !submenu.contains(event.target) &&
                    event.target !== submenuToggle &&
                    sidebar.style.transform === "translateX(0px)") {
                    closeSidebar();
                }
            });
        });
});

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


