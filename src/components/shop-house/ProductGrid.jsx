import { formatINR, stockLabel } from './data'

export default function ProductGrid({
  products,
  isLoadingProducts,
  wishlistSet,
  onToggleWishlist,
  onAddToCart,
  onOpenProductModal,
}) {
  return (
    <>
      {isLoadingProducts ? (
        <div className="product-spinner-wrap">
          <div className="product-spinner" />
          <span>Syncing products...</span>
        </div>
      ) : null}

      <div className="products-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card" style={{ '--card-accent': product.accent }}>
            <button
              type="button"
              className="wishlist"
              onClick={() => onToggleWishlist(product.id)}
              aria-label={`Wishlist ${product.name}`}
            >
              {wishlistSet.has(product.id) ? '♥' : '♡'}
            </button>

            <button type="button" className="media-placeholder" onClick={() => onOpenProductModal(product)}>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                />
              ) : (
                <span>IMG</span>
              )}
            </button>

            <div className="product-meta">
              <h3>
                <button type="button" className="title-link" onClick={() => onOpenProductModal(product)}>
                  {product.name}
                </button>
              </h3>
              <p>{formatINR(product.price)}</p>
            </div>

            <div className="card-bottom">
              <span className={`stock-badge ${product.stock <= 3 ? 'low' : ''}`}>{stockLabel(product.stock)}</span>
              <button
                type="button"
                className="cart-action glitch"
                onClick={() => onAddToCart(product)}
              >
                Add To Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
