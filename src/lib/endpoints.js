import { apiRequest } from "./api.js";

const withId = (path, id) => path.replace(":id", encodeURIComponent(id));

const dayNumber = (day) => {
  if (Number.isInteger(day)) return day;
  const index = ["월", "화", "수", "목", "금", "토", "일"].indexOf(day);
  return index < 0 ? Number(day) : index + 1;
};

function habitCategories(value) {
  if (Array.isArray(value.categories)) return value.categories;
  return value.category ? [value.category] : [];
}

export function toDailyHabitCreateRequest(value) {
  return {
    name: value.name,
    periodType: value.periodType ?? "DAILY",
    categories: habitCategories(value),
    totalRepeat: Number(value.totalRepeat ?? value.verificationCount ?? 1),
  };
}

export function toWeeklyHabitCreateRequest(value) {
  return {
    name: value.name,
    periodType: value.periodType ?? "WEEKLY",
    categories: habitCategories(value),
    dayOfWeek: (value.dayOfWeek ?? value.verificationDays ?? []).map(dayNumber),
  };
}

// Paths and HTTP methods copied from the supplied API endpoint list.
export const authApi = {
  signup: (body) => apiRequest("/signup", { method: "POST", body }),
  login: (body) => apiRequest("/login", { method: "POST", body }),
  logout: (token) => apiRequest("/logout", { method: "POST", token }),
  resign: (token, body) =>
    apiRequest("/resign", { method: "DELETE", token, body }),
  sendPasswordResetEmail: (body) =>
    apiRequest("/password-reset/email", { method: "POST", body }),
  verifyPasswordResetCode: (body) =>
    apiRequest("/password-reset/verify", { method: "POST", body }),
  resetPassword: (body) =>
    apiRequest("/password-reset", { method: "PATCH", body }),
};

export const userApi = {
  getMe: (token) => apiRequest("/user/me", { token }),
  updateMe: (body, token) =>
    apiRequest("/user/me", { method: "PATCH", body, token }),
};

export const habitApi = {
  list: (token) => apiRequest("/habits", { token }),
  createDay: (body, token) =>
    apiRequest("/habits/day", {
      method: "POST",
      body: toDailyHabitCreateRequest(body),
      token,
    }),
  createWeek: (body, token) =>
    apiRequest("/habits/week", {
      method: "POST",
      body: toWeeklyHabitCreateRequest(body),
      token,
    }),
  update: (id, body, token) => {
    const requestBody =
      body.frequency === "일주일" || body.dayOfWeek
        ? toWeeklyHabitCreateRequest(body)
        : toDailyHabitCreateRequest(body);
    return apiRequest(withId("/habits/update/:id", id), {
      method: "PATCH",
      body: requestBody,
      token,
    });
  },
  remove: (id, token) =>
    apiRequest(withId("/habits/:id", id), { method: "DELETE", token }),
  verify: (id, body, token) =>
    apiRequest(withId("/habit/:id", id), { method: "PATCH", body, token }),
};

export const streakApi = {
  ranking: (token) => apiRequest("/streaks/rank", { token }),
  all: (token) => apiRequest("/streaks/allStreak", { token }),
};
