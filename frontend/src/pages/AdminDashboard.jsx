// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaPaperPlane, FaTimes, FaShippingFast, FaCheckCircle,  FaSpinner } from "react-icons/fa"; // Added FaTimes for the modal close button
import SecurityBadge from "../components/securityBadge";


const OrderDetailsModal = ({ order, onClose, updateOrderStatus, loading }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-500';
            case 'Shipped': return 'text-blue-400';
            case 'Processing': return 'text-yellow-500';
            case 'Cancelled': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    const isDisabled = (targetStatus) => {
        if (loading) return true;
        const currentStatus = order.orderStatus;

        if (targetStatus === 'Delivered') return currentStatus === 'Delivered' || currentStatus === 'Cancelled';
        if (targetStatus === 'Shipped') return currentStatus === 'Delivered' || currentStatus === 'Shipped' || currentStatus === 'Cancelled';
        if (targetStatus === 'Processing') return currentStatus === 'Delivered' || currentStatus === 'Cancelled';
        return false;
    };

    const disabledClass = "bg-gray-500 text-gray-300 cursor-not-allowed";

    // 🟢 UPDATED FIELD ACCESS BASED ON YOUR ORDER MODEL
    const buyer = order.buyer || {};
    const shipping = order.shippingAddress || {};
    const currentStatus = order.orderStatus || 'N/A';

    // 🟢 Build readable address string
    const fullShippingAddress = [
        shipping.streetAddress,
        shipping.city,
        shipping.state,
        shipping.postalCode,
        shipping.country
    ]
    .filter(Boolean)
    .join(', ');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-3xl text-offwhite p-6 relative max-h-[90vh] overflow-y-auto"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-offwhite transition-colors">
                    <FaTimes size={20} />
                </button>
                <h3 className="text-2xl font-playfair text-gold mb-4 border-b border-gray-700 pb-2">
                    Order Details: {order._id?.substring(0, 10)}...
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                    {/* BUYER DETAILS */}
                    <p><strong>Buyer Name:</strong> {buyer.name || 'N/A'}</p>
                    <p><strong>Buyer Email:</strong> <span className="text-lime-400">{buyer.email || 'N/A'}</span></p>

                    <p><strong>Phone Number:</strong> {shipping.contactPhone || 'N/A'}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>

                    <p><strong>Total Price:</strong> ₦{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</p>
                    <p>
                        <strong>Current Status:</strong>{" "}
                        <span className={`font-bold ${getStatusColor(currentStatus)}`}>{currentStatus}</span>
                    </p>

                    {/* SHIPPING ADDRESS */}
                    <div className="sm:col-span-2 bg-[#2a2a2a] p-3 rounded-lg">
                        <FaShippingFast className="inline mr-2 text-platinum" /> 
                        <strong>Shipping Address:</strong>
                        <div className="mt-2 text-gray-300 space-y-1">
                            <p><strong>Street:</strong> {shipping.streetAddress || 'N/A'}</p>
                            <p><strong>City:</strong> {shipping.city || 'N/A'}</p>
                            <p><strong>State:</strong> {shipping.state || 'N/A'}</p>
                            <p><strong>Postal Code:</strong> {shipping.postalCode || 'N/A'}</p>
                            <p><strong>Country:</strong> {shipping.country || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* ORDER ITEMS */}
                <h4 className="text-xl font-semibold text-platinum mb-3 mt-4 border-t border-gray-700 pt-3">Items Ordered:</h4>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-[#2a2a2a]">
                            <tr>
                                <th className="p-2 border border-platinum/20"></th>
                                <th className="p-2 border border-platinum/20 text-left">Product</th>
                                <th className="p-2 border border-platinum/20 text-center">Qty</th>
                                <th className="p-2 border border-platinum/20 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems?.map((item, index) => (
                                <tr key={index} className="odd:bg-[#111] even:bg-[#1a1a1a] hover:bg-[#333]">
                                    <td className="p-2 border border-platinum/20 w-16">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                            onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x300.png?text=No+Image'}
                                        />
                                    </td>
                                    <td className="p-2 border border-platinum/20">{item.name}</td>
                                    <td className="p-2 border border-platinum/20 text-center">{item.qty}</td>
                                    <td className="p-2 border border-platinum/20 text-right">₦{(item.price * item.qty).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* STATUS UPDATE CONTROLS */}
                <h4 className="text-xl font-semibold text-platinum mb-3 mt-4 border-t border-gray-700 pt-3">Update Status:</h4>
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => updateOrderStatus(order._id, "Processing")}
                        disabled={isDisabled("Processing")}
                        className={`${isDisabled("Processing") ? disabledClass : "bg-yellow-500 hover:bg-yellow-600"} flex items-center text-offwhite text-sm px-4 py-2 rounded transition-colors shadow-lg`}
                    >
                        {loading && !isDisabled("Processing") ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
                        Set to Processing
                    </button>

                    <button
                        onClick={() => updateOrderStatus(order._id, "Shipped")}
                        disabled={isDisabled("Shipped")}
                        className={`${isDisabled("Shipped") ? disabledClass : "bg-blue-500 hover:bg-blue-600"} flex items-center text-offwhite text-sm px-4 py-2 rounded transition-colors shadow-lg`}
                    >
                        {loading && !isDisabled("Shipped") ? <FaSpinner className="animate-spin mr-2" /> : <FaShippingFast className="mr-2" />}
                        Set to Shipped
                    </button>

                    <button
                        onClick={() => updateOrderStatus(order._id, "Delivered")}
                        disabled={isDisabled("Delivered")}
                        className={`${isDisabled("Delivered") ? disabledClass : "bg-green-500 hover:bg-green-600"} flex items-center text-offwhite text-sm px-4 py-2 rounded transition-colors shadow-lg`}
                    >
                        {loading && !isDisabled("Delivered") ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
                        Set to Delivered
                    </button>
                </div>

                {loading && <p className="text-center text-sm text-gray-400 mt-2">Updating order status...</p>}
            </motion.div>
        </div>
    );
};


// const OrderDetailsModal = ({ order, onClose, updateOrderStatus, loading }) => {

//     // Helper function to dynamically get the status color
//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'Delivered': return 'text-green-500';
//             case 'Shipped': return 'text-blue-400';
//             case 'Processing': return 'text-yellow-500';
//             case 'Cancelled': return 'text-red-500';
//             default: return 'text-gray-400';
//         }
//     };

//     // Logic to determine if a status button should be disabled
//     const isDisabled = (targetStatus) => {
//         if (loading) return true;
//         const currentStatus = order.orderStatus;
        
//         if (targetStatus === 'Delivered') return currentStatus === 'Delivered' || currentStatus === 'Cancelled';
//         if (targetStatus === 'Shipped') return currentStatus === 'Delivered' || currentStatus === 'Shipped' || currentStatus === 'Cancelled';
//         // 'Processing' can be set if currently 'Shipped', but not if 'Delivered' or 'Cancelled'
//         if (targetStatus === 'Processing') return currentStatus === 'Delivered' || currentStatus === 'Cancelled'; 
//         return false;
//     };

//     const disabledClass = "bg-gray-500 text-gray-300 cursor-not-allowed";

//     // 🟢 EXTRACTED DATA for clean rendering based on your Order Model
//     const shipping = order.shippingAddress || {};
//     const userPhone = order.user?.phoneNumber || "N/A"; // ⬅️ Using user.phoneNumber
//     const customerName = order.user?.name || "N/A";
//     const currentStatus = order.orderStatus || 'N/A';
    
//     const fullShippingAddress = `${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}`;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//             <motion.div
//                 initial={{ opacity: 0, y: -50 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -50 }}
//                 className="bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-3xl text-offwhite p-6 relative max-h-[90vh] overflow-y-auto"
//             >
//                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-offwhite transition-colors">
//                     <FaTimes size={20} />
//                 </button>
//                 <h3 className="text-2xl font-playfair text-gold mb-4 border-b border-gray-700 pb-2">Order Details: {order._id.substring(0, 10)}...</h3>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
//                     {/* CUSTOMER & PHONE */}
//                     <p><strong>Customer Name:</strong> {customerName}</p>
//                     <p><strong>Phone Number:</strong> <span className="text-lime-400">{userPhone}</span></p>

//                     {/* PRICE & STATUS */}
//                     <p>
//                         <strong>Total Price:</strong> ₦{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
//                     </p>
//                     <p>
//                         <strong>Current Status:</strong> <span className={`font-bold ${getStatusColor(currentStatus)}`}>{currentStatus}</span>
//                     </p>

//                     {/* ADDRESS - Spanning two columns */}
//                     <div className="sm:col-span-2 bg-[#2a2a2a] p-3 rounded-lg">
//                         <FaShippingFast className="inline mr-2 text-platinum" /> 
//                         <strong>Shipping Address:</strong> 
//                         <span className="text-gray-300 block mt-1">{fullShippingAddress}</span>
//                     </div>
//                 </div>
                
//                 {/* Order Items Table */}
//                 <h4 className="text-xl font-semibold text-platinum mb-3 mt-4 border-t border-gray-700 pt-3">Items Ordered:</h4>
//                 <div className="overflow-x-auto mb-6">
//                     <table className="w-full text-sm border-collapse">
//                         <thead className="bg-[#2a2a2a]">
//                             <tr>
//                                 <th className="p-2 border border-platinum/20"></th> {/* Image Column */}
//                                 <th className="p-2 border border-platinum/20 text-left">Product</th>
//                                 <th className="p-2 border border-platinum/20 text-center">Qty</th>
//                                 <th className="p-2 border border-platinum/20 text-right">Price</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {order.orderItems.map((item, index) => (
//                                 <tr key={index} className="odd:bg-[#111] even:bg-[#1a1a1a] hover:bg-[#333]">
//                                     {/* 🟢 NEW: Product Image */}
//                                     <td className="p-2 border border-platinum/20 w-16">
//                                         <img 
//                                             src={item.image} 
//                                             alt={item.name} 
//                                             className="w-12 h-12 object-cover rounded-md" 
//                                             onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/300x300.png?text=Image+Error'}
//                                         />
//                                     </td>
//                                     <td className="p-2 border border-platinum/20">{item.name}</td>
//                                     <td className="p-2 border border-platinum/20 text-center">{item.qty}</td>
//                                     <td className="p-2 border border-platinum/20 text-right">₦{(item.price * item.qty).toFixed(2)}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Status Update Controls */}
//                 <h4 className="text-xl font-semibold text-platinum mb-3 mt-4 border-t border-gray-700 pt-3">Update Status:</h4>
//                 <div className="flex flex-wrap justify-center gap-3">
//                     {/* PROCESSING BUTTON */}
//                     <button
//                         onClick={() => updateOrderStatus(order._id, "Processing")}
//                         disabled={isDisabled("Processing")}
//                         className={`${isDisabled("Processing") ? disabledClass : "bg-yellow-500 hover:bg-yellow-600"} flex items-center text-offwhite text-sm px-4 py-2 rounded transition-colors shadow-lg`}
//                     >
//                         {loading && !isDisabled("Processing") ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
//                         Set to Processing
//                     </button>
//                     {/* SHIPPED BUTTON */}
//                     <button
//                         onClick={() => updateOrderStatus(order._id, "Shipped")}
//                         disabled={isDisabled("Shipped")}
//                         className={`${isDisabled("Shipped") ? disabledClass : "bg-blue-500 hover:bg-blue-600"} flex items-center text-offwhite text-sm px-4 py-2 rounded transition-colors shadow-lg`}
//                     >
//                          {loading && !isDisabled("Shipped") ? <FaSpinner className="animate-spin mr-2" /> : <FaShippingFast className="mr-2" />}
//                         Set to Shipped
//                     </button>
//                     {/* DELIVERED BUTTON */}
//                     <button
//                         onClick={() => updateOrderStatus(order._id, "Delivered")}
//                         disabled={isDisabled("Delivered")}
//                         className={`${isDisabled("Delivered") ? disabledClass : "bg-green-500 hover:bg-green-600"} flex items-center text-offwhite text-sm px-4 py-2 rounded transition-colors shadow-lg`}
//                     >
//                          {loading && !isDisabled("Delivered") ? <FaSpinner className="animate-spin mr-2" /> : <FaCheckCircle className="mr-2" />}
//                         Set to Delivered
//                     </button>
//                 </div>
//                 {loading && <p className="text-center text-sm text-gray-400 mt-2">Updating order status...</p>}
//             </motion.div>
//         </div>
//     );
// };

const AdminDashboard = () => {
    // Component State
    const [view, setView] = useState("");
    const [orders, setOrders] = useState([]);
    // 🟢 NEW STATE: For holding the currently viewed single order
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const [productsForm, setProductsForm] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
        countInStock: "",
        flashSale: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    // 🟢 NEW STATE: Tracks if the user's role check is still running
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // NEW STATE FOR EMAIL FORM
    const [emailForm, setEmailForm] = useState({
        title: "",
        subject: "",
        body: "",
        imageFile: null,
    });
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const API_BASE = "https://pindows-elite-backend.onrender.com/api";

    // ---------------------------------------------------------------------
    // ✅ Check admin (MODIFIED useEffect)
    // ---------------------------------------------------------------------
    useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");

        try {
            if (userInfo) {
                const parsed = JSON.parse(userInfo);
                if (parsed.role === "admin") {
                    setIsAdmin(true);
                } else {
                    setMessage("Access Denied: You are not an admin.");
                }
            } else {
                setMessage("Please log in as an admin to access this dashboard.");
            }
        } catch (err) {
            console.error("Error parsing user info:", err);
            setMessage("An error occurred during authentication check.");
        } finally {
            // 🟢 Crucial: Set loading to false once the check is done, regardless of outcome
            setIsAuthLoading(false);
        }
    }, []);

    // ---------------------------------------------------------------------
    // ✅ Fetch all orders
    // ---------------------------------------------------------------------
    const fetchOrders = async () => {
        setLoading(true);
        setMessage("");
        try {
            const token = localStorage.getItem("userToken");
            // NOTE: The backend must be configured to populate the 'user' field with name/phone and the 'orderItems' field.
            const { data } = await axios.get(`${API_BASE}/orders/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("❌ Error fetching orders:", err);
            setMessage(err.response?.data?.message || "Failed to fetch orders.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------------------
    // 🟢 NEW FUNCTION: View single order details
    // ---------------------------------------------------------------------
    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    // ---------------------------------------------------------------------
    // 🟢 NEW FUNCTION: Close Modal
    // ---------------------------------------------------------------------
    const closeOrderDetailsModal = () => {
        setSelectedOrder(null);
    };

    // ---------------------------------------------------------------------
    // ✅ Update order status (MODIFIED to also update selectedOrder if applicable)
    // ---------------------------------------------------------------------
    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem("userToken");
            await axios.put(
                `${API_BASE}/orders/${orderId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setMessage(`✅ Order ${orderId.substring(0, 8)}... updated to "${status}"`);
            
            // Re-fetch orders list to update the table
            fetchOrders(); 

            // If the modal is open for this order, close and then re-open with updated data
            // This requires a second fetch or finding the updated order in the full list, 
            // but for simplicity and to ensure fresh data, re-fetching is safer.
            // A more complex/performant solution would be to update the state directly.
            
            // Simple approach: Close the modal and let the fetchOrders take care of the list update
            setSelectedOrder(null);
            
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to update order status.");
        }
    };

    // --- (Keep all other functions unchanged: handleProductChange, uploadImageToServer, handleAddProduct, handleEmailChange, handleEmailImageChange, handleSendEmail) ---
    // ---------------------------------------------------------------------
    // ✅ Handle product form change (UNMODIFIED)
    // ---------------------------------------------------------------------
    const handleProductChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductsForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ---------------------------------------------------------------------
    // ✅ Upload image via backend (Cloudinary integrated) (UNMODIFIED)
    // ---------------------------------------------------------------------
    const uploadImageToServer = async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("image", file);

        try {
            const token = localStorage.getItem("userToken");
            const { data } = await axios.post(`${API_BASE}/products/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            return data.image; // Cloudinary image URL from backend
        } catch (err) {
            console.error("❌ Upload failed:", err);
            setMessage("Image upload failed. Try again.");
            return null;
        }
    };

    // ---------------------------------------------------------------------
    // ✅ Add product (UNMODIFIED)
    // ---------------------------------------------------------------------
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const imageUrl = await uploadImageToServer(imageFile);
            if (!imageUrl) return;

            const token = localStorage.getItem("userToken");
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const productData = { ...productsForm, image: imageUrl };
            const { data } = await axios.post(`${API_BASE}/products/admin`, productData, config);

            setMessage(`✅ Product "${data.name}" added successfully!`);
            setProductsForm({
                name: "",
                price: "",
                description: "",
                image: "",
                countInStock: "",
                flashSale: false,
            });
            setImageFile(null);
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "❌ Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------------------------------------------------
    // 🟢 NEW FUNCTIONS FOR EMAIL FEATURE (UNMODIFIED)
    // ---------------------------------------------------------------------

    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setEmailForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEmailImageChange = (e) => {
        setEmailForm((prev) => ({ ...prev, imageFile: e.target.files[0] }));
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        if (isSendingEmail) return;

        setIsSendingEmail(true);
        setMessage("");

        if (!emailForm.subject || !emailForm.body) {
            setMessage("Subject and Email Body are required.");
            setIsSendingEmail(false);
            return;
        }

        try {
            // 1. Upload the image if one is selected
            let imageUrl = null;
            if (emailForm.imageFile) {
                // Use generic upload logic
                imageUrl = await uploadImageToServer(emailForm.imageFile);
                if (!imageUrl) throw new Error("Image upload for email failed.");
            }

            // 2. Prepare the email data for the backend
            const emailData = {
                title: emailForm.title,
                subject: emailForm.subject,
                body: emailForm.body,
                imageUrl: imageUrl,
            };

            // 3. Send the request to the new backend route
            const token = localStorage.getItem("userToken");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.post(`${API_BASE}/subscribers/send-update`, emailData, config);

            setMessage(`✅ Email campaign launched successfully. Sent to ${data.sentCount || 'all'} subscribers.`);
            setEmailForm({ title: "", subject: "", body: "", imageFile: null });
        } catch (err) {
            console.error("❌ Email send failed:", err);
            setMessage(err.response?.data?.message || "❌ Failed to send email update.");
        } finally {
            setIsSendingEmail(false);
        }
    };

    // ---------------------------------------------------------------------
    // START OF JSX RETURN (MODIFIED)
    // ---------------------------------------------------------------------

    return (
        <div className="min-h-[80vh] bg-gradient-to-b from-[#0a0a0a] to-[#111] text-offwhite p-8">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl font-playfair text-gold mb-6 text-center"
            >
                Howdy Admin, Let's Get To Business 👑
            </motion.h2>

            {message && <p className="text-center text-yellow-400 mb-4 font-semibold">{message}</p>}

            {/* 🟢 NEW LOADING/ACCESS CHECK LOGIC */}
            {isAuthLoading ? (
                <p className="text-center text-gray-400">Verifying admin access...</p>
            ) : !isAdmin ? (
                <p className="text-center text-gray-400">Restricted access.</p>
            ) : (
                <>
                    <div className="flex gap-4 mb-6 justify-center flex-wrap">
                        <button
                            onClick={() => {
                                setView("orders");
                                fetchOrders();
                            }}
                            className={`py-2 px-4 rounded transition-all ${view === 'orders' ? 'bg-gold text-black' : 'bg-gray-700 text-offwhite hover:bg-gray-600'}`}
                        >
                            See Orders 🧾
                        </button>
                        <button
                            onClick={() => setView("addProduct")}
                            className={`py-2 px-4 rounded transition-all ${view === 'addProduct' ? 'bg-gold text-black' : 'bg-gray-700 text-offwhite hover:bg-gray-600'}`}
                        >
                            Add Product 📦
                        </button>
                        {/* NEW EMAIL BUTTON */}
                        <button
                            onClick={() => setView("sendEmail")}
                            className={`flex items-center gap-2 py-2 px-4 rounded transition-all ${view === 'sendEmail' ? 'bg-green-600 text-offwhite' : 'bg-gray-700 text-offwhite hover:bg-gray-600'}`}
                        >
                            <FaPaperPlane /> Send Email Update
                        </button>
                    </div>

                    {/* 🧾 ORDERS VIEW (MODIFIED - Order ID is now a button to open modal) */}
                    {view === "orders" && (
                        <div className="overflow-x-auto max-w-4xl mx-auto">
                            {loading ? (
                                <p className="text-center text-gray-300">Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <p className="text-center text-gray-400">No orders found.</p>
                            ) : (
                                <table className="w-full text-sm border border-platinum/20">
                                    <thead className="bg-[#1a1a1a]">
                                        <tr>
                                            <th className="p-2 border border-platinum/20">Order ID (Details)</th> {/* Column name changed */}
                                            <th className="p-2 border border-platinum/20">User</th>
                                            <th className="p-2 border border-platinum/20">Total</th>
                                            <th className="p-2 border border-platinum/20">Current Status</th>
                                            <th className="p-2 border border-platinum/20">Quick Status Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => {
                                            // Determine current status based on backend flags
                                            // **Note: The back-end logic for 'Shipped' needs to be explicit, e.g., order.isShipped**
                                            const currentStatus = order.isDelivered ? "Delivered" : order.isShipped ? "Shipped" : order.isPaid ? "Processing" : "Pending";

                                            // Helper for quick update buttons (same as before)
                                            const isDisabledQuick = (targetStatus) => {
                                                if (loading) return true;
                                                if (targetStatus === 'Delivered') return order.isDelivered;
                                                // Simplified flow control
                                                if (targetStatus === 'Shipped') return order.isDelivered || currentStatus === 'Shipped';
                                                if (targetStatus === 'Processing') return order.isDelivered || currentStatus === 'Shipped' || currentStatus === 'Processing';
                                                return false;
                                            };

                                            const disabledClass = "bg-gray-500 text-gray-300 cursor-not-allowed";

                                            return (
                                                <tr key={order._id} className="text-center odd:bg-[#111] even:bg-[#1a1a1a] transition-colors hover:bg-[#2a2a2a]">
                                                    <td className="p-2 border border-platinum/20">
                                                        {/* 🟢 MODIFIED: Make ID clickable to show modal */}
                                                        <button 
                                                            onClick={() => viewOrderDetails(order)}
                                                            className="text-gold hover:text-amber-400 font-mono transition-colors text-xs"
                                                            title="Click to see full order details"
                                                        >
                                                            {order._id.substring(0, 8)}...
                                                        </button>
                                                    </td>
                                                    <td className="p-2 border border-platinum/20">{order.user?.name || order.buyer?.name || "N/A"}</td>
                                                    <td className="p-2 border border-platinum/20">₦{order.totalPrice.toFixed(2)}</td>
                                                    <td className="p-2 border border-platinum/20 font-semibold">{currentStatus}</td>
                                                    <td className="p-2 border border-platinum/20 flex justify-center gap-1">
                                                        {/* QUICK UPDATE BUTTONS */}
                                                        <button
                                                            onClick={() => updateOrderStatus(order._id, "Processing")}
                                                            disabled={isDisabledQuick("Processing")}
                                                            className={`${isDisabledQuick("Processing") ? disabledClass : "bg-blue-500 hover:bg-blue-600"} text-offwhite text-xs px-2 py-1 rounded transition-colors`}
                                                        >
                                                            Proc
                                                        </button>
                                                        <button
                                                            onClick={() => updateOrderStatus(order._id, "Shipped")}
                                                            disabled={isDisabledQuick("Shipped")}
                                                            className={`${isDisabledQuick("Shipped") ? disabledClass : "bg-orange-500 hover:bg-orange-600"} text-offwhite text-xs px-2 py-1 rounded transition-colors`}
                                                        >
                                                            Ship
                                                        </button>
                                                        <button
                                                            onClick={() => updateOrderStatus(order._id, "Delivered")}
                                                            disabled={isDisabledQuick("Delivered")}
                                                            className={`${isDisabledQuick("Delivered") ? disabledClass : "bg-green-500 hover:bg-green-600"} text-offwhite text-xs px-2 py-1 rounded transition-colors`}
                                                        >
                                                            Del
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* 🛒 ADD PRODUCT VIEW (UNMODIFIED) */}
                    {view === "addProduct" && (
                        // ... form JSX
                    <form
                            onSubmit={handleAddProduct}
                            className="max-w-md mx-auto flex flex-col gap-4 bg-[#1a1a1a] p-6 rounded-xl shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-gold mb-2 border-b border-gray-700 pb-2">Add New Product</h3>
                            <input
                                name="name"
                                value={productsForm.name}
                                onChange={handleProductChange}
                                placeholder="Product Name"
                                className="p-3 rounded bg-[#111] border border-gray-700 focus:ring-gold focus:border-gold"
                                required
                            />
                            <input
                                name="price"
                                value={productsForm.price}
                                onChange={handleProductChange}
                                placeholder="Price (e.g., 50000)"
                                type="number"
                                step="0.01"
                                className="p-3 rounded bg-[#111] border border-gray-700 focus:ring-gold focus:border-gold"
                                required
                            />
                            <textarea
                                name="description"
                                value={productsForm.description}
                                onChange={handleProductChange}
                                placeholder="Description"
                                rows="4"
                                className="p-3 rounded bg-[#111] border border-gray-700 focus:ring-gold focus:border-gold"
                                required
                            />
                            <label className="text-sm text-gray-400">Product Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-amber-400 bg-[#111] rounded"
                                required
                            />
                            <input
                                name="countInStock"
                                value={productsForm.countInStock}
                                onChange={handleProductChange}
                                placeholder="Stock Count"
                                type="number"
                                className="p-3 rounded bg-[#111] border border-gray-700 focus:ring-gold focus:border-gold"
                                required
                            />
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="flashSale"
                                    checked={productsForm.flashSale}
                                    onChange={handleProductChange}
                                    className="h-5 w-5 text-gold rounded border-gray-600 bg-gray-700 focus:ring-gold"
                                />
                                <span className="text-lg font-medium">Flash Sale</span>
                            </label>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gold text-black py-3 rounded hover:bg-[#b08d28] disabled:bg-gray-600 disabled:text-gray-400 transition-colors mt-2 font-bold"
                            >
                                {loading ? "Uploading Product..." : "Add Product"}
                            </button>
                        </form>
                    )}

                    {/* 📧 SEND EMAIL VIEW (UNMODIFIED) */}
                    {view === "sendEmail" && (
                        // ... form JSX
                        <form
                            onSubmit={handleSendEmail}
                            className="max-w-lg mx-auto flex flex-col gap-4 bg-[#1a1a1a] p-6 rounded-xl shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-green-400 mb-2 border-b border-gray-700 pb-2">Create Newsletter Update</h3>
                            <input
                                name="title"
                                value={emailForm.title}
                                onChange={handleEmailChange}
                                placeholder="Email Title (Internal Reference)"
                                className="p-3 rounded bg-[#111] border border-gray-700 focus:ring-gold focus:border-gold"
                                required
                            />
                            <input
                                name="subject"
                                value={emailForm.subject}
                                onChange={handleEmailChange}
                                placeholder="Email Subject Line (What subscribers see)"
                                className="p-3 rounded bg-[#111] border border-gray-700 focus:ring-gold focus:border-gold"
                                required
                            />
                            <textarea
                                name="body"
                                value={emailForm.body}
                                onChange={handleEmailChange}
                                placeholder="Email Body Content (Use HTML or simple text)"
                                rows="8"
                                className="p-3 rounded bg-[#111] border border-gray-700 font-mono focus:ring-gold focus:border-gold"
                                required
                            />
                            <label className="text-sm text-gray-400">Optional Image (for email content):</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleEmailImageChange}
                                className="p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-400 file:text-black hover:file:bg-green-500 bg-[#111] rounded"
                            />
                            <button
                                type="submit"
                                disabled={isSendingEmail}
                                className="bg-green-600 text-offwhite py-3 rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors mt-2 font-bold"
                            >
                                <FaPaperPlane /> {isSendingEmail ? "Sending to All Subscribers..." : "Send Email Campaign"}
                            </button>
                        </form>
                    )}
                </>
            )}

            {/* 🟢 NEW: ORDER DETAILS MODAL */}
            {selectedOrder && (
                <OrderDetailsModal 
                    order={selectedOrder} 
                    onClose={closeOrderDetailsModal} 
                    updateOrderStatus={updateOrderStatus}
                    loading={loading}
                />
            )}
            <SecurityBadge />
        </div>
    );
};
export default AdminDashboard;