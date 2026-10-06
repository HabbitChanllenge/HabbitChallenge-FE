import { apiRequest } from "./api.js";

const withId = (path, id) => path.replace(":id", encodeURIComponent(id));

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const koreanWeekDays = [
  "\uC6D4",
  "\uD654",
  "\uC218",
  "\uBAA9",
  "\uAE08",
  "\uD1A0",
  "\uC77C",
];

const dayName = (day) => {
  if (Number.isInteger(day)) return weekDays[day - 1] ?? String(day);
  const value = String(day).trim();
  const koreanIndex = koreanWeekDays.indexOf(value);
  if (koreanIndex >= 0) return weekDays[koreanIndex];
  return value.toLowerCase();
};

function habitCategories(value) {
  if (Array.isArray(value.categories)) return value.categories;
  return value.category ? [value.category] : [];
}

export function toDailyHabitCreateRequest(value) {
  return {
    name: value.name,
    periodType: "day",
    categories: habitCategories(value),
    totalRepeat: Number(value.totalRepeat ?? value.verificationCount ?? 1),
  };
}

export function toWeeklyHabitCreateRequest(value) {
  return {
    name: value.name,
    periodType: "week",
    categories: habitCategories(value),
    dayOfWeek: (value.dayOfWeek ?? value.verificationDays ?? []).map(dayName),
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
    const requestBody = {};
    if (body.name !== undefined) requestBody.name = body.name;
    if (body.category !== undefined || body.categories !== undefined) {
      requestBody.category = Array.isArray(body.category)
        ? body.category
        : Array.isArray(body.categories)
          ? body.categories
          : [body.category];
    }
    const isWeekly = body.dayOfWeek !== undefined || (body.verificationDays?.length ?? 0) > 0 || /week/i.test(body.frequency ?? body.periodType ?? "");
    if (!isWeekly && (body.totalRepeat !== undefined || body.verificationCount !== undefined)) {
      requestBody.totalRepeat = Number(body.totalRepeat ?? body.verificationCount);
    }
    return apiRequest(withId("/habits/update/:id", id), {
      method: "PATCH",
      body: requestBody,
      token,
    });
  },
  remove: (id, token) =>
    apiRequest(withId("/habits/:id", id), { method: "DELETE", token }),
  verify: (id, completedCount, token) =>
    apiRequest(withId("/habit/:id", id), { method: "PATCH", body: { completedCount }, token }),
};

export const streakApi = {
  ranking: (token) => apiRequest("/streaks/rank", { token }),
  all: (token) => apiRequest("/streaks/allStreak", { token }),
};
