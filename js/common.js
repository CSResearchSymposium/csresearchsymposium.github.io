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

function loadSubmissions() {
    // <ul uk-accordion="multiple: true" id="submission-list">
    //     <li class="uk-close">
    //         <a class="uk-accordion-title uk-text-bold" href="#">
    //             Architecture
    //         </a>
    //         <div class="uk-accordion-content">
    //         <ol>
    //             <li><a href="">Title</a> - <a href="">Author</a></li>
    //         </ol>
    //         </div>
    //     </li>
    // </ul>
    const areas = [
        "Architecture", 
        "Data Science", 
        "Database", 
        "Graphics", 
        "HCI", 
        "ML/AI", 
        "Networks",
        "Numerical Analysis",
        "Optimization",
        "Programming Languages",
        "Robotics",
        "Security",
        "Systems",
        "Theory",
        "Other"];
    let ul = document.getElementById("submission-list")
    let lis = '';
    for (let i = 0; i < areas.length; i++) {
        let papers = [{"title": "Your Paper Title", "author": "Your Name", "paper_url": '', "author_url": ''}]

        let li = '<li class="uk-close">';
        li += '<a class="uk-accordion-title uk-text-bold" href="#">' + areas[i] + ' (' + papers.length + ')</a>';
        li += '<div class="uk-accordion-content collapsable-list">';
        li += '<ol>'

        // load papers
        for (let j = 0; j < papers.length; j++) {
            paper = papers[j]
            li += '<li><a href="' + paper["paper_url"] + '">' + paper["title"] + '</a> - <a href="'+ paper["author_url"] + '">' + paper["author"] + '</a></li>';
        }
        li += "</ol></div></li>"
        lis += li;
    }
    ul.innerHTML = lis;
}

function expandCollapseAll(expand) {
    var accordionEl = UIkit.util.$('[uk-accordion]');
    var liItems;
    if (expand) {
        liItems = UIkit.util.$$('[uk-accordion] > li:not(.uk-open)');
    } else {
        liItems = UIkit.util.$$('[uk-accordion] > li.uk-open');
    }

    UIkit.util.each(liItems, function(el) {
        var idx = UIkit.util.index(el);
        UIkit.accordion(accordionEl).toggle(idx, false);
    });
    
}