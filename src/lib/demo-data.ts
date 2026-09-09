import type { TodayData } from "@/types/domain";

export const demoToday: TodayData = {
  profile: { firstName: "Alex", targetWeight: 79.9, stepGoal: 10_000 },
  weight: 86.4,
  weightAverage7d: 86.8,
  steps: 6_420,
  stepGoalReached: false,
  meals: [
    { id: "demo-lunch", type: "lunch", eaten: true, recipe: { name: "Poulet citron & riz", calories: 565, protein: 48 } },
    { id: "demo-dinner", type: "dinner", eaten: false, recipe: { name: "Chili de dinde", calories: 520, protein: 44 } },
  ],
  workout: { id: "demo-workout", name: "Haut du corps", type: "strength", durationMinutes: 45, completed: false },
};
