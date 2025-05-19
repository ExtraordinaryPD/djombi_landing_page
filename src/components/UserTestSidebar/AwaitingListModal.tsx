import { addToWaitlist, WaitlistFormData } from "@/lib/api/waitlist";
import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

// Add animation keyframes for the toast and modal
const styles = `
@keyframes slideUp {
  from {
    transform: translateY(1rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`;

// Positions options - matching your backend enum values
const positionOptions = [
  "sales",
  "admin",
  "digital",
  "manager",
  "freelancer",
  "intern",
  "finance",
  "others",
];

// Position display names for the UI
const positionDisplayNames: { [key: string]: string } = {
  sales: "Sales",
  admin: "Admin",
  digital: "Digital Marketing",
  manager: "Manager",
  freelancer: "Freelancer",
  intern: "Intern",
  finance: "Finance",
  others: "Others",
};

interface AwaitingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Toast notification type
type ToastType = "success" | "error" | null;
interface ToastMessage {
  type: ToastType;
  message: string;
}

export const AwaitingListModal: React.FC<AwaitingListModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: "",
    fullName: "",
    position: "",
    country: "",
  });

  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [toast, setToast] = useState<ToastMessage>({ type: null, message: "" });

  // React Query mutation
  const waitlistMutation = useMutation({
    mutationFn: (data: WaitlistFormData) => addToWaitlist(data),
    onSuccess: (data, variables, context) => {
      // Make sure to show success modal for 201 Created status
      setSubmitStatus({
        type: "success",
        message: "You have successfully joined the waiting list!",
      });

      // Reset form after successful submission
      setFormData({
        email: "",
        fullName: "",
        position: "",
        country: "",
      });

      // Auto-close success message and modal after 3 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
        onClose();
      }, 3000);
    },
    onError: (error: any) => {
      console.error("Submission error:", error);

      // Handle specific error responses from the API
      const errorMessage = error.response?.data?.message || "Submission failed. Please try again.";
      
      // Check if it's an email already exists error
      if (errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("exist")) {
        setSubmitStatus({
          type: "error",
          message: "This email is already on our waiting list.",
        });
      } else {
        // Display other errors as toast notifications
        setToast({
          type: "error",
          message: errorMessage,
        });
      }
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });
    setToast({ type: null, message: "" });

    try {
      // Submit form data to the API
      waitlistMutation.mutate(formData);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const closeStatusModal = () => {
    setSubmitStatus({ type: null, message: "" });
  };

  const closeToast = () => {
    setToast({ type: null, message: "" });
  };

  // Debug successful submission
  useEffect(() => {
    if (waitlistMutation.isSuccess) {
      console.log("Mutation successful, setting status modal");
    }
  }, [waitlistMutation.isSuccess]);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => {
        closeToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.type]);

  if (!isOpen) return null;

  return (
    <>
      {/* Add the styles to the document */}
      <style>{styles}</style>
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Join Awaiting List
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <select
                id="position"
                name="position"
                required
                value={formData.position}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Position</option>
                {positionOptions.map((position) => (
                  <option key={position} value={position}>
                    {positionDisplayNames[position]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={waitlistMutation.isPending}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {waitlistMutation.isPending
                  ? "Submitting..."
                  : "Join Awaiting List"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Status Modal for Success or Email Already Exists */}
      {submitStatus.type && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className={`
            bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 relative animate-fade-in
            ${
              submitStatus.type === "success"
                ? "border-4 border-green-500"
                : "border-4 border-red-500"
            }
          `}
          >
            <button
              onClick={closeStatusModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <div className="text-center">
              <h3
                className={`
                text-2xl font-bold mb-4
                ${
                  submitStatus.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }
              `}
              >
                {submitStatus.type === "success" ? "Success!" : "Error"}
              </h3>
              <p
                className={`
                text-lg mb-6
                ${
                  submitStatus.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }
              `}
              >
                {submitStatus.message}
              </p>
              <button
                onClick={closeStatusModal}
                className={`
                  px-6 py-2 rounded-md
                  ${
                    submitStatus.type === "success"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }
                `}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for other errors */}
      {toast.type && (
        <div className="fixed bottom-4 right-4 z-70 max-w-md">
          <div
            className={`
              rounded-lg shadow-lg p-4 flex items-start space-x-3 animate-slide-up
              ${toast.type === "success" ? "bg-green-100" : "bg-red-100"}
            `}
          >
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={closeToast}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};















































// import { addToWaitlist, WaitlistFormData } from "@/lib/api/waitlist";
// import { useMutation } from "@tanstack/react-query";
// import React, { useState, useEffect } from "react";

// // Positions options - matching your backend enum values
// const positionOptions = [
//   "sales",
//   "admin",
//   "digital",
//   "manager",
//   "freelancer",
//   "intern",
//   "finance",
//   "others",
// ];

// // Position display names for the UI
// const positionDisplayNames: { [key: string]: string } = {
//   sales: "Sales",
//   admin: "Admin",
//   digital: "Digital Marketing",
//   manager: "Manager",
//   freelancer: "Freelancer",
//   intern: "Intern",
//   finance: "Finance",
//   others: "Others",
// };

// interface AwaitingListModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// // Toast notification type
// type ToastType = "success" | "error" | null;
// interface ToastMessage {
//   type: ToastType;
//   message: string;
// }

// export const AwaitingListModal: React.FC<AwaitingListModalProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const [formData, setFormData] = useState<WaitlistFormData>({
//     email: "",
//     fullName: "",
//     position: "",
//     country: "",
//   });

//   const [submitStatus, setSubmitStatus] = useState<{
//     type: "success" | "error" | null;
//     message: string;
//   }>({ type: null, message: "" });

//   const [toast, setToast] = useState<ToastMessage>({ type: null, message: "" });

//   // React Query mutation
//   const waitlistMutation = useMutation({
//     mutationFn: (data: WaitlistFormData) => addToWaitlist(data),
//     onSuccess: (data) => {
//       setSubmitStatus({
//         type: "success",
//         message: "You have successfully joined the waiting list!",
//       });

//       // Reset form after successful submission
//       setFormData({
//         email: "",
//         fullName: "",
//         position: "",
//         country: "",
//       });

//       // Auto-close success message and modal after 3 seconds
//       setTimeout(() => {
//         setSubmitStatus({ type: null, message: "" });
//         onClose();
//       }, 3000);
//     },
//     onError: (error: any) => {
//       console.error("Submission error:", error);

//       // Handle specific error responses from the API
//       const errorMessage = error.response?.data?.message || "Submission failed. Please try again.";
      
//       // Check if it's an email already exists error
//       if (errorMessage.toLowerCase().includes("email") && errorMessage.toLowerCase().includes("exist")) {
//         setSubmitStatus({
//           type: "error",
//           message: "This email is already on our waiting list.",
//         });
//       } else {
//         // Display other errors as toast notifications
//         setToast({
//           type: "error",
//           message: errorMessage,
//         });
        
//         setSubmitStatus({ type: null, message: "" });
//       }
//     },
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitStatus({ type: null, message: "" });
//     setToast({ type: null, message: "" });

//     // Submit form data to the API
//     waitlistMutation.mutate(formData);
//   };

//   const closeStatusModal = () => {
//     setSubmitStatus({ type: null, message: "" });
//   };

//   const closeToast = () => {
//     setToast({ type: null, message: "" });
//   };

//   // Auto-dismiss toast after 5 seconds
//   useEffect(() => {
//     if (toast.type) {
//       const timer = setTimeout(() => {
//         closeToast();
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast.type]);

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//           >
//             ✕
//           </button>
//           <h2 className="text-2xl font-bold mb-4 text-center">
//             Join Awaiting List
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="fullName"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 required
//                 value={formData.fullName}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="position"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Position
//               </label>
//               <select
//                 id="position"
//                 name="position"
//                 required
//                 value={formData.position}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="">Select Position</option>
//                 {positionOptions.map((position) => (
//                   <option key={position} value={position}>
//                     {positionDisplayNames[position]}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label
//                 htmlFor="country"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Country
//               </label>
//               <input
//                 type="text"
//                 id="country"
//                 name="country"
//                 required
//                 value={formData.country}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 disabled={waitlistMutation.isPending}
//                 className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {waitlistMutation.isPending
//                   ? "Submitting..."
//                   : "Join Awaiting List"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Status Modal for Success or Email Already Exists */}
//       {submitStatus.type && (
//         <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
//           <div
//             className={`
//             bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 relative
//             ${
//               submitStatus.type === "success"
//                 ? "border-4 border-green-500"
//                 : "border-4 border-red-500"
//             }
//           `}
//           >
//             <button
//               onClick={closeStatusModal}
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//             >
//               ✕
//             </button>
//             <div className="text-center">
//               <h3
//                 className={`
//                 text-2xl font-bold mb-4
//                 ${
//                   submitStatus.type === "success"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }
//               `}
//               >
//                 {submitStatus.type === "success" ? "Success!" : "Error"}
//               </h3>
//               <p
//                 className={`
//                 text-lg mb-6
//                 ${
//                   submitStatus.type === "success"
//                     ? "text-green-800"
//                     : "text-red-800"
//                 }
//               `}
//               >
//                 {submitStatus.message}
//               </p>
//               <button
//                 onClick={closeStatusModal}
//                 className={`
//                   px-6 py-2 rounded-md
//                   ${
//                     submitStatus.type === "success"
//                       ? "bg-green-600 hover:bg-green-700 text-white"
//                       : "bg-red-600 hover:bg-red-700 text-white"
//                   }
//                 `}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast Notification for other errors */}
//       {toast.type && (
//         <div className="fixed bottom-4 right-4 z-70 max-w-md">
//           <div
//             className={`
//               rounded-lg shadow-lg p-4 flex items-start space-x-3 animate-slide-up
//               ${toast.type === "success" ? "bg-green-100" : "bg-red-100"}
//             `}
//           >
//             <div className="flex-shrink-0">
//               {toast.type === "success" ? (
//                 <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               ) : (
//                 <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               )}
//             </div>
//             <div className="flex-1">
//               <p className={`text-sm font-medium ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>
//                 {toast.message}
//               </p>
//             </div>
//             <button
//               onClick={closeToast}
//               className="flex-shrink-0 text-gray-500 hover:text-gray-700"
//             >
//               <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };





































// import { addToWaitlist, WaitlistFormData } from "@/lib/api/waitlist";
// import { useMutation } from "@tanstack/react-query";
// import React, { useState } from "react";

// // Positions options - matching your backend enum values
// const positionOptions = [
//   "sales",
//   "admin",
//   "digital",
//   "manager",
//   "freelancer",
//   "intern",
//   "finance",
//   "others",
// ];

// // Position display names for the UI
// const positionDisplayNames: { [key: string]: string } = {
//   sales: "Sales",
//   admin: "Admin",
//   digital: "Digital Marketing",
//   manager: "Manager",
//   freelancer: "Freelancer",
//   intern: "Intern",
//   finance: "Finance",
//   others: "Others",
// };

// interface AwaitingListModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const AwaitingListModal: React.FC<AwaitingListModalProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const [formData, setFormData] = useState<WaitlistFormData>({
//     email: "",
//     fullName: "",
//     position: "",
//     country: "",
//   });

//   const [submitStatus, setSubmitStatus] = useState<{
//     type: "success" | "error" | null;
//     message: string;
//   }>({ type: null, message: "" });

//   // React Query mutation
//   const waitlistMutation = useMutation({
//     mutationFn: (data: WaitlistFormData) => addToWaitlist(data),
//     onSuccess: (data) => {
//       setSubmitStatus({
//         type: "success",
//         message: data.message || "Successfully added to awaiting list!",
//       });

//       // Reset form after successful submission
//       setFormData({
//         email: "",
//         fullName: "",
//         position: "",
//         country: "",
//       });

//       // Auto-close success message and modal after 3 seconds
//       setTimeout(() => {
//         setSubmitStatus({ type: null, message: "" });
//         onClose();
//       }, 3000);
//     },
//     onError: (error: any) => {
//       console.error("Submission error:", error);

//       // Handle specific error responses from the API
//       const errorMessage =
//         error.response?.data?.message || "Submission failed. Please try again.";

//       setSubmitStatus({
//         type: "error",
//         message: errorMessage,
//       });
//     },
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitStatus({ type: null, message: "" });

//     // Submit form data to the API
//     waitlistMutation.mutate(formData);
//   };

//   const closeStatusModal = () => {
//     setSubmitStatus({ type: null, message: "" });
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//           >
//             ✕
//           </button>
//           <h2 className="text-2xl font-bold mb-4 text-center">
//             Join Awaiting List
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="fullName"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 required
//                 value={formData.fullName}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="position"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Position
//               </label>
//               <select
//                 id="position"
//                 name="position"
//                 required
//                 value={formData.position}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="">Select Position</option>
//                 {positionOptions.map((position) => (
//                   <option key={position} value={position}>
//                     {positionDisplayNames[position]}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label
//                 htmlFor="country"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Country
//               </label>
//               <input
//                 type="text"
//                 id="country"
//                 name="country"
//                 required
//                 value={formData.country}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div>
//               <button
//                 type="submit"
//                 disabled={waitlistMutation.isPending}
//                 className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {waitlistMutation.isPending
//                   ? "Submitting..."
//                   : "Join Awaiting List"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Status Modal */}
//       {submitStatus.type && (
//         <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
//           <div
//             className={`
//             bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 relative
//             ${
//               submitStatus.type === "success"
//                 ? "border-4 border-green-500"
//                 : "border-4 border-red-500"
//             }
//           `}
//           >
//             <button
//               onClick={closeStatusModal}
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//             >
//               ✕
//             </button>
//             <div className="text-center">
//               <h3
//                 className={`
//                 text-2xl font-bold mb-4
//                 ${
//                   submitStatus.type === "success"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }
//               `}
//               >
//                 {submitStatus.type === "success" ? "Success!" : "Error"}
//               </h3>
//               <p
//                 className={`
//                 text-lg mb-6
//                 ${
//                   submitStatus.type === "success"
//                     ? "text-green-800"
//                     : "text-red-800"
//                 }
//               `}
//               >
//                 {submitStatus.message}
//               </p>
//               <button
//                 onClick={closeStatusModal}
//                 className={`
//                   px-6 py-2 rounded-md
//                   ${
//                     submitStatus.type === "success"
//                       ? "bg-green-600 hover:bg-green-700 text-white"
//                       : "bg-red-600 hover:bg-red-700 text-white"
//                   }
//                 `}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
