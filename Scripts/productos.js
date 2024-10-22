document.addEventListener("DOMContentLoaded", function () {
    const productosContainer = document.getElementById("productos");

    fetch("/Scripts/productos.json")
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data.productos);
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));

    function mostrarProductos(productos) {
        productos.forEach((producto, index) => {

            const div = document.createElement('div');
            div.className = 'card';

            const divimg = document.createElement('div');
            divimg.className = 'image-box';

            const img = document.createElement('img');
            img.src = producto.imagen;
            divimg.appendChild(img);
            div.appendChild(divimg);

            const divcontent = document.createElement('div');
            divcontent.className = 'content';

            const nombre = document.createElement('h2');
            nombre.className = 'data-producto';
            nombre.textContent = producto.nombre;
            divcontent.appendChild(nombre);

            const descripcion = document.createElement('p');
            descripcion.textContent = producto.descripcion;
            divcontent.appendChild(descripcion);

            const precio = document.createElement('p');
            precio.textContent = producto.precio;
            precio.className = 'data-precio';
            divcontent.appendChild(precio);

            const entrada = document.createElement('input');
            entrada.className = 'cantidad-productos';
            entrada.type = 'number';
            entrada.min = 1;
            entrada.placeholder = 'Cantidad: ';
            divcontent.appendChild(entrada);

            const boton = document.createElement('button');
            boton.className = 'btn-agregar-carrito';
            boton.textContent = 'Añadir al Carrito';
            divcontent.appendChild(boton);
            div.appendChild(divcontent);
            productosContainer.appendChild(div);

            boton.addEventListener('click', () => {
                Swal.fire({
                    icon: 'success',
                    title: "Producto agregado al carrito exitosamente!",
                    showDenyButton: true,
                    confirmButtonText: "Seguir agregando",
                    denyButtonText: `Ir a carrito`,
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

                const productoExistente = productosCarrito.find(prod => prod.nombre === nombreProducto);
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
    }
});
