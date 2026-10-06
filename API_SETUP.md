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

Endpoint wrappers based on the exported API list are in `src/lib/endpoints.js`
(`authApi`, `userApi`, `habitApi`, and `streakApi`). They provide the listed
paths and methods; request bodies still need to match the backend's field names.

The helper JSON-encodes request bodies, includes cookies by default, returns JSON
or text responses, and throws `ApiError` when the server returns a non-success
status. If the frontend and backend have different origins, configure the
backend to allow the frontend origin through CORS. Login, signup, habit loading
and mutations, and the ranking screen now call these wrappers. The supplied
export lists paths and HTTP methods, but not request/response schemas, token
placement, or the API base prefix. Current form payloads and response mapping
use common field names; confirm them against the backend contract if requests
return validation errors or the ranking is empty. Week-habit creation and
streak endpoints are marked unconfirmed in the export.
