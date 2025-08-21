var video = document.querySelector(".tes video");
var image = document.querySelector(".tes img");
var container = document.querySelector(".tes");

container.addEventListener("mouseenter", function() {
    console.log("Mouse Entrou")
    image.style.display = "none";   // Esconde a imagem
    video.style.display = "block";  // Mostra o vídeo
});

container.addEventListener("mouseleave", function() {
    console.log("Mouse saiu")
    image.style.display = "block";  // Mostra a imagem
    video.style.display = "none";   // Esconde o vídeo
});