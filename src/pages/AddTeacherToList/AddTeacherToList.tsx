import { useState } from "react";
import Navbar from "../../components/layout/Navbar";

const AddTeacherToList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data
  const initialTeachers = Array(9).fill({
    name: "Firstname Lastname",
    email: "firstname_lastname@cmu.ac.th",
  });
// State to track if each button is active (purple) or inactive (gray)
  const [isCheckActive, setIsCheckActive] = useState(false);
  const [isUncheckActive, setIsUncheckActive] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex justify-center py-[35px]">
        {/* Main Card Container (1240px) */}
        <div 
          className="bg-white flex flex-col items-center" 
          style={{
            width: '1240px',
            minHeight: '793px',
            borderRadius: '8px',
            padding: '32px 50px',
            boxShadow: '0px 4px 4px 0px #00000040',
          }}
        >
          {/* Title & Add Button Row */}
          <div className="flex justify-between items-center w-[1140px] mb-4">
            <h1 className="text-3xl font-bold text-[#5D4685]">Add Teacher</h1>
            <div className="flex gap-4">
            <button className="bg-[#818181] text-white px-10 py-2 rounded-md font-bold text-lg hover:bg-bg-gray-500 transition-colors">
              Cancel
            </button>
            <button className="bg-[#5D4685] text-white px-10 py-2 rounded-md font-bold text-lg hover:bg-[#4a386a] transition-colors">
              Confirm
            </button>
            </div>
          </div>

          {/* THE SPECIFIC FRAME (1140px x 666px) */}
          <div 
            className="flex flex-col items-center"
            style={{
              width: '1140px',
              height: '666.527px',
              borderRadius: '4px',
              gap: '16px',
              padding: '16px',
              border: '1px solid #B9B9B9',
              opacity: '1',
              backgroundColor: '#FFFFFF'
            }}
          >
            {/* Search Bar inside the frame */}
            {/* Search Bar and Buttons Row */}
            <div className="flex items-center w-full gap-4">
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="search here"
                className=" w-200  bg-[#EFEFEF] border-none rounded-sm px-4 py-2 italic text-gray-500 outline-none focus:ring-1 focus:ring-[#5D4685]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Action Buttons */}
              <div className="flex gap-2 shrink-0">
                {/* Check All Button */}
                <button
                  onClick={() => setIsCheckActive(!isCheckActive)}
                  className={`flex items-center justify-center w-[80px] h-[40px] rounded-md transition-colors duration-200 ${
                    isCheckActive 
                      ? 'bg-[#5D4685] text-white' 
                      : 'bg-[#EFEFEF] text-[#5D4685] hover:bg-gray-200'
                  }`}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="4"></rect>
                    <polyline points="8 12 11 15 16 9"></polyline>
                  </svg>
                </button>

                {/* Uncheck All Button */}
                <button
                  onClick={() => setIsUncheckActive(!isUncheckActive)}
                  className={`flex items-center justify-center w-[80px] h-[40px] rounded-md transition-colors duration-200 ${
                    isUncheckActive 
                      ? 'bg-[#5D4685] text-white' 
                      : 'bg-[#EFEFEF] text-[#5D4685] hover:bg-gray-200'
                  }`}
                >
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="4"></rect>
                  </svg>
                </button>
              </div>
            </div>
            {/* Table Header inside the frame */}
            <div className="flex w-full bg-[#EFEFEF] px-4 py-2 rounded-sm text-sm font-semibold text-gray-700">
              <div className="flex-1">Name</div>
              <div className="flex-1">Mail</div>
              <div className="w-10"></div>
            </div>

            {/* Teacher List Scrollable Area */}
            <div className="w-full flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
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
          {/* End of Frame */}
          
        </div>
      </div>
    </div>
  );
};

const MinusCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default AddTeacherToList;