
function submit(){
    var time = document.getElementById("start-time").value;
    var date = new Date(Date.parse(time));
    var historicDate = percToDate(percent, date);
}
function getDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate() ;
    var hour = date.getHours()-24;
    var minute = date.getMinutes();
    var decimal = year + (month / 12) + (day / 365) + (hour / 8760) + (minute / 525600);
    return decimal;
}
function percToDate(percent, time){
    var func1 = time - (Math.exp(20.3444*Math.pow(percent, 3)+3)-Math.exp(3));
    return func1
}

function factForDate(year){
    var csv = data.FileReader("events.csv")
    var lowestyear = 0
    var difference = 99999999999
    for (var i of csv){
        if (Math.abs(i[0] - year) < difference){
            lowestyear = i[0]
            difference = Math.abs(i[0] - year)
        }
    }
    for(var i of csv){
        if (lowestyear == i[0]){
            return i[1]
        }
    }
}

/**
 * Date to display
 * 
 * @param {number} year The date as a decimal (i.e. 2022.123)
 * @returns A string representing how to display the date
 */
function fullDate(year){
    let currentYear = new Date().getFullYear();
    let yearInMs = 31536000000;

    if (year > 1990) {
        // Present - 1990
        // @todo - how accurate is this?
        let date = Date(currentYear - year * yearInMs)
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
    else if (year > 1000)
        // 1990 - 1000
        return `${Math.floor(year)}`;
    else if (year > 0)
        // 1000 CE - 0
        return `${Math.floor(year)} CE`;
    else if (year > -1000)
        // 0 - 1000 BCE
        return `${Math.abs(Math.ceil(year))} BCE`;
    else if (Math.ceil(currentYear-year) > -10000)
        // 1000 BCE - 10,000 BCE
        return `${(Math.abs(Math.ceil(currentYear-year))).toLocaleString()} years ago`
    else if (Math.ceil(currentYear-year) > -1000000)
        // 10 thousand years ago - 1 million years ago
        return `${Math.abs(Math.round((currentYear-year)/1000))} thousand years ago`
    else if (Math.ceil(currentYear-year) > -100000000)
        // 1 million years ago - 1 billion years ago
        return `${Math.abs(Math.ceil(currentYear-year)/1000000)} million years ago`
    else
        // 1 billion years ago - end
        return `${Math.abs(Math.ceil(currentYear-year)/1000000000)} billion years ago`
}

/**
 * Calculate the percentage given start and end dates
 * 
 * @param {string} start The start date/time as a an ISO string (i.e. '2022-11-05T14:42')
 * @param {string} end   The end date/time as a an ISO string (i.e. '2022-11-05T14:42')
 * @param {string} [now = [current time]] The current date/time as a an ISO string (i.e. '2022-11-05T14:42')
 * @returns The percentage of the way through the time period as a decimal (i.e. 0.5)
 */
function calcPercent(start, end, now = new Date().toISOString()) {
    let startMs = Date.parse(start);
    let endMs = Date.parse(end);
    let nowMs = Date.parse(now);

    if (nowMs < startMs) return 0;
    if (nowMs > endMs) return 1;

    return (nowMs - startMs) / (endMs - startMs);
}

let loopInterval = null;

/**
 * Submit function for when you press the button
 */
function submit() {
    if (loopInterval) clearInterval(loopInterval);

    let start = document.getElementById("start-time").value;
    let end = document.getElementById("end-time").value;

    let timeline = document.getElementById("timeline");
    timeline.style.display = "block";

    setInterval(() => loop(start, end), 100);
}

function loop(start, end) {
    let now = new Date().toISOString();
    let percent = calcPercent(start, end, now);
    let resultDate = percToDate(percent, start);

    let prog = document.getElementById("progress");
    prog.innerText = `${percent.toFixed(5)*100}% completed`;

    let bar = document.getElementById("bar");
    bar.style.width = `${percent*100}%`;

    let date = document.getElementById("date");
    date.innerText = fullDate(resultDate);

    let fact = document.getElementById("fact");
    fact.innerText = factForDate(resultDate);
    
}