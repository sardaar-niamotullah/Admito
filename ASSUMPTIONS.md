# Assumptions

The assignment leaves these points open. Each one lists the assumption and the reason.

## Seats and holds

1. **Seat locking**
   - Assumption: a hold runs in one database transaction that locks the class row (`SELECT ... FOR UPDATE`), counts live holds and confirmed seats, and inserts the new hold only if a seat is free.
   - Reason: requests for the same class are processed one at a time, so overbooking is impossible and the order of lock acquisition is the first-come-first-served order. No queue or cache is needed.

2. **Hold period**
   - Assumption: 10 minutes, set by the `HOLD_MINUTES` environment variable.
   - Reason: the assignment says "hold period" without a value. An environment variable changes it without touching the code.

3. **Expiry is derived**
   - Assumption: a hold is live only while its status is `HELD` and `expires_at` is in the future. The database stores `HELD`, `CONFIRMED` and `CANCELLED`. The API reports a `HELD` hold with a past `expires_at` as `EXPIRED`.
   - Reason: the seat is free the moment the hold expires, with no background job that could run late.

4. **One application per student per class**
   - Assumption: a student with a live `HELD` or `CONFIRMED` application in a class gets `409` when applying to it again. After a hold expires or is cancelled, the student can apply again.
   - Reason: one student should not take several seats in the same class.

5. **Confirm and cancel**
   - Assumption: only a live `HELD` application can be confirmed or cancelled, otherwise the API returns `409`. A confirmed admission cannot be cancelled.
   - Reason: confirmed admissions must not lose their seats.

6. **Ownership**
   - Assumption: confirming or cancelling another student's hold returns `404`.
   - Reason: the response does not reveal that the hold exists.

7. **Payment**
   - Assumption: `POST /holds/{holdId}/confirm` is the payment. There is no payment record and no fee amount.
   - Reason: the assignment says to assume the payment succeeds.

## Data and validation

8. **Student ID**
   - Assumption: `X-Student-Id` is required on holds, confirm, cancel and `/me/holds`, and must be exactly 6 digits (for example `123456`). Otherwise the API returns `400`.
   - Reason: we are not using full long birth registration number. A 6-digit number is used for now to make development and manual testing easier. The length is the only rule checked, so it can be changed to official digits later in one place.

9. **Class validation**
   - Assumption: `name` is required and `totalSeats` must be an integer of at least 1, otherwise `400`. Classes cannot be edited or deleted.
   - Reason: the assignment only asks to create and list classes.

10. **Seat counts**
    - Assumption: `heldSeats` counts live holds, `confirmedSeats` counts confirmed ones, and `availableSeats = totalSeats - heldSeats - confirmedSeats`.
    - Reason: expired and cancelled holds must not reduce availability.

11. **IDs and time**
    - Assumption: IDs are UUIDs returned as strings. All times are UTC (ISO 8601).
    - Reason: the contract shows string IDs and `Z` timestamps.

12. **`GET /holds/{holdId}`**
    - Assumption: it needs no `X-Student-Id` header.
    - Reason: the contract lists no header for this endpoint.

## Application

13. **My applications**
    - Assumption: `GET /me/holds` returns the newest first, ordered by `expires_at`, and adds `className` to each item.
    - Reason: the hold period is constant, so this order matches creation order. The class name lets the UI show the list without extra requests.

14. **Admin access**
    - Assumption: no login. The admin and guardian pages are two tabs of one app.
    - Reason: the assignment requires no authentication.

15. **Schema creation**
    - Assumption: EF Core creates the tables at backend startup, with no migrations.
    - Reason: the project has a single fixed schema, and `docker compose up` must work on an empty database.

16. **Backend URL and CORS**
    - Assumption: the browser calls the backend directly, so CORS is enabled. The URL comes from `VITE_API_URL`.
    - Reason: the assignment requires a configurable backend URL in the frontend.
