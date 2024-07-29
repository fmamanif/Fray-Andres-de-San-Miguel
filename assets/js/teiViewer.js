
    let c = new CETEI();
    let behaviors = {
        "tei": {
            "ptr": function (e) {
                // Crea un elemento <a> para hacer el ptr clickable
                let a = document.createElement("a");
                a.href = "#";
                a.textContent = e.getAttribute("n");
                // Agrega una clase al elemento <a>
                a.className = "notaTEI"; // Asigna la clase "nota-link"

                // Encuentra la nota referenciada
                let targetId = e.getAttribute("target").substring(1); // elimina el "#" inicial
                let noteElement = document.querySelector("#" + targetId);
                let note = noteElement.textContent;

                // Procesa el contenido de 'type', reemplazando '-' por ' '
                let noteType = noteElement.getAttribute("type") ? noteElement.getAttribute("type").replace(/-/g, ' ') : "";

                // Agrega un evento de clic al enlace para abrir un modal
                a.onclick = function () {
                    // Crea el modal y muestra la nota
                    let modal = document.createElement("div");
                    modal.setAttribute("class", "modal");

                    let modalContent = document.createElement("div");
                    modalContent.setAttribute("class", "modal-content");

                    let closeSpan = document.createElement("span");
                    closeSpan.setAttribute("class", "close");
                    closeSpan.innerHTML = "&times;";
                    closeSpan.onclick = function () {
                        modal.style.display = "none";
                        document.body.removeChild(modal);
                        document.body.style.overflow = ''; // Re-habilita el desplazamiento del cuerpo de la página cuando el modal se cierra
                    };

                    modal.onclick = function (event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                            document.body.removeChild(modal);
                            document.body.style.overflow = ''; // Re-habilita el desplazamiento del cuerpo de la página cuando el modal se cierra
                        }
                    };

                    modalContent.appendChild(closeSpan);

                    // Deshabilita (hidden) el desplazamiento del cuerpo de la página cuando el modal está activo
                    document.body.style.overflow = 'shown';

                    // Crea un elemento específico para 'type' si existe
                    if (noteType) {
                        let normalizedNoteType = noteType.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita los acentos
                            .replace(/-/g, ' ').toLowerCase() // Convierte guiones a espacios y a minúsculas
                            .replace(/\s+/g, '-'); // Reemplaza espacios con guiones para el atributo data-type

                        let noteTypeElement = document.createElement("span");
                        noteTypeElement.className = "note-type";
                        noteTypeElement.textContent = noteType;
                        noteTypeElement.setAttribute('data-type', normalizedNoteType);
                        modalContent.appendChild(noteTypeElement);
                    }

                    let noteContent = document.createElement("p");
                    noteContent.textContent = note;
                    modalContent.appendChild(noteContent);

                    modal.appendChild(modalContent);
                    document.body.appendChild(modal);

                    modal.style.display = "block";

                    // Evita que el enlace navegue a su href
                    return false;
                };

                return a;
            }
        }
    };


    c.addBehaviors(behaviors);

    document.addEventListener("DOMContentLoaded", function() {
    // Ocultar o eliminar el contenedor de notas
    let notesContainer = document.querySelector('.notes');
    if (notesContainer) {
        notesContainer.style.display = 'none';
    }

    // Asegúrate de que por defecto se muestre la versión modernizada
    document.body.classList.add("modernized");

    // Gestionar los botones para alternar entre versiones
    document.getElementById("showDiplomatic").addEventListener("click", function () {
        document.body.classList.remove("modernized");
        document.body.classList.add("diplomatic");
    });

    document.getElementById("showModernized").addEventListener("click", function () {
        document.body.classList.remove("diplomatic");
        document.body.classList.add("modernized");
    });
    
});