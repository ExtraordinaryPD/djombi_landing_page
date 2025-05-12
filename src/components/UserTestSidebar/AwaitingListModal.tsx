import React, { useState } from 'react';

// Positions options
const positionOptions = [
  'Sales', 
  'Admin', 
  'Digital Marketing', 
  'Manager', 
  'Freelancer', 
  'Intern', 
  'Finance', 
  'Others'
];

interface AwaitingListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AwaitingListModal: React.FC<AwaitingListModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    position: '',
    country: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Successfully added to awaiting list!'
        });
        
        // Reset form after successful submission
        setFormData({
          email: '',
          fullName: '',
          position: '',
          country: '',
        });
        
        // Auto-close success message and modal after 3 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
          onClose();
        }, 3000);
      } else {
        // Handle error response
        setSubmitStatus({
          type: 'error',
          message: 'Submission failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeStatusModal = () => {
    setSubmitStatus({ type: null, message: '' });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Join Awaiting List</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
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
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
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
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Join Awaiting List'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Status Modal */}
      {submitStatus.type && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`
            bg-white rounded-lg shadow-xl w-11/12 max-w-md mx-auto p-6 relative
            ${submitStatus.type === 'success' ? 'border-4 border-green-500' : 'border-4 border-red-500'}
          `}>
            <button 
              onClick={closeStatusModal} 
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <div className="text-center">
              <h3 className={`
                text-2xl font-bold mb-4
                ${submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}
              `}>
                {submitStatus.type === 'success' ? 'Success!' : 'Error'}
              </h3>
              <p className={`
                text-lg mb-6
                ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}
              `}>
                {submitStatus.message}
              </p>
              <button
                onClick={closeStatusModal}
                className={`
                  px-6 py-2 rounded-md
                  ${submitStatus.type === 'success' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'}
                `}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};