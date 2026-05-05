# Backend structure

This folder is organized so new developers can quickly understand where each part of the API lives:

- controllers: HTTP handlers and response logic
- middleware: reusable request validation/authentication helpers
- models: shared data and in-memory state
- routes: endpoint registration

The entry point is src/server.js.
