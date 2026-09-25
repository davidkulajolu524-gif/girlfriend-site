import os

import resend
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ========================================
# LOAD ENVIRONMENT VARIABLES
# ========================================

load_dotenv()


# ========================================
# FASTAPI
# ========================================

app = FastAPI()


# ========================================
# CORS
# ========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================================
# RESEND CONFIGURATION
# ========================================

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
CONTACT_EMAIL = os.getenv("CONTACT_EMAIL")

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


# ========================================
# DATE MODEL
# ========================================

class DateDetails(BaseModel):
    location: str
    food: str
    date: str
    time: str


# ========================================
# HOME
# ========================================

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "Girlfriend site notification backend is running ❤️"
    }


# ========================================
# SEND DATE NOTIFICATION
# ========================================

@app.post("/notify")
def notify(date_details: DateDetails):

    # ------------------------------------
    # CHECK CONFIGURATION
    # ------------------------------------

    if not RESEND_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="RESEND_API_KEY is missing."
        )

    if not CONTACT_EMAIL:
        raise HTTPException(
            status_code=500,
            detail="CONTACT_EMAIL is missing."
        )


    # ------------------------------------
    # CREATE EMAIL
    # ------------------------------------

    email_params = {
        "from": "Girlfriend Site <onboarding@resend.dev>",
        "to": [CONTACT_EMAIL],
        "subject": "❤️ Someone just planned your date!",
        "html": f"""
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">

                <h1>Someone just planned your date! ❤️</h1>

                <p>Here are the details:</p>

                <p>
                    <strong>📍 Place:</strong><br>
                    {date_details.location}
                </p>

                <p>
                    <strong>🍴 Food:</strong><br>
                    {date_details.food}
                </p>

                <p>
                    <strong>📅 Date:</strong><br>
                    {date_details.date}
                </p>

                <p>
                    <strong>⏰ Time:</strong><br>
                    {date_details.time}
                </p>

                <hr>

                <h2>Looks like you have a date! 🥰❤️</h2>

            </div>
        """
    }


    # ------------------------------------
    # SEND EMAIL
    # ------------------------------------

    try:

        print("Sending email through Resend...")

        result = resend.Emails.send(email_params)

        print("Resend response:", result)

        return {
            "success": True,
            "message": "Notification sent successfully ❤️"
        }


    except Exception as error:

        print("RESEND ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )