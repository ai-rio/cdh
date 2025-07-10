# User Story: Admin Email Communication via Resend

**As an** Administrator,
**I want to** send emails directly from a dedicated UI within the admin dashboard,
**So that** I can conduct direct communication with users for support, marketing, or administrative announcements.

---

### Acceptance Criteria (ACs)

1.  **GIVEN** I am logged in as an 'admin' user and am on the dashboard page (`/dashboard`),
    **WHEN** I navigate to the new "Email" tab,
    **THEN** I see a user interface for composing and sending emails.
2.  **GIVEN** I am on the "Email" tab,
    **THEN** the UI contains input fields for "To", "Subject", and a rich text editor for the email "Body".
3.  **GIVEN** I have filled out the email composition form,
    **WHEN** I click the "Send Email" button,
    **THEN** an API request is sent to a secure backend endpoint which uses the Resend service to dispatch the email.
4.  **GIVEN** the email has been sent,
    **THEN** the UI provides clear visual feedback, indicating whether the email was sent successfully or if an error occurred.
5.  **GIVEN** I need to contact a specific user,
    **WHEN** I start typing in the "To" field,
    **THEN** the field should ideally suggest existing users from the Payload CMS database.
6.  **GIVEN** the system's security needs,
    **THEN** the Resend API key must be stored securely as an environment variable on the server and never exposed to the client.

---

### Technical & Implementation Notes

*   **Frontend:**
    *   A new tab will be added to the `Dashboard` component in `src/app/(frontend)/dashboard/page.tsx`.
    *   A new component, `ResendAdminUI.tsx`, will be created to house the email composition form and sending logic.
*   **Backend:**
    *   A new custom endpoint will be created within Payload CMS to handle the email sending logic. This endpoint will be responsible for receiving the request from the admin UI and calling the Resend API.
*   **Service Integration:**
    *   A service file, `src/lib/resend.ts`, will be created to encapsulate all interactions with the Resend API, keeping the integration clean and reusable.
