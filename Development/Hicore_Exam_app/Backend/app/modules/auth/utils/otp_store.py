# app/modules/auth/utils/otp_store.py

from datetime import datetime, timedelta
from threading import Lock


class OTPStore:
    """Thread-safe OTP storage."""

    _store = {}
    _lock = Lock()

    def store(self, email: str, otp: str, expiry_minutes: int):
        expiry_time = datetime.utcnow() + timedelta(minutes=expiry_minutes)
        with self._lock:
            self._store[email] = (otp, expiry_time)

    def verify(self, email: str, otp: str) -> bool:
        with self._lock:
            entry = self._store.get(email)
            if not entry:
                return False

            stored_otp, expiry = entry
            if stored_otp != otp or datetime.utcnow() > expiry:
                return False

            del self._store[email]
            return True


otp_store = OTPStore()
