function updateNavBar(currentNav) {
    let uls = document.getElementsByClassName("nav-ul")
    for (let i =0; i < uls.length; i++) {
        let lis = uls[i].getElementsByTagName("li");
        for (let j = 0; j < lis.length; j++) {
            lis[j].classList.remove("uk-active");
        }
    }

    let li = document.getElementsByClassName("nav-" + currentNav);
    for (let i =0; i < li.length; i++) {
        li[i].classList.add("uk-active");
    }
}