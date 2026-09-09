import { TodayDashboard } from "@/features/today/today-dashboard";
import { getTodayData } from "@/features/today/data";

export default async function TodayPage() {
  const { data, demo } = await getTodayData();
  return <TodayDashboard data={data} demo={demo} />;
}
