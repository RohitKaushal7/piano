function closeModal(e) {
    if (e.target !== this)
        return;
    document.querySelector('.modal').style.display = "none";
}
function showModal(e) {
    document.querySelector('.modal').style.display = "flex";
}

document.querySelector('.modal').addEventListener("click", closeModal)
document.querySelector('#feedback').addEventListener("click", showModal)


// visit count
fetch('https://api.countapi.xyz/hit/rohitkaushal7/piano_count').then(res => res.json()).then(res => {
    document.querySelector("#count").innerHTML = res.value;
})