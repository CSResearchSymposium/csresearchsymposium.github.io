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

// global variable
var gPaperList = [];
var gKeynoteList = [];
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
    // const areas = [
    //     "Architecture", 
    //     "Data Science", 
    //     "Database", 
    //     "Graphics", 
    //     "HCI", 
    //     "ML/AI", 
    //     "Networks",
    //     "Numerical Analysis",
    //     "Optimization",
    //     "Programming Languages",
    //     "Robotics",
    //     "Security",
    //     "Systems",
    //     "Theory",
    //     "Other"];
    // let ul = document.getElementById("submission-list")
    // let lis = '';
    // for (let i = 0; i < areas.length; i++) {
    //     let papers = [{"title": "Your Paper Title", "author": "Your Name", "paper_url": '', "author_url": ''}]

    //     let li = '<li class="uk-close">';
    //     li += '<a class="uk-accordion-title uk-text-bold" href="#">' + areas[i] + ' (' + papers.length + ')</a>';
    //     li += '<div class="uk-accordion-content collapsable-list">';
    //     li += '<ol>'

    //     // load papers
    //     for (let j = 0; j < papers.length; j++) {
    //         paper = papers[j]
    //         li += '<li><img class="paper-thumbnail" src="img/submissions/paper_img.png"></img><a href="' + paper["paper_url"] + '">' + paper["title"] + '</a> - <a href="'+ paper["author_url"] + '">' + paper["author"] + '</a></li>';
    //     }
    //     li += "</ol></div></li>"
    //     lis += li;
    // }
    // ul.innerHTML = lis;

    // dynamically load submissions from .csv file exported from google sheet
    in_path = './data/timetable.tsv'
    file = parseSubmissions(in_path);
}

// function loadKeynotes() {
//     // <ul uk-accordion="multiple: true" id="submission-list">
//     //     <li class="uk-close">
//     //         <a class="uk-accordion-title uk-text-bold" href="#">
//     //             Architecture
//     //         </a>
//     //         <div class="uk-accordion-content">
//     //         <ol>
//     //             <li><a href="">Title</a> - <a href="">Author</a></li>
//     //         </ol>
//     //         </div>
//     //     </li>
//     // </ul>
//     const areas = [
//         "Talk 1",
//         "Talk 2",
//     ];
//     let ul = document.getElementById("keynote-list")
//     let lis = '';
//     for (let i = 0; i < areas.length; i++) {
//         let papers = [{"title": "Keynote title", "author": "Presenter", "paper_url": '', "author_url": ''}]

//         let li = '<li class="uk-close">';
//         li += '<a class="uk-accordion-title uk-text-bold" href="#">' + areas[i] + '</a>';
//         li += '<div class="uk-accordion-content collapsable-list">';
//         li += '<ol>'

//         // load papers
//         for (let j = 0; j < papers.length; j++) {
//             paper = papers[j]
//             li += '<li><img class="paper-thumbnail" src="img/submissions/paper_img.png"></img><a href="' + paper["paper_url"] + '">' + paper["title"] + '</a> - <a href="'+ paper["author_url"] + '">' + paper["author"] + '</a></li>';
//         }
//         li += "</ol></div></li>"
//         lis += li;
//     }
//     ul.innerHTML = lis;
// }
function expandCollapseAll(id, expand) {
    var accordionEl = UIkit.util.$('[uk-accordion]#'+id);
    var liItems;
    if (expand) {
        liItems = UIkit.util.$$('[uk-accordion]#'+id + ' > li:not(.uk-open)');
    } else {
        liItems = UIkit.util.$$('[uk-accordion]#'+id + ' > li.uk-open');
    }

    UIkit.util.each(liItems, function(el) {
        var idx = UIkit.util.index(el);
        UIkit.accordion(accordionEl).toggle(idx, false);
    });
    
}

function parseSubmissions(filePath, keynote_id, paper_id){
    /*
    1. download timetable from google sheet (https://docs.google.com/spreadsheets/d/1a8Sp2GasjQqyspXNq0E34wF0ssBVWN8uBfzoJn2O5Ww/edit?usp=sharing)
        to ./data as .tsv
    2. read in .tsv file as a string
    3. parse manually
    4. populate inner HTML accordingly (manual coding)
    */
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const fullText = this.responseText;
            const str = fullText.split('\n');
            for(let i = 4; i < str.length; i++) {
                const v = str[i].split('\t');
                // skip non-presentation rows
                if (v[4] == '' || v[4] == '-') {
                    continue;
                }
                const speaker = v[4];
                let type = v[5];
                const title = v[7].replace(/["]+/g, '');
                const area = v[6].replace(/["]+/g, '');
                if (type.includes('Keynote')) {
                    type = 'Keynote';
                }
                // console.log(speaker + '_____' + type + '______' + area + '_____' + title);
                if (type == 'Keynote') {
                    gKeynoteList.push({'speaker': speaker, 'title': title, 'paper_url': '', 'speaker_url': ''});
                } else {
                    gPaperList.push({'speaker': speaker, 'type': type, 'area': area, 'title': title, 'paper_url': '', 'speaker_url': ''});
                }
            }
            populatePapers(null, 'title');
            populateKeynotes();
        }
    };
    xhttp.open("GET", filePath, true);
    xhttp.send();
}
function populateKeynotes() {
    let ulKeynote = document.getElementById('keynote-list');
    var liKeynote = '';
    ulKeynote.innerHTML = '';
    // create html here
    for (var idx=0; idx<gKeynoteList.length; idx++) {
        const paper = gKeynoteList[idx];
    
        liKeynote += '<li style="margin-bottom:5px; padding-bottom:5px; min-height:96px; border-bottom:1px solid lightgray;"><p style="width:100%;">\
                <img class="paper-thumbnail" src="img/submissions/paper_img.png" style="float:left;"></img>\
                <a href="' + paper["paper_url"] + '"><span style="font-size:1.25em">' + paper["title"] + '</span></a>\
                <br><a href="'+ paper["speaker_url"] + '">' + paper["speaker"] + '</a></li>';
    }
    ulKeynote.innerHTML = liKeynote;
}
function populatePapers(btn, sortKey) {
    var span = document.getElementById("span-sort-" + sortKey);
    var attr = span.getAttribute('uk-icon');
    var sortDirection = 0;
    if (btn != null) {
        if (attr.includes("arrow-down")) {
            span.setAttribute('uk-icon', 'icon: arrow-up');
            sortDirection = 1;
        } else {
            span.setAttribute('uk-icon', 'icon: arrow-down');
            sortDirection = 0;
        }
    }


    let ulPaper = document.getElementById('submission-list');
    ulPaper.innerHTML = '';
    var liPaper = '';

    // sort areas in alphabetical order
    var indices = new Array(gPaperList.length);
    for (var i = 0; i < gPaperList.length; ++i) indices[i] = i;
    if (sortDirection == 0) {
        indices.sort(function (a, b) { return gPaperList[a][sortKey] < gPaperList[b][sortKey] ? -1 : gPaperList[a][sortKey] > gPaperList[b][sortKey] ? 1 : 0; });
    } else {
        indices.sort(function (a, b) { return gPaperList[a][sortKey] > gPaperList[b][sortKey] ? -1 : gPaperList[a][sortKey] < gPaperList[b][sortKey] ? 1 : 0; });
    }

    // create html here
    // for (const [area, papers] of Object.entries(paperDict)) {
    for (var i0=0; i0<indices.length; i0++) {
        const idx = indices[i0];
        const paper = gPaperList[idx];
        const areas = paper['area'].split(',');
        var areaTag = [];
        for (var i = 0; i < areas.length; i++) {
            areaTag.push('#' + areas[i].trim());
        }
    
        liPaper += '<li style="margin-bottom:5px; padding-bottom:5px; min-height:96px; border-bottom:1px solid lightgray;"><p style="width:100%;">\
            <img class="paper-thumbnail" src="img/submissions/paper_img.png" style="float:left;"></img>\
            <a href="' + paper["paper_url"] + '"><span style="font-size:1.25em">' + paper["title"] + '</span></a>\
            <br><a href="'+ paper["speaker_url"] + '">' + paper["speaker"] + '</a>\
            <br><span>'+areaTag.join(' ')+'</span></p></li>';
    }
    ulPaper.innerHTML = liPaper;
}