// /src/components/ProductCard.jsx - UPDATED
import { FaStar } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md"; // Added an icon for the button

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(price);
};


// ⚠️ Accept the onDetailsClick prop
const ProductCard = ({ product, onDetailsClick }) => {
    const { name, image, price, rating, flashSale, discountPrice } = product;
    
    // Determine which price to display on the card
    const displayPrice = flashSale && discountPrice > 0 ? discountPrice : price;
    const originalPrice = price;

    return (
        <div
            id="products-section"
            data-aos="zoom-in"
            className="group bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-platinum/10 rounded-2xl p-4 shadow-lg hover:scale-[1.03] hover:border-gold/50 transition-all duration-500 relative"
        >
            <div className="relative overflow-hidden rounded-xl">
                <img
                    src={image}
                    alt={name}
                    className="rounded-xl w-full h-60 object-cover transform group-hover:scale-110 transition duration-700 ease-out"
                />
                
                {/* Optional: Flash Sale Badge */}
                {flashSale && (
                    <span className="absolute top-2 left-2 bg-red-600 text-offwhite text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        SALE!
                    </span>
                )}
            </div>

            <h3 className="mt-4 text-xl font-playfair group-hover:text-gold transition truncate">{name}</h3>
            
            {/* Price Display with Discount logic */}
            <div className="flex items-center space-x-2 mt-1">
                <p className={`text-xl font-bold ${flashSale ? 'text-red-400' : 'text-offwhite'}`}>
                    {formatPrice(displayPrice)}
                </p>
                {flashSale && discountPrice > 0 && (
                    <p className="text-platinum/60 line-through text-md">
                        {formatPrice(originalPrice)}
                    </p>
                )}
            </div>

            {/* Simple Rating Display */}
            <div className="flex items-center mt-1">
                {Array.from({ length: 5 }, (_, i) => (
                    <FaStar 
                        key={i} 
                        className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-platinum/40'} 
                        size={14} 
                    />
                ))}
                <span className="text-sm text-platinum/70 ml-2">({rating.toFixed(1)})</span>
            </div>

            {/* ⚠️ Updated Button with click handler */}
            <button 
                onClick={() => onDetailsClick(product)} // Pass the product to the handler
                className="mt-4 w-full flex items-center justify-center bg-gold text-deepblack px-5 py-2 rounded-full font-semibold hover:bg-[#b08d28] transition transform hover:scale-[1.01]"
            >
                <MdOutlineSearch className="mr-2 text-xl" />
                View Details
            </button>
        </div>
    );
};

export default ProductCard;
