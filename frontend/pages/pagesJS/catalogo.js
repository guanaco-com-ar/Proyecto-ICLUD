// Esperamos a que el HTML de la página esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarCatalogoCompleto();
});

async function cargarCatalogoCompleto() {
    const cardsContainer = document.getElementById("cards-container");
    
    // Validación por si el script se ejecuta en un HTML sin este contenedor
    if (!cardsContainer) return; 

    cardsContainer.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #666;'>Cargando catálogo disponible...</p>";

    try {
        // Petición a la API conectada a tu base de datos
        const response = await fetch("/api/hoteles");
        
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const hoteles = await response.json();
        cardsContainer.innerHTML = "";

        if (hoteles.length === 0) {
            cardsContainer.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>No hay alojamientos cargados actualmente.</p>";
            return;
        }

        // Iteración sobre los hoteles de la base de datos
        hoteles.forEach(hotel => {
            const imagenUrl = hotel.imagen_h || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200';
            
            // Creamos la tarjeta estructuralmente como elemento del DOM
            const card = document.createElement("div");
            card.className = "card";
            
            card.innerHTML = `
                <img src="${imagenUrl}" alt="${hotel.nombre}">
                <div class="card-content">
                    <h3>${hotel.nombre}</h3>
                    <p>📍 ${hotel.localizacion}</p>
                    <p>🛏️ ${hotel.cantidad_habitaciones} Hab.</p>
                    
                    <button class="btn-reservar" onclick="event.stopPropagation();">Reservar ahora</button>
                </div>
            `;

            // Manejador del Click para expandir la tarjeta
            card.addEventListener("click", () => {
                // Remueve la expansión de cualquier otra tarjeta que esté abierta
                const tarjetaExpandidaAnterior = document.querySelector(".card.expanded");
                if (tarjetaExpandidaAnterior && tarjetaExpandidaAnterior !== card) {
                    tarjetaExpandidaAnterior.classList.remove("expanded");
                }

                // Aplica o quita la expansión a la tarjeta actual
                card.classList.toggle("expanded");
            });

            // Agregamos la tarjeta configurada al grid de la interfaz
            cardsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        cardsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 20px;">
                <p>⚠️ Hubo un problema al conectar con el servidor.</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}