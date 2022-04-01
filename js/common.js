function updateNavBar(currentNav) {
    var uls = document.getElementsByClassName("nav-ul")
    for (var i =0; i < uls.length; i++) {
        var lis = uls[i].getElementsByTagName("li");
        for (var j = 0; j < lis.length; j++) {
            lis[j].classList.remove("uk-active");
        }
    }

    var li = document.getElementsByClassName("nav-" + currentNav);
    for (var i =0; i < li.length; i++) {
        li[i].classList.add("uk-active");
    }
}

// global variable
var gPaperList = [];
function loadSubmissions() {
    // dynamically load submissions from .csv file exported from google sheet
    parseSubmissions(); // loads to global variables: gPaperList

    // to be added after final submissions
}

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

function parseSubmissions(){
    /*
    1. download timetable from google sheet (https://docs.google.com/spreadsheets/d/1f4a1po1Zi3kZsJsoMljCZIOvRO6trsoNp8NN-W9EWV4/edit?usp=sharing)
        to ./data/submissions as submissions.tsv
    2. read in .tsv file as a string
    3. parse manually
    4. populate inner HTML accordingly (manual coding)
    */
    const filePath = './data/submissions/submissions.tsv';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const fullText = this.responseText;
            const str = fullText.split('\n');
            for(let i = 2; i < str.length; i++) {
                const v = str[i].split('\t');

                const speaker = v[2].trim();
                const title = v[11].replace(/["]+/g, '');
                const area = v[13].replace(/["]+/g, '');
                const areas = area.split(',');
                var areaTag = [];
                for (var j = 0; j < areas.length; j++) {
                    areaTag.push('#' + areas[j].trim());
                }
                areaTag = areaTag.join(' ');
                
                const shareSlides = v[9] == "Yes";
                var slideUrl = null;
                if (shareSlides) {
                    const fileFormat = v[17].trim();
                    slideUrl = "data/submissions/slides/" + speaker + fileFormat;
                }
                const hasImage = v[14].trim() == "1";
                var imgUrl = null;
                if (hasImage) {
                    const fileFormat = v[15].trim();
                    imgUrl = "data/submissions/imgs/" + speaker + fileFormat;
                } else {
                    imgUrl = "img/BuckyBadger.png";
                }

                const speakerUrl = v[8].trim();
                var paperUrl = v[7].trim();
                if (paperUrl.length>0) {
                    paperUrl = paperUrl.split(";");
                }
                gPaperList.push({'speaker': speaker, 'area': areaTag, 'title': title, 'slideUrl': slideUrl, 'imgUrl': imgUrl, 'paperUrl': paperUrl, 'speakerUrl': speakerUrl});
            }
            populatePapers(null, 'title');
        }
    };
    xhttp.open("GET", filePath, true);
    xhttp.send();
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

    let olPaper = document.getElementById('submission-list');
    olPaper.innerHTML = '';
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
    for (var i0=0; i0 < indices.length; i0++) {
        const idx = indices[i0];
        const data = gPaperList[idx];
        liPaper += 
        "<li class='paper-li'><span><div class='paper-container'><div class='paper-left'><img class='paper-thumbnail' src='" + data['imgUrl'] + "'></img></div>" + 
        "<div class='paper-right'><span style='font-size:1.25em'>" + data['title'] + "</span>";
    
        const hasPaperUrl = data['paperUrl'] != null && data['paperUrl'].length > 0;
        const hasSlideUrl = data['slideUrl'] != null && data['slideUrl'].length > 0;
        if (hasPaperUrl) {
            for(var urlIdx=0; urlIdx<data['paperUrl'].length; urlIdx++){
                if (urlIdx == 0) liPaper += '<br>';
                if (data['paperUrl'].length > 1) {
                    liPaper += "<a href='" + data['paperUrl'][urlIdx] + "' target='_blank'>[paper " + (urlIdx+1).toString() + "] </a>";
                }
                else {
                    liPaper += "<a href='" + data['paperUrl'][urlIdx] + "' target='_blank'>[paper]</a>";
                }
            }
            if(!hasSlideUrl) liPaper += "<br>";
        }

        if (hasSlideUrl) {
            if (!hasPaperUrl) liPaper += "<br>";
            liPaper += "<a href='" + data['slideUrl'] + "' target='_blank'>[slides]</a><br>";
        }

        if (!hasPaperUrl && !hasSlideUrl) {
            liPaper += "<br>";
        }
        if (data['speakerUrl'].length > 0) {
            liPaper += "<span class='speaker'><a href='" + data['speakerUrl'] + "' target='_blank'>" + data['speaker'] + "</a></span><br>";
        } else {
            liPaper += "<span class='speaker'>" + data['speaker'] + "</span><br>";
        }

        liPaper += '<span>' + data['area'] + "</span></div></div></span></li>";
    }
    olPaper.innerHTML = liPaper;
}