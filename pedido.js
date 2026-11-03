const NUMERO_WHATSAPP = "573178231416";

const ventana = document.getElementById("ventana-pedido");
const ventanaCliente = document.getElementById("ventana-cliente");

const formulario = document.getElementById("formulario-pedido");
const formularioCliente = document.getElementById("formulario-cliente");


const listaCarrito = document.getElementById("lista-carrito");
const subtotalCarrito = document.getElementById("subtotal-carrito");

let productoActual = null;
let carrito = [];

function llenarOpciones(select, opciones) {
  select.innerHTML = opciones.map(function (opcion) {
    return `<option value="${opcion}">${opcion}</option>`;
  }).join("");
}

function precioCOP(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

// Abrir ventana del producto
contenedor.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".comprar");
  if (!boton) return;

  productoActual = productos.find(function (p) {
    return p.id === boton.dataset.id;
  });

  if (!productoActual) return;

  document.getElementById("titulo-producto").textContent =
    productoActual.nombre;

  document.getElementById("foto-producto").src =
    productoActual.imagen;

  llenarOpciones(formulario.elements.talla, productoActual.tallas);
  llenarOpciones(formulario.elements.color, productoActual.colores);

  formulario.elements.cantidad.value = 1;

  ventana.showModal();
});

// Agregar producto al carrito
document.getElementById("agregar-carrito").addEventListener("click", function () {
  if (!productoActual) return;

  const talla = formulario.elements.talla.value;
  const color = formulario.elements.color.value;
  const cantidad = Number(formulario.elements.cantidad.value);

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    alert("Ingresa una cantidad válida.");
    return;
  }

  const existente = carrito.find(function (item) {
    return item.id === productoActual.id &&
      item.talla === talla &&
      item.color === color;
  });

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      id: productoActual.id,
      nombre: productoActual.nombre,
      precio: productoActual.precio,
      imagen: productoActual.imagen,
      talla: talla,
      color: color,
      cantidad: cantidad
    });
  }

  actualizarCarrito();
  ventana.close();
  formulario.reset();
});

// Mostrar carrito y subtotal
function actualizarCarrito() {
  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
  } else {
    listaCarrito.innerHTML = carrito.map(function (item, indice) {
      return `
        <div class="producto-carrito">
          <p><strong>${item.nombre}</strong></p>
          <p>Talla: ${item.talla} | Color: ${item.color}</p>
          <p>Cantidad: ${item.cantidad}</p>
          <p>Precio: ${precioCOP(item.precio * item.cantidad)}</p>
          <button type="button" class="quitar-producto" data-indice="${indice}">
            Quitar
          </button>
        </div>
      `;
    }).join("");
  }

  const subtotal = carrito.reduce(function (total, item) {
    return total + item.precio * item.cantidad;
  }, 0);

  subtotalCarrito.textContent = "Subtotal: " + precioCOP(subtotal);
}

// Quitar productos
listaCarrito.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".quitar-producto");
  if (!boton) return;

  carrito.splice(Number(boton.dataset.indice), 1);
  actualizarCarrito();
});

// Cerrar ventanas
document.getElementById("cerrar").addEventListener("click", function () {
  ventana.close();
});

document.getElementById("cerrar-cliente").addEventListener("click", function () {
  ventanaCliente.close();
});

// Finalizar compra
document.getElementById("finalizar-compra").addEventListener("click", function () {
  if (carrito.length === 0) {
    alert("Agrega productos al carrito antes de finalizar.");
    return;
  }

  ventanaCliente.showModal();
});

// Enviar pedido consolidado por WhatsApp
formularioCliente.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const datos = Object.fromEntries(new FormData(formularioCliente));

  const subtotal = carrito.reduce(function (total, item) {
    return total + item.precio * item.cantidad;
  }, 0);

  const lineas = [
    "🛍️ *NUEVO PEDIDO - TRENDY RUANAS*",
    "",
    "*Productos:*"
  ];

  carrito.forEach(function (item, indice) {
    lineas.push(
      "",
      `${indice + 1}. ${item.nombre}`,
      `Talla: ${item.talla} | Color: ${item.color}`,
      `Cantidad: ${item.cantidad}`,
      `Precio: ${precioCOP(item.precio * item.cantidad)}`
    );
  });

  lineas.push(
    "",
    "*Subtotal: " + precioCOP(subtotal) + "*",
    "🚚 El valor del envío se cotiza según la zona de destino.",
    "",
    "👤 *DATOS DEL CLIENTE*",
    "Nombre: " + datos.nombre,
    "Celular: " + datos.celular,
    "Ciudad: " + datos.ciudad,
    "Dirección: " + datos.direccion
  );

  if (datos.notas.trim()) {
    lineas.push("Notas: " + datos.notas);
  }

  const mensaje = encodeURIComponent(lineas.join("\n"));
  const enlace = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + mensaje;

  window.open(enlace, "_blank");
  ventanaCliente.close();
});