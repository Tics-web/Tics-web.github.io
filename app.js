// Definir la función asíncrona buscarClima
async function buscarClima() {
    // Obtener el valor ingresado por el usuario en el campo de texto
    const ciudad = document.getElementById("ciudad").value;

    // Claves de las APIs de OpenWeatherMap (clima) y Pexels (imágenes)
    const apiKeyWeather = "769fbee604774325472814c29eb13e45"; // clave de OpenWeatherMap
    const apiKeyPexels = "d6XhzgPTEKyR0S6JPnXf9wn9puKIPgi5K0ux6AKUzunHwDoec6lf8QBW"; // clave de Pexels

    // Crear la URL para la solicitud de clima usando la ciudad y la clave API de OpenWeatherMap
    const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKeyWeather}&lang=es&units=metric`;

    // Crear la URL para la solicitud de imágenes usando la ciudad y la clave API de Pexels
    const urlPexels = `https://api.pexels.com/v1/search?query=${ciudad}&orientation=landscape&size=medium`;

    try {
        // Realizar ambas solicitudes (a OpenWeatherMap y Pexels) de forma paralela utilizando Promise.all
        const [respuestaWeather, respuestaPexels] = await Promise.all([
            fetch(urlWeather), // Solicitar datos del clima
            fetch(urlPexels, { headers: { Authorization: apiKeyPexels } }) // Solicitar datos de la imagen (con el encabezado de autorización de Pexels)
        ]);

        // Convertir las respuestas de las APIs a formato JSON
        const datosWeather = await respuestaWeather.json();
        const datosPexels = await respuestaPexels.json();

        // Verificar si la ciudad fue encontrada por la API de OpenWeatherMap (código 404 indica ciudad no encontrada)
        if (datosWeather.cod === "404") {
            // Mostrar un mensaje si la ciudad no se encuentra
            document.getElementById("resultado").innerHTML = `<p>Ciudad no encontrada. Intenta de nuevo.</p>`;
            return; // Terminar la función si la ciudad no se encuentra
        }

        // Extraer los datos del clima de la respuesta de OpenWeatherMap
        const clima = `
            <h2>Clima en ${datosWeather.name}</h2> <!-- Nombre de la ciudad -->
            <p>Temperatura: ${datosWeather.main.temp} °C</p> <!-- Temperatura actual -->
            <p>Descripción: ${datosWeather.weather[0].description}</p> <!-- Descripción del clima -->
            <p>Humedad: ${datosWeather.main.humidity}%</p> <!-- Porcentaje de humedad -->
        `;

        // Obtener la URL de la imagen de la ciudad desde la respuesta de Pexels
        const imagenUrl = datosPexels.photos[0]?.src?.medium || ''; // Usamos el primer resultado de la búsqueda, si existe

        // Si hay una imagen, se muestra; si no, se muestra un mensaje de que no se encontró imagen
        const imagenHtml = imagenUrl ? `<img src="${imagenUrl}" alt="Imagen de ${ciudad}">` : `<p>No se encontró imagen para esta ciudad.</p>`;

        // Mostrar el clima y la imagen en el elemento con el ID "resultado"
        document.getElementById("resultado").innerHTML = clima + imagenHtml;
    } catch (error) {
        // En caso de error (por ejemplo, problemas de conexión a las APIs), mostrar un mensaje de error
        document.getElementById("resultado").innerHTML = `<p>Error al conectar con los servicios. Intenta de nuevo.</p>`;
        console.error(error); // Mostrar detalles del error en la consola
    }
}
