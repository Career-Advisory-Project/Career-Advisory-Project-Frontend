import React from "react";

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // Allow external styling overrides if needed
};

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search ...",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#f0f0f5] text-gray-700 text-sm rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#5b4085]"
      />
    </div>
  );
};

export default SearchInput;
