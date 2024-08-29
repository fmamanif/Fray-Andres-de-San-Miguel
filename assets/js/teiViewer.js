
    let c = new CETEI();
    let notesDocument = null;  // Variable global para almacenar el documento de notas

    // Cargar el archivo de notas al iniciar teiViewer.js
    document.addEventListener("DOMContentLoaded", function() {
    c.getHTML5('../assets/tei/notas.xml', function(data) {
        notesDocument = data;  // Almacenar el documento de notas
    });
    });

    let behaviors = {
        "tei": {
            "figure": (element) => {
                // Busca un elemento 'graphic' dentro del 'figure'
                let graphic = element.querySelector("graphic");
                if (graphic && graphic.getAttribute("url")) {
                    // Crea un div contenedor
                    let container = document.createElement("div");
                    container.className = "figure-container";

                    // Extraer el valor del atributo @place y asignar clases correspondientes
                    let place = element.getAttribute("place");
                    if (place) {
                        container.classList.add(`place-${place}`);
                    }

                    // Crea un elemento img y configura su src
                    let img = document.createElement("img");
                    img.src = graphic.getAttribute("url").replace("..", "");
                    img.alt = element.querySelector("figDesc")?.textContent || "Imagen TEI";

                    // Añade la imagen al contenedor
                    container.appendChild(img);

                    // Añade descripción si existe
                    let desc = element.querySelector("figDesc");
                    if (desc) {
                    let figDesc = document.createElement("figcaption");
                    figDesc.textContent = desc.textContent;
                    container.appendChild(figDesc);
                    }

                    // Reemplaza el elemento 'figure' original con el contenedor en el DOM
                    element.parentNode.replaceChild(container, element);
                }
            },
        "ptr": function (e) {
            let a = document.createElement("a");
            a.href = "#";
            a.textContent = e.getAttribute("n");
            a.className = "notaTEI"; 

            // Extraer el valor del atributo 'type'
            let ptrType = e.getAttribute("type");
            if (ptrType) {
                // Añadir la clase basada en el valor de 'type'
                a.classList.add(ptrType);
            }

            // Asegurarse de que el documento de notas esté cargado
            if (!notesDocument) {
                console.error('El documento de notas no está disponible.');
                return a;
            }

            let targetId = e.getAttribute("target").substring(1);

            // Buscar la nota correspondiente en notesDocument
            let noteElement = notesDocument.querySelector("#" + targetId);
            if (noteElement) {
                let note = noteElement.textContent;
                let noteType = noteElement.getAttribute("type") ? noteElement.getAttribute("type").replace(/-/g, ' ') : "";

                a.onclick = function () {
                    // Crear y mostrar el modal
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

                    // Deshabilita el desplazamiento del cuerpo de la página cuando el modal está activo
                    document.body.style.overflow = 'shown';

                    if (noteType) {
                        let normalizedNoteType = noteType.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita los acentos
                            .replace(/-/g, ' ').toLowerCase()
                            .replace(/\s+/g, '-');

                        let noteTypeElement = document.createElement("span");
                        noteTypeElement.className = "note-type";
                        noteTypeElement.textContent = noteType;
                        noteTypeElement.setAttribute('data-type', normalizedNoteType);
                        modalContent.appendChild(noteTypeElement);
                    }

                    // Procesar el contenido de la nota, incluyendo el reemplazo de <term> por <span class="term">
                    let noteContent = document.createElement("p");

                    // Copiar el contenido de la nota
                    noteContent.innerHTML = noteElement.innerHTML;

                    // Reemplazar los <term> por <span class="term">
                    noteContent.querySelectorAll('term').forEach(function(termElement) {
                        let span = document.createElement("span");
                        span.className = "term";
                        span.innerHTML = termElement.innerHTML;

                        // Reemplazar el <term> original por el <span> en el DOM
                        termElement.parentNode.replaceChild(span, termElement);
                    });

                    modalContent.appendChild(noteContent);
                    modal.appendChild(modalContent);
                    document.body.appendChild(modal);

                    modal.style.display = "block";

                    return false; // Prevenir la navegación predeterminada del enlace
                };
            }

            return a;
        },
        
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
    document.getElementById("toggleEdition").textContent = "Ver edición diplomática";

    // Gestionar el botón para alternar entre versiones
    document.getElementById("toggleEdition").addEventListener("click", function () {
        if (document.body.classList.contains("modernized")) {
            document.body.classList.remove("modernized");
            document.body.classList.add("diplomatic");
            this.textContent = "Ver edición modernizada"; // Cambia el texto del botón
        } else {
            document.body.classList.remove("diplomatic");
            document.body.classList.add("modernized");
            this.textContent = "Ver edición diplomática"; // Cambia el texto del botón
        }
    });

});