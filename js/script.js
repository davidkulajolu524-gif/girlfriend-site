// ========================================
// GIRLFRIEND SITE - MAIN JAVASCRIPT
// ========================================


// ========================================
// INDEX PAGE
// ========================================

const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");


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

    function moveNoButton() {

        const buttonWidth = noButton.offsetWidth;
        const buttonHeight = noButton.offsetHeight;

        const maxX = window.innerWidth - buttonWidth - 20;
        const maxY = window.innerHeight - buttonHeight - 20;

        const randomX =
            Math.max(20, Math.random() * maxX);

        const randomY =
            Math.max(20, Math.random() * maxY);

        noButton.style.position = "fixed";
        noButton.style.left = `${randomX}px`;
        noButton.style.top = `${randomY}px`;
    }


    noButton.addEventListener(
        "mouseenter",
        moveNoButton
    );


    noButton.addEventListener(
        "touchstart",
        (event) => {
            event.preventDefault();
            moveNoButton();
        }
    );


    noButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            moveNoButton();
        }
    );
}


// ========================================
// YES PAGE
// ========================================

const continueButton =
    document.querySelector("#continueButton");


if (continueButton) {

    continueButton.addEventListener(
        "click",
        () => {
            window.location.href = "date.html";
        }
    );
}


// ========================================
// DATE PAGE
// ========================================

const choiceCards =
    document.querySelectorAll(".choice-card");

const confirmButton =
    document.querySelector("#confirmButton");

const selectionMessage =
    document.querySelector("#selectionMessage");


// ========================================
// DATE SELECTION
// ========================================

choiceCards.forEach((card) => {

    card.addEventListener("click", () => {

        const type =
            card.dataset.type;

        const value =
            card.dataset.value;


        // -----------------------------
        // LOCATION
        // -----------------------------

        if (type === "location") {

            document
                .querySelectorAll(
                    '.choice-card[data-type="location"]'
                )
                .forEach((item) => {

                    item.classList.remove("selected");
                    item.classList.remove("active");

                });


            card.classList.add("selected");
            card.classList.add("active");


            localStorage.setItem(
                "dateLocation",
                value
            );
        }


        // -----------------------------
        // FOOD
        // -----------------------------

        if (type === "food") {

            document
                .querySelectorAll(
                    '.choice-card[data-type="food"]'
                )
                .forEach((item) => {

                    item.classList.remove("selected");
                    item.classList.remove("active");

                });


            card.classList.add("selected");
            card.classList.add("active");


            localStorage.setItem(
                "dateFood",
                value
            );
        }


        updateSelectionMessage();
    });

});


// ========================================
// DATE INPUT
// ========================================

const dateInput =
    document.querySelector("#date");


if (dateInput) {

    dateInput.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "dateDate",
                dateInput.value
            );

            updateSelectionMessage();
        }
    );
}


// ========================================
// TIME INPUT
// ========================================

const timeInput =
    document.querySelector("#time");


if (timeInput) {

    timeInput.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "dateTime",
                timeInput.value
            );

            updateSelectionMessage();
        }
    );
}


// ========================================
// UPDATE SELECTION MESSAGE
// ========================================

function updateSelectionMessage() {

    if (!selectionMessage) {
        return;
    }


    const location =
        localStorage.getItem("dateLocation") || "";

    const food =
        localStorage.getItem("dateFood") || "";

    const date =
        localStorage.getItem("dateDate") || "";

    const time =
        localStorage.getItem("dateTime") || "";


    if (
        location &&
        food &&
        date &&
        time
    ) {

        selectionMessage.textContent =
            "Everything looks perfect. Ready to make it official? ❤️";

    } else {

        selectionMessage.textContent =
            "Choose your date details above ❤️";
    }
}


// ========================================
// GET DATE DETAILS
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


    // Get currently selected location

    const selectedLocation =
        document.querySelector(
            '.choice-card[data-type="location"].selected'
        );


    if (selectedLocation) {

        location =
            selectedLocation.dataset.value;
    }


    // Get currently selected food

    const selectedFood =
        document.querySelector(
            '.choice-card[data-type="food"].selected'
        );


    if (selectedFood) {

        food =
            selectedFood.dataset.value;
    }


    // Get date directly from input

    if (
        dateInput &&
        dateInput.value
    ) {

        date =
            dateInput.value;
    }


    // Get time directly from input

    if (
        timeInput &&
        timeInput.value
    ) {

        time =
            timeInput.value;
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

async function sendDateNotification(
    dateDetails
) {

    const response =
        await fetch(
            "https://girlfriend-site.onrender.com/notify",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    location:
                        dateDetails.location,

                    food:
                        dateDetails.food,

                    date:
                        dateDetails.date,

                    time:
                        dateDetails.time
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

                errorMessage =
                    errorData.detail;
            }

        } catch (error) {

            console.error(
                "Could not read server response:",
                error
            );
        }


        throw new Error(errorMessage);
    }


    return await response.json();
}


// ========================================
// CONFIRM DATE
// ========================================

if (confirmButton) {

    confirmButton.addEventListener(
        "click",
        async () => {

            const dateDetails =
                getDateDetails();


            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (!dateDetails.location) {

                alert(
                    "Please choose a location ❤️"
                );

                return;
            }


            if (!dateDetails.food) {

                alert(
                    "Please choose what you want to eat ❤️"
                );

                return;
            }


            if (!dateDetails.date) {

                alert(
                    "Please choose a date ❤️"
                );

                return;
            }


            if (!dateDetails.time) {

                alert(
                    "Please choose a time ❤️"
                );

                return;
            }


            // -----------------------------
            // PREVENT DOUBLE CLICK
            // -----------------------------

            confirmButton.disabled = true;


            const originalText =
                confirmButton.textContent;


            confirmButton.textContent =
                "Sending our date... ❤️";


            try {

                // -------------------------
                // SEND EMAIL
                // -------------------------

                await sendDateNotification(
                    dateDetails
                );


                // -------------------------
                // SAVE DETAILS
                // -------------------------

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


                // -------------------------
                // GO TO CONFIRMED PAGE
                // -------------------------

                window.location.href =
                    "confirmed.html";

            } catch (error) {

                console.error(
                    "Notification error:",
                    error
                );


                confirmButton.disabled =
                    false;


                confirmButton.textContent =
                    originalText;


                alert(
                    "I couldn't send the confirmation right now. Please try again ❤️"
                );
            }

        }
    );
}


// ========================================
// CONFIRMED PAGE
// ========================================

const finalLocation =
    document.querySelector("#finalLocation");

const finalFood =
    document.querySelector("#finalFood");

const finalDate =
    document.querySelector("#finalDate");

const finalTime =
    document.querySelector("#finalTime");


if (
    finalLocation ||
    finalFood ||
    finalDate ||
    finalTime
) {

    const location =
        localStorage.getItem(
            "dateLocation"
        ) || "---";


    const food =
        localStorage.getItem(
            "dateFood"
        ) || "---";


    const date =
        localStorage.getItem(
            "dateDate"
        ) || "---";


    const time =
        localStorage.getItem(
            "dateTime"
        ) || "---";


    // -----------------------------
    // LOCATION
    // -----------------------------

    if (finalLocation) {

        finalLocation.textContent =
            location;
    }


    // -----------------------------
    // FOOD
    // -----------------------------

    if (finalFood) {

        finalFood.textContent =
            food;
    }


    // -----------------------------
    // DATE
    // -----------------------------

    if (finalDate) {

        if (date !== "---") {

            const formattedDate =
                new Date(
                    `${date}T00:00:00`
                ).toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );


            finalDate.textContent =
                formattedDate;

        } else {

            finalDate.textContent =
                "---";
        }
    }


    // -----------------------------
    // TIME
    // -----------------------------

    if (finalTime) {

        if (time !== "---") {

            let formattedTime =
                time;


            if (time.includes(":")) {

                const [
                    hours,
                    minutes
                ] = time.split(":");


                const hourNumber =
                    parseInt(
                        hours,
                        10
                    );


                const suffix =
                    hourNumber >= 12
                        ? "PM"
                        : "AM";


                const displayHour =
                    hourNumber % 12 || 12;


                formattedTime =
                    `${displayHour}:${minutes} ${suffix}`;
            }


            finalTime.textContent =
                formattedTime;

        } else {

            finalTime.textContent =
                "---";
        }
    }
}


// ========================================
// LOAD SAVED SELECTIONS
// ========================================

if (choiceCards.length > 0) {

    const savedLocation =
        localStorage.getItem(
            "dateLocation"
        );

    const savedFood =
        localStorage.getItem(
            "dateFood"
        );


    if (savedLocation) {

        const savedLocationCard =
            document.querySelector(
                `.choice-card[data-type="location"][data-value="${savedLocation}"]`
            );


        if (savedLocationCard) {

            savedLocationCard.classList.add(
                "selected"
            );

            savedLocationCard.classList.add(
                "active"
            );
        }
    }


    if (savedFood) {

        const savedFoodCard =
            document.querySelector(
                `.choice-card[data-type="food"][data-value="${savedFood}"]`
            );


        if (savedFoodCard) {

            savedFoodCard.classList.add(
                "selected"
            );

            savedFoodCard.classList.add(
                "active"
            );
        }
    }


    if (dateInput) {

        const savedDate =
            localStorage.getItem(
                "dateDate"
            );


        if (savedDate) {

            dateInput.value =
                savedDate;
        }
    }


    if (timeInput) {

        const savedTime =
            localStorage.getItem(
                "dateTime"
            );


        if (savedTime) {

            timeInput.value =
                savedTime;
        }
    }


    updateSelectionMessage();
}