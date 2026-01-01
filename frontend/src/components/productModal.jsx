// /src/components/ProductModal.jsx
import { IoCloseSharp } from "react-icons/io5";
import { FaStar, FaShoppingCart } from "react-icons/fa";

// Utility function for price formatting (optional but good practice)
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};


const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  // 🚫 Don't render anything if the modal is closed or no product is selected
  if (!isOpen || !product) return null;

  const { name, image, description, price, rating, flashSale, discountPrice, countInStock } = product;
  const isAvailable = countInStock > 0;

  // Function to render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-xl ${i < fullStars ? 'text-yellow-400' : 'text-gray-600'}`}
        />
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    // 1. Modal Backdrop (Clicking this closes the modal)
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center backdrop-blur-sm p-4"
      onClick={onClose} // Close on backdrop click
    >
      {/* 2. Modal Content (Stop propagation so clicking inside doesn't close it) */}
      <div 
        className="relative bg-deepblack text-offwhite rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-2xl rounded-full bg-gold/80 hover:bg-gold transition duration-300 text-deepblack"
          aria-label="Close product details"
        >
          <IoCloseSharp />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-1/2 p-6 flex justify-center items-center bg-[#1a1a1a] rounded-t-xl lg:rounded-l-xl lg:rounded-t-none">
            <img
              src={image}
              alt={name}
              className="object-contain max-h-96 w-full rounded-lg shadow-xl"
            />
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-8 space-y-6">
            <h3 className="text-4xl font-playfair text-gold tracking-wider">{name}</h3>
            
            {/* Rating */}
            <div className="flex items-center space-x-3">
              {renderRating(rating)}
              <span className="text-lg text-gray-400">({rating.toFixed(1)})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 font-semibold">
              {flashSale && discountPrice > 0 ? (
                <>
                  <span className="text-3xl text-red-400">
                    {formatPrice(discountPrice)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(price)}
                  </span>
                  <span className="text-sm text-green-400">
                    (20% OFF!)
                  </span>
                </>
              ) : (
                <span className="text-3xl text-gold">
                  {formatPrice(price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="text-lg">
                <span className={`font-bold ${isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-gray-400"> ({countInStock} units)</span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xl font-bold mb-2 border-b border-gray-700 pb-1">Description</h4>
              <p className="text-gray-300 leading-relaxed text-sm">{description}</p>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart(product)}
              disabled={!isAvailable}
              className={`flex items-center justify-center w-full py-3 text-lg font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02]
                ${isAvailable 
                    ? 'bg-gold text-deepblack hover:bg-yellow-600' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
              <FaShoppingCart className="mr-3" />
              {isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;