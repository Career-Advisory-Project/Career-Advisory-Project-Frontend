import { useState } from "react";
import Navbar from "../../components/layout/Navbar";

const TeacherList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Mock data
  const initialTeachers = Array(9).fill({
    name: "Firstname Lastname",
    email: "firstname_lastname@cmu.ac.th",
  });

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Navbar />

      <div className="flex justify-center py-[35px]">
        {/* Main Card Container */}
        <div 
          className="bg-white flex flex-col items-center w-full max-w-[1240px] min-h-[400px] rounded-lg px-4 py-6 sm:px-[50px] sm:py-8 shadow-[0px_4px_4px_0px_#00000040]"
        >
          {/* Title & Add Button Row */}
          <div className="flex justify-between items-center w-full mb-4">
            <h1 className="text-3xl font-bold text-[#5D4685]">Teacher List</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5D4685] flex items-center justify-center w-[200px] h-[50px] text-white px-10 py-2 rounded-md font-bold text-lg hover:bg-[#4a386a] transition-colors"
            >
              Add
            </button>
          </div>

          {/* Table Frame */}
          <div 
            className="flex flex-col items-center w-full min-h-[300px] max-h-[666px] rounded p-4 gap-4 border border-[#B9B9B9] bg-white"
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="search here"
                className="w-full bg-[#EFEFEF] border-none rounded-sm px-4 py-2 italic text-gray-500 outline-none focus:ring-1 focus:ring-[#5D4685]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex w-full bg-[#EFEFEF] px-4 py-2 rounded-sm text-sm font-semibold text-gray-700">
              <div className="flex-1">Name</div>
              <div className="flex-1">Mail</div>
              <div className="w-10"></div>
            </div>

            <div className="w-full flex-1 overflow-y-auto space-y-2 pr-1">
              {initialTeachers.map((teacher, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-[#EFEFEF] px-4 py-3 rounded-md border border-transparent hover:border-gray-300 transition-all"
                >
                  <div className="flex-1 text-gray-800">{teacher.name}</div>
                  <div className="flex-1 text-gray-800">{teacher.email}</div>
                  <button className="text-red-400 hover:text-red-600">
                    <MinusCircleIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD TEACHER MODAL --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex justify-center items-center z-50"
          style={{ backgroundColor: '#3F3F3F80' }} // Custom background color
        >
          <div 
            className="w-full max-w-[1034px] mx-4 rounded-lg bg-white p-6 sm:p-10 flex flex-col relative"
          >
            {/* Modal Header */}
            <h2 
              className="w-full text-[#5E4481] text-xl sm:text-2xl font-bold flex items-center mb-2.5"
            >
              Add Teacher
            </h2>

            {/* Textarea Input Area */}
            <textarea
              className="w-full p-4 resize-none outline-none border-none placeholder-[#8C8989]"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={`add list of cmu mail to add to teacher list, each line at most 1 cmu mail\ni.e.\nname_sur1@cmu.ac.th\nname_sur2@cmu.ac.th\n.\n.\n.\nname_surN@cmu.ac.th`}
              style={{
                height: '261px',
                borderRadius: '4px',
                background: '#ECECEC',
                fontSize: '16px',
                fontWeight: '300',
                lineHeight: '100%',
                color: '#8C8989'
              }}
            />

            {/* Button Row */}
            <div className="flex justify-end gap-5 mt-4">
              {/* Cancel Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex items-center justify-center text-white transition-opacity hover:opacity-90 w-full sm:w-[200px] h-[46px] bg-[#818181] rounded font-bold text-base"
              >
                Cancel
              </button>
              
              {/* Add Button */}
              <button 
                onClick={() => {
                  // Logic to add emails goes here
                  setIsModalOpen(false);
                }}
                className="flex items-center justify-center text-white transition-opacity hover:opacity-90 w-full sm:w-[200px] h-[46px] bg-[#5E4481] rounded font-bold text-base"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MinusCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default TeacherList;