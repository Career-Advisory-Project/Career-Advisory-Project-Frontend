import React from "react";

type CourseCardProps = {
  courseNo: string;
  name: string;
  credits?: number;
  isSelected?: boolean;
  onClick?: () => void;
};

const CourseCard: React.FC<CourseCardProps> = ({
  courseNo,
  name,
  credits,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-0 cursor-pointer transition flex justify-between items-stretch overflow-hidden h-[80px]
        ${
          isSelected
            ? "border-[#5b4085] bg-white ring-1 ring-[#5b4085]"
            : "border-gray-300 hover:bg-gray-50 bg-white"
        }`}
    >
      {/* Main Content */}
      <div className="flex-1 p-3 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-[#7a6aa6] font-extrabold uppercase">{courseNo}</span>
          <div className="h-[2px] bg-[#dcdbe6] flex-1 mx-3 rounded-full"></div>
          <span className="text-xs text-[#7a6aa6] font-bold whitespace-nowrap">{credits} Credits</span>
        </div>
        
        <h3 className="font-bold text-sm text-black truncate leading-tight">{name}</h3>
      </div>

      {/* Selection Indicator (Right Side) */}
      <div
        className={`w-12 flex items-center justify-center transition-colors
          ${isSelected ? "bg-[#5b4085]" : "bg-gray-200"}
        `}
      >
        {isSelected && (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
