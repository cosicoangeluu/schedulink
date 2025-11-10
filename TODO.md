# TODO: Allow Admin Reports Access with Expired Tokens

## Tasks
- [x] Modify backend/reports.js to remove authenticateToken from GET /api/reports route
- [x] Modify backend/reports.js to remove authenticateToken from GET /api/reports/file/:id route
- [ ] Keep authentication for DELETE /api/reports/:id route
- [x] Test that frontend can fetch and view/download files without valid token
