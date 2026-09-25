// ========================================
// YES / NO PAGE
// ========================================

const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");


// ========================================
// YES BUTTON
// ========================================

if (yesButton) {
    yesButton.addEventListener("click", () => {
        window.location.href = "yes.html";
    });
}


// ========================================
// UN-CATCHABLE NO BUTTON 😭
// ========================================

if (noButton) {

    const buttonsArea = document.querySelector(".buttons");

    let lastMove = 0;

    function moveNoButton() {

        if (!buttonsArea) return;

        const now = Date.now();

        if (now - lastMove < 180) return;

        lastMove = now;

        const area = buttonsArea.getBoundingClientRect();

        const buttonWidth = noButton.offsetWidth;
        const buttonHeight = noButton.offsetHeight;

        const extraHorizontal = 140;
        const extraVertical = 90;

        let minX = area.left - extraHorizontal;
        let maxX = area.right + extraHorizontal - buttonWidth;

        let minY = area.top - extraVertical;
        let maxY = area.bottom + extraVertical - buttonHeight;

        const padding = 15;

        minX = Math.max(padding, minX);

        maxX = Math.min(
            window.innerWidth - buttonWidth - padding,
            maxX
        );

        minY = Math.max(padding, minY);

        maxY = Math.min(
            window.innerHeight - buttonHeight - padding,
            maxY
        );

        const x =
            minX +
            Math.random() *
            Math.max(1, maxX - minX);

        const y =
            minY +
            Math.random() *
            Math.max(1, maxY - minY);

        noButton.style.position = "fixed";
        noButton.style.left = `${Math.round(x)}px`;
        noButton.style.top = `${Math.round(y)}px`;
        noButton.style.right = "auto";
        noButton.style.bottom = "auto";
        noButton.style.zIndex = "9999";
    }


    // PC mouse
    document.addEventListener("mousemove", (event) => {

        const rect = noButton.getBoundingClientRect();

        const escapeDistance = 100;

        const close =
            event.clientX >= rect.left - escapeDistance &&
            event.clientX <= rect.right + escapeDistance &&
            event.clientY >= rect.top - escapeDistance &&
            event.clientY <= rect.bottom + escapeDistance;

        if (close) {
            moveNoButton();
        }

    });


    // Mouse enters button
    noButton.addEventListener("mouseenter", () => {
        moveNoButton();
    });


    // Mobile
    noButton.addEventListener(
        "touchstart",
        (event) => {

            event.preventDefault();

            moveNoButton();

        },
        {
            passive: false
        }
    );


    // If somehow clicked
    noButton.addEventListener("click", (event) => {

        event.preventDefault();

        moveNoButton();

    });

}


// ========================================
// YES PAGE
// ========================================

const continueButton =
    document.getElementById("continueButton");

if (continueButton) {

    continueButton.addEventListener("click", () => {

        window.location.href = "date.html";

    });

}


// ========================================
// DATE PLANNER
// ========================================

const choiceCards =
    document.querySelectorAll(".choice-card");

const dateInput =
    document.getElementById("date");

const timeInput =
    document.getElementById("time");

const confirmButton =
    document.getElementById("confirmButton");

const selectionMessage =
    document.getElementById("selectionMessage");


let selectedLocation = "";
let selectedFood = "";


// ========================================
// CHOICE CARDS
// ========================================

if (choiceCards.length > 0) {

    choiceCards.forEach((card) => {

        card.addEventListener("click", () => {

            const type =
                card.dataset.type;

            const value =
                card.dataset.value;


            document
                .querySelectorAll(
                    `.choice-card[data-type="${type}"]`
                )
                .forEach((item) => {

                    item.classList.remove("selected");

                });


            card.classList.add("selected");


            if (type === "location") {
                selectedLocation = value;
            }


            if (type === "food") {
                selectedFood = value;
            }


            updateSelectionMessage();

        });

    });

}


// ========================================
// UPDATE DATE MESSAGE
// ========================================

function updateSelectionMessage() {

    if (!selectionMessage) return;


    if (selectedLocation && selectedFood) {

        selectionMessage.textContent =
            `So we're thinking ${selectedLocation} with ${selectedFood}... ❤️`;

        return;

    }


    if (selectedLocation) {

        selectionMessage.textContent =
            `${selectedLocation} sounds lovely! Now choose something to eat. ❤️`;

        return;

    }


    if (selectedFood) {

        selectionMessage.textContent =
            `${selectedFood} sounds delicious! Now choose somewhere to go. ❤️`;

        return;

    }


    selectionMessage.textContent =
        "Choose your date details above ❤️";

}


// ========================================
// SEND DATE NOTIFICATION
// ========================================

async function sendDateNotification(
    location,
    food,
    date,
    time
) {

    const response = await fetch(
        "http://127.0.0.1:8100/notify",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                location: location,
                food: food,
                date: date,
                time: time
            })
        }
    );


    const result = await response.json();


    if (!response.ok) {

        throw new Error(
            result.detail ||
            "The notification could not be sent."
        );

    }


    return result;

}


// ========================================
// CONFIRM DATE
// ========================================

if (confirmButton) {

    confirmButton.addEventListener("click", async () => {

        const date =
            dateInput.value;

        const time =
            timeInput.value;


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!selectedLocation) {

            alert(
                "You haven't chosen where we're going yet. 🥹❤️"
            );

            return;

        }


        if (!selectedFood) {

            alert(
                "You haven't chosen what we're eating yet. 🍕❤️"
            );

            return;

        }


        if (!date) {

            alert(
                "You haven't chosen a date yet. 📅❤️"
            );

            return;

        }


        if (!time) {

            alert(
                "You haven't chosen a time yet. ⏰❤️"
            );

            return;

        }


        // -------------------------------
        // PREVENT DOUBLE CLICK
        // -------------------------------

        confirmButton.disabled = true;

        const originalText =
            confirmButton.textContent;

        confirmButton.textContent =
            "Sending our date... ❤️";


        try {

            // ---------------------------
            // SEND EMAIL NOTIFICATION
            // ---------------------------

            await sendDateNotification(
                selectedLocation,
                selectedFood,
                date,
                time
            );


            // ---------------------------
            // SAVE DATE DETAILS
            // ---------------------------

            localStorage.setItem(
                "dateLocation",
                selectedLocation
            );

            localStorage.setItem(
                "dateFood",
                selectedFood
            );

            localStorage.setItem(
                "dateDate",
                date
            );

            localStorage.setItem(
                "dateTime",
                time
            );


            // ---------------------------
            // GO TO CONFIRMATION PAGE
            // ---------------------------

            window.location.href =
                "confirmed.html";

        }

        catch (error) {

            console.error(
                "Notification error:",
                error
            );

            alert(
                "Something went wrong while sending the date notification. Please try again. ❤️"
            );

            confirmButton.disabled = false;

            confirmButton.textContent =
                originalText;

        }

    });

}


// ========================================
// CONFIRMED PAGE
// ========================================

const finalLocation =
    document.getElementById("finalLocation");

const finalFood =
    document.getElementById("finalFood");

const finalDate =
    document.getElementById("finalDate");

const finalTime =
    document.getElementById("finalTime");


if (finalLocation) {

    const location =
        localStorage.getItem("dateLocation");

    const food =
        localStorage.getItem("dateFood");

    const date =
        localStorage.getItem("dateDate");

    const time =
        localStorage.getItem("dateTime");


    // Location

    finalLocation.textContent =
        location || "---";


    // Food

    finalFood.textContent =
        food || "---";


    // Date

    if (date) {

        const dateObject =
            new Date(`${date}T00:00:00`);


        finalDate.textContent =
            dateObject.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );

    } else {

        finalDate.textContent =
            "---";

    }


    // Time

    if (time) {

        const [hours, minutes] =
            time.split(":");


        const timeObject =
            new Date();


        timeObject.setHours(
            hours,
            minutes
        );


        finalTime.textContent =
            timeObject.toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

    } else {

        finalTime.textContent =
            "---";

    }

}