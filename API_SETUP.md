# Backend API setup

1. Copy `.env.example` to `.env.local` in the project root.
2. Replace `VITE_API_BASE_URL` with your backend origin, for example `http://localhost:8080`.
3. Restart the Vite dev server after changing the environment file.

Use `apiRequest` from `src/lib/api.js` for backend calls:

```js
import { apiRequest } from "./lib/api.js";

const result = await apiRequest("/api/example", {
  method: "POST",
  body: { value: "example" },
});
```

The helper JSON-encodes request bodies, includes cookies by default, returns JSON
or text responses, and throws `ApiError` when the server returns a non-success
status. If the frontend and backend have different origins, configure the
backend to allow the frontend origin through CORS. Connect each screen after
the matching endpoint and its request/response format are known.
