document.querySelectorAll('.btn-agregar-carrito').forEach((boton, index) => {
    boton.addEventListener('click', () => {
        Swal.fire({
            icon: 'success',
            title: "Producto agregado al carrito exitosamente!",
            showDenyButton: true,
            confirmButtonText: "Seguir agregando",
            denyButtonText: "Ir a carrito",
            preDeny: () => {
                window.location.href = 'carrito.html';
            }
        });

        const nombreProducto = document.querySelectorAll('.data-producto')[index].innerText;
        const precioProducto = document.querySelectorAll('.data-precio')[index].innerText;
        let cantidadProducto = parseInt(document.querySelectorAll('.cantidad-productos')[index].value);
        const precioOriginal = parseFloat(precioProducto.replace('$', ''));
        const imgProducto = document.querySelectorAll('.image-box img')[index].src;

        let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (isNaN(cantidadProducto) || cantidadProducto <= 0) {
            cantidadProducto = 1;
        }

        const productoExistente = productosCarrito.find(producto => producto.nombre === nombreProducto);
        if (productoExistente) {
            productoExistente.cantidad += cantidadProducto;
            productoExistente.precio += (precioOriginal * cantidadProducto);
        } else {
            productosCarrito.push({
                nombre: nombreProducto,
                precio: (precioOriginal * cantidadProducto),
                img: imgProducto,
                cantidad: cantidadProducto,
                precioOriginal: precioOriginal
            });
        }

        localStorage.setItem('carrito', JSON.stringify(productosCarrito));
    });
});

function cargarCarrito() {
    let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listaProductos = document.getElementById('productos-lista');
    listaProductos.innerHTML = '';

    let total = 0;

    if (productosCarrito.length === 0) {
        listaProductos.innerHTML = '<li>El carrito está vacío</li>';
    } else {
        productosCarrito.forEach((producto, index) => {
            const li = document.createElement('li');
            total += producto.precio;

            li.innerHTML = `
                <img src="${producto.img}" alt="${producto.nombre}" width="50" height="50"> 
                <strong>${producto.nombre}</strong> - $${producto.precio.toFixed(3)} (x${producto.cantidad})
                <button class="bin-button" data-index="${index}">
                    <!-- SVG del botón de eliminar -->
                    <svg class="bin-top" viewBox="0 0 39 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line y1="5" x2="39" y2="5" stroke="white" stroke-width="4"></line>
                        <line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="white" stroke-width="3"></line>
                    </svg>
                    <svg class="bin-bottom" viewBox="0 0 33 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="path-1-inside-1_8_19" fill="white">
                            <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                        </mask>
                        <path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)"></path>
                        <path d="M12 6L12 29" stroke="white" stroke-width="4"></path>
                        <path d="M21 6V29" stroke="white" stroke-width="4"></path>
                    </svg>
                </button>
            `;

            listaProductos.appendChild(li);
        });

        const lineaHorizontal = document.createElement('hr');
        const totalElement = document.createElement('p');
        totalElement.innerHTML = `<strong>Total: $${total.toFixed(3)}</strong>`;

        listaProductos.appendChild(lineaHorizontal);
        listaProductos.appendChild(totalElement);
    }

    agregarEventosEliminar();
}

function agregarEventosEliminar() {
    document.querySelectorAll('.bin-button').forEach((boton) => {
        boton.addEventListener('click', (e) => {
            const index = e.target.closest('.bin-button').dataset.index;
            eliminarProducto(index);
        });
    });
}

function eliminarProducto(index) {
    let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (productosCarrito[index].cantidad > 1) {
        productosCarrito[index].cantidad -= 1;
        productosCarrito[index].precio -= productosCarrito[index].precioOriginal;
    } else {
        productosCarrito.splice(index, 1);
    }

    localStorage.setItem('carrito', JSON.stringify(productosCarrito));
    cargarCarrito();
}

cargarCarrito();

function cargarProductosFinalizar() {
    let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listaProductosFinalizar = document.getElementById('lista-productos-finalizar');
    listaProductosFinalizar.innerHTML = '';

    let total = 0;

    productosCarrito.forEach(producto => {
        const li = document.createElement('li');
        total += producto.precio;
        li.innerHTML = `<strong>${producto.nombre}</strong> - $${producto.precio.toFixed(3)} (x${producto.cantidad})`;
        listaProductosFinalizar.appendChild(li);
    });

    const lineaHorizontal = document.createElement('hr');
    const totalElement = document.createElement('p');
    totalElement.innerHTML = `<strong>Total: $${total.toFixed(3)}</strong>`;

    listaProductosFinalizar.appendChild(lineaHorizontal);
    listaProductosFinalizar.appendChild(totalElement);
}

function generarPDFTicket() {
    let productosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Ticket de Compra', 10, 10);

    doc.setFontSize(12);
    let posicionY = 20;

    productosCarrito.forEach(producto => {
        doc.text(`Producto: ${producto.nombre}`, 10, posicionY);
        doc.text(`Cantidad: ${producto.cantidad}`, 10, posicionY + 5);
        doc.text(`Precio: $${producto.precioOriginal.toFixed(3)}`, 10, posicionY + 10);
        posicionY += 20;
    });

    const total = productosCarrito.reduce((acc, producto) => acc + producto.precio, 0);
    doc.text('-------------------------', 10, posicionY);
    doc.text(`Total: $${total.toFixed(3)}`, 10, posicionY + 10);

    doc.save('ticket_compra.pdf');
}

const finalizarBtn = document.getElementById("finalizar");
finalizarBtn.addEventListener("click", () => {
    cargarProductosFinalizar();

    const modalFinalizar = document.getElementById("modal-finalizar");
    const modalContent = modalFinalizar.querySelector('.modal-content');

    modalFinalizar.style.display = "block";
    document.body.classList.add("no-scroll");

    setTimeout(() => {
        modalContent.classList.add("show");
    }, 10);
});

const descargarBtn = document.getElementById("descargar-ticket");
descargarBtn.addEventListener("click", () => {
    generarPDFTicket();
});

const closeModal = document.getElementById("close-finalizar");
closeModal.addEventListener("click", () => {
    const modalFinalizar = document.getElementById("modal-finalizar");
    const modalContent = modalFinalizar.querySelector('.modal-content');

    modalContent.classList.remove("show");
    setTimeout(() => {
        modalFinalizar.style.display = "none";
        document.body.classList.remove("no-scroll");
    }, 300);
});

window.addEventListener("click", (event) => {
    const modalFinalizar = document.getElementById("modal-finalizar");
    if (event.target === modalFinalizar) {
        const modalContent = modalFinalizar.querySelector('.modal-content');
        modalContent.classList.remove("show");
        setTimeout(() => {
            modalFinalizar.style.display = "none";
            document.body.classList.remove("no-scroll");
        }, 300);
    }
});
