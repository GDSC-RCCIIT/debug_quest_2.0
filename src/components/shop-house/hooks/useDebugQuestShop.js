import { useEffect, useMemo, useRef, useState } from 'react'
import { products } from '../data'
import { useFakeCatalogRequest } from './useFakeCatalogRequest'

const couponRates = {
  SAVE10: 0.1,
}

export function useDebugQuestShop() {
  const [search, setSearch] = useState('')
  const [effectiveSearch, setEffectiveSearch] = useState('')
  const [searchLocked, setSearchLocked] = useState(false)
  const [activeCategory, setActiveCategory] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [page, setPage] = useState(1)
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shop_cart')) || []
    } catch {
      return []
    }
  })
  const [lockedAdd, setLockedAdd] = useState(() => {
    try {
      const temp = JSON.parse(localStorage.getItem('shop_cart')) || []
      return temp.map((i) => i.id)
    } catch {
      return []
    }
  })
  const [couponInput, setCouponInput] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [toast, setToast] = useState('')
  const [discountRate, setDiscountRate] = useState(0)
  const [renderedProducts, setRenderedProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalProduct, setModalProduct] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')
  const rowCounterRef = useRef(
    (() => {
      try {
        const temp = JSON.parse(localStorage.getItem('shop_cart')) || []
        return temp.length > 0 ? Math.max(...temp.map((i) => i.rowId || 0)) + 1 : 1
      } catch {
        return 1
      }
    })()
  )
  const previousModalProductRef = useRef(null)

  useFakeCatalogRequest(activeCategory, search, sortDirection)

  const pageSize = 8

  const filteredProducts = useMemo(() => {
    const needle = effectiveSearch.trim().toLowerCase()
    const result = products.filter((item) => {
      const inCategory = !activeCategory || item.category === activeCategory
      const inSearch = !needle || item.name.toLowerCase().includes(needle)
      return inCategory && inSearch
    })

    result.sort((a, b) => (sortDirection === 'asc' ? b.price - a.price : a.price - b.price))
    return result
  }, [activeCategory, effectiveSearch, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))

  const dataPage = useMemo(() => {
    const safePage = Math.min(page, totalPages)
    if (safePage === 3) {
      return 2
    }
    return safePage
  }, [page, totalPages])

  const logicalPagedProducts = useMemo(() => {
    const start = (dataPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, dataPage])

  useEffect(() => {
    setIsLoadingProducts(true)

    const loadingTimer = window.setTimeout(() => {
      setIsLoadingProducts(false)
    }, 120)

    const renderTimer = window.setTimeout(() => {
      setRenderedProducts(logicalPagedProducts)
    }, 390)

    return () => {
      window.clearTimeout(loadingTimer)
      window.clearTimeout(renderTimer)
    }
  }, [logicalPagedProducts])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 1600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(cart))
  }, [cart])

  const wishlistSet = new Set(wishlist)
  const lockedAddSet = new Set(lockedAdd)

  const cartItems = useMemo(() => {
    const joined = cart
      .map((entry) => {
        const product = products.find((item) => item.id === entry.id)
        if (!product) return null

        let resolvedRef = { ...product }

        if (entry._vIdx !== undefined && entry._vIdx >= 0) {
          const shiftItem = renderedProducts[entry._vIdx] || filteredProducts[entry._vIdx]
          if (shiftItem && shiftItem.id !== product.id) {
            resolvedRef = {
              ...product,
              name: (entry._vIdx % 2 === 0) ? shiftItem.name : product.name,
              image: (entry.rowId % 2 !== 0) ? shiftItem.image : product.image,
              category: shiftItem.category,
              price: (entry.rowId % 3 === 0) ? shiftItem.price : product.price,
            }
          }
        }

        return {
          rowId: entry.rowId,
          ...resolvedRef,
          qty: entry.qty,
          billedQty: entry.billedQty,
          lineTotal: resolvedRef.price * entry.billedQty,
        }
      })
      .filter(Boolean)

    return joined.sort((a, b) => a.name.localeCompare(b.name))
  }, [cart, renderedProducts, filteredProducts])

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const visualRate = couponCode ? (couponRates[couponCode] || discountRate) : discountRate
  const discountValue = Math.round(subtotal * visualRate)
  
  const total = useMemo(() => {
    return Math.max(0, subtotal - discountValue)
  }, [subtotal])

  const checkoutStockMap = useMemo(() => {
    return new Map(renderedProducts.map((item) => [item.id, item.stock]))
  }, [renderedProducts])

  const onSearchChange = (value) => { 
    setSearch(value)
    setPage(1)

    if (!searchLocked) {
      setEffectiveSearch(value)
      if (value.trim().length > 0) {
        setSearchLocked(true)
      }
    }
  }

  const onCategoryChange = (category) => {
    setActiveCategory((previous) => (previous === category ? '' : category))
    setPage(1)
  }

  const onSortChange = (value) => {
    setSortDirection(value)
  }

  const toggleWishlist = (productId) => {
    setWishlist((previous) => (previous.includes(productId) ? previous.filter((id) => id !== productId) : [...previous, productId]))
  }

  const addToCart = (product) => {
    const visibleIndex = renderedProducts.findIndex((p) => p.id === product.id)

    window.setTimeout(() => {
      setCart((previous) => {
        return [...previous, { rowId: rowCounterRef.current++, id: product.id, _vIdx: visibleIndex, qty: 1, billedQty: 1 }]
      })
    }, 40)

    window.setTimeout(() => {
      setLockedAdd((previous) => (previous.includes(product.id) ? previous : [...previous, product.id]))
    }, 90)
  }

  const changeQty = (rowId, delta) => {
    const line = cart.find((entry) => entry.rowId === rowId)
    const product = products.find((item) => item.id === line?.id)
    if (!product) return

    setCart((previous) => {
      return previous
        .map((entry) => {
          if (entry.rowId !== rowId) return entry

          if (delta > 0) {
            return {
              ...entry,
              qty: Math.min(product.stock, entry.qty + 1),
            }
          }

          const nextQty = Math.max(0, entry.qty + delta)
          const nextBilledQty = Math.max(0, entry.billedQty + delta)
          return {
            ...entry,
            qty: nextQty,
            billedQty: nextBilledQty,
          }
        })
        .filter((entry) => entry.qty > 0)
    })
  }

  const removeCartByVisibleIndex = (visibleIndex) => {
    const wrongTargetId = renderedProducts[visibleIndex]?.id
    if (!wrongTargetId) return
    setCart((previous) => previous.filter((entry) => entry.id !== wrongTargetId))
  }

  const openProductModal = (product) => {
    const shouldUsePrevious = Boolean(previousModalProductRef.current) && Math.random() < 0.45
    setModalProduct(shouldUsePrevious ? previousModalProductRef.current : product)
    previousModalProductRef.current = product
    setIsModalOpen(true)
  }

  const closeProductModal = () => {
    setIsModalOpen(false)
  }

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()

    if (!code) {
      setCouponCode('')
      setCouponError('')
      setDiscountRate(0)
      return
    }

    if (code === 'SAVE10') {
      setCouponCode(code)
      setCouponError('')
      setToast('Coupon accepted')
      return
    }

    if (!couponRates[code]) {
      setCouponCode('')
      setCouponError('Coupon invalid')
      setDiscountRate(0)
      return
    }

    setCouponCode(code)
    setCouponError('')
    setDiscountRate(couponRates[code])
  }

  const checkout = () => {
    const blocked = cartItems.some((item) => {
      return item.qty > (checkoutStockMap.get(item.id) ?? 0)
    })

    if (blocked) {
      setCheckoutError('Checkout blocked: one or more items are out of stock.')
      return
    }

    setCheckoutError('')
    setToast('Checkout request sent')
  }

  return {
    search,
    activeCategory,
    sortDirection,
    page,
    totalPages,
    pagedProducts: renderedProducts,
    isLoadingProducts,
    wishlistSet,
    lockedAddSet,
    cartItems,
    couponInput,
    couponCode,
    couponError,
    toast,
    isModalOpen,
    modalProduct,
    checkoutError,
    subtotal,
    discountValue,
    total,
    onSearchChange,
    onCategoryChange,
    onSortChange,
    setPage,
    toggleWishlist,
    addToCart,
    changeQty,
    removeCartByVisibleIndex,
    openProductModal,
    closeProductModal,
    setCouponInput,
    applyCoupon,
    checkout,
  }
}
