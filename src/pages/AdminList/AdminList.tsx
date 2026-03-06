import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/layout/Navbar";
import { getAdminlist, addAdmin, deleteUser, getUserlist } from "../../services/userlist.service";
import type { User } from "../../types/Userlist";

type ToastType = "success" | "error" | "warning";

interface Toast {
  message: string;
  type: ToastType;
}

const Adminlist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const [admins, setAdmins] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<Toast | null>(null);

  // Confirm dialog state
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  // Role conflict state
  const [conflictEmails, setConflictEmails] = useState<string[]>([]);
  const [pendingEmails, setPendingEmails] = useState<string[]>([]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAdminlist();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAddAdmins = async () => {
    const emailsToAdd = emailInput
      .split('\n')
      .map(email => email.trim())
      .filter(email => email !== '');

    if (emailsToAdd.length === 0) {
      showToast("Please enter at least one email address.", "warning");
      return;
    }

    try {
      setIsAdding(true);
      // Check if any emails already exist as teachers
      const teachers = await getUserlist();
      const teacherEmails = teachers.map(t => t.cmuitaccount.toLowerCase());
      const conflicts = emailsToAdd.filter(email => teacherEmails.includes(email.toLowerCase()));

      if (conflicts.length > 0) {
        // Show conflict confirmation dialog
        setConflictEmails(conflicts);
        setPendingEmails(emailsToAdd);
        setIsAdding(false);
        return;
      }

      await addAdmin(emailsToAdd);
      showToast("Admins added successfully!", "success");
      setIsModalOpen(false);
      setEmailInput("");
      fetchAdmins();
    } catch (error) {
      console.error("Failed to add admins:", error);
      showToast(error instanceof Error ? error.message : "An unexpected error occurred.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleConfirmRoleSwitch = async () => {
    try {
      setIsAdding(true);
      // First, remove conflicting users from the teacher list
      await deleteUser(conflictEmails);
      // Then add all pending emails as admins
      await addAdmin(pendingEmails);
      showToast("Admins added successfully!", "success");
      setIsModalOpen(false);
      setEmailInput("");
      setConflictEmails([]);
      setPendingEmails([]);
      fetchAdmins();
    } catch (error) {
      console.error("Failed to switch roles:", error);
      showToast(error instanceof Error ? error.message : "Failed to switch roles.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAdmin = async (email: string) => {
    try {
      await deleteUser([email]);
      showToast(`${email} has been removed.`, "success");
      fetchAdmins();
    } catch (error) {
      console.error("Failed to delete admin:", error);
      showToast(error instanceof Error ? error.message : "Failed to delete admin.", "error");
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const searchLower = searchTerm.toLowerCase();
    const fname = admin.fname || "";
    const lname = admin.lname || "";
    const account = admin.cmuitaccount || "";

    const fullName = `${fname} ${lname}`.toLowerCase();
    const email = account.toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Navbar />

      <div className="flex justify-center py-[35px]">
        <div className="bg-white flex flex-col items-center w-full max-w-[1240px] h-[calc(100vh-180px)] rounded-lg px-4 py-6 sm:px-[50px] sm:py-8 shadow-[0px_4px_4px_0px_#00000040]">
          <div className="flex justify-between items-center w-full mb-4">
            <h1 className="text-3xl font-bold text-[#5D4685]">Admin List</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5D4685] flex items-center justify-center w-[200px] h-[50px] text-white px-10 py-2 rounded-md font-bold text-lg hover:bg-[#4a386a] transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-col items-center w-full flex-1 overflow-hidden rounded p-4 gap-4 border border-[#B9B9B9] bg-white">
            <div className="w-full">
              <input
                type="text"
                placeholder="search by name or email"
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
              {isLoading ? (
                <div className="flex justify-center items-center h-full text-gray-500 py-10">
                  Loading admins...
                </div>
              ) : filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-[#EFEFEF] px-4 py-3 rounded-md border border-transparent hover:border-gray-300 transition-all"
                  >
                    <div className="flex-1 text-gray-800 capitalize">
                      {admin.fname ? `${admin.fname} ${admin.lname}` : "(Pending Name)"}
                    </div>
                    <div className="flex-1 text-gray-800">
                      {admin.cmuitaccount}
                    </div>
                    <button
                      onClick={() => setConfirmTarget(admin.cmuitaccount)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Remove Admin"
                    >
                      <MinusCircleIcon />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500 py-10">
                  No admins found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD ADMIN MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backgroundColor: '#3F3F3F80' }}>
          <div className="w-full max-w-[1034px] mx-4 rounded-lg bg-white p-6 sm:p-10 flex flex-col relative">
            <h2 className="w-full text-[#5E4481] text-xl sm:text-2xl font-bold flex items-center mb-2.5">
              Add Admin
            </h2>

            <textarea
              className="w-full p-4 resize-none outline-none border-none placeholder-[#8C8989]"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={isAdding}
              placeholder={`add list of cmu mail to add to admin list, each line at most 1 cmu mail\ni.e.\nname_sur1@cmu.ac.th\nname_sur2@cmu.ac.th\n.\n.\n.\nname_surN@cmu.ac.th`}
              style={{
                height: '261px',
                borderRadius: '4px',
                background: isAdding ? '#E0E0E0' : '#ECECEC',
                fontSize: '16px',
                fontWeight: '300',
                lineHeight: '100%',
                color: '#000000ff'
              }}
            />

            <div className="flex justify-end gap-5 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isAdding}
                className={`flex items-center justify-center text-white transition-opacity w-full sm:w-[200px] h-[46px] bg-[#818181] rounded font-bold text-base ${isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                Cancel
              </button>

              <button
                onClick={handleAddAdmins}
                disabled={isAdding}
                className={`flex items-center justify-center text-white transition-opacity w-full sm:w-[200px] h-[46px] bg-[#5E4481] rounded font-bold text-base ${isAdding ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isAdding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {confirmTarget && (
        <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backgroundColor: '#3F3F3F80' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-[440px] w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Remove Admin</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <span className="font-semibold text-gray-800">{confirmTarget}</span> from the admin list?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmTarget(null)}
                className="px-6 py-2 rounded font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteAdmin(confirmTarget);
                  setConfirmTarget(null);
                }}
                className="px-6 py-2 rounded font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ROLE CONFLICT CONFIRMATION MODAL --- */}
      {conflictEmails.length > 0 && (
        <div className="fixed inset-0 flex justify-center items-center z-50" style={{ backgroundColor: '#3F3F3F80' }}>
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-[520px] w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Role Conflict Detected</h3>
            <p className="text-gray-600 mb-3">
              The following email(s) are currently in the <span className="font-semibold text-[#5D4685]">Teacher</span> list. They must be removed from Teacher before they can be added as Admin:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700 bg-gray-50 rounded p-3 max-h-[150px] overflow-y-auto">
              {conflictEmails.map((email, i) => (
                <li key={i} className="text-sm py-0.5">{email}</li>
              ))}
            </ul>
            <p className="text-gray-600 mb-6 text-sm">
              Do you want to remove them from Teacher and add them as Admin?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setConflictEmails([]); setPendingEmails([]); }}
                className="px-6 py-2 rounded font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRoleSwitch}
                disabled={isAdding}
                className={`px-6 py-2 rounded font-semibold text-white bg-[#5E4481] hover:bg-[#4a386a] transition-colors ${isAdding ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isAdding ? 'Switching...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-[slideIn_0.3s_ease-out]">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const MinusCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default Adminlist;