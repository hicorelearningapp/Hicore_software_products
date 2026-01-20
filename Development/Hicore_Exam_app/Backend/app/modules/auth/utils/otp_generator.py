# app/modules/auth/utils/otp_generator.py

import random

def generate_otp(length: int = 6) -> str:
    """Generate a numeric OTP."""
    return "".join(str(random.randint(0, 9)) for _ in range(length))
