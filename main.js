const links = document.querySelectorAll("nav a");

links.forEach(link => {
    link.addEventListener("click", e => {
        console.log("Navigating to", link.getAttribute("href"));
    });
});

// Popup
document.addEventListener("click", function (event) {
    // Only allow popup on sections
    if(!event.target.closest("section")) return;

    const popups = ["mik", "mak", "mikmak"];
    const popup = document.createElement("span");
    const popupId = Math.floor(Math.random() * popups.length);
    popup.innerText = popups[popupId];
    popup.classList.add("popup");
    popup.style.left = event.clientX + "px";
    popup.style.top = event.clientY + "px";
    popup.addEventListener("animationend", () => popup.remove());

    document.body.appendChild(popup);
});

// Toggle Zen mode
function toggleZen() {
    document.body.classList.toggle('zen');
}