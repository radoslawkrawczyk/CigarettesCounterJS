document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    // Empty
}
class Data {
    constructor() {}

    get() {
        let data = window.localStorage.getItem("data");
        if (data === null) {
            window.localStorage.setItem("data", JSON.stringify({
                "lastCigarette": 0,
                "today": 0,
                "smoked": []
            }));
            data = window.localStorage.getItem("data");
        }

        return JSON.parse(data);
    }

    set(data) {
        window.localStorage.setItem("data", JSON.stringify(data));
        return true;
    }

    updateLast() {
        let last = this.get();
        last.lastCigarette = new Date().getTime();
        this.set(last);
        return last.lastCigarette;
    }

    updateToday() {
        let today = new Date();

        let milisecondsOfDate = 86340000;
        let lastCig = this.get();
        let lastCigDate = new Date(parseInt(lastCig.smoked[lastCig.smoked.length - 1]));

        if (today.setHours(0, 0, 0, 0) == lastCigDate.setHours(0, 0, 0, 0)) {
            return lastCig.today;

        } else {
            lastCig.today = 0;
            this.set(lastCig);
            return lastCig.today;
        }
    }

    add() {
        let add = this.get();
        let date = new Date().getTime();
        add.smoked.push(date);
        this.set(add);
        return date;
    }

    getYesterday() {
        let cigars = this.get().smoked;

        let yesterdayTimestamp = new Date();
        let timezoneOffset = (new Date().getTimezoneOffset()) * 60 * 1000;

        yesterdayTimestamp.setDate(yesterdayTimestamp.getDate() - 1);
        yesterdayTimestamp.setHours(0, 0, 0, 0);

        yesterdayTimestamp = yesterdayTimestamp.getTime() - timezoneOffset;
        let todayTimestamp = yesterdayTimestamp + (23 * 60 * 60 * 1000 + 60 * 59 * 1000);

        let howMany = 0;
        cigars.forEach(function (value, key) {
            if (value > yesterdayTimestamp && value < todayTimestamp) {
                howMany++;
            }
        });

        return howMany;
    }

    getWeekly() {
        let cigars = this.get().smoked;
        let weeklyTimestamp = new Date();
        let timezoneOffset = (new Date().getTimezoneOffset()) * 60 * 1000;

        weeklyTimestamp.setDate(weeklyTimestamp.getDate() - 7);
        weeklyTimestamp.setHours(0,0,0,0);

        weeklyTimestamp = weeklyTimestamp.getTime() -timezoneOffset;
        let todayTimestamp = weeklyTimestamp + + (23 * 60 * 60 * 1000 + 60 * 59 * 1000) * 7;

        let howMany = 0;
        cigars.forEach(function (value, key) {
            if (value > weeklyTimestamp && value < todayTimestamp) {
                howMany++;
            }
        });

        return howMany;
    }
}
let data = new Data();
data.get();
let lastCig = document.getElementById("lastCigarette");
let addCig = document.getElementById("addCigarette");
let today = document.getElementById("todayCounter");
let delCig = document.getElementById("delCigarette");
let showYesterday = document.getElementById("showYesterday");
let showWeekly = document.getElementById("showWeekly");
let clearData = document.getElementById("clearData");
let showOverall = document.getElementById("showOverall");

today.innerText = data.updateToday();
if (data.get().lastCigarette !== 0) {
    lastCig.innerText = data.get().lastCigarette.substring(0, data.get().lastCigarette.length - 7);
}
addCig.addEventListener("click", function () {
    let last = new Date(data.add()).toUTCString();
    lastCig.innerText = last.substring(0, last.length - 7);
    let add = data.get();
    add.lastCigarette = last;
    add.today++;
    data.set(add);
    today.innerText = data.updateToday();
});

delCig.addEventListener("click", function () {
    let del = data.get();
    if (del.today > 0)
        del.today--;
    today.innerText = del.today;
    del.smoked.splice(-1,1);
    data.set(del);
    let lastCigData = new Date(data.get().smoked[data.get().smoked.length-1]).toUTCString();
    lastCigData = lastCigData.substring(0, lastCigData.length - 7);
    lastCig.innerText = lastCigData;

});

showYesterday.addEventListener("click", function () {
    alert('Cigarettes smoked yesterday: \n\n' + data.getYesterday());
});

showWeekly.addEventListener("click", function() {
    alert("Cigarettes smoked in the last 7 days:\n\n"+data.getWeekly());
});

showOverall.addEventListener("click", function () {
    let firstCig = new Date(data.get().smoked[0]).toUTCString();
    let soFar = firstCig.substring(0, firstCig.length - 4);
    if (soFar != 'Invalid ') {
        alert("Cigarettes smoked since " + soFar + ":\n\n" + data.get().smoked.length);
    }
    else {
        alert("No cigarettes smoked so far")
    }
});

clearData.addEventListener("click", function () {
    let isUserSure = window.confirm("Do you really want to remove all the data?");
    if (isUserSure) {
        window.localStorage.removeItem("data");
        window.localStorage.setItem("data", JSON.stringify({
            "lastCigarette": 0,
            "today": 0,
            "smoked": []
        }));
        lastCig.innerText = data.get().lastCigarette;
        today.innerText = data.get().today;
    }
});