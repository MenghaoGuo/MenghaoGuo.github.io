
// Data file

BASE_DIR = "./data";

DATA_FILE = "data_public.js"; // default, answers for testmini, no answer for test


// Variables for the filters with the number of questions
let number_options = [10, 20, 100, 200];  
let splits = ["All", "testmini (304)", "test (3040)"];    
let question_types = ["All", "free_form", "multi_choice"];
let categories = ["All", "algebra", "analytic geometry", "arithmetic", "combinatorial geometry", "combinatorics", "counting", "descriptive geometry", "graph theory", "logic", "metric geometry - angle", "metric geometry - area", "metric geometry - length", "solid geometry", "statistics", "topology", "transformation geometry"];
let grades = ["All",  "level 1", "level 2", "level 3", "level 4", "level 5"];

// Elements in the Option Panel
let optbtn = document.getElementsByClassName("optionsbtn")[0];
let closebtn = document.getElementsByClassName("closebtn")[0];
let optionpanel = document.getElementById("option-panel");
let optboxes = document.getElementsByClassName("optbox");
let opt_dds = document.getElementsByClassName("opt-dd");
let filter_submit = document.getElementById("filter-submit");

// Element Text the Option Panel
let number_dd = make_dropdown("How many samples?", number_options, "number_dd");
let split_dd = make_dropdown("Choose a split:", splits, "split_dd");
let question_type_dd = make_dropdown("Choose a question type:", question_types, "question_type_dd");
let category_dd = make_dropdown("Choose a subject:", categories, "category_dd");
let grade_dd = make_dropdown("Choose a level:", grades, "grade_dd");

// Content in the Option Box
optboxes[0].innerHTML += number_dd;
optboxes[0].innerHTML += split_dd;
optboxes[0].innerHTML += question_type_dd;
optboxes[0].innerHTML += category_dd;
optboxes[0].innerHTML += grade_dd;

// Elements in the Content Body
let body = document.getElementById("content-body");
let display = document.getElementById("display");

// Click actions for the option buttons
optbtn.addEventListener("click", openNav);
closebtn.addEventListener("click", closeNav);

// Responsive: if screen is narrow, body only displays one column
if (window.innerWidth < 600) {
    body.style.flexDirection = "column";
}

// Set up the data filters and display the page
let filters = {};

for (each of opt_dds) {
    each.addEventListener("change", change_filters);
}

// Display the page when clicking the fresh button
filter_submit.addEventListener("click", filter_data);
if (window.innerWidth < 600) {
    filter_submit.addEventListener("click", closeNav);
}

// Display the page when it is running at the first time
filter_data();

// Functions
var display_padding = display.style.padding;
function openNav() {
    if (window.innerWidth < 600) {
        // optionpanel.style.zIndex = "2";
        optionpanel.style.width = "100vw";
        display.style.width = "0vw";
        display.style.padding = "0";
    } else {
        optionpanel.style.width = "30vw";
        display.style.width = "50vw";
    }
    for (each of optionpanel.children) 
        each.style.display = "block";
}

function closeNav() {
    // display.style.display = "block";
    optionpanel.style.width = "0vw";
    display.style.width = "100vw";
    display
    for (each of optionpanel.children) {
        each.style.display = "none";
    }
}

// Function: update the filter values
function change_filters(e) {
    filters.split = document.getElementById("split_dd").value;
    filters.number = document.getElementById("number_dd").value;
    filters.question_type = document.getElementById("question_type_dd").value;
    filters.category = document.getElementById("category_dd").value;
    filters.grade = document.getElementById("grade_dd").value;
}

// Function: draw the page
function create_page(d) {
    if (d.length === 0) {
        body.innerHTML = "<p>No number satisfies All the filters.</p>";
    } else {
        col1 = create_col(d.slice(0, d.length / 2));
        col2 = create_col(d.slice(d.length / 2));
        body.innerHTML = col1 + col2;
    }
    reflow(body);
    console.log("reflowed");
}

function create_col(data) {
    res = [];

    for (each of data) {
        res.push(create_number(each));
    }

    return `<div class="display-col"> ${res.join("")} </div>`;
}

// data is an object with the following attr.
function create_number(data) {
    let question = make_qt(data.pid, data.question, data.unit);

    // let hint = make_hint(data.hint)
    let image = "";
    if (data.image !== -1)
        // image = make_img(`${BASE_DImetadataR}/${filters.dataset}/${data.image}`);
        image = make_img(`${BASE_DIR}/${data.image}`);

    let choices = "";
    if (data.question_type === "multi_choice")
        choices = make_choices(data.choices);

    // if data has the answer attr.
    let answer = "";
    if ("answer" in data)
        answer = make_answer(data.answer);

    html = make_box([question, image, choices, answer]) + "<hr/>";

    return html;
}

// creates a div with question text in it
function make_qt(pid, question, unit) {
    let html = "";
    if (unit === null)
        html = `
                <p><b>Question </b></p>
                <p class="question-txt">[No.${pid}] ${question}</p>
        `;
    else
        html = `
                <p><b>Question </b></p>
                <p class="question-txt">[No.${pid}] ${question} (unit: ${unit})</p>
        `;
    return html;
}

function make_hint(hint) {
    if (hint === null) return "";
    let html = `<p><b>Context </b></p><p class="hint-txt">${hint}</p>`;
    return html;
}

function make_img(path) {
    if (path === null) return "";
    let html = `<img src="${path}" alt="number image" class="question-img" />`;
    return html;
}

function make_box(contents, cls = "") {
    if (contents.join("").length === 0) return "";
    let html = `
        <div class="box ${cls}"> 
            ${contents.join(" ")}
        </div>
    `;
    return html;
}

function make_choices(choices) {
    // console.log(choices);
    let temp = "";
    let len = 0;
    for (each of choices) {
        let html = make_choice(each);
        temp += html;
        len += each.length;
    }
    let html = "";
    if (len < 60)
        html = `<p><b>Choices </b></p><div class="choices">${temp}</div>`;
    else
        html = `<p><b>Choices </b></p><div class="choices-vertical">${temp}</div>`;
    return html;
}
function make_choice(choice) {
    let html = `<p class="choice-txt">${choice}</p>`;
    return html;
}

function make_answer(answer) {
    let html = `<p><b>Answer </b></p><p class="answer-txt">${answer}</p>`;
    return html;
}

function make_dropdown(label, options, id, default_ind = 0) {
    let html = "";
    for (let i = 0; i < options.length; i++) {
        if (i === default_ind)
            html += `<option value="${options[i]}" selected> ${options[i]} </option>`;
        else
            html += `<option value="${options[i]}"> ${options[i]} </option>`;
    }
    html = `<label class="dd-label">${label} <select id="${id}" class="opt-dd"> ${html} </select> </label><br/>`;
    return html;
}


// Main Functions (FIXME: need to be updated)
async function filter_data() {
    // set up or update the filter
    change_filters();

    console.log(filters);
    // e.g. data/{"dataset": "CLEVR-Math", "number": 20}

    // success event 
    let scriptEle = document.createElement("script");
    // scriptEle.setAttribute("src", `data/${filters.dataset}_test.js`);
    scriptEle.setAttribute("src", `data/${DATA_FILE}`);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", false);
    document.body.appendChild(scriptEle);

    scriptEle.addEventListener("load", () => {
        console.log("File loaded");
        res = test_data;
        // console.log(res);


        // go over res and add pid to each element
        for (let i of Object.keys(res)) {
            res[i].pid = i;
        }


        // filter: split
        filters.split = filters.split.split(" (")[0];
        if (filters.split == "testmini") {
            for (let i of Object.keys(res)) {
                if (res[i].metadata.split.toString() !== filters.split) {
                    delete res[i];
                }
            }
        }

        // filter: question type
        filters.question_type = filters.question_type.split(" (")[0];
        if (filters.question_type !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].question_type.toString() !== filters.question_type) {
                    delete res[i];
                }
            }
        }


        // filter: category
        filters.category = filters.category.split(" (")[0];
        if (filters.category !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].metadata.category.toString() !== filters.category) {
                    delete res[i];
                }
            }
        }
    

        // filter: grade
        filters.grade = filters.grade.split(" (")[0];
        if (filters.grade !== "All") {
            for (let i of Object.keys(res)) {
                if (res[i].metadata.grade.toString() !== filters.grade) {
                    delete res[i];
                }
            }
        }
    


        // filter: number
        cnt = filters.number;
        if (cnt != "All") {
            cnt = Number.parseInt(cnt);
            d = _.sample(res, Math.min(cnt, Object.keys(res).length));

        } else {
            d = [];
            for (let i of Object.keys(res)) {
                d.push(res[i]);
            }
        }

   
        create_page(d);
    });
}

// force the browser to reflow
function reflow(elt) {
    elt.offsetHeight;
}
