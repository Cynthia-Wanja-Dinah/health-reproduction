# Security Specification: Smart SRH Chat Assistant

## Data Invariants
1. A user can only access their own `UserProfile`.
2. A user can only access `ChatThreads` they created.
3. `ChatMessages` must belong to a thread owned by the user.
4. `Clinics` are public (read-only for users).
5. Timestamps (`createdAt`, `updatedAt`) must be server-validated.
6. IDs must be valid strings.

## The Dirty Dozen (Test Payloads)
1. **Identity Spoofing**: Attempt to read/write a `UserProfile` with a different `userId`.
2. **Thread Hijacking**: Attempt to write a `ChatMessage` to a `threadId` owned by another user.
3. **Massive Payload**: Attempt to inject 1MB of garbage into the `content` of a message.
4. **Invalid ID**: Using special characters or ultra-long IDs.
5. **Timestamp Forge**: Sending a client-side timestamp for `createdAt`.
6. **Role Promotion**: Attempting to set `role: 'admin'` (if it existed) or bypass message role restrictions.
7. **Phantom Field**: Adding `isVerified: true` to a profile.
8. **Clinic Write**: Attempting to create/edit clinic data as a regular user.
9. **Unauthenticated List**: Attempting to list all threads without being signed in.
10. **State Shortcut**: Updating `updatedAt` without changing anything else (or changing immutable fields).
11. **Cross-Thread Access**: Listing messages from a thread the user doesn't own.
12. **Null Auth**: Accessing any protected route with `auth == null`.

## Test Runner (Logic Check)
The tests will verify that `request.auth.uid` is strictly matched against the `userId` field in all sensitive documents.

```typescript
// Example rule checks
match /userProfiles/{userId} {
  allow get, write: if isSignedIn() && userId == request.auth.uid;
}
```
