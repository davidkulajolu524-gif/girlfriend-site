// ========================================
// GIRLFRIEND SITE - MAIN JAVASCRIPT
// ========================================


// ========================================
// PAGE ELEMENTS
// ========================================

const yesButton = document.querySelector(".yes-btn");
const noButton = document.querySelector(".no-btn");

const continueButton = document.querySelector(".continue-btn");
const confirmButton = document.querySelector(".confirm-btn");


// ========================================
// YES BUTTON
// ========================================

if (yesButton) {
    yesButton.addEventListener("click", () => {
        window.location.href = "yes.html";
    });
}


// ========================================
// UN-CATCHABLE NO BUTTON
// ========================================

if (noButton) {

    const moveNoButton = () => {

        const buttonWidth = noButton.offsetWidth;
        const buttonHeight = noButton.offsetHeight;

        const maxX = window.innerWidth - buttonWidth - 20;
        const maxY = window.innerHeight - buttonHeight - 20;

        const randomX = Math.max(
            20,
            Math.random() * maxX
        );

        const randomY = Math.max(
            20,
            Math.random() * maxY
        );

        noButton.style.position = "fixed";
        noButton.style.left = `${randomX}px`;
        noButton.style.top = `${randomY}px`;
    };


    noButton.addEventListener("mouseenter", moveNoButton);

    noButton.addEventListener("touchstart", (event) => {
        event.preventDefault();
        moveNoButton();
    });

    noButton.addEventListener("click", (event) => {
        event.preventDefault();
        moveNoButton();
    });
}


// ========================================
// CONTINUE TO DATE PAGE
// ========================================

if (continueButton) {
    continueButton.addEventListener("click", () => {
        window.location.href = "date.html";
    });
}


// ========================================
// DATE PAGE
// ========================================

// Location selection
const locationCards = document.querySelectorAll(
    ".location-card, [data-location]"
);

locationCards.forEach((card) => {

    card.addEventListener("click", () => {

        locationCards.forEach((item) => {
            item.classList.remove("selected");
            item.classList.remove("active");
        });

        card.classList.add("selected");
        card.classList.add("active");

        const location =
            card.dataset.location ||
            card.textContent.trim();

        localStorage.setItem("dateLocation", location);
    });
});


// Food selection
const foodCards = document.querySelectorAll(
    ".food-card, [data-food]"
);

foodCards.forEach((card) => {

    card.addEventListener("click", () => {

        foodCards.forEach((item) => {
            item.classList.remove("selected");
            item.classList.remove("active");
        });

        card.classList.add("selected");
        card.classList.add("active");

        const food =
            card.dataset.food ||
            card.textContent.trim();

        localStorage.setItem("dateFood", food);
    });
});


// ========================================
// DATE INPUT
// ========================================

const dateInput =
    document.querySelector("#date") ||
    document.querySelector('input[type="date"]');

if (dateInput) {

    dateInput.addEventListener("change", () => {

        localStorage.setItem(
            "dateDate",
            dateInput.value
        );

    });
}


// ========================================
// TIME INPUT
// ========================================

const timeInput =
    document.querySelector("#time") ||
    document.querySelector('input[type="time"]') ||
    document.querySelector("select.time-select");

if (timeInput) {

    timeInput.addEventListener("change", () => {

        localStorage.setItem(
            "dateTime",
            timeInput.value
        );

    });
}


// ========================================
// GET SELECTED DATE DETAILS
// ========================================

function getDateDetails() {

    let location =
        localStorage.getItem("dateLocation") || "";

    let food =
        localStorage.getItem("dateFood") || "";

    let date =
        localStorage.getItem("dateDate") || "";

    let time =
        localStorage.getItem("dateTime") || "";


    // Try to get current values directly from the page
    // in case localStorage hasn't been updated yet.

    const selectedLocation = document.querySelector(
        ".location-card.selected, .location-card.active, [data-location].selected, [data-location].active"
    );

    if (selectedLocation) {
        location =
            selectedLocation.dataset.location ||
            selectedLocation.textContent.trim();
    }


    const selectedFood = document.querySelector(
        ".food-card.selected, .food-card.active, [data-food].selected, [data-food].active"
    );

    if (selectedFood) {
        food =
            selectedFood.dataset.food ||
            selectedFood.textContent.trim();
    }


    if (dateInput && dateInput.value) {
        date = dateInput.value;
    }


    if (timeInput && timeInput.value) {
        time = timeInput.value;
    }


    return {
        location,
        food,
        date,
        time
    };
}


// ========================================
// SEND DATE NOTIFICATION
// ========================================

async function sendDateNotification(dateDetails) {

    const response = await fetch(
        "https://girlfriend-site.onrender.com/notify",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                location: dateDetails.location,
                food: dateDetails.food,
                date: dateDetails.date,
                time: dateDetails.time
            })
        }
    );


    if (!response.ok) {

        let errorMessage =
            "Something went wrong while sending the notification.";

        try {

            const errorData =
                await response.json();

            if (errorData.detail) {
                errorMessage = errorData.detail;
            }

        } catch (error) {
            // Ignore JSON parsing errors.
        }

        throw new Error(errorMessage);
    }


    return await response.json();
}


// ========================================
// CONFIRM DATE
// ========================================

if (confirmButton) {

    confirmButton.addEventListener("click", async () => {

        const dateDetails = getDateDetails();


        // --------------------------------
        // VALIDATE
        // --------------------------------

        if (!dateDetails.location) {

            alert("Please choose a location ❤️");
            return;

        }


        if (!dateDetails.food) {

            alert("Please choose what you want to eat ❤️");
            return;

        }


        if (!dateDetails.date) {

            alert("Please choose a date ❤️");
            return;

        }


        if (!dateDetails.time) {

            alert("Please choose a time ❤️");
            return;

        }


        // --------------------------------
        // PREVENT DOUBLE CLICK
        // --------------------------------

        confirmButton.disabled = true;

        const originalText =
            confirmButton.textContent;

        confirmButton.textContent =
            "Sending our date... ❤️";


        try {

            // ----------------------------
            // SEND TO RENDER BACKEND
            // ----------------------------

            await sendDateNotification(dateDetails);


            // ----------------------------
            // SAVE DETAILS
            // ----------------------------

            localStorage.setItem(
                "dateLocation",
                dateDetails.location
            );

            localStorage.setItem(
                "dateFood",
                dateDetails.food
            );

            localStorage.setItem(
                "dateDate",
                dateDetails.date
            );

            localStorage.setItem(
                "dateTime",
                dateDetails.time
            );


            // ----------------------------
            // GO TO CONFIRMED PAGE
            // ----------------------------

            window.location.href = "confirmed.html";

        } catch (error) {

            console.error(
                "Notification error:",
                error
            );


            confirmButton.disabled = false;

            confirmButton.textContent =
                originalText;


            alert(
                "I couldn't send the confirmation right now. Please try again ❤️"
            );
        }

    });
}


// ========================================
// CONFIRMED PAGE
// ========================================

const confirmedLocation =
    document.querySelector("#confirmed-location");

const confirmedFood =
    document.querySelector("#confirmed-food");

const confirmedDate =
    document.querySelector("#confirmed-date");

const confirmedTime =
    document.querySelector("#confirmed-time");


if (
    confirmedLocation ||
    confirmedFood ||
    confirmedDate ||
    confirmedTime
) {

    const location =
        localStorage.getItem("dateLocation") || "";

    const food =
        localStorage.getItem("dateFood") || "";

    const date =
        localStorage.getItem("dateDate") || "";

    const time =
        localStorage.getItem("dateTime") || "";


    if (confirmedLocation) {
        confirmedLocation.textContent =
            location;
    }


    if (confirmedFood) {
        confirmedFood.textContent =
            food;
    }


    if (confirmedDate) {

        if (date) {

            const formattedDate =
                new Date(`${date}T00:00:00`)
                    .toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        }
                    );

            confirmedDate.textContent =
                formattedDate;

        } else {

            confirmedDate.textContent =
                "Not selected";

        }
    }


    if (confirmedTime) {

        if (time) {

            let formattedTime = time;

            // Convert 24-hour time to 12-hour format
            if (time.includes(":")) {

                const [hours, minutes] =
                    time.split(":");

                const hourNumber =
                    parseInt(hours, 10);

                const suffix =
                    hourNumber >= 12
                        ? "PM"
                        : "AM";

                const displayHour =
                    hourNumber % 12 || 12;

                formattedTime =
                    `${displayHour}:${minutes} ${suffix}`;
            }

            confirmedTime.textContent =
                formattedTime;

        } else {

            confirmedTime.textContent =
                "Not selected";

        }
    }
}