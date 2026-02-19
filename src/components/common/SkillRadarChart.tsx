import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { SkillItem } from "../../types/course";

type SkillRadarChartProps = {
  skills: SkillItem[];
};

const GRADES = [
  { label: "A", active: true },
  { label: "B+", active: false },
  { label: "B", active: false },
  { label: "C+", active: false },
  { label: "C", active: false },
  { label: "D+", active: false },
  { label: "D", active: false },
];

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills }) => {
  // Transform skills into radar chart data
  const rawData = skills.map((skill) => ({
    name: skill.name,
    level: skill.rubrics[0]?.level ?? 0,
    fullMark: 5,
  }));

  let i = 0;

  // Pad to at least 3 data points so the radar forms a polygon
  const chartData = [...rawData];
  while (chartData.length < 3) {
    chartData.push({ name: `__HIDDEN__${i}`, level: 0, fullMark: 5 });
    i++;
  }

  return (
    <div className="flex items-start gap-4">
      {/* Radar Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#c4b5d9" />
            <PolarAngleAxis
              dataKey="name"
              tickFormatter={(val) => (val.toString().startsWith("__HIDDEN__") ? "" : val)}
              tick={{ fill: "#4a3370", fontWeight: 700, fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tickCount={6}
              tick={{ fill: "#5b4085", fontSize: 11 }}
            />
            <Radar
              name="Skills"
              dataKey="level"
              stroke="#7a6aa6"
              fill="#b8a9d4"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Badges */}
      <div className="flex flex-col gap-2 pt-2">
        {GRADES.map((grade) => (
          <div
            key={grade.label}
            className={`w-12 h-8 flex items-center justify-center rounded-md font-bold text-sm border ${
              grade.active
                ? "bg-[#5b4085] text-white border-[#5b4085]"
                : "bg-white text-gray-500 border-gray-300"
            }`}
          >
            {grade.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRadarChart;
