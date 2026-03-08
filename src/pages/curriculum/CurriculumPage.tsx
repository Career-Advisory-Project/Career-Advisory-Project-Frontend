import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import SearchInput from "../../components/common/SearchInput";
import CurriculumCard from "../../components/curriculum/CurriculumCard";
import { getCurriculums, syncCurriculums } from "../../services/curriculum.service";
import type { Curriculum } from "../../types/curriculum";
import type { CurriculumSyncResponse } from "../../types/curriculum";
import { useAuth } from "../../hooks/useAuth";
import { useAppContext } from "../../context/AppContext";

const CurriculumPage = () => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<CurriculumSyncResponse | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { lang } = useAppContext();

  const fetchData = async () => {
    const data = await getCurriculums();
    setCurriculums(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const result = await syncCurriculums();
      setSyncResult(result);
      // Refresh the curriculum list after sync
      await fetchData();
    } catch (error) {
      setSyncResult({
        ok: false,
        total_synced: 0,
        total_failed: 0,
        synced: [],
        failed: [{ key: "sync", error: String(error) }],
      });
    } finally {
      setSyncing(false);
    }
  };

  const filteredCurriculums = curriculums.filter((c) =>
    c.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col overflow-hidden">
      <Navbar />

      {/* CONTENT */}
      <div className="flex-1 flex justify-center px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
        <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-sm p-6 sm:p-8 flex flex-col overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h2 className="text-[#5b4085] font-bold text-2xl">
              Curriculum List
            </h2>
            {isAdmin && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className={`text-white px-6 sm:px-20 py-2.5 rounded-lg transition ${
                  syncing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#5b4085] hover:bg-[#4a3370]"
                }`}
              >
                {syncing ? "Syncing..." : "Update Curriculum"}
              </button>
            )}
          </div>

          <p className="w-full text-left font-light mb-4">
            {lang === "en" 
              ? "Select a curriculum to view and manage its associated courses and mapped skills." 
              : "เลือกหลักสูตรเพื่อดูและจัดการรายวิชา รวมถึงทักษะที่เชื่อมโยงกับหลักสูตร"}
          </p>

          {/* Inner List Container */}
          <div className="border border-gray-200 rounded-lg p-4 flex-1 overflow-y-auto">
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

      {/* Sync Result Modal */}
      {syncResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-[600px] w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6">
              <h3 className="text-xl font-bold text-[#5b4085]">Sync Result</h3>
              <button
                onClick={() => setSyncResult(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Summary */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {syncResult.total_synced}
                  </div>
                  <div className="text-sm text-green-700">Synced</div>
                </div>
                {/* <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4 text-center"> */}
                  {/* <div className="text-2xl font-bold text-red-600">
                    {syncResult.total_failed}
                  </div> */}
                  {/* <div className="text-sm text-red-700">Failed</div>
                </div> */}
              </div>

              {/* Synced List */}
              {syncResult.synced.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-green-700 mb-2">
                    Synced Successfully
                  </h4>
                  <ul className="space-y-1">
                    {syncResult.synced.map((key) => (
                      <li
                        key={key}
                        className="text-sm bg-green-50 px-3 py-1.5 rounded"
                      >
                        {key}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Failed List */}
              {/* {syncResult.failed.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">
                    Failed
                  </h4>
                  <ul className="space-y-1">
                    {syncResult.failed.map((item) => (
                      <li
                        key={item.key}
                        className="text-sm bg-red-50 px-3 py-1.5 rounded"
                      >
                        <span className="font-medium">{item.key}</span>
                        <span className="text-red-500 ml-2 text-xs">
                          — {item.error}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
            </div>

            {/* Modal Footer */}
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setSyncResult(null)}
                className="bg-[#5b4085] text-white px-8 py-2 rounded-lg hover:bg-[#4a3370] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumPage;
