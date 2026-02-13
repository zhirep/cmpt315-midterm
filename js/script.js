async function loadWeather() {
    const box = document.getElementById("weatherBox");
    const url =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=51.1784&longitude=115.5708" +
        "&current_weather=true";

    try {
        const res = await fetch(url);
        const data = await res.json();
        const code = data.current_weather.weathercode;
        const value = displayWeather(code);
        box.innerHTML = `Live from Banff: ${code}°C<br>Current Mountain Conditions: ${value}`;

    } catch {
        box.textContent = "Weather unavailable.";
    }
}

function displayWeather(value) {
    if (value == 0) {
        value = "Clear sky ☀️"
    }

    else if (value == 1 || value == 2 || value == 3) {
        value = "Cloudy ☁️"
    }

    else if (value == 61 || value == 63 || value == 65) {
        value = "Rain ☔"
    }

    else if (value == 71 || value == 73 || value == 75) {
        value = "Snow ❄️"
    }

    return value;
}

function resetUI() {
    document.getElementById("display").textContent = "$0.00";
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('route').selectedIndex = 0;
    document.getElementById('numberOfTrav').value = "";
    document.getElementById("studentBox").checked = false;
    document.getElementById("optiona").checked = false;
    document.getElementById("optionb").checked = false;
}

function calculateBooking() {
    let subtotal = 0;

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const route = document.getElementById('route').value;
    const numOfTrav = document.getElementById('numberOfTrav').value;
    const paymentOpt = document.querySelector('input[name="payment"]:checked');

    if (name == "") {
        alert("Please fill out all fields.");
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email.");
        return;
    }

    if (route == "") {
        alert("Please select a route.");
        return;
    }

    if (numOfTrav >= 10 || numOfTrav <= 0) {
        alert("Please enter a valid number between 1-10.");
        return;
    } 

    if (!paymentOpt) {
        alert("Please select a payment option.");
        return;
    }

    let routePrice = checkPrice(route);
    subtotal = routePrice * numOfTrav;

    const student = document.getElementById('studentBox').checked;
    subtotal = isStudent(student, subtotal);

    let taxableAmount = subtotal * 0.05;
    let total = subtotal + taxableAmount;

    updatePrice(total);
    successMsg(name, numOfTrav, route, email);
}

function updatePrice(value) {
    const box = document.getElementById("display");
    box.innerHTML = `$${value.toFixed(2)}`;
}

function checkPrice(route) {
    let price = 0;

    if (route == "Calgary to Banff") {
        price = 50.00;
    }

    else if (route == "Edmonton to Jasper") {
        price = 90.00;
    }

    else if (route == "Calgary to Lake Louise") {
        price = 70.00;
    }

    return price;
}

function bulkDiscount(subtotal, numOfTrav) {
    if (numOfTrav >= 5) {
        let discount = subtotal * 0.10;
        subtotal -= discount;
    }

    return subtotal;
}

function isStudent(student, subtotal) {
    if (student) {
        let discount = subtotal * 0.15;
        subtotal -= discount;
    }

    return subtotal;
}

function successMsg(name, numberOfTrav, route, email) {
    alert(`Thank you ${name}! Your booking for ${numberOfTrav} people to ${route} has been received. 
A confirmation email has been sent to ${email}.`);
}

function checkContact() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('phone').value;
    const messageText = document.getElementById('message');

    if (name == "") {
        alert("Please fill out all fields.");
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email.");
        return;
    }

    const phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phonePattern.test(number)) {
        alert("Please enter a valid phone number.");
        return;
    }

    if (messageText.value == "") {
        alert("Please write your inquiry.");
        return;
    }

    alert(`Thank you ${name}, we will contact you soon!`);
}

function main() {
    loadWeather();
    resetUI();

    document.getElementById("submit").addEventListener("click", (event) => {
        event.preventDefault();
        calculateBooking();
    });

    document.getElementById("reset").addEventListener("click", () => {
        resetUI();
    });
}

main();