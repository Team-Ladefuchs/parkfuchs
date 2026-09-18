# Parkfuchs moderation UI

## Goal

Add a staff-only moderation area at `/admin` for reviewing incoming city data.
The public site remains the end-user frontend. Staff use the new area to manage
submissions and corrections without using PocketBase's generic collection editor
for everyday work.

The first release will:

- Approve new cities after a staff member reviews and edits them.
- Compare correction reports with the published city.
- Merge corrections field by field into the published city.
- Reject tickets with an optional internal reason.
- Keep resolved tickets available as history.
- Show related pending tickets for the same city.
- Work on desktop and mobile.

Generic PocketBase collection administration remains in PocketBase's built-in
dashboard.

## Feasibility

This fits the existing TanStack Start and PocketBase application. The current
code already stores new submissions and corrections in `cityInbox`, and a
correction points to its published record through `currentCity`.

The current application does not yet provide the foundations needed for a safe
moderation UI:

- There is no application login or authorization guard.
- The PocketBase client is process-global and must not hold one staff member's
  authentication state for all requests.
- Public PocketBase rules expose more of `cityInbox` than they should.
- Approval, rejection, and correction merging have no defined lifecycle.
- PocketBase schema changes are not version controlled.
- A correction currently has no atomic merge operation or stale-data check.

The authentication, schema, rules, and mutation paths must be built before the
admin UI is exposed.

## Decisions

| Area | Decision |
| --- | --- |
| Location | Existing application under `/admin` |
| Accounts | Existing PocketBase `_superusers` |
| Registration | No registration or invitation UI |
| Session | Secure HttpOnly cookie, valid for seven days |
| Language | German |
| Default queue | Pending tickets, newest first |
| New city review | Staff can edit before approval |
| Correction review | Field-by-field merge into the existing published record |
| Rejection | Optional internal reason |
| History | Keep approved, merged, and rejected tickets indefinitely |
| Audit | Reviewer, timestamp, outcome, and optional reason |
| Conflicts | Reject stale moderation actions |
| Duplicate submissions | Show related tickets for the same city |
| Realtime | Out of scope for the first release |
| Deployment | NixOS services behind Caddy |
| PocketBase dashboard | Exposed through Caddy and protected by PocketBase login |

## Routes

| Route | Purpose |
| --- | --- |
| `/admin/login` | Existing superuser login |
| `/admin` | Moderation inbox |
| `/admin/tickets/$ticketId` | Ticket review |
| `/admin/history` | Resolved-ticket history and filters |

The admin routes need their own layout. The current root layout always renders
the public navigation and public content spacing, so the admin area should not
reuse that shell unchanged.

Unauthenticated requests should redirect to `/admin/login`. Every admin server
function must also check authentication. A route guard alone is not an access
control mechanism.

## Authentication

Use the existing PocketBase superuser collection:

```ts
pb.collection("_superusers").authWithPassword(email, password)
```

The browser must never receive a PocketBase superuser token. The login flow is:

1. `/admin/login` sends credentials to a server function.
2. The server authenticates against PocketBase using a request-scoped client.
3. The server stores the PocketBase token in a secure HttpOnly cookie.
4. The cookie uses `Secure`, `SameSite=Lax`, and a seven-day maximum age.
5. Each admin request creates a new PocketBase client and restores the cookie.
6. Each admin operation verifies that the authenticated record is a
   `_superusers` record.
7. Logout clears the cookie and the PocketBase auth store.

There will be no registration, password reset, or password-change UI. Staff
accounts remain managed through PocketBase.

The public, unauthenticated PocketBase client must remain separate from the
request-scoped authenticated client. Authenticating the singleton in
`src/db/city.server.ts` would let one request affect another request.

All state-changing server functions should validate the request origin or use
an equivalent CSRF check. Login failures should not reveal whether an email
exists.

Version checks for optimistic concurrency compare the record timestamp before
writing, but the PocketBase SDK offers no conditional update, so the
check-then-write sequence is not atomic. With few moderators working at once
this race is acceptable; the conflict error from a stale version remains
advisory, not a guarantee.

## Ticket model

`cityInbox` will continue to contain both published records and submitted
candidates. Add these fields through a committed PocketBase migration:

| Field | Type | Purpose |
| --- | --- | --- |
| `moderationStatus` | Select | `pending`, `approved`, `merged`, or `rejected` |
| `reviewedAt` | Date | Resolution time |
| `reviewedBy` | Text | Reviewer identity snapshot |
| `reviewNote` | Text | Optional internal note or rejection reason |

The current `approved` field remains for compatibility with the public API.
Moderation operations must enforce these values:

| `moderationStatus` | `approved` |
| --- | --- |
| `pending` | `false` |
| `approved` | `true` |
| `merged` | `false` |
| `rejected` | `false` |

Existing `notes` and the new moderation fields are internal. They must not be
returned by public API queries.

The meaning of `currentCity` stays as follows:

- Empty `currentCity`: new-city submission.
- Set `currentCity`: correction of an existing published record.

## Existing data migration

The migration must preserve the current records:

- Existing `approved = true` records become `moderationStatus = approved`.
- Existing `approved = false` records become `moderationStatus = pending`.
- The current pending records remain available for review.
- `currentCity` identifies whether each pending record is a new city or a
  correction.
- Existing moderator notes remain intact.
- Known duplicate approved records are flagged for manual cleanup, not silently
  removed.

The `InboxNew` view can be retired after the custom inbox is verified.

Migrations and PocketBase hooks belong in tracked `pb_migrations/` and
`pb_hooks/` directories. The ignored local database must not become the schema
source for production.

## Moderation operations

### Approve a new city

1. Load the pending ticket.
2. Let the staff member edit the structured city data.
3. Validate and normalize the final values.
4. Confirm that the ticket is still pending and unchanged.
5. Set `approved = true` and `moderationStatus = approved`.
6. Record the reviewer and review time.

### Merge a correction

The review screen compares the submitted record with the published record.
Changed fields include:

- Privilege flags.
- Parking hours.
- Information text.
- Primary website.
- Additional websites.

For each changed field, the published value is selected by default. Staff can
explicitly choose `Änderung übernehmen` for the submitted value or
`Bestand behalten` for the published value. Unreviewed fields remain on the
published value when a partial review is merged. The screen shows the
resulting city in a final `Feinschliff` editor before the merge is submitted.

The merge then:

1. Checks that the ticket is still pending.
2. Checks that the published record still has the version shown to the staff
   member.
3. Updates the selected fields on the existing published record.
4. Marks the correction ticket as `merged`.
5. Records reviewer, review time, and optional note.

The city relation cannot be changed by a correction merge.

### Reject a ticket

1. Confirm that the ticket is still pending.
2. Set `moderationStatus = rejected`.
3. Keep `approved = false`.
4. Record reviewer, review time, and optional reason.

Resolved tickets are read-only in the custom UI.

## Atomicity and conflicts

A correction merge updates both a published city and its ticket. Two unrelated
PocketBase REST calls are not sufficient because the first update could succeed
while the second fails.

Implement the merge as a PocketBase hook endpoint that:

- Requires an authenticated superuser.
- Starts a database transaction.
- Checks the ticket and published-record versions inside the transaction.
- Applies the selected published-record update.
- Resolves the ticket.
- Rolls back both changes if any operation fails.

If another moderator changed either record first, return a conflict response.
The UI should ask the current moderator to reload rather than silently applying
stale data.

## Inbox UI

The default inbox shows pending tickets, newest first. Each item displays:

- City name and state.
- New city or correction.
- Submission age.
- Number of changed fields.
- Number of related pending tickets.
- Current status.
- Reviewer and resolution time when history is shown.

Filters:

- Search by city or postcode.
- Status.
- New city versus correction.
- Newest or oldest first.

Use pagination. The first release uses manual refresh. It does not include
PocketBase realtime or background polling.

## Review UI

On desktop, use a queue/detail layout where the available width allows it. On
mobile, use separate list and detail views.

Correction review includes:

- Current and proposed values.
- Highlighted differences.
- Per-field current/proposed controls.
- Final-value preview.
- Related submissions for the same city.
- Merge and reject actions.
- Confirmation before resolving the ticket.

New-city review includes:

- The editable structured city form.
- Source website fields.
- Approve and reject actions.
- Related pending submissions.

The admin UI should reuse the current green visual language and form controls,
but it needs its own ticket list, status badges, diff view, and confirmation
dialog components.

## Code structure

Suggested files:

```text
src/
  app/
    admin/
      login.tsx
      index.tsx
      tickets/
        $ticketId.tsx
  auth/
    admin.server.ts
  components/
    admin/
      AdminLayout.tsx
      TicketList.tsx
      TicketReview.tsx
      FieldDiff.tsx
  db/
    admin.functions.ts
    admin.server.ts
    admin.types.ts
pb_migrations/
pb_hooks/
```

Responsibilities:

- `auth/admin.server.ts`: cookie loading, login, logout, session refresh, and
  superuser checks.
- `db/admin.server.ts`: request-scoped PocketBase queries and moderation reads.
- `db/admin.functions.ts`: validated and authorized server functions.
- `pb_hooks`: transactional merge endpoint.
- `pb_migrations`: fields, indexes, rules, and existing-data migration.

Validate every server-function input with Zod. Do not copy the current
identity validators from `city.functions.ts`.

## PocketBase rules

Tighten the rules as part of the release:

- Public `cityInbox` list and view return approved records only.
- Public creation can create only unapproved pending submissions.
- Public clients cannot set moderation metadata.
- `cityInbox` update and delete stay superuser-only.
- `cityRepo` list and view can remain public.
- Anonymous `cityRepo` create and delete should be disabled.
- Internal notes and reviewer fields must be hidden from public responses.
- Search filters must escape user input with PocketBase filter helpers rather
  than string interpolation.

The TanStack server action must validate public submissions even when PocketBase
rules also constrain them. Application-side validation is still needed for
normalization and clear error messages.

## Deployment

For the NixOS deployment:

- Bind PocketBase to `127.0.0.1`, not `0.0.0.0`.
- Keep the TanStack application on loopback behind Caddy.
- Package and deploy `pb_migrations` and `pb_hooks`.
- Run migrations before accepting application traffic.
- Pin or record the PocketBase server version.
- Back up the SQLite database before migration.

Caddy can expose the PocketBase dashboard over TLS. PocketBase login remains
the access control chosen for that dashboard. Because the dashboard uses the
PocketBase API, exposing `/_/` also exposes the API host. Strict collection
rules, TLS, and login-rate monitoring are therefore required.

The safer future option is a VPN, IP allowlist, or forward-auth layer in front
of the dashboard.

## Tests

Add automated coverage for:

- Successful and failed login.
- Unauthenticated and expired-session rejection.
- Non-superuser rejection.
- Seven-day cookie behavior and logout.
- Pending queue filters and pagination.
- Existing-data migration.
- New-city approval.
- Field-by-field correction merge.
- Rejection with and without a reason.
- Related-ticket display.
- Stale ticket conflicts.
- Stale published-city conflicts.
- Concurrent resolution attempts.
- Public inability to read pending records or moderation notes.
- Public inability to create an approved record.
- Responsive inbox and review flows.

## Delivery order

1. Pin the PocketBase version and add migration and hook packaging.
2. Add and test the schema migration.
3. Tighten collection rules and public submission validation.
4. Implement request-scoped authentication and secure cookies.
5. Implement transactional moderation operations.
6. Add admin routes and a separate layout.
7. Build the inbox, filters, and ticket details.
8. Build new-city editing and correction merging.
9. Add authorization, conflict, and migration tests.
10. Deploy behind Caddy and migrate a database backup.
11. Verify all existing pending tickets before production rollout.

## Out of scope

- External registration.
- New staff account creation.
- Password recovery.
- Generic collection management.
- Assignment and internal discussion.
- Priority labels.
- Bulk moderation.
- Submitter notifications.
- Email alerts.
- Realtime queue updates.
- Editing arbitrary published cities outside a ticket.
