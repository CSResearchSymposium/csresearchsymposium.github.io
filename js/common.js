function updateNavBar(currentNav) {
    let lis = document.getElementById("nav-ul").getElementsByTagName("li");
    for (let i = 0; i < lis.length; i++) {
        let li = lis[i];
        li.classList.remove("uk-active");
    }
    let li = document.getElementById("nav-" + currentNav);
    li.classList.add("uk-active");
}