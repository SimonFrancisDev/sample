import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserShield } from "react-icons/fa";
import logo from "/assets/logo.jpg";
import { useCart } from "../context/CartContext"; 

// Custom event for cross-component user status updates
const USER_STATUS_CHANGE_EVENT = "userStatusChange";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get the total number of items in the cart from the context
  const { totalItems } = useCart(); 

  // Load user from localStorage
  const loadUser = () => {
    const userInfo = localStorage.getItem("userInfo");
    setUser(userInfo ? JSON.parse(userInfo) : null);
  };

  useEffect(() => {
    loadUser();
    const handleStorageChange = () => loadUser();
    const handleUserStatusChange = () => loadUser();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(USER_STATUS_CHANGE_EVENT, handleUserStatusChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(USER_STATUS_CHANGE_EVENT, handleUserStatusChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    setUser(null);
    window.dispatchEvent(new Event(USER_STATUS_CHANGE_EVENT));
    navigate("/login");
  };

  // ------------------------------------------------------------------
  // 🟢 UPDATE: Define the primary navigation links array, including "My Orders" 
  // unconditionally so it's always visible.
  // ------------------------------------------------------------------
  const primaryNavLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "My Orders", path: "/my-orders" }, // Now always visible
  ];

  // ------------------------------------------------------------------
  // 🟢 UPDATE: Construct the final list of links (no conditional check needed for "My Orders")
  // ------------------------------------------------------------------
  let finalNavLinks = [...primaryNavLinks];
  
  // Removed conditional block:
  // if (user) {
  //   finalNavLinks.push({ name: "My Orders", path: "/my-orders" });
  // }
  
  // We no longer use a separate authLink variable; Login/Logout is now integrated
  // along with Cart and Admin directly in the JSX for precise control.


  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex justify-between items-center py-5 px-6 md:px-10 bg-deepblack text-offwhite border-b border-platinum/20 relative z-50"
    >
      {/* Left: Logo + Brand Name (UNCHANGED) */}
      <Link
        to="/"
        className="flex items-center gap-3 text-2xl font-playfair tracking-wide text-gold"
      >
        <img
          src={logo}
          alt="Pindows Elite Logo"
          className="h-10 w-10 object-cover rounded-full border-2 border-[#d4af37] shadow-md"
        />
        <span>Pindows Elite</span>
      </Link>

      {/* Desktop Nav Links (MODIFIED) */}
      <div className="hidden md:flex items-center gap-8 text-sm font-poppins">
        {/* 1. Standard Links (Home, About, My Orders) */}
        {finalNavLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="hover:text-gold transition duration-300"
          >
            {link.name}
          </Link>
        ))}

        {/* 2. Cart Icon (always visible) */}
        <Link to="/cart" className="relative">
          <FaShoppingCart className="text-gold text-lg hover:text-[#b08d28] transition" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-gold text-deepblack text-xs font-bold px-[6px] rounded-full min-w-[20px] text-center">
              {totalItems}
            </span>
          )}
        </Link>

        {/* 3. Admin Dashboard Icon (if admin) */}
        {user?.role === "admin" && (
          <Link to="/admin" className="flex items-center gap-1 hover:text-gold">
            <FaUserShield className="text-gold" /> <span>Admin</span>
          </Link>
        )}

        {/* 4. Login / Logout Link */}
        {user ? (
          <button
            onClick={handleLogout}
            className="hover:text-gold transition duration-300"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="hover:text-gold transition duration-300"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Button (UNCHANGED) */}
      <div
        className="md:hidden flex items-center gap-6"
      >
        {/* Cart Icon (Mobile View) */}
        <Link to="/cart" className="relative">
          <FaShoppingCart className="text-gold text-lg" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-gold text-deepblack text-xs font-bold px-[6px] rounded-full min-w-[20px] text-center">
              {totalItems}
            </span>
          )}
        </Link>
        
        {/* Hamburger Menu */}
        <div
            className="flex flex-col justify-center items-end gap-[5px] cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
        >
            <motion.span
                animate={{
                    rotate: menuOpen ? 45 : 0,
                    y: menuOpen ? 4 : 0,
                    width: "28px",
                }}
                transition={{ duration: 0.3 }}
                className="h-[2px] bg-gold rounded-full"
            />
            <motion.span
                animate={{
                    rotate: menuOpen ? -45 : 0,
                    y: menuOpen ? -4 : 0,
                    width: "18px",
                }}
                transition={{ duration: 0.3 }}
                className="h-[2px] bg-gold rounded-full"
            />
        </div>
      </div>

      {/* Mobile Dropdown Menu (MODIFIED) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full right-4 mt-2 w-48 bg-deepblack border border-platinum/20 rounded-xl shadow-lg flex flex-col items-center gap-4 py-5"
          >
            {/* The full list of links: Home, About, My Orders, Cart, Admin, Login/Logout */}
            {
              [...finalNavLinks, { name: "Cart", path: "/cart" }].map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <Link
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-poppins hover:text-gold transition"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {/* Admin Link (Mobile) */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 hover:text-gold"
              >
                <FaUserShield /> Admin
              </Link>
            )}
            
            {/* Login / Logout (Mobile) */}
            <Link
              to={user ? "/login" : "/login"}
              onClick={() => {
                setMenuOpen(false);
                user && handleLogout(); // Call logout only if user is logged in
              }}
              className="text-sm font-poppins hover:text-gold transition"
            >
              {user ? "Logout" : "Login"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;



// // src/components/Navbar.jsx
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaUserShield } from "react-icons/fa";
// import logo from "/assets/logo.jpg";
// import { useCart } from "../context/CartContext"; 

// // Custom event for cross-component user status updates
// const USER_STATUS_CHANGE_EVENT = "userStatusChange";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   // Get the total number of items in the cart from the context
//   const { totalItems } = useCart(); 

//   // Load user from localStorage
//   const loadUser = () => {
//     const userInfo = localStorage.getItem("userInfo");
//     setUser(userInfo ? JSON.parse(userInfo) : null);
//   };

//   useEffect(() => {
//     loadUser();
//     const handleStorageChange = () => loadUser();
//     const handleUserStatusChange = () => loadUser();

//     window.addEventListener("storage", handleStorageChange);
//     window.addEventListener(USER_STATUS_CHANGE_EVENT, handleUserStatusChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener(USER_STATUS_CHANGE_EVENT, handleUserStatusChange);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("userToken");
//     localStorage.removeItem("userInfo");
//     setUser(null);
//     window.dispatchEvent(new Event(USER_STATUS_CHANGE_EVENT));
//     navigate("/login");
//   };

//   // ------------------------------------------------------------------
//   // 🟢 MAIN CHANGE: Redefine the primary navigation links array
//   // ------------------------------------------------------------------
//   const primaryNavLinks = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//   ];

//   // ------------------------------------------------------------------
//   // 🟢 MAIN CHANGE: Construct the final list of links
//   // ------------------------------------------------------------------
//   let finalNavLinks = [...primaryNavLinks];

//   if (user) {
//     finalNavLinks.push({ name: "My Orders", path: "/my-orders" });
//   }
//   
//   // We no longer use a separate authLink variable; Login/Logout is now integrated
//   // along with Cart and Admin directly in the JSX for precise control.


//   return (
//     <motion.nav
//       initial={{ opacity: 0, y: -40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: "easeOut" }}
//       className="flex justify-between items-center py-5 px-6 md:px-10 bg-deepblack text-offwhite border-b border-platinum/20 relative z-50"
//     >
//       {/* Left: Logo + Brand Name (UNCHANGED) */}
//       <Link
//         to="/"
//         className="flex items-center gap-3 text-2xl font-playfair tracking-wide text-gold"
//       >
//         <img
//           src={logo}
//           alt="Pindows Elite Logo"
//           className="h-10 w-10 object-cover rounded-full border-2 border-[#d4af37] shadow-md"
//         />
//         <span>Pindows Elite</span>
//       </Link>

//       {/* Desktop Nav Links (MODIFIED) */}
//       <div className="hidden md:flex items-center gap-8 text-sm font-poppins">
//         {/* 1. Standard Links (Home, About, My Orders) */}
//         {finalNavLinks.map((link) => (
//           <Link
//             key={link.name}
//             to={link.path}
//             className="hover:text-gold transition duration-300"
//           >
//             {link.name}
//           </Link>
//         ))}

//         {/* 2. Cart Icon (always visible) */}
//         <Link to="/cart" className="relative">
//           <FaShoppingCart className="text-gold text-lg hover:text-[#b08d28] transition" />
//           {totalItems > 0 && (
//             <span className="absolute -top-2 -right-3 bg-gold text-deepblack text-xs font-bold px-[6px] rounded-full min-w-[20px] text-center">
//               {totalItems}
//             </span>
//           )}
//         </Link>

//         {/* 3. Admin Dashboard Icon (if admin) */}
//         {user?.role === "admin" && (
//           <Link to="/admin" className="flex items-center gap-1 hover:text-gold">
//             <FaUserShield className="text-gold" /> <span>Admin</span>
//           </Link>
//         )}

//         {/* 4. Login / Logout Link */}
//         {user ? (
//           <button
//             onClick={handleLogout}
//             className="hover:text-gold transition duration-300"
//           >
//             Logout
//           </button>
//         ) : (
//           <Link
//             to="/login"
//             className="hover:text-gold transition duration-300"
//           >
//             Login
//           </Link>
//         )}
//       </div>

//       {/* Mobile Hamburger Button (UNCHANGED) */}
//       <div
//         className="md:hidden flex items-center gap-6"
//       >
//         {/* Cart Icon (Mobile View) */}
//         <Link to="/cart" className="relative">
//           <FaShoppingCart className="text-gold text-lg" />
//           {totalItems > 0 && (
//             <span className="absolute -top-2 -right-3 bg-gold text-deepblack text-xs font-bold px-[6px] rounded-full min-w-[20px] text-center">
//               {totalItems}
//             </span>
//           )}
//         </Link>
//         
//         {/* Hamburger Menu */}
//         <div
//             className="flex flex-col justify-center items-end gap-[5px] cursor-pointer"
//             onClick={() => setMenuOpen(!menuOpen)}
//         >
//             <motion.span
//                 animate={{
//                     rotate: menuOpen ? 45 : 0,
//                     y: menuOpen ? 4 : 0,
//                     width: "28px",
//                 }}
//                 transition={{ duration: 0.3 }}
//                 className="h-[2px] bg-gold rounded-full"
//             />
//             <motion.span
//                 animate={{
//                     rotate: menuOpen ? -45 : 0,
//                     y: menuOpen ? -4 : 0,
//                     width: "18px",
//                 }}
//                 transition={{ duration: 0.3 }}
//                 className="h-[2px] bg-gold rounded-full"
//             />
//         </div>
//       </div>

//       {/* Mobile Dropdown Menu (MODIFIED) */}
//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//             className="absolute top-full right-4 mt-2 w-48 bg-deepblack border border-platinum/20 rounded-xl shadow-lg flex flex-col items-center gap-4 py-5"
//           >
//             {/* The full list of links: Home, About, My Orders, Cart, Admin, Login/Logout */}
//             {
//               [...finalNavLinks, { name: "Cart", path: "/cart" }].map((link, i) => (
//               <motion.div
//                 key={link.name}
//                 initial={{ opacity: 0, x: 10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.05 * i }}
//               >
//                 <Link
//                   to={link.path}
//                   onClick={() => setMenuOpen(false)}
//                   className="text-sm font-poppins hover:text-gold transition"
//                 >
//                   {link.name}
//                 </Link>
//               </motion.div>
//             ))}

//             {/* Admin Link (Mobile) */}
//             {user?.role === "admin" && (
//               <Link
//                 to="/admin"
//                 onClick={() => setMenuOpen(false)}
//                 className="flex items-center gap-2 hover:text-gold"
//               >
//                 <FaUserShield /> Admin
//               </Link>
//             )}
//             
//             {/* Login / Logout (Mobile) */}
//             <Link
//               to={user ? "/login" : "/login"}
//               onClick={() => {
//                 setMenuOpen(false);
//                 user && handleLogout(); // Call logout only if user is logged in
//               }}
//               className="text-sm font-poppins hover:text-gold transition"
//             >
//               {user ? "Logout" : "Login"}
//             </Link>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// };

// export default Navbar;