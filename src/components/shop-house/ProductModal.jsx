import { formatINR, stockLabel } from './data'

export default function ProductModal({ product, onClose }) {
  if (!product) return null

  return (
    <div className="product-modal-overlay" role="dialog" aria-modal="true">
      <div className="product-modal-card">
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-media" style={{ '--card-accent': product.accent }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
            />
          ) : (
            <span>PREVIEW</span>
          )}
        </div>

        <h3>{product.name}</h3>
        <p className="modal-price">{formatINR(product.price)}</p>
        <p className="modal-category">Category: {product.category}</p>
        <p className="modal-stock">{stockLabel(product.stock)}</p>
        <p className="modal-copy">A premium product sourced from the most stable part of the glitch grid.</p>
      </div>
    </div>
  )
}
