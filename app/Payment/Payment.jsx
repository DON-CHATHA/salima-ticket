// 'use client';

// import { useState } from 'react';
// import axios from 'axios';

// export default function TicketPaymentPage() {
//   const [form, setForm] = useState({
//     mobile: '',
//     operator: '',
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const operators = [
//     { name: 'Airtel Money', ref: 'airtel_malawi' },
//     { name: 'TNM Mpamba', ref: 'tnm_malawi' },
//   ];

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     try {
//       const res = await axios.post('/api/payments/tickets', {
//         amount: 3000, // Example ticket price
//         mobile: form.mobile,
//         mobile_money_operator_ref_id: form.operator,
//         ticketId: '123ABC', // Optional
//       });

//       if (res.data.success) {
//         setMessage('Payment request sent. Please check your phone to approve.');
//       } else {
//         setMessage('Something went wrong. Try again.');
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage('Payment failed. Please check your details.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold text-center mb-4">Buy Ticket - K3000</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Mobile Number */}
//           <div>
//             <label className="block mb-1 font-medium">Mobile Number</label>
//             <input
//               type="tel"
//               name="mobile"
//               value={form.mobile}
//               onChange={handleChange}
//               placeholder="e.g. 0888123456"
//               className="w-full border rounded px-3 py-2 focus:outline-none"
//               required
//             />
//           </div>

//           {/* Operator */}
//           <div>
//             <label className="block mb-1 font-medium">Mobile Money Operator</label>
//             <select
//               name="operator"
//               value={form.operator}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2"
//               required
//             >
//               <option value="" disabled>Select Operator</option>
//               {operators.map((op) => (
//                 <option key={op.ref} value={op.ref}>{op.name}</option>
//               ))}
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//             disabled={isLoading}
//           >
//             {isLoading ? 'Processing...' : 'Pay Now'}
//           </button>
//         </form>

//         {message && (
//           <div className="mt-4 text-center text-sm text-gray-700">
//             {message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
