document.addEventListener("DOMContentLoaded", function () {
    const prevBtn = document.querySelector(".carousel-btn.prev");
    const nextBtn = document.querySelector(".carousel-btn.next");
    const carouselTrack = document.querySelector(".carousel-track");
    const carouselImages = document.querySelectorAll(".carousel-image");
    const totalImages = carouselImages.length;
    let currentIndex = 0;
  
    // Mostrar imágenes de tres en tres
    const imagesToShow = 3;
  
    // Función para actualizar la posición del carrusel
    function updateCarousel() {
      const offset = -currentIndex * (carouselImages[0].clientWidth + 10); // 10 es el espacio entre las imágenes
      carouselTrack.style.transform = `translateX(${offset}px)`;
    }
  
    // Función para mover el carrusel al siguiente conjunto de imágenes
    function moveNext() {
      currentIndex++;
      if (currentIndex > totalImages - imagesToShow) {
        currentIndex = 0; // Volver al principio
      }
      updateCarousel();
    }
  
    // Función para mover el carrusel al conjunto anterior de imágenes
    function movePrev() {
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = totalImages - imagesToShow; // Volver al final
      }
      updateCarousel();
    }
  
    // Escuchadores de eventos para los botones
    nextBtn.addEventListener("click", moveNext);
    prevBtn.addEventListener("click", movePrev);
  
    // Iniciar el carrusel automáticamente
    let intervalId = setInterval(moveNext, 2000); // Cambiar de imagen cada 3 segundos
  
    // Pausar el carrusel automático al hacer clic en los botones
    nextBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      intervalId = setInterval(moveNext, 2000);
    });
  
    prevBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      intervalId = setInterval(moveNext, 2000);
    });
  });