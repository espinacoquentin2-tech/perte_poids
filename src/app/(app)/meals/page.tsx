<<<<<<< ours
import { CalendarDays } from "lucide-react";
import { ComingSoon } from "@/components/app-shell/coming-soon";
export default function MealsPage() { return <ComingSoon title="Repas" icon={CalendarDays} description="Le planning hebdomadaire et les fiches recettes arriveront lors de la prochaine étape." />; }
=======
import { MealPlanner } from "@/features/meals/components/meal-planner";
import { getMealWeek } from "@/features/meals/data";

export default async function MealsPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const { week } = await searchParams;
  const requestedWeek = week && /^\d{4}-\d{2}-\d{2}$/.test(week) ? week : undefined;
  const { data, demo } = await getMealWeek(requestedWeek);
  return <MealPlanner data={data} demo={demo} />;
}
>>>>>>> theirs
