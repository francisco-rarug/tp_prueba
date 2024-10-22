document.addEventListener("DOMContentLoaded", () => {
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'))

    document.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.card')
            const nombre = card.querySelector('.data-producto').textContent
            const descripcion = card.querySelector('p').textContent
            const precio = card.querySelector('.data-precio').textContent.replace('$', '').replace('.', '')
            const id = event.target.getAttribute('data-id')

            document.getElementById('nombreProducto').value = nombre
            document.getElementById('descripcionProducto').value = descripcion
            document.getElementById('precioProducto').value = precio
            document.getElementById('productoId').value = id

            modalEditar.show()
        })
    })

    document.getElementById('guardarCambios').addEventListener('click', () => {
        const id = document.getElementById('productoId').value
        const nombre = document.getElementById('nombreProducto').value
        const descripcion = document.getElementById('descripcionProducto').value
        const precio = document.getElementById('precioProducto').value

        const card = document.querySelector(`.btn-editar[data-id="${id}"]`).closest('.card')
        card.querySelector('.data-producto').textContent = nombre
        card.querySelector('p').textContent = descripcion
        card.querySelector('.data-precio').textContent = `$${precio.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`

        modalEditar.hide()
    })
})



const deleteButtons = document.querySelectorAll('.btn-eliminar')
deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás deshacer esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })
    })
})
