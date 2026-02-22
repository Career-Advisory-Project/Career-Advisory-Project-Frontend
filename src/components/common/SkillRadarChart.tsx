import React, { useState } from "react";
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

const GRADES_CONFIG = [
  { label: "A", color: "#5b4085" },
  { label: "B+", color: "#5c8df6" },
  { label: "B", color: "#00b8d9" },
  { label: "C+", color: "#82db8a" },
  { label: "C", color: "#f1c40f" },
  { label: "D+", color: "#e67e22" },
  { label: "D", color: "#e74c3c" },
];

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills }) => {
  const [activeGrades, setActiveGrades] = useState<string[]>(["A"]);

  const toggleGrade = (gradeValue: string) => {
    setActiveGrades((prev) =>
      prev.includes(gradeValue)
        ? prev.filter((g) => g !== gradeValue)
        : [...prev, gradeValue]
    );
  };

  // Transform skills into radar chart data
  const rawData = skills.map((skill) => {
    const dataPoint: any = { name: skill.name, fullMark: 5 };
    
    skill.rubrics.forEach((r) => {
      if (r.grade && r.level != null) {
        dataPoint[r.grade] = r.level;
      }
    });

    // Default missing grades to 0
    GRADES_CONFIG.forEach((g) => {
      if (dataPoint[g.label] === undefined) {
        dataPoint[g.label] = 0;
      }
    });

    return dataPoint;
  });

  let i = 0;

  // Pad to at least 3 data points so the radar forms a polygon
  const chartData = [...rawData];
  while (chartData.length < 3) {
    const emptyPoint: any = { name: `__HIDDEN__${i}`, fullMark: 5 };
    GRADES_CONFIG.forEach((g) => {
      emptyPoint[g.label] = 0;
    });
    chartData.push(emptyPoint);
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
            {GRADES_CONFIG.map(
              (g) =>
                activeGrades.includes(g.label) && (
                  <Radar
                    key={g.label}
                    name={g.label}
                    dataKey={g.label}
                    stroke={g.color}
                    fill={g.color}
                    fillOpacity={0.4}
                  />
                )
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Grade Badges */}
      <div className="flex flex-col gap-2 pt-2">
        {GRADES_CONFIG.map((grade) => {
          const isActive = activeGrades.includes(grade.label);
          return (
            <button
              key={grade.label}
              onClick={() => toggleGrade(grade.label)}
              className={`w-12 h-8 flex items-center justify-center rounded-md font-bold text-sm border cursor-pointer transition-colors shadow-sm ${
                isActive
                  ? "text-white border-transparent"
                  : "bg-white text-[#8a6db1] hover:bg-gray-50 hover:border-[#8a6db1] border-white"
              }`}
              style={isActive ? { backgroundColor: grade.color } : {}}
            >
              {grade.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SkillRadarChart;
