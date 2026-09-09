import { addDays, DEFAULT_TIMEZONE, localDate, startOfWeek } from "@/lib/date";
import type { MealWeekData, Recipe } from "@/types/domain";

export const demoRecipes: Recipe[] = [
  { id: "r-oats", name: "Porridge Skyr & fruits", description: "Petit déjeuner rassasiant", portions: 1, prepMinutes: 8, calories: 410, protein: 30, carbs: 52, fat: 9, instructions: ["Cuire les flocons avec le lait.", "Ajouter le Skyr et les fruits."], ingredients: [{ ingredientId: "i-oats", name: "Flocons d’avoine", quantity: 60, unit: "g" }, { ingredientId: "i-skyr", name: "Skyr", quantity: 150, unit: "g" }] },
  { id: "r-chicken", name: "Poulet, légumes & riz", description: "Poulet citronné et légumes rôtis", portions: 2, prepMinutes: 30, calories: 565, protein: 48, carbs: 58, fat: 14, instructions: ["Cuire le riz.", "Rôtir les légumes 20 minutes.", "Dorer le poulet avec le citron."], ingredients: [{ ingredientId: "i-chicken", name: "Blanc de poulet", quantity: 300, unit: "g" }, { ingredientId: "i-rice", name: "Riz basmati", quantity: 160, unit: "g" }] },
  { id: "r-chili", name: "Chili de dinde", description: "Chili léger riche en protéines", portions: 4, prepMinutes: 40, calories: 520, protein: 44, carbs: 46, fat: 16, instructions: ["Faire revenir la dinde.", "Ajouter tomate et haricots.", "Mijoter 25 minutes."], ingredients: [{ ingredientId: "i-turkey", name: "Dinde hachée", quantity: 500, unit: "g" }, { ingredientId: "i-beans", name: "Haricots rouges", quantity: 400, unit: "g" }] },
  { id: "r-dahl", name: "Dahl de lentilles corail", description: "Dahl crémeux aux épices", portions: 4, prepMinutes: 35, calories: 475, protein: 24, carbs: 68, fat: 11, instructions: ["Faire revenir les épices.", "Ajouter les lentilles et le lait de coco.", "Mijoter 25 minutes."], ingredients: [{ ingredientId: "i-lentils", name: "Lentilles corail", quantity: 320, unit: "g" }] },
  { id: "r-trout", name: "Truite, pommes de terre & haricots", description: "Truite au four et légumes verts", portions: 2, prepMinutes: 35, calories: 540, protein: 42, carbs: 48, fat: 19, instructions: ["Cuire les pommes de terre.", "Enfourner la truite 15 minutes.", "Servir avec les haricots verts."], ingredients: [{ ingredientId: "i-trout", name: "Filets de truite", quantity: 300, unit: "g" }] },
];

export function getDemoMealWeek(requestedStart?: string): MealWeekData {
  const today = localDate(DEFAULT_TIMEZONE);
  const weekStart = requestedStart ?? startOfWeek(today);
  const planned = [
    { id: "m1", date: weekStart, type: "breakfast" as const, recipe: demoRecipes[0] },
    { id: "m2", date: addDays(weekStart, 1), type: "dinner" as const, recipe: demoRecipes[2] },
    { id: "m3", date: addDays(weekStart, 2), type: "lunch" as const, recipe: demoRecipes[2] },
    { id: "m4", date: addDays(weekStart, 2), type: "dinner" as const, recipe: demoRecipes[3] },
    { id: "m5", date: addDays(weekStart, 3), type: "dinner" as const, recipe: demoRecipes[4] },
    { id: "m6", date: addDays(weekStart, 4), type: "dinner" as const, recipe: demoRecipes[1] },
  ];
  return { weekStart, today, timezone: DEFAULT_TIMEZONE, recipes: demoRecipes, ingredients: demoRecipes.flatMap((recipe) => recipe.ingredients).map(({ ingredientId: id, name }) => ({ id, name })), meals: planned.map((meal, index) => ({ ...meal, portions: 1, eaten: index === 0, isLeftover: meal.id === "m3" })) };
}
