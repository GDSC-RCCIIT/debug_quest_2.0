import CartPanel from './shop-house/CartPanel'
import PaginationControls from './shop-house/PaginationControls'
import ProductGrid from './shop-house/ProductGrid'
import ProductModal from './shop-house/ProductModal'
import ShopToolbar from './shop-house/ShopToolbar'
import { categories } from './shop-house/data'
import { useDebugQuestShop } from './shop-house/hooks/useDebugQuestShop'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import './ShopHouse.css'

export default function ShopHouse({ onBack }) {
  const shop = useDebugQuestShop()

  return (
    <main className="shop-house-shell">
      <div className="shop-noise" aria-hidden="true" />

      <div className="shop-page-wrap">
        <nav className="shop-navbar">
          <button type="button" className="back-link" onClick={onBack}>
            ← Back To City
          </button>

          <div className="title-group">
            <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: 0 }}>
              <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                <DotLottieReact
                  src="https://lottie.host/566df18a-682f-4e52-85bc-2c7dc9dc40d5/d4e3jkPAE2.lottie"
                  loop
                  autoplay
                />
              </div>
              Shop House
            </h1>
            <p>Something feels broken here...</p>
          </div>

          <div className="status-pill flicker">DEBUG QUEST MODE</div>
        </nav>

        {shop.toast ? <div className="coupon-toast">{shop.toast}</div> : null}

        <ShopToolbar
          categories={categories}
          search={shop.search}
          activeCategory={shop.activeCategory}
          sortDirection={shop.sortDirection}
          onSearchChange={shop.onSearchChange}
          onCategoryChange={shop.onCategoryChange}
          onSortChange={shop.onSortChange}
        />

        <section className="shop-main-grid">
          <div className="products-column">
            <ProductGrid
              products={shop.pagedProducts}
              isLoadingProducts={shop.isLoadingProducts}
              wishlistSet={shop.wishlistSet}
              onToggleWishlist={shop.toggleWishlist}
              onAddToCart={shop.addToCart}
              onOpenProductModal={shop.openProductModal}
            />

            <PaginationControls page={shop.page} totalPages={shop.totalPages} onPageChange={shop.setPage} />
          </div>

          <CartPanel
            cartItems={shop.cartItems}
            couponInput={shop.couponInput}
            couponCode={shop.couponCode}
            couponError={shop.couponError}
            subtotal={shop.subtotal}
            discountValue={shop.discountValue}
            total={shop.total}
            onQuantityChange={shop.changeQty}
            onRemoveByVisibleIndex={shop.removeCartByVisibleIndex}
            onCouponInputChange={shop.setCouponInput}
            onApplyCoupon={shop.applyCoupon}
            onCheckout={shop.checkout}
            checkoutError={shop.checkoutError}
          />
        </section>

        {shop.isModalOpen ? <ProductModal product={shop.modalProduct} onClose={shop.closeProductModal} /> : null}
      </div>
    </main>
  )
}