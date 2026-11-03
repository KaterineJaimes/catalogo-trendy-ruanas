const contenedor = document.getElementById("catalogo");

function precioCOP(valor) {
  return "$" + valor.toLocaleString("es-CO");
}

productos.forEach(function (p) {
  contenedor.innerHTML += `
    <article class="tarjeta">
      <img src="${p.imagen}" alt="${p.nombre}">
      <h2>${p.nombre}</h2>
      <p class="precio">${precioCOP(p.precio)}</p>
      <button class="comprar" data-id="${p.id}">Comprar</button>
    </article>`;
});