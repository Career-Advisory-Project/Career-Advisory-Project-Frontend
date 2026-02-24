import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import SearchInput from "../../components/common/SearchInput";
import CurriculumCard from "../../components/curriculum/CurriculumCard";
import { getCurriculums } from "../../services/curriculum.service";
import type { Curriculum } from "../../types/curriculum";

const CurriculumPage = () => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCurriculums();
      setCurriculums(data);
    };
    fetchData();
  }, []);

  const filteredCurriculums = curriculums.filter((c) =>
    c.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      {/* CONTENT */}
      <div className="flex-1 flex justify-center px-6 py-8">
        <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-sm p-8">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#5b4085] font-bold text-2xl">
              Curriculum List
            </h2>
            <button className="bg-[#5b4085] text-white px-20 py-2.5 rounded-lg hover:bg-[#4a3370] transition">
              Fetch Curriculum
            </button>
          </div>

          {/* Inner List Container */}
          <div className="border border-gray-200 rounded-lg p-4 min-h-[400px]">
            <SearchInput
              placeholder="search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            <div className="space-y-3">
              {filteredCurriculums.map((curriculum, index) => (
                <CurriculumCard
                  key={index}
                  curriculum={curriculum}
                  onClick={() =>
                    navigate(
                      `/curriculum/${encodeURIComponent(curriculum.program)}/${
                        curriculum.curriculum_year
                      }`
                    )
                  }
                />
              ))}

              {filteredCurriculums.length === 0 && (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  No curriculum found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumPage;
