(() => {
  const STORAGE_KEYS = {
    products: 'poas_products_data',
    cart: 'poas_pos_cart',
    apartados: 'poas_apartados',
    invoices: 'poas_invoice_history'
  };

  const currency = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2
  });

  const formatCRC = (amount) => currency.format(Number(amount || 0));

  const getLocalISODateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().slice(0, 19);
  };

  const deepClone = (data) => JSON.parse(JSON.stringify(data));

  const ensureBarcode = (product, index) => {
    if (!product.barcode) {
      product.barcode = `POAS${String(product.id || index + 1).padStart(6, '0')}`;
    }
  };

  const getVariantTotalStock = (product) => {
    if (!product?.variants?.options?.length) return 0;
    return product.variants.options.reduce((sum, option) => {
      const inv = option.inventory || {};
      if (typeof inv.poas === 'number') return sum + inv.poas;
      const legacy = (inv.tienda1 || 0) + (inv.tienda2 || 0) + (inv.tienda3 || 0) + (inv.bodega || 0);
      return sum + legacy;
    }, 0);
  };

  const getProductStock = (product) => {
    if (!product) return 0;
    if (product.inventory && typeof product.inventory.poas === 'number') return product.inventory.poas;
    if (product.inventory) {
      const legacy = (product.inventory.tienda1 || 0) + (product.inventory.tienda2 || 0) + (product.inventory.tienda3 || 0) + (product.inventory.bodega || 0);
      return legacy;
    }
    return getVariantTotalStock(product);
  };

  const getVariantStock = (variant) => {
    if (!variant?.inventory) return 0;
    return (variant.inventory.tienda1 || 0) + (variant.inventory.tienda2 || 0) + (variant.inventory.tienda3 || 0) + (variant.inventory.bodega || 0);
  };

  const ensureInventory = (product) => {
    product.inventory = product.inventory || {};
    if (typeof product.inventory.poas !== 'number') {
      product.inventory.poas = getProductStock(product);
    }
    if (typeof product.inventory.bodega !== 'number') {
      product.inventory.bodega = 0;
    }
  };

  const syncBodegaFromSophie = (products) => {
    const sophieProducts = JSON.parse(localStorage.getItem('products_data') || '[]');
    products.forEach(poasProduct => {
      const sophieProduct = sophieProducts.find(sp => String(sp.id) === String(poasProduct.id));
      if (sophieProduct && sophieProduct.inventory) {
        if (!poasProduct.inventory) poasProduct.inventory = {};
        poasProduct.inventory.bodega = sophieProduct.inventory.bodega || 0;
      }
    });
  };

  const getProductPrice = (product) => {
    if (typeof product.price === 'number') return product.price;
    if (product?.variants?.options?.length) {
      const prices = product.variants.options.map(opt => Number(opt.price || 0)).filter(p => p > 0);
      if (prices.length) return Math.min(...prices);
    }
    return 0;
  };

  const getImagePath = (img) => {
    if (!img) return '';
    return img.startsWith('/') ? img : `./${img}`;
  };

  const loadProducts = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.products);
    if (stored) {
      const parsed = JSON.parse(stored || '[]');
      const list = Array.isArray(parsed) ? parsed : [];
      list.forEach((product, idx) => {
        ensureBarcode(product, idx);
        ensureInventory(product);
      });
      syncBodegaFromSophie(list);
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(list));
      return list;
    }
    const fallback = JSON.parse(localStorage.getItem('products_data') || '[]');
    const normalized = Array.isArray(fallback) ? deepClone(fallback) : [];
    normalized.forEach((product, idx) => {
      ensureBarcode(product, idx);
      ensureInventory(product);
    });
    syncBodegaFromSophie(normalized);
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(normalized));
    return normalized;
  };

  const saveProducts = (products) => {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products || []));
    syncBodegaToSophie(products);
  };

  const syncBodegaToSophie = (products) => {
    const sophieProducts = JSON.parse(localStorage.getItem('products_data') || '[]');
    let updated = false;
    products.forEach(poasProduct => {
      const sophieProduct = sophieProducts.find(sp => String(sp.id) === String(poasProduct.id));
      if (sophieProduct && poasProduct.inventory && typeof poasProduct.inventory.bodega === 'number') {
        if (!sophieProduct.inventory) sophieProduct.inventory = {};
        if (sophieProduct.inventory.bodega !== poasProduct.inventory.bodega) {
          sophieProduct.inventory.bodega = poasProduct.inventory.bodega;
          updated = true;
        }
      }
    });
    if (updated) {
      localStorage.setItem('products_data', JSON.stringify(sophieProducts));
    }
  };

  const loadCart = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.cart);
    const parsed = JSON.parse(stored || '[]');
    return Array.isArray(parsed) ? parsed : [];
  };

  const saveCart = (cart) => {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart || []));
  };

  const loadApartados = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.apartados);
    const parsed = JSON.parse(stored || '[]');
    return Array.isArray(parsed) ? parsed : [];
  };

  const saveApartados = (apartados) => {
    localStorage.setItem(STORAGE_KEYS.apartados, JSON.stringify(apartados || []));
  };

  const loadInvoices = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.invoices);
    const parsed = JSON.parse(stored || '[]');
    return Array.isArray(parsed) ? parsed : [];
  };

  const saveInvoices = (invoices) => {
    localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(invoices || []));
  };

  let products = [];
  let cart = [];
  let poasCurrentPage = 1;
  const POAS_PRODUCTS_PER_PAGE = 20;

  const nodes = {
    productsGrid: document.getElementById('poas-products-grid'),
    productsCount: document.getElementById('poas-products-count'),
    productsStock: document.getElementById('poas-products-stock'),
    productsSearch: document.getElementById('poas-search'),
    productsPagination: document.getElementById('poas-products-pagination'),
    cartItems: document.getElementById('poas-cart-items'),
    cartSubtotal: document.getElementById('poas-subtotal'),
    cartTotal: document.getElementById('poas-total'),
    clearCartBtn: document.getElementById('poas-clear-cart'),
    checkoutBtn: document.getElementById('poas-checkout'),
    createApartadoBtn: document.getElementById('poas-create-apartado'),
    apartadosList: document.getElementById('poas-apartados-list'),
    apartadosSearch: document.getElementById('poas-apartados-search'),
    modal: document.getElementById('poas-modal'),
    modalBody: document.getElementById('poas-modal-body'),
    modalTitle: document.getElementById('poas-modal-title'),
    modalClose: document.getElementById('poas-modal-close'),
    openInvoicesBtn: document.getElementById('poas-open-invoices')
  };

  const setModal = (title, bodyHtml) => {
    if (!nodes.modal || !nodes.modalBody || !nodes.modalTitle) return;
    nodes.modalTitle.textContent = title;
    nodes.modalBody.innerHTML = bodyHtml;
    nodes.modal.classList.add('active');
    nodes.modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!nodes.modal) return;
    nodes.modal.classList.remove('active');
    nodes.modal.setAttribute('aria-hidden', 'true');
  };

  const renderPoasPagination = (totalPages) => {
    const container = nodes.productsPagination;
    if (!container) return;
    if (totalPages <= 1) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }
    container.style.display = 'flex';
    container.innerHTML = `
      <button class="page-btn prev" ${poasCurrentPage===1 ? 'disabled aria-disabled="true"' : ''}>Anterior</button>
      <span class="page-info">Página ${poasCurrentPage} de ${totalPages}</span>
      <button class="page-btn next" ${poasCurrentPage===totalPages ? 'disabled aria-disabled="true"' : ''}>Siguiente</button>
    `;
    const prev = container.querySelector('.page-btn.prev');
    const next = container.querySelector('.page-btn.next');
    if (prev) prev.addEventListener('click', () => { if (poasCurrentPage > 1) { poasCurrentPage -= 1; renderProducts(); } });
    if (next) next.addEventListener('click', () => { if (poasCurrentPage < totalPages) { poasCurrentPage += 1; renderProducts(); } });
  };

  const renderProducts = () => {
    if (!nodes.productsGrid) return;
    const term = (nodes.productsSearch?.value || '').trim().toLowerCase();
    let filtered = products.filter(product => {
      const stock = getProductStock(product);
      if (term) {
        const title = (product.title || '').toLowerCase();
        const barcode = (product.barcode || '').toLowerCase();
        return title.includes(term) || barcode.includes(term);
      }
      return true;
    });

    nodes.productsGrid.innerHTML = '';
    let stockTotal = 0;

    if (filtered.length === 0) {
      nodes.productsGrid.innerHTML = '<div class="empty-state">No se encontraron productos.</div>';
      if (nodes.productsCount) nodes.productsCount.textContent = '0';
      if (nodes.productsStock) nodes.productsStock.textContent = '0';
      return;
    }

    filtered.forEach(product => {
      const stock = Math.max(0, getProductStock(product));
      stockTotal += stock;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / POAS_PRODUCTS_PER_PAGE));
    if (poasCurrentPage > totalPages) poasCurrentPage = totalPages;
    const start = (poasCurrentPage - 1) * POAS_PRODUCTS_PER_PAGE;
    const visible = filtered.slice(start, start + POAS_PRODUCTS_PER_PAGE);
    renderPoasPagination(totalPages);

    visible.forEach(product => {
      const stock = Math.max(0, getProductStock(product));
      const price = getProductPrice(product);
      const card = document.createElement('div');
      card.className = `product-card${stock <= 0 ? ' out' : ''}`;
      
      let variantHTML = '';
      const hasVariants = product?.variants?.options?.length > 0;
      if (hasVariants) {
        variantHTML = `
          <select class="poas-variant-selector" data-id="${product.id}" style="width:100%;padding:6px;font-size:9px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;background:#f9f9f9;cursor:pointer">
            <option value="">-- Elige opción (Stock varía) --</option>
            ${product.variants.options.map((opt, idx) => {
              const variantStock = getVariantStock(opt);
              return `<option value="${idx}">${opt.name} (${variantStock})</option>`;
            }).join('')}
          </select>
        `;
      }
      
      card.innerHTML = `
        <img src="${getImagePath(product.img)}" alt="${product.title || 'Producto'}" />
        <h3>${product.title || 'Producto sin nombre'}</h3>
        <div class="product-meta">
          <span class="product-price">${formatCRC(price)}</span>
          <span class="product-stock">Stock: ${hasVariants ? 'ver opciones' : stock}</span>
        </div>
        ${variantHTML}
        <button class="poas-btn" ${stock <= 0 ? 'disabled' : ''} data-action="add" data-id="${product.id}">
          ${stock <= 0 ? 'Agotado' : 'Agregar'}
        </button>
      `;
      
      if (hasVariants) {
        const select = card.querySelector('.poas-variant-selector');
        select.addEventListener('change', (e) => {
          if (e.target.value !== '') {
            addVariantToCart(product.id, parseInt(e.target.value));
            e.target.value = '';
          }
        });
        select.addEventListener('click', (e) => e.stopPropagation());
      }
      
      nodes.productsGrid.appendChild(card);
    });

    if (nodes.productsCount) nodes.productsCount.textContent = String(filtered.length);
    if (nodes.productsStock) nodes.productsStock.textContent = String(stockTotal);
  };

  const renderCart = () => {
    if (!nodes.cartItems) return;
    nodes.cartItems.innerHTML = '';

    if (!cart.length) {
      nodes.cartItems.innerHTML = '<div class="empty-state">El carrito está vacío.</div>';
      if (nodes.cartSubtotal) nodes.cartSubtotal.textContent = formatCRC(0);
      if (nodes.cartTotal) nodes.cartTotal.textContent = formatCRC(0);
      return;
    }

    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      const displayTitle = item.variantName ? `${item.title} - ${item.variantName}` : item.title;
      const removeId = item.variantId || item.id;
      const decreaseId = item.variantId || item.id;
      const increaseId = item.variantId || item.id;
      
      el.innerHTML = `
        <img src="${getImagePath(item.img)}" alt="${item.title}" />
        <div>
          <h4>${displayTitle}</h4>
          <div class="price">${formatCRC(item.price)}</div>
          <div class="cart-qty">
            <button data-action="decrease" data-id="${decreaseId}" data-variant="${item.variantId || ''}">-</button>
            <span>${item.qty}</span>
            <button data-action="increase" data-id="${increaseId}" data-variant="${item.variantId || ''}">+</button>
            <button class="poas-btn ghost" data-action="remove" data-id="${removeId}" data-variant="${item.variantId || ''}">Quitar</button>
          </div>
        </div>
      `;
      nodes.cartItems.appendChild(el);
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (nodes.cartSubtotal) nodes.cartSubtotal.textContent = formatCRC(subtotal);
    if (nodes.cartTotal) nodes.cartTotal.textContent = formatCRC(subtotal);
  };

  const addVariantToCart = (productId, variantIndex) => {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product || !product?.variants?.options?.[variantIndex]) return;
    
    const variant = product.variants.options[variantIndex];
    const variantStock = getVariantStock(variant);
    
    if (variantStock <= 0) {
      alert(`Sin stock de ${variant.name}.`);
      return;
    }
    
    const variantId = productId + '-' + variant.name;
    const existing = cart.find(item => item.variantId === variantId);
    
    if (existing) {
      if (existing.qty >= variantStock) {
        alert('No hay más stock disponible.');
        return;
      }
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        variantId: variantId,
        variantName: variant.name,
        title: product.title || 'Producto',
        price: variant.price || getProductPrice(product),
        img: product.img || '',
        barcode: variant.barcode || product.barcode || '',
        qty: 1
      });
    }
    saveCart(cart);
    renderCart();
  };

  const addToCart = (productId) => {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;
    
    if (product?.variants?.options?.length > 0) {
      alert('Por favor, selecciona una opción del producto.');
      return;
    }
    
    const stock = getProductStock(product);
    if (stock <= 0) {
      alert('Producto sin stock disponible.');
      return;
    }
    const existing = cart.find(item => String(item.id) === String(productId) && !item.variantId);
    if (existing) {
      if (existing.qty >= stock) {
        alert('No hay más stock disponible.');
        return;
      }
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title || 'Producto',
        price: getProductPrice(product),
        img: product.img || '',
        barcode: product.barcode || '',
        qty: 1
      });
    }
    saveCart(cart);
    renderCart();
  };

  const updateCartQty = (productId, delta, variantId) => {
    let item;
    if (variantId) {
      item = cart.find(i => i.variantId === variantId);
    } else {
      item = cart.find(i => String(i.id) === String(productId) && !i.variantId);
    }
    
    if (!item) return;
    
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;
    
    let stock;
    if (variantId && item.variantName) {
      const variant = product.variants?.options?.find(opt => opt.name === item.variantName);
      stock = variant ? getVariantStock(variant) : 0;
    } else {
      stock = getProductStock(product);
    }
    
    const nextQty = item.qty + delta;
    if (nextQty <= 0) {
      cart = variantId ? cart.filter(i => i.variantId !== variantId) : cart.filter(i => String(i.id) !== String(productId) || i.variantId);
    } else if (nextQty > stock) {
      alert('No hay más stock disponible.');
      return;
    } else {
      item.qty = nextQty;
    }
    saveCart(cart);
    renderCart();
  };

  const removeFromCart = (productId, variantId) => {
    if (variantId) {
      cart = cart.filter(i => i.variantId !== variantId);
    } else {
      cart = cart.filter(i => String(i.id) !== String(productId) || i.variantId);
    }
    saveCart(cart);
    renderCart();
  };

  const clearCart = () => {
    if (!confirm('¿Deseas limpiar el carrito?')) return;
    cart = [];
    saveCart(cart);
    renderCart();
  };

  const getFormattedCartItems = () => {
    return cart.map(item => ({
      id: item.id,
      title: item.variantName ? `${item.title} - ${item.variantName}` : item.title,
      price: item.price,
      qty: item.qty
    }));
  };

  const applyInventoryDelta = (items, delta) => {
    items.forEach(item => {
      const product = products.find(p => String(p.id) === String(item.id));
      if (!product) return;
      
      // Si tiene variantId, aplica el cambio a la variante específica
      if (item.variantId && item.variantName) {
        const variant = product.variants?.options?.find(opt => opt.name === item.variantName);
        if (variant) {
          variant.inventory = variant.inventory || {};
          ['tienda1', 'tienda2', 'tienda3', 'bodega'].forEach(store => {
            variant.inventory[store] = Math.max(0, (variant.inventory[store] || 0) + (delta * item.qty));
          });
        }
      } else {
        // Si no tiene variante, aplica al stock general del producto
        ensureInventory(product);
        const next = Math.max(0, Number(product.inventory.poas || 0) + (delta * item.qty));
        product.inventory.poas = next;
      }
    });
    saveProducts(products);
  };

  const createInvoice = ({ type, total, items, payment, cashier }) => {
    const invoices = loadInvoices();
    invoices.unshift({
      id: `POAS-${Date.now()}`,
      type,
      date: getLocalISODateTime(),
      total,
      items: deepClone(items),
      payment,
      cashier: cashier || ''
    });
    saveInvoices(invoices);
  };

  const normalizePayment = (payment, total = 0) => {
    if (!payment) {
      return { methods: [], received: 0, change: 0 };
    }
    if (Array.isArray(payment.methods)) {
      const received = Number(payment.received || payment.receivedTotal || 0);
      return {
        methods: payment.methods.map(p => ({
          method: p.method || 'efectivo',
          amount: Number(p.amount || 0)
        })),
        received,
        change: Number(payment.change || Math.max(0, received - total))
      };
    }
    const received = Number(payment.received || 0);
    return {
      methods: [{ method: payment.method || 'efectivo', amount: received }],
      received,
      change: Number(payment.change || Math.max(0, received - total))
    };
  };

  const getPaymentLabel = (method) => {
    const map = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      sinpe: 'Sinpe móvil',
      otro: 'Otro'
    };
    return map[method] || method;
  };

  const ensurePoasThermalPrintStyle = () => {
    const existingStyle = document.getElementById('poas-thermal-print-style');
    if (existingStyle) return;
    const style = document.createElement('style');
    style.id = 'poas-thermal-print-style';
    style.textContent = `
      @media print {
        /* Force page size for 80mm receipts and remove margins */
        /* Use 72mm printable width (rollo 72mm) and leave safe non-printable margins */
        html, body { width:72mm !important; margin:0 !important; padding:0 !important; background:#fff !important; color:#000 !important; box-sizing:border-box !important; }
        * { box-sizing:border-box; color-adjust:exact !important; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
        @page { size:72mm auto; margin:3mm; }

        /* Hide everything except the invoice modals */
        body > * { display:none !important; }

        #invoice-modal,
        #apartado-invoice-modal,
        #completion-invoice-modal,
        #abono-invoice-modal {
          position:static !important;
          background:#fff !important;
          width:72mm !important;
          display:block !important;
          padding:0 !important;
          margin:0 !important;
          max-width:none !important;
          max-height:none !important;
          overflow:visible !important;
          color:#000 !important;
          font-family: Arial, Helvetica, sans-serif !important;
          font-size:12px !important;
          line-height:1.28 !important;
          box-sizing:border-box !important;
          padding:0 !important;
        }

        #invoice-modal > div,
        #apartado-invoice-modal > div,
        #completion-invoice-modal > div,
        #abono-invoice-modal > div {
          box-shadow:none !important;
          border-radius:0 !important;
          /* content area slightly smaller than paper to avoid non-printable edges */
          width:66mm !important;
          max-width:66mm !important;
          padding:1mm !important;
          margin:0 !important;
          border:none !important;
          page-break-after:avoid !important;
          background:#fff !important;
        }

        #invoice-modal > div > div,
        #apartado-invoice-modal > div > div,
        #completion-invoice-modal > div > div,
        #abono-invoice-modal > div > div {
          width:100% !important;
          color:#000 !important;
        }

        /* Ensure buttons are hidden */
        button { display:none !important; }

        /* Logo sizing for impact printers: smaller so it doesn't push content */
        #invoice-modal img,
        #apartado-invoice-modal img,
        #completion-invoice-modal img,
        #abono-invoice-modal img {
          -webkit-print-color-adjust:exact !important;
          print-color-adjust:exact !important;
          max-width:40mm !important;
          width:auto !important;
          height:auto !important;
          display:block !important;
          margin:0 auto 4px !important;
          opacity:1 !important;
        }

        /* Force darker, fully opaque text for printed invoices */
        #invoice-modal, #invoice-modal *,
        #apartado-invoice-modal, #apartado-invoice-modal *,
        #completion-invoice-modal, #completion-invoice-modal *,
        #abono-invoice-modal, #abono-invoice-modal * {
          color: #000 !important;
          opacity: 1 !important;
          filter: none !important;
          -webkit-filter: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          -webkit-font-smoothing: antialiased !important;
          font-weight: 600 !important;
        }

        table { width:100% !important; color:#000 !important; font-size:11px !important; table-layout:fixed !important; border-collapse:collapse !important; }
        tr { page-break-inside:avoid !important; }
        td, th { border:none !important; padding:0.35mm 0.6mm !important; color:#000 !important; font-size:11px !important; font-weight:600 !important; word-wrap:break-word; overflow-wrap:break-word; }

        /* inner content should respect the page margins: more left padding to avoid left cut */
        #invoice-modal > div > div,
        #apartado-invoice-modal > div > div,
        #completion-invoice-modal > div > div,
        #abono-invoice-modal > div > div {
          width:100% !important;
          /* shift content to the right to avoid left-side cut on TM-U220A */
          padding-left:5mm !important;
          padding-right:3mm !important;
          box-sizing:border-box !important;
        }

        /* Larger headings and totals — make store title very prominent and consistent */
        #invoice-modal .invoice-title, #invoice-modal h1 { font-size:20px !important; font-weight:800 !important; letter-spacing:0.2px !important; text-rendering:geometricPrecision !important; }
        #invoice-modal tfoot td { font-size:18px !important; font-weight:800 !important; }

        /* Ensure crisp rendering on impact/thermal printers */
        #invoice-modal, #invoice-modal * { -webkit-font-smoothing:antialiased !important; text-rendering:optimizeLegibility !important; font-synthesis:none !important; }

        /* Ensure Arial overall */
        body, table, td, th, div, span { font-family: Arial, Helvetica, sans-serif !important; color:#000 !important; }
      }
    `;
    document.head.appendChild(style);
  };

  const printSaleInvoice = ({ invoiceId, total, items, payment, cashier }) => {
    const now = new Date();
    const invoiceDate = now.toLocaleDateString('es-CR');
    const invoiceTime = now.toLocaleTimeString('es-CR');
    
    const itemsHTML = items.map(item => {
      const displayTitle = item.variant ? `${item.title} - ${item.variant}` : item.title;
      return `
        <tr>
          <td class="invoice-desc" style="word-wrap:break-word;max-width:40mm;padding:2px 0">${displayTitle}</td>
          <td class="invoice-qty" style="text-align:center;padding:0 4px">x${item.qty}</td>
          <td class="invoice-price" style="text-align:right;padding:0 4px"><span class="invoice-amount">${formatCRC(item.price)}</span></td>
          <td class="invoice-line-total" style="text-align:right;padding:0 4px"><span class="invoice-amount">${formatCRC(item.price * item.qty)}</span></td>
        </tr>
      `;
    }).join('');

    const paymentInfo = normalizePayment(payment, total);
    const change = Math.max(0, paymentInfo.received - total);
    const methodsHTML = paymentInfo.methods.length ? paymentInfo.methods.map(p => `
      <div style="display:flex;justify-content:space-between;font-size:8px">
        <span>${getPaymentLabel(p.method)}</span>
        <span>${formatCRC(p.amount)}</span>
      </div>
    `).join('') : '';
    
    const html = `
      <div style="font-family:Arial, Helvetica, sans-serif;width:72mm;margin:0;padding:0;background:#fff;font-size:14px;color:#000;line-height:1.25;-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box">
        <div style="text-align:center;margin-bottom:6px;border-bottom:2px dashed #000;padding-bottom:6px">
          <img src="Logo%20Po%C3%A1s/Logos-Poas-negro.png" alt="Logo Poás" style="max-width:30mm;width:auto;height:auto;display:block;margin:0 auto 6px;filter:contrast(120%);opacity:1;" />
            <div style="margin:4px 0;font-size:20px;font-weight:800;color:#000" class="invoice-title">FACTURA DE VENTA</div>
          </div>
        
        <div style="border-bottom:2px dashed #000;padding:6px 0;margin-bottom:8px;font-size:12px;line-height:1.3">
          <div style="display:flex;justify-content:space-between">
            <span>Factura:</span>
            <span>${invoiceId}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>Fecha:</span>
            <span>${invoiceDate}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>Hora:</span>
            <span>${invoiceTime}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span>Cajero:</span>
            <span>${cashier}</span>
          </div>
        </div>

        <table style="width:100%;font-size:13px;margin-bottom:8px;border-collapse:collapse;line-height:1.4;table-layout:fixed">
          <colgroup>
            <col style="width:40%" />
            <col style="width:10%" />
            <col style="width:22%" />
            <col style="width:28%" />
          </colgroup>
          <thead>
            <tr style="border-bottom:1px dashed #000">
              <th class="invoice-desc" style="text-align:left;padding:4px 0;font-weight:900;font-size:13px">Descripción</th>
              <th class="invoice-qty" style="text-align:center;padding:4px 2px;font-weight:900;font-size:13px">Qty</th>
              <th class="invoice-price" style="text-align:right;padding:4px 2px;font-weight:900;font-size:13px">Precio</th>
              <th class="invoice-line-total" style="text-align:right;padding:4px 2px;font-weight:900;font-size:13px">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="border-top:1px dashed #000">
              <td colspan="3" style="text-align:right;padding:6px 2px;font-weight:900;font-size:18px">TOTAL:</td>
              <td style="text-align:right;padding:6px 2px;font-weight:900;font-size:18px"><span class="invoice-amount">${formatCRC(total)}</span></td>
            </tr>
          </tfoot>
        </table>

        <div style="border-top:2px dashed #000;padding-top:6px;font-size:11px;line-height:1.3">
          ${methodsHTML ? `
          <div style="margin-bottom:6px">
            <div style="font-weight:bold;margin-bottom:4px;font-size:12px">MÉTODOS DE PAGO</div>
            ${methodsHTML}
          </div>
          ` : ''}
          <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:14px">
            <span>Recibido:</span>
            <span>${formatCRC(paymentInfo.received)}</span>
          </div>
          ${change > 0 ? `
          <div style="display:flex;justify-content:space-between;font-weight:bold;margin-top:4px;font-size:14px">
            <span>VUELTO:</span>
            <span>${formatCRC(change)}</span>
          </div>
          ` : ''}
        </div>

        <div style="text-align:center;margin-top:8px;padding-top:6px;border-top:2px dashed #000;font-size:11px;line-height:1.3">
          <div style="margin:2px 0">¡Gracias por su compra!</div>
          <div style="margin:2px 0">${new Date().toLocaleDateString('es-CR')}</div>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'invoice-modal';
    modal.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px`;
    modal.innerHTML = `
      <div style="background:#fff;border-radius:6px;max-width:320px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.2)">
        ${html}
        <div style="display:flex;gap:8px;margin-top:12px;padding:0 12px 12px">
          <button onclick="window.print()" class="poas-btn" style="flex:1">🖨️ Imprimir</button>
          <button onclick="document.getElementById('invoice-modal')?.remove()" class="poas-btn ghost" style="flex:1">Cerrar</button>
        </div>
      </div>
    `;

    ensurePoasThermalPrintStyle();

    ensurePoasThermalPrintStyle();
    document.body.appendChild(modal);
    // Auto-print immediately when a sale is completed. Try direct print first,
    // then fallback to opening a print window if the dialog is blocked.
    try {
      setTimeout(() => {
        try { window.print(); } catch(e) {}
        // Fallback: open a minimal window with the invoice HTML and print from there
        try {
          const win = window.open('', '_blank');
          if (win) {
            const styleNode = document.getElementById('poas-thermal-print-style');
            const injected = styleNode ? `<style>${styleNode.textContent}</style>` : '';
            win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Factura</title>${injected}</head><body>${html}</body></html>`);
            win.document.close();
            setTimeout(() => { try { win.print(); } catch (e) {} setTimeout(() => { try { win.close(); } catch(e) {} }, 500); }, 300);
          }
        } catch (e) {}
      }, 300);
    } catch (e) {}
  };

  const printApartadoInvoice = ({ apartado }) => {
    const itemsHTML = apartado.items.map(item => `
      <tr>
        <td>${item.title}</td>
        <td style="text-align:center">${item.qty}</td>
        <td style="text-align:right">${formatCRC(item.price)}</td>
        <td style="text-align:right">${formatCRC(item.price * item.qty)}</td>
      </tr>
    `).join('');

    const expiresAt = new Date(apartado.expiresAt);
    
    const html = `
      <div style="font-family:Arial, Helvetica, sans-serif;width:320px;margin:0 auto;padding:8px;background:#fff;font-size:11px;color:#000">
        <div style="text-align:center;margin-bottom:10px;border-bottom:1px dashed #000;padding-bottom:10px">
          <img src="Logo%20Po%C3%A1s/Logos-Poas-negro.png" alt="Logo Poás" style="width:70%;height:auto;max-width:100%;display:block;margin:0 auto 8px;filter:contrast(300%) grayscale(100%);opacity:1">
          <div style="margin:0;font-size:12px;font-weight:800">CONSTANCIA DE APARTADO</div>
        </div>
        
        <div style="border-bottom:1px dashed #000;padding:6px 0;margin-bottom:8px;font-size:9px">
          <div style="display:flex;justify-content:space-between">
            <span><strong>ID Apartado:</strong></span>
            <span>${apartado.id}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span><strong>Fecha:</strong></span>
            <span>${new Date(apartado.date).toLocaleDateString('es-CR')}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span><strong>Cajero:</strong></span>
            <span>${apartado.cashier}</span>
          </div>
        </div>

        <div style="background:#f0f0f0;padding:8px;margin-bottom:8px;border:1px dashed #000;font-size:9px">
          <div style="font-weight:bold">CLIENTE:</div>
          <div>${apartado.client}</div>
          ${apartado.phone ? `<div>Tel: ${apartado.phone}</div>` : ''}
          ${apartado.email ? `<div>${apartado.email}</div>` : ''}
        </div>

        <table style="width:100%;font-size:10px;margin-bottom:8px;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:1px dashed #000">
              <th style="text-align:left;padding:3px 0">Descripción</th>
              <th style="text-align:center;padding:3px 0">Qty</th>
              <th style="text-align:right;padding:3px 0">Precio</th>
              <th style="text-align:right;padding:3px 0">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="border-top:1px dashed #000;font-weight:900;font-size:11px">
              <td colspan="3" style="text-align:right;padding:6px 0">TOTAL APARTADO:</td>
              <td style="text-align:right;padding:6px 0">${formatCRC(apartado.total)}</td>
            </tr>
            <tr style="background:#f0f0f0">
              <td colspan="3" style="text-align:right;padding:6px 0;font-weight:900">SEÑA RECIBIDA:</td>
              <td style="text-align:right;padding:6px 0;font-weight:900">${formatCRC(apartado.deposit)}</td>
            </tr>
            ${apartado.balance > 0 ? `
            <tr>
              <td colspan="3" style="text-align:right;padding:3px 0;font-weight:bold">SALDO PENDIENTE:</td>
              <td style="text-align:right;padding:3px 0;font-weight:bold">${formatCRC(apartado.balance)}</td>
            </tr>
            ` : ''}
          </tfoot>
        </table>

        ${apartado.notes ? `
        <div style="background:#f9f9f9;padding:6px;margin-bottom:8px;border:1px dashed #000;font-size:8px">
          <div style="font-weight:bold">NOTAS:</div>
          <div>${apartado.notes}</div>
        </div>
        ` : ''}

        <div style="background:#f0f0f0;border:1px dashed #000;padding:8px;margin-bottom:8px;font-size:8px;text-align:center">
          <div style="font-weight:bold;margin-bottom:3px">VÁLIDO POR 30 DÍAS</div>
          <div>Vence: ${expiresAt.toLocaleDateString('es-CR')}</div>
        </div>

        <div style="text-align:center;padding-top:8px;border-top:1px dashed #000;font-size:8px">
          <div style="margin:3px 0">¡Su apartado ha sido registrado!</div>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'apartado-invoice-modal';
    modal.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px`;
    modal.innerHTML = `
      <div style="background:#fff;border-radius:6px;max-width:320px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.2)">
        ${html}
        <div style="display:flex;gap:8px;margin-top:12px;padding:0 12px 12px">
          <button onclick="window.print()" class="poas-btn" style="flex:1">🖨️ Imprimir</button>
          <button onclick="document.getElementById('apartado-invoice-modal')?.remove()" class="poas-btn ghost" style="flex:1">Cerrar</button>
        </div>
      </div>
    `;

    ensurePoasThermalPrintStyle();
    document.body.appendChild(modal);
  };

  const printApartadoCompletionInvoice = ({ apartado, paymentMethod, received, change, paymentMethods }) => {
    const itemsHTML = apartado.items.map(item => `
      <tr>
        <td>${item.title}</td>
        <td style="text-align:center">${item.qty}</td>
        <td style="text-align:right">${formatCRC(item.price)}</td>
        <td style="text-align:right">${formatCRC(item.price * item.qty)}</td>
      </tr>
    `).join('');

    const methods = Array.isArray(paymentMethods) ? paymentMethods : (paymentMethod ? [{ method: paymentMethod, amount: received }] : []);
    const methodsHTML = methods.length ? methods.map(p => `
      <div style="display:flex;justify-content:space-between">
        <span>${getPaymentLabel(p.method)}</span>
        <span>${formatCRC(p.amount)}</span>
      </div>
    `).join('') : '';

    const html = `
      <div style="font-family:Arial, Helvetica, sans-serif;width:320px;margin:0 auto;padding:8px;background:#fff;font-size:11px;color:#000">
        <div style="text-align:center;margin-bottom:10px;border-bottom:1px dashed #000;padding-bottom:10px">
          <img src="Logo%20Po%C3%A1s/Logos-Poas-negro.png" alt="Logo Poás" style="width:70%;height:auto;max-width:100%;display:block;margin:0 auto 8px;filter:contrast(300%) grayscale(100%);opacity:1">
          <div style="margin:0;font-size:12px;font-weight:800">LIQUIDACIÓN DE APARTADO</div>
        </div>
        
        <div style="border-bottom:1px dashed #000;padding:6px 0;margin-bottom:8px;font-size:9px">
          <div style="display:flex;justify-content:space-between">
            <span><strong>ID Apartado:</strong></span>
            <span>${apartado.id}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span><strong>Cliente:</strong></span>
            <span>${apartado.client}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span><strong>Liquidado:</strong></span>
            <span>${new Date().toLocaleDateString('es-CR')}</span>
          </div>
        </div>

        <table style="width:100%;font-size:10px;margin-bottom:8px;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:1px dashed #000">
              <th style="text-align:left;padding:3px 0">Descripción</th>
              <th style="text-align:center;padding:3px 0">Qty</th>
              <th style="text-align:right;padding:3px 0">Precio</th>
              <th style="text-align:right;padding:3px 0">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="border-top:1px dashed #000;font-weight:900;font-size:11px">
              <td colspan="3" style="text-align:right;padding:6px 0">TOTAL APARTADO:</td>
              <td style="text-align:right;padding:6px 0">${formatCRC(apartado.total)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="border-top:1px dashed #000;border-bottom:1px dashed #000;padding:6px 0;margin-bottom:8px;font-size:9px">
          <div style="background:#f0f0f0;padding:4px;margin-bottom:4px">
            <div style="display:flex;justify-content:space-between">
              <span><strong>Seña inicial:</strong></span>
              <span>${formatCRC(apartado.depositPaid)}</span>
            </div>
          </div>
          <div style="background:#fff3e0;padding:5px">
            <div style="display:flex;justify-content:space-between">
              <span><strong>Saldo pagado:</strong></span>
              <span>${formatCRC(apartado.balancePaid)}</span>
            </div>
          </div>
        </div>

        <div style="background:#f0f0f0;padding:8px;margin-bottom:8px;border:1px dashed #000;font-size:9px">
          ${methodsHTML ? `
          <div style="margin-bottom:4px">
            <div style="font-weight:bold;margin-bottom:2px">Métodos de pago</div>
            ${methodsHTML}
          </div>
          ` : ''}
          <div style="display:flex;justify-content:space-between;margin-bottom:3px">
            <span style="font-weight:bold">Monto recibido:</span>
            <span>${formatCRC(received)}</span>
          </div>
          ${change > 0 ? `
          <div style="display:flex;justify-content:space-between;font-weight:bold">
            <span>VUELTO:</span>
            <span>${formatCRC(change)}</span>
          </div>
          ` : ''}
        </div>

        <div style="text-align:center;padding-top:8px;border-top:1px dashed #000;font-size:8px">
          <div style="margin:3px 0">Apartado completado</div>
          <div style="margin:3px 0">${new Date().toLocaleDateString('es-CR')}</div>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'completion-invoice-modal';
    modal.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px`;
    modal.innerHTML = `
      <div style="background:#fff;border-radius:6px;max-width:320px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.2)">
        ${html}
        <div style="display:flex;gap:8px;margin-top:12px;padding:0 12px 12px">
          <button onclick="window.print()" class="poas-btn" style="flex:1">🖨️ Imprimir</button>
          <button onclick="document.getElementById('completion-invoice-modal')?.remove()" class="poas-btn ghost" style="flex:1">Cerrar</button>
        </div>
      </div>
    `;

    ensurePoasThermalPrintStyle();
    document.body.appendChild(modal);
  };

  const printApartadoAbonoInvoice = ({ apartado, abono }) => {
    const itemsHTML = (apartado.items || []).map(item => `
      <tr>
        <td>${item.title}</td>
        <td style="text-align:center">${item.qty}</td>
        <td style="text-align:right">${formatCRC(item.price)}</td>
        <td style="text-align:right">${formatCRC(item.price * item.qty)}</td>
      </tr>
    `).join('');

    const methods = Array.isArray(abono.methods) ? abono.methods : [];
    const methodsHTML = methods.length ? methods.map(p => `
      <div style="display:flex;justify-content:space-between">
        <span>${getPaymentLabel(p.method)}</span>
        <span>${formatCRC(p.amount)}</span>
      </div>
    `).join('') : '';

    const expiresAt = apartado.expiresAt ? new Date(apartado.expiresAt) : null;

    const html = `
      <div style="font-family:Arial, Helvetica, sans-serif;width:280px;margin:0 auto;padding:8px;background:#fff;font-size:9px;color:#000">
        <div style="text-align:center;margin-bottom:8px;border-bottom:1px dashed #000;padding-bottom:8px">
          <img src="Logo%20Po%C3%A1s/Logos-Poas-negro.png" alt="Logo Poás" style="width:50%;height:auto;max-width:100%;display:block;margin:0 auto 6px;filter:contrast(250%) grayscale(100%);opacity:1">
          <div style="margin:0;font-size:8px">RECIBO DE ABONO</div>
        </div>
        
        <div style="border-bottom:1px dashed #000;padding:6px 0;margin-bottom:8px;font-size:9px">
          <div style="display:flex;justify-content:space-between">
            <span><strong>ID Apartado:</strong></span>
            <span>${apartado.id}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span><strong>Fecha:</strong></span>
            <span>${new Date(abono.date).toLocaleString('es-CR')}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span><strong>Cliente:</strong></span>
            <span>${apartado.client}</span>
          </div>
        </div>

        <table style="width:100%;font-size:8px;margin-bottom:8px;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:1px dashed #000">
              <th style="text-align:left;padding:3px 0">Descripción</th>
              <th style="text-align:center;padding:3px 0">Qty</th>
              <th style="text-align:right;padding:3px 0">Precio</th>
              <th style="text-align:right;padding:3px 0">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="border-top:1px dashed #000;font-weight:bold">
              <td colspan="3" style="text-align:right;padding:3px 0">TOTAL APARTADO:</td>
              <td style="text-align:right;padding:3px 0">${formatCRC(apartado.total)}</td>
            </tr>
            <tr style="background:#f0f0f0">
              <td colspan="3" style="text-align:right;padding:3px 0;font-weight:bold">ABONO:</td>
              <td style="text-align:right;padding:3px 0;font-weight:bold">${formatCRC(abono.amount)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align:right;padding:3px 0;font-weight:bold">SALDO PENDIENTE:</td>
              <td style="text-align:right;padding:3px 0;font-weight:bold">${formatCRC(apartado.balance)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background:#f0f0f0;padding:8px;margin-bottom:8px;border:1px dashed #000;font-size:9px">
          ${methodsHTML ? `
          <div style="margin-bottom:4px">
            <div style="font-weight:bold;margin-bottom:2px">Métodos de pago</div>
            ${methodsHTML}
          </div>
          ` : ''}
          <div style="display:flex;justify-content:space-between;margin-bottom:3px">
            <span style="font-weight:bold">Monto recibido:</span>
            <span>${formatCRC(abono.received)}</span>
          </div>
          ${abono.change > 0 ? `
          <div style="display:flex;justify-content:space-between;font-weight:bold">
            <span>VUELTO:</span>
            <span>${formatCRC(abono.change)}</span>
          </div>
          ` : ''}
        </div>

        ${expiresAt ? `
        <div style="background:#f0f0f0;border:1px dashed #000;padding:8px;margin-bottom:8px;font-size:8px;text-align:center">
          <div style="font-weight:bold;margin-bottom:3px">PRÓRROGA +15 DÍAS</div>
          <div>Nuevo vencimiento: ${expiresAt.toLocaleDateString('es-CR')}</div>
        </div>
        ` : ''}

        <div style="text-align:center;padding-top:8px;border-top:1px dashed #000;font-size:8px">
          <div style="margin:3px 0">¡Gracias por su abono!</div>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'abono-invoice-modal';
    modal.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px`;
    modal.innerHTML = `
      <div style="background:#fff;border-radius:6px;max-width:320px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.2)">
        ${html}
        <div style="display:flex;gap:8px;margin-top:12px;padding:0 12px 12px">
          <button onclick="window.print()" class="poas-btn" style="flex:1">🖨️ Imprimir</button>
          <button onclick="document.getElementById('abono-invoice-modal')?.remove()" class="poas-btn ghost" style="flex:1">Cerrar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  const openCheckoutModal = () => {
    if (!cart.length) {
      alert('El carrito está vacío.');
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setModal('Confirmar venta', `
      <div class="form-field">
        <label>Cajero</label>
        <select id="poas-checkout-cashier">
          <option value="">Seleccione un cajero</option>
          <optgroup label="Vendedores">
            <option value="Tamica">Tamica</option>
            <option value="Valerie">Valerie</option>
            <option value="Jesenia">Jesenia</option>
          </optgroup>
          <optgroup label="━━━ ENCARGADOS ━━━">
            <option value="Darlyn" style="color:#2196f3;font-weight:600">👑 Darlyn (Encargado)</option>
            <option value="Rebeca" style="color:#2196f3;font-weight:600">👑 Rebeca (Encargado)</option>
            <option value="Elizabeth" style="color:#2196f3;font-weight:600">👑 Elizabeth (Encargado)</option>
          </optgroup>
          <optgroup label="━━━ ADMINISTRADORES ━━━">
            <option value="Moni" style="color:red;font-weight:bold">🔴 Moni (Admin)</option>
            <option value="Hernan" style="color:red;font-weight:bold">🔴 Hernan (Admin)</option>
            <option value="David" style="color:red;font-weight:bold">🔴 David (Admin)</option>
            <option value="Esteban" style="color:red;font-weight:bold">🔴 Esteban (Admin)</option>
          </optgroup>
        </select>
      </div>
      <div class="form-field">
        <label>Métodos de pago</label>
        <div id="poas-payments-list" style="display:flex;flex-direction:column;gap:8px"></div>
        <button class="poas-btn ghost" type="button" id="poas-add-payment" style="margin-top:8px">➕ Agregar método</button>
      </div>
      <div class="form-field">
        <label>Total</label>
        <input type="text" value="${formatCRC(total)}" disabled />
      </div>
      <div class="form-field">
        <label>Resumen</label>
        <div id="poas-payment-summary" style="font-weight:600;color:var(--poas-blue)">Pendiente: ${formatCRC(total)}</div>
      </div>
      <div class="modal-actions">
        <button class="poas-btn ghost" id="poas-cancel-payment">Cancelar</button>
        <button class="poas-btn" id="poas-confirm-payment">Confirmar</button>
      </div>
    `);

    const paymentsList = document.getElementById('poas-payments-list');
    const summaryNode = document.getElementById('poas-payment-summary');
    const addPaymentBtn = document.getElementById('poas-add-payment');

    const createPaymentRow = (method = 'efectivo', amount = '') => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '1fr 120px 36px';
      row.style.gap = '8px';
      row.innerHTML = `
        <select class="poas-payment-method">
          <option value="efectivo" ${method === 'efectivo' ? 'selected' : ''}>Efectivo</option>
          <option value="tarjeta" ${method === 'tarjeta' ? 'selected' : ''}>Tarjeta</option>
          <option value="sinpe" ${method === 'sinpe' ? 'selected' : ''}>Sinpe móvil</option>
          <option value="otro" ${method === 'otro' ? 'selected' : ''}>Otro</option>
        </select>
        <input type="number" class="poas-payment-amount" min="0" step="0.01" placeholder="Monto" value="${amount}" />
        <button class="poas-btn ghost" type="button" aria-label="Quitar">✕</button>
      `;
      row.querySelector('button')?.addEventListener('click', () => {
        row.remove();
        updateSummary();
      });
      row.querySelector('.poas-payment-amount')?.addEventListener('input', updateSummary);
      row.querySelector('.poas-payment-method')?.addEventListener('change', updateSummary);
      return row;
    };

    const getPayments = () => {
      const rows = Array.from(document.querySelectorAll('#poas-payments-list > div'));
      return rows.map(row => {
        const method = row.querySelector('.poas-payment-method')?.value || 'efectivo';
        const amount = Number(row.querySelector('.poas-payment-amount')?.value || 0);
        return { method, amount };
      }).filter(p => p.amount > 0);
    };

    const updateSummary = () => {
      const payments = getPayments();
      const received = payments.reduce((sum, p) => sum + p.amount, 0);
      const remaining = total - received;
      if (!summaryNode) return;
      if (remaining > 0) {
        summaryNode.textContent = `Pendiente: ${formatCRC(remaining)}`;
      } else if (remaining < 0) {
        summaryNode.textContent = `Vuelto: ${formatCRC(Math.abs(remaining))}`;
      } else {
        summaryNode.textContent = 'Pago completo';
      }
    };

    if (paymentsList) {
      paymentsList.appendChild(createPaymentRow('efectivo', total.toFixed(2)));
      updateSummary();
    }

    addPaymentBtn?.addEventListener('click', () => {
      paymentsList?.appendChild(createPaymentRow());
    });

    document.getElementById('poas-cancel-payment')?.addEventListener('click', closeModal);
    document.getElementById('poas-confirm-payment')?.addEventListener('click', () => {
      const cashier = document.getElementById('poas-checkout-cashier')?.value || '';
      if (!cashier) {
        alert('Debe seleccionar un cajero.');
        return;
      }
      const payments = getPayments();
      if (!payments.length) {
        alert('Agrega al menos un método de pago con monto.');
        return;
      }
      const received = payments.reduce((sum, p) => sum + p.amount, 0);
      if (received < total) {
        alert('El monto recibido debe ser igual o mayor al total.');
        return;
      }
      const hasCash = payments.some(p => p.method === 'efectivo');
      if (received > total && !hasCash) {
        alert('El vuelto solo aplica si hay efectivo. Ajusta los montos.');
        return;
      }
      applyInventoryDelta(cart, -1);
      
      const invoiceId = `POAS-${Date.now()}`;
      const invoiceData = {
        type: 'venta',
        total,
        items: cart,
        cashier,
        payment: { methods: payments, received, change: Math.max(0, received - total) }
      };
      createInvoice(invoiceData);
      
      const cartItems = deepClone(cart);
      const formattedItems = getFormattedCartItems();
      cart = [];
      saveCart(cart);
      renderCart();
      renderProducts();
      closeModal();
      
      // Mostrar factura
      printSaleInvoice({
        invoiceId,
        total,
        items: formattedItems,
        payment: invoiceData.payment,
        cashier
      });
    });
  };

  const openApartadoModal = () => {
    if (!cart.length) {
      alert('El carrito está vacío.');
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    setModal('Crear apartado', `
      <div class="form-field">
        <label>Cajero</label>
        <select id="poas-apartado-cashier" required>
          <option value="">Seleccione un cajero</option>
          <optgroup label="Vendedores">
            <option value="Tamica">Tamica</option>
            <option value="Valerie">Valerie</option>
            <option value="Jesenia">Jesenia</option>
          </optgroup>
          <optgroup label="━━━ ENCARGADOS ━━━">
            <option value="Darlyn" style="color:#2196f3;font-weight:600">👑 Darlyn (Encargado)</option>
            <option value="Rebeca" style="color:#2196f3;font-weight:600">👑 Rebeca (Encargado)</option>
            <option value="Elizabeth" style="color:#2196f3;font-weight:600">👑 Elizabeth (Encargado)</option>
          </optgroup>
          <optgroup label="━━━ ADMINISTRADORES ━━━">
            <option value="Moni" style="color:red;font-weight:bold">🔴 Moni (Admin)</option>
            <option value="Hernan" style="color:red;font-weight:bold">🔴 Hernan (Admin)</option>
            <option value="David" style="color:red;font-weight:bold">🔴 David (Admin)</option>
            <option value="Esteban" style="color:red;font-weight:bold">🔴 Esteban (Admin)</option>
          </optgroup>
        </select>
      </div>
      <div class="form-field">
        <label>Cliente</label>
        <input type="text" id="poas-apartado-client" placeholder="Nombre completo" />
      </div>
      <div class="form-field">
        <label>Teléfono</label>
        <input type="tel" id="poas-apartado-phone" placeholder="8888-8888" />
      </div>
      <div class="form-field">
        <label>Correo</label>
        <input type="email" id="poas-apartado-email" placeholder="correo@ejemplo.com" />
      </div>
      <div class="form-field">
        <label>Seña</label>
        <input type="number" id="poas-apartado-deposit" min="0" step="0.01" />
      </div>
      <div class="form-field">
        <label>Método de pago</label>
        <select id="poas-apartado-method">
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="sinpe">Sinpe móvil</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div class="form-field">
        <label>Notas</label>
        <textarea id="poas-apartado-notes" rows="3" placeholder="Notas adicionales"></textarea>
      </div>
      <div class="form-field">
        <label>Total del apartado</label>
        <input type="text" value="${formatCRC(total)}" disabled />
      </div>
      <div class="modal-actions">
        <button class="poas-btn ghost" id="poas-cancel-apartado">Cancelar</button>
        <button class="poas-btn" id="poas-save-apartado">Guardar</button>
      </div>
    `);

    document.getElementById('poas-cancel-apartado')?.addEventListener('click', closeModal);
    document.getElementById('poas-save-apartado')?.addEventListener('click', () => {
      const cashier = document.getElementById('poas-apartado-cashier')?.value.trim();
      if (!cashier) {
        alert('Debe seleccionar un cajero.');
        return;
      }
      const client = document.getElementById('poas-apartado-client')?.value.trim();
      const deposit = Number(document.getElementById('poas-apartado-deposit')?.value || 0);
      const phone = document.getElementById('poas-apartado-phone')?.value.trim();
      const email = document.getElementById('poas-apartado-email')?.value.trim();
      const method = document.getElementById('poas-apartado-method')?.value || 'efectivo';
      const notes = document.getElementById('poas-apartado-notes')?.value.trim();

      if (!client) {
        alert('Ingresa el nombre del cliente.');
        return;
      }
      if (deposit <= 0) {
        alert('La seña debe ser mayor a ₡0.');
        return;
      }

      const apartados = loadApartados();
      const apartado = {
        id: `APT-POAS-${Date.now()}`,
        date: getLocalISODateTime(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cashier,
        client,
        phone,
        email,
        notes,
        paymentMethod: method,
        deposit,
        total,
        balance: Math.max(0, total - deposit),
        status: 'activo',
        items: deepClone(cart)
      };
      apartados.unshift(apartado);
      saveApartados(apartados);

      applyInventoryDelta(cart, -1);
      const formattedCartItems = getFormattedCartItems();
      createInvoice({
        type: 'apartado',
        total: deposit,
        items: formattedCartItems,
        payment: { method, received: deposit, change: 0, apartadoId: apartado.id }
      });

      const cartItems = deepClone(cart);
      cart = [];
      saveCart(cart);
      renderCart();
      renderProducts();
      renderApartados();
      closeModal();
      
      // Mostrar factura de apartado
      printApartadoInvoice({ apartado: { ...apartado, items: formattedCartItems } });
    });
  };

  const renderApartados = () => {
    if (!nodes.apartadosList) return;
    let apartados = loadApartados();
    const now = Date.now();
    apartados = apartados.map(ap => {
      if (ap.status === 'activo' && ap.expiresAt && new Date(ap.expiresAt).getTime() < now) {
        return { ...ap, status: 'vencido' };
      }
      return ap;
    });
    saveApartados(apartados);

    const term = (nodes.apartadosSearch?.value || '').trim().toLowerCase();
    if (term) {
      apartados = apartados.filter(ap =>
        ap.client?.toLowerCase().includes(term) ||
        ap.id?.toLowerCase().includes(term) ||
        ap.status?.toLowerCase().includes(term)
      );
    }

    nodes.apartadosList.innerHTML = '';
    if (!apartados.length) {
      nodes.apartadosList.innerHTML = '<div class="empty-state">No hay apartados registrados.</div>';
      return;
    }

    apartados.forEach(ap => {
      const card = document.createElement('div');
      card.className = 'apartado-card';
      const statusTag = ap.status === 'pagado' ? 'success' : ap.status === 'vencido' ? 'warning' : 'muted';
      card.innerHTML = `
        <div>
          <h4>${ap.client}</h4>
          <div class="apartado-meta">
            <div>ID: ${ap.id}</div>
            <div>Fecha: ${new Date(ap.date).toLocaleString('es-CR')}</div>
            <div>Total: ${formatCRC(ap.total)}</div>
            <div>Seña: ${formatCRC(ap.deposit)}</div>
            <div>Saldo: ${formatCRC(ap.balance)}</div>
          </div>
          <div class="apartado-tags">
            <span class="tag ${statusTag}">${ap.status.toUpperCase()}</span>
            <span class="tag">Expira: ${new Date(ap.expiresAt).toLocaleDateString('es-CR')}</span>
          </div>
        </div>
        <div class="apartado-actions">
          ${ap.balance > 0 && ap.status === 'activo' ? `<button class="poas-btn ghost" data-action="abono" data-id="${ap.id}">Abonar</button>` : ''}
          ${ap.balance > 0 && ap.status === 'activo' ? `<button class="poas-btn" data-action="complete" data-id="${ap.id}">Completar</button>` : ''}
          ${ap.status === 'activo' ? `<button class="poas-btn danger" data-action="cancel" data-id="${ap.id}">Cancelar</button>` : ''}
        </div>
      `;
      nodes.apartadosList.appendChild(card);
    });
  };

  const openAbonoModal = (apartadoId) => {
    const apartados = loadApartados();
    const apartado = apartados.find(ap => ap.id === apartadoId);
    if (!apartado || apartado.status !== 'activo' || !apartado.balance) return;

    const balance = Number(apartado.balance || 0);
    setModal('Registrar abono', `
      <div class="form-field">
        <label>Cliente</label>
        <input type="text" value="${apartado.client}" disabled />
      </div>
      <div class="form-field">
        <label>Saldo pendiente</label>
        <input type="text" value="${formatCRC(balance)}" disabled />
      </div>
      <div class="form-field">
        <label>Métodos de pago</label>
        <div id="poas-abono-payments" style="display:flex;flex-direction:column;gap:8px"></div>
        <button class="poas-btn ghost" type="button" id="poas-add-abono-payment" style="margin-top:8px">➕ Agregar método</button>
      </div>
      <div class="form-field">
        <label>Resumen</label>
        <div id="poas-abono-summary" style="font-weight:600;color:var(--poas-blue)">Pendiente: ${formatCRC(balance)}</div>
      </div>
      <div class="modal-actions">
        <button class="poas-btn ghost" id="poas-cancel-abono">Cancelar</button>
        <button class="poas-btn" id="poas-confirm-abono">Guardar abono</button>
      </div>
    `);

    const abonoPaymentsList = document.getElementById('poas-abono-payments');
    const addAbonoPaymentBtn = document.getElementById('poas-add-abono-payment');
    const abonoSummary = document.getElementById('poas-abono-summary');

    const createAbonoPaymentRow = (method = 'efectivo', amount = '') => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '1fr 120px 36px';
      row.style.gap = '8px';
      row.innerHTML = `
        <select class="poas-abono-method">
          <option value="efectivo" ${method === 'efectivo' ? 'selected' : ''}>Efectivo</option>
          <option value="tarjeta" ${method === 'tarjeta' ? 'selected' : ''}>Tarjeta</option>
          <option value="sinpe" ${method === 'sinpe' ? 'selected' : ''}>Sinpe móvil</option>
          <option value="otro" ${method === 'otro' ? 'selected' : ''}>Otro</option>
        </select>
        <input type="number" class="poas-abono-amount" min="0" step="0.01" placeholder="Monto" value="${amount}" />
        <button class="poas-btn ghost" type="button" aria-label="Quitar">✕</button>
      `;
      row.querySelector('button')?.addEventListener('click', () => {
        row.remove();
        updateAbonoSummary();
      });
      row.querySelector('.poas-abono-amount')?.addEventListener('input', updateAbonoSummary);
      row.querySelector('.poas-abono-method')?.addEventListener('change', updateAbonoSummary);
      return row;
    };

    const getAbonoPayments = () => {
      const rows = Array.from(document.querySelectorAll('#poas-abono-payments > div'));
      return rows.map(row => {
        const method = row.querySelector('.poas-abono-method')?.value || 'efectivo';
        const amount = Number(row.querySelector('.poas-abono-amount')?.value || 0);
        return { method, amount };
      }).filter(p => p.amount > 0);
    };

    const updateAbonoSummary = () => {
      const payments = getAbonoPayments();
      const received = payments.reduce((sum, p) => sum + p.amount, 0);
      const remaining = balance - received;
      if (!abonoSummary) return;
      if (remaining > 0) {
        abonoSummary.textContent = `Pendiente: ${formatCRC(remaining)}`;
      } else if (remaining < 0) {
        abonoSummary.textContent = `Vuelto: ${formatCRC(Math.abs(remaining))}`;
      } else {
        abonoSummary.textContent = 'Pago completo';
      }
    };

    if (abonoPaymentsList) {
      abonoPaymentsList.appendChild(createAbonoPaymentRow('efectivo', ''));
      updateAbonoSummary();
    }

    addAbonoPaymentBtn?.addEventListener('click', () => {
      abonoPaymentsList?.appendChild(createAbonoPaymentRow());
    });

    document.getElementById('poas-cancel-abono')?.addEventListener('click', closeModal);
    document.getElementById('poas-confirm-abono')?.addEventListener('click', () => {
      const payments = getAbonoPayments();
      if (!payments.length) {
        alert('Agrega al menos un método de pago con monto.');
        return;
      }
      const received = payments.reduce((sum, p) => sum + p.amount, 0);
      if (received <= 0) {
        alert('El abono debe ser mayor a ₡0.');
        return;
      }
      if (received > balance && !payments.some(p => p.method === 'efectivo')) {
        alert('El vuelto solo aplica si hay efectivo. Ajusta los montos.');
        return;
      }

      const newBalance = Math.max(0, balance - received);
      const prevExpiry = apartado.expiresAt ? new Date(apartado.expiresAt) : new Date();
      const extended = new Date(prevExpiry.getTime() + 15 * 24 * 60 * 60 * 1000);

      const abonoEntry = {
        date: getLocalISODateTime(),
        amount: received,
        methods: payments,
        received,
        change: Math.max(0, received - balance)
      };

      apartado.abonos = Array.isArray(apartado.abonos) ? apartado.abonos : [];
      apartado.abonos.unshift(abonoEntry);
      apartado.balance = newBalance;
      apartado.expiresAt = extended.toISOString();
      if (apartado.balance === 0) {
        apartado.status = 'pagado';
        apartado.paidAt = getLocalISODateTime();
      }

      saveApartados(apartados.map(ap => ap.id === apartadoId ? apartado : ap));

      createInvoice({
        type: 'apartado-abono',
        total: received,
        items: apartado.items || [],
        payment: { methods: payments, received, change: Math.max(0, received - balance), apartadoId }
      });

      renderApartados();
      closeModal();

      printApartadoAbonoInvoice({ apartado, abono: abonoEntry });
    });
  };

  const completeApartado = (apartadoId) => {
    const apartados = loadApartados();
    const apartado = apartados.find(ap => ap.id === apartadoId);
    if (!apartado) return;
    const balance = apartado.balance || 0;
    setModal('Completar apartado', `
      <div class="form-field">
        <label>Cliente</label>
        <input type="text" value="${apartado.client}" disabled />
      </div>
      <div class="form-field">
        <label>Saldo pendiente</label>
        <input type="text" value="${formatCRC(balance)}" disabled />
      </div>
      <div class="form-field">
        <label>Métodos de pago</label>
        <div id="poas-complete-payments" style="display:flex;flex-direction:column;gap:8px"></div>
        <button class="poas-btn ghost" type="button" id="poas-add-complete-payment" style="margin-top:8px">➕ Agregar método</button>
      </div>
      <div class="modal-actions">
        <button class="poas-btn ghost" id="poas-cancel-complete">Cancelar</button>
        <button class="poas-btn" id="poas-confirm-complete">Confirmar</button>
      </div>
    `);

    const completePaymentsList = document.getElementById('poas-complete-payments');
    const addCompletePaymentBtn = document.getElementById('poas-add-complete-payment');

    const createCompletePaymentRow = (method = 'efectivo', amount = '') => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '1fr 120px 36px';
      row.style.gap = '8px';
      row.innerHTML = `
        <select class="poas-complete-method">
          <option value="efectivo" ${method === 'efectivo' ? 'selected' : ''}>Efectivo</option>
          <option value="tarjeta" ${method === 'tarjeta' ? 'selected' : ''}>Tarjeta</option>
          <option value="sinpe" ${method === 'sinpe' ? 'selected' : ''}>Sinpe móvil</option>
          <option value="otro" ${method === 'otro' ? 'selected' : ''}>Otro</option>
        </select>
        <input type="number" class="poas-complete-amount" min="0" step="0.01" placeholder="Monto" value="${amount}" />
        <button class="poas-btn ghost" type="button" aria-label="Quitar">✕</button>
      `;
      row.querySelector('button')?.addEventListener('click', () => row.remove());
      return row;
    };

    const getCompletePayments = () => {
      const rows = Array.from(document.querySelectorAll('#poas-complete-payments > div'));
      return rows.map(row => {
        const method = row.querySelector('.poas-complete-method')?.value || 'efectivo';
        const amount = Number(row.querySelector('.poas-complete-amount')?.value || 0);
        return { method, amount };
      }).filter(p => p.amount > 0);
    };

    if (completePaymentsList) {
      completePaymentsList.appendChild(createCompletePaymentRow('efectivo', balance.toFixed(2)));
    }

    addCompletePaymentBtn?.addEventListener('click', () => {
      completePaymentsList?.appendChild(createCompletePaymentRow());
    });

    document.getElementById('poas-cancel-complete')?.addEventListener('click', closeModal);
    document.getElementById('poas-confirm-complete')?.addEventListener('click', () => {
      const payments = getCompletePayments();
      if (!payments.length) {
        alert('Agrega al menos un método de pago con monto.');
        return;
      }
      const received = payments.reduce((sum, p) => sum + p.amount, 0);
      if (received < balance) {
        alert('El monto recibido debe ser igual o mayor al saldo.');
        return;
      }
      const hasCash = payments.some(p => p.method === 'efectivo');
      if (received > balance && !hasCash) {
        alert('El vuelto solo aplica si hay efectivo. Ajusta los montos.');
        return;
      }
      apartado.balance = 0;
      apartado.status = 'pagado';
      apartado.paidAt = getLocalISODateTime();
      saveApartados(apartados.map(ap => ap.id === apartadoId ? apartado : ap));

      createInvoice({
        type: 'apartado-liquidacion',
        total: balance,
        items: apartado.items || [],
        payment: { methods: payments, received, change: Math.max(0, received - balance), apartadoId }
      });

      renderApartados();
      closeModal();
      
      // Generar factura final de liquidación del apartado
      printApartadoCompletionInvoice({
        apartado: { ...apartado, depositPaid: apartado.deposit, balancePaid: balance },
        paymentMethods: payments,
        paymentMethod: payments[0]?.method || 'efectivo',
        received,
        change: Math.max(0, received - balance)
      });
    });
  };

  const cancelApartado = (apartadoId) => {
    if (!confirm('¿Deseas cancelar este apartado?')) return;
    let apartados = loadApartados();
    const apartado = apartados.find(ap => ap.id === apartadoId);
    if (!apartado) return;
    applyInventoryDelta(apartado.items || [], 1);
    apartado.status = 'cancelado';
    saveApartados(apartados.map(ap => ap.id === apartadoId ? apartado : ap));
    renderApartados();
  };

  const openInvoicesModal = () => {
    const invoices = loadInvoices();
    if (!invoices.length) {
      setModal('Historial de facturas', '<div class="empty-state">No hay facturas registradas.</div>');
      return;
    }
    const renderInvoiceList = (list) => {
      return list.slice(0, 50).map(inv => `
        <div style="border-bottom:1px solid #eee;padding:16px;margin-bottom:8px;display:flex;justify-content:space-between;gap:16px;align-items:flex-start;background:#f8f9fa;border-radius:8px">
          <div style="flex:1">
            <strong style="font-size:1.1rem;display:block;margin-bottom:6px">${inv.id}</strong>
            <div style="font-size:0.9rem;color:#666;margin-bottom:6px">${inv.type}</div>
            <div style="font-size:0.85rem;color:#888;margin-bottom:4px">${new Date(inv.date).toLocaleString('es-CR')}</div>
            <div style="font-weight:600;color:var(--poas-blue);margin-bottom:4px">Total: ${formatCRC(inv.total)}</div>
            ${inv.cashier ? `<div style="font-size:0.9rem;color:#666">Cajero: <strong>${inv.cashier}</strong></div>` : ''}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;min-width:80px;justify-content:flex-end">
            <button class="poas-btn ghost" data-action="view" data-id="${inv.id}" style="padding:8px 12px;font-size:0.9rem">Ver</button>
          </div>
        </div>
      `).join('');
    };

    const downloadInvoicesCSV = () => {
      const lines = [];
      lines.push('ID,Fecha,Tipo,Total,Cajero,Metodos');
      invoices.forEach(inv => {
        const methods = normalizePayment(inv.payment, inv.total).methods.map(p => `${getPaymentLabel(p.method)} ${p.amount}`).join(' | ');
        lines.push(`${inv.id},${inv.date},${inv.type},${inv.total},${inv.cashier || ''},${methods}`);
      });
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `historial_facturas_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    };

    const downloadInvoicesPDF = () => {
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`
        <html><head><title>Historial de facturas</title>
        <style>
          body{font-family:Arial,sans-serif;padding:20px;color:#111}
          h1{font-size:18px;margin-bottom:10px}
          table{width:100%;border-collapse:collapse;font-size:12px}
          th,td{border-bottom:1px solid #eee;padding:6px 0;text-align:left}
        </style>
        </head><body>
          <h1>Historial de facturas</h1>
          <table>
            <thead><tr><th>ID</th><th>Fecha</th><th>Tipo</th><th>Total</th><th>Cajero</th></tr></thead>
            <tbody>
              ${invoices.slice(0, 100).map(inv => `<tr><td>${inv.id}</td><td>${inv.date}</td><td>${inv.type}</td><td>${formatCRC(inv.total)}</td><td>${inv.cashier || ''}</td></tr>`).join('')}
            </tbody>
          </table>
        </body></html>
      `);
      win.document.close();
      win.focus();
      win.print();
    };

    const openInvoiceDetail = (invoiceId) => {
      const inv = invoices.find(i => i.id === invoiceId);
      if (!inv) return;
      const itemsHTML = (inv.items || []).map(item => `
        <tr>
          <td>${item.title || 'Producto'}</td>
          <td style="text-align:center">${item.qty || 0}</td>
          <td style="text-align:right">${formatCRC(item.price || 0)}</td>
          <td style="text-align:right">${formatCRC((item.price || 0) * (item.qty || 0))}</td>
        </tr>
      `).join('');
      const payInfo = normalizePayment(inv.payment, inv.total);
      const methodsHTML = payInfo.methods.map(p => `
        <div style="display:flex;justify-content:space-between">
          <span>${getPaymentLabel(p.method)}</span>
          <span>${formatCRC(p.amount)}</span>
        </div>
      `).join('') || '<div style="color:#888">Sin métodos</div>';

      setModal('Detalle de factura', `
        <div style="margin-bottom:10px">
          <strong>${inv.id}</strong> · ${inv.type}<br/>
          ${new Date(inv.date).toLocaleString('es-CR')}<br/>
          ${inv.cashier ? `Cajero: ${inv.cashier}` : ''}
        </div>
        <table style="width:100%;font-size:12px;border-collapse:collapse;margin-bottom:12px">
          <thead>
            <tr style="border-bottom:1px solid #ddd">
              <th style="text-align:left">Descripción</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:right">Precio</th>
              <th style="text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="border-top:1px solid #ddd">
              <td colspan="3" style="text-align:right"><strong>Total:</strong></td>
              <td style="text-align:right"><strong>${formatCRC(inv.total)}</strong></td>
            </tr>
          </tfoot>
        </table>
        <div style="background:#f7f7f7;border:1px solid #eee;border-radius:8px;padding:10px">
          <div style="font-weight:700;margin-bottom:6px">Métodos de pago</div>
          ${methodsHTML}
        </div>
      `);
    };

    setModal('Historial de facturas', `
      <input type="text" id="poas-invoices-search" placeholder="🔍 Buscar por ID, cajero, tipo o fecha..." style="width:100%;padding:12px;border:2px solid var(--poas-border);border-radius:8px;font-size:0.95rem;margin-bottom:16px;box-sizing:border-box" />
      <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap;justify-content:flex-start">
        <button class="poas-btn ghost" id="poas-invoices-pdf" style="padding:10px 16px;font-size:0.95rem">⬇️ PDF</button>
        <button class="poas-btn ghost" id="poas-invoices-csv" style="padding:10px 16px;font-size:0.95rem">⬇️ CSV</button>
      </div>
      <div id="poas-invoices-list" style="display:flex;flex-direction:column;gap:8px">
        ${renderInvoiceList(invoices)}
      </div>
    `);

    // Funcionalidad de búsqueda
    const searchInput = document.getElementById('poas-invoices-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        const filtered = invoices.filter(inv => 
          inv.id.toLowerCase().includes(searchText) ||
          (inv.cashier && inv.cashier.toLowerCase().includes(searchText)) ||
          inv.type.toLowerCase().includes(searchText) ||
          inv.date.toLowerCase().includes(searchText)
        );
        
        const listDiv = document.getElementById('poas-invoices-list');
        if (listDiv) {
          listDiv.innerHTML = filtered.length > 0 
            ? renderInvoiceList(filtered)
            : '<div style="color:#888;text-align:center;padding:20px">No se encontraron facturas</div>';
          
          // Agregar event listeners nuevamente después de renderizar
          listDiv.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action="view"]');
            if (!btn) return;
            openInvoiceDetail(btn.dataset.id);
          });
        }
      });
    }

    document.getElementById('poas-invoices-pdf')?.addEventListener('click', downloadInvoicesPDF);
    document.getElementById('poas-invoices-csv')?.addEventListener('click', downloadInvoicesCSV);
    document.getElementById('poas-invoices-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="view"]');
      if (!btn) return;
      openInvoiceDetail(btn.dataset.id);
    });
  };

  const openSalesSummaryModal = () => {
    let currentSummary = null;

    const renderSummary = (period) => {
      const invoices = loadInvoices();
      const now = new Date();
      let start;
      let end;
      if (period === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (period === 'year') {
        start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      } else {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      }

      const filtered = invoices.filter(inv => {
        const invDate = new Date(inv.date);
        return invDate >= start && invDate <= end;
      });

      const totals = {
        count: 0,
        revenue: 0,
        units: 0,
        averageItems: 0
      };
      const typeTotals = {};
      const methodTotals = {};
      const cashierTotals = {};
      const hourTotals = Array.from({ length: 24 }, () => 0);
      const productTotals = {};

      filtered.forEach(inv => {
        totals.count += 1;
        totals.revenue += Number(inv.total || 0);
        typeTotals[inv.type] = (typeTotals[inv.type] || 0) + Number(inv.total || 0);

        const payInfo = normalizePayment(inv.payment, inv.total);
        payInfo.methods.forEach(p => {
          methodTotals[p.method] = (methodTotals[p.method] || 0) + Number(p.amount || 0);
        });

        if (inv.cashier) {
          cashierTotals[inv.cashier] = (cashierTotals[inv.cashier] || 0) + Number(inv.total || 0);
        }

        const invDate = new Date(inv.date);
        if (!isNaN(invDate)) {
          hourTotals[invDate.getHours()] += Number(inv.total || 0);
        }

        (inv.items || []).forEach(item => {
          const qty = Number(item.qty || 0);
          const amount = Number(item.price || 0) * qty;
          totals.units += qty;
          const key = item.title || 'Producto';
          if (!productTotals[key]) productTotals[key] = { qty: 0, amount: 0 };
          productTotals[key].qty += qty;
          productTotals[key].amount += amount;
        });
      });

      const topProductsByQty = Object.entries(productTotals)
        .sort((a, b) => b[1].qty - a[1].qty)
        .slice(0, 5);
      const topProductsByAmount = Object.entries(productTotals)
        .sort((a, b) => b[1].amount - a[1].amount)
        .slice(0, 5);
      const topMethods = Object.entries(methodTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      const topCashiers = Object.entries(cashierTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const topHours = hourTotals
        .map((total, hour) => ({ hour, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      const avgTicket = totals.count ? totals.revenue / totals.count : 0;
      const avgItems = totals.count ? totals.units / totals.count : 0;
      const periodLabel = period === 'month'
        ? `Mes: ${now.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })}`
        : period === 'year'
          ? `Año: ${now.getFullYear()}`
          : `Día: ${now.toLocaleDateString('es-CR')}`;

      const typeRows = Object.entries(typeTotals).map(([type, total]) => `
        <div style="display:flex;justify-content:space-between">
          <span>${type}</span>
          <strong>${formatCRC(total)}</strong>
        </div>
      `).join('') || '<div style="color:#888">Sin datos</div>';

      const methodsRows = topMethods.map(([method, total]) => `
        <div style="display:flex;justify-content:space-between">
          <span>${getPaymentLabel(method)}</span>
          <strong>${formatCRC(total)}</strong>
        </div>
      `).join('') || '<div style="color:#888">Sin datos</div>';

      const cashiersRows = topCashiers.map(([cashier, total]) => `
        <div style="display:flex;justify-content:space-between">
          <span>${cashier}</span>
          <strong>${formatCRC(total)}</strong>
        </div>
      `).join('') || '<div style="color:#888">Sin datos</div>';

      const productsQtyRows = topProductsByQty.map(([name, data]) => `
        <div style="display:flex;justify-content:space-between">
          <span>${name}</span>
          <strong>${data.qty}</strong>
        </div>
      `).join('') || '<div style="color:#888">Sin datos</div>';

      const productsAmountRows = topProductsByAmount.map(([name, data]) => `
        <div style="display:flex;justify-content:space-between">
          <span>${name}</span>
          <strong>${formatCRC(data.amount)}</strong>
        </div>
      `).join('') || '<div style="color:#888">Sin datos</div>';

      currentSummary = {
        period,
        start,
        end,
        totals: { ...totals, revenue: totals.revenue, averageItems: avgItems },
        avgTicket,
        typeTotals,
        methodTotals,
        cashierTotals,
        topProductsByQty,
        topProductsByAmount,
        topHours,
        invoices: filtered
      };

      const summaryContainer = document.getElementById('poas-sales-summary-body');
      if (!summaryContainer) return;
      summaryContainer.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px">
          <div style="flex:1;min-width:180px;background:#f7fbfd;border:1px solid var(--poas-border);border-radius:10px;padding:10px">
            <div style="font-size:0.8rem;color:#666">${periodLabel}</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--poas-blue)">${formatCRC(totals.revenue)}</div>
            <div style="font-size:0.8rem;color:#666">${totals.count} transacciones · ${totals.units} unidades</div>
            <div style="font-size:0.8rem;color:#666">Ticket promedio: ${formatCRC(avgTicket)} · Items promedio: ${avgItems.toFixed(1)}</div>
          </div>
          <div style="flex:1;min-width:180px;background:#fef8ff;border:1px solid var(--poas-border);border-radius:10px;padding:10px">
            <div style="font-weight:700;color:var(--poas-magenta);margin-bottom:6px">Por tipo</div>
            ${typeRows}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
          <div style="background:#fff;border:1px solid var(--poas-border);border-radius:10px;padding:10px">
            <div style="font-weight:700;color:var(--poas-blue);margin-bottom:6px">Métodos de pago</div>
            ${methodsRows}
          </div>
          <div style="background:#fff;border:1px solid var(--poas-border);border-radius:10px;padding:10px">
            <div style="font-weight:700;color:var(--poas-blue);margin-bottom:6px">Cajeros (top)</div>
            ${cashiersRows}
          </div>
          <div style="background:#fff;border:1px solid var(--poas-border);border-radius:10px;padding:10px">
            <div style="font-weight:700;color:var(--poas-blue);margin-bottom:6px">Horas pico</div>
            ${topHours.map(h => `
              <div style="display:flex;justify-content:space-between">
                <span>${String(h.hour).padStart(2, '0')}:00</span>
                <strong>${formatCRC(h.total)}</strong>
              </div>
            `).join('') || '<div style="color:#888">Sin datos</div>'}
          </div>
          <div style="background:#fff;border:1px solid var(--poas-border);border-radius:10px;padding:10px">
            <div style="font-weight:700;color:var(--poas-blue);margin-bottom:6px">Top productos (unidades)</div>
            ${productsQtyRows}
          </div>
          <div style="background:#fff;border:1px solid var(--poas-border);border-radius:10px;padding:10px">
            <div style="font-weight:700;color:var(--poas-blue);margin-bottom:6px">Top productos (ingreso)</div>
            ${productsAmountRows}
          </div>
        </div>
      `;
    };

    const downloadSummaryCSV = () => {
      if (!currentSummary) return;
      const lines = [];
      lines.push(['Periodo', currentSummary.period].join(','));
      lines.push(['Inicio', currentSummary.start.toISOString()].join(','));
      lines.push(['Fin', currentSummary.end.toISOString()].join(','));
      lines.push(['Transacciones', currentSummary.totals.count].join(','));
      lines.push(['Unidades', currentSummary.totals.units].join(','));
      lines.push(['Ingreso total', currentSummary.totals.revenue].join(','));
      lines.push(['Ticket promedio', currentSummary.avgTicket].join(','));
      lines.push(['Items promedio', currentSummary.totals.averageItems].join(','));
      lines.push('');
      lines.push('Tipos,Total');
      Object.entries(currentSummary.typeTotals).forEach(([k, v]) => {
        lines.push(`${k},${v}`);
      });
      lines.push('');
      lines.push('Metodos,Total');
      Object.entries(currentSummary.methodTotals).forEach(([k, v]) => {
        lines.push(`${getPaymentLabel(k)},${v}`);
      });
      lines.push('');
      lines.push('Cajeros,Total');
      Object.entries(currentSummary.cashierTotals).forEach(([k, v]) => {
        lines.push(`${k},${v}`);
      });
      lines.push('');
      lines.push('Hora,Total');
      currentSummary.topHours.forEach(h => {
        lines.push(`${String(h.hour).padStart(2, '0')}:00,${h.total}`);
      });
      lines.push('');
      lines.push('Facturas');
      lines.push('ID,Fecha,Tipo,Total,Cajero,Metodos');
      currentSummary.invoices.forEach(inv => {
        const methods = normalizePayment(inv.payment, inv.total).methods.map(p => `${getPaymentLabel(p.method)} ${p.amount}`).join(' | ');
        lines.push(`${inv.id},${inv.date},${inv.type},${inv.total},${inv.cashier || ''},${methods}`);
      });

      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resumen_ventas_${currentSummary.period}_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    };

    const downloadSummaryPDF = () => {
      if (!currentSummary) return;
      const periodLabel = currentSummary.period === 'month'
        ? `Mes: ${new Date(currentSummary.start).toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })}`
        : currentSummary.period === 'year'
          ? `Año: ${new Date(currentSummary.start).getFullYear()}`
          : `Día: ${new Date(currentSummary.start).toLocaleDateString('es-CR')}`;

      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`
        <html><head><title>Resumen de ventas</title>
        <style>
          body{font-family:Arial,sans-serif;padding:20px;color:#111}
          h1{font-size:18px;margin-bottom:6px}
          .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
          .card{border:1px solid #ddd;border-radius:8px;padding:10px}
          table{width:100%;border-collapse:collapse;font-size:12px}
          th,td{border-bottom:1px solid #eee;padding:4px 0;text-align:left}
        </style>
        </head><body>
          <h1>Resumen de ventas</h1>
          <div>${periodLabel}</div>
          <div style="margin:10px 0">
            <strong>Total:</strong> ${formatCRC(currentSummary.totals.revenue)} · <strong>Transacciones:</strong> ${currentSummary.totals.count} · <strong>Unidades:</strong> ${currentSummary.totals.units}
          </div>
          <div class="grid">
            <div class="card">
              <strong>Por tipo</strong>
              ${Object.entries(currentSummary.typeTotals).map(([k,v]) => `<div>${k}: ${formatCRC(v)}</div>`).join('')}
            </div>
            <div class="card">
              <strong>Métodos de pago</strong>
              ${Object.entries(currentSummary.methodTotals).map(([k,v]) => `<div>${getPaymentLabel(k)}: ${formatCRC(v)}</div>`).join('')}
            </div>
            <div class="card">
              <strong>Cajeros (top)</strong>
              ${Object.entries(currentSummary.cashierTotals).slice(0,5).map(([k,v]) => `<div>${k}: ${formatCRC(v)}</div>`).join('')}
            </div>
            <div class="card">
              <strong>Horas pico</strong>
              ${currentSummary.topHours.map(h => `<div>${String(h.hour).padStart(2, '0')}:00 ${formatCRC(h.total)}</div>`).join('')}
            </div>
          </div>
          <h2 style="font-size:14px;margin-top:16px">Facturas (resumen)</h2>
          <table>
            <thead><tr><th>ID</th><th>Fecha</th><th>Tipo</th><th>Total</th><th>Cajero</th></tr></thead>
            <tbody>
              ${currentSummary.invoices.slice(0, 50).map(inv => `<tr><td>${inv.id}</td><td>${inv.date}</td><td>${inv.type}</td><td>${formatCRC(inv.total)}</td><td>${inv.cashier || ''}</td></tr>`).join('')}
            </tbody>
          </table>
        </body></html>
      `);
      win.document.close();
      win.focus();
      win.print();
    };

    setModal('Resumen de ventas', `
      <div class="form-field">
        <label>Periodo</label>
        <select id="poas-sales-period">
          <option value="day">Día</option>
          <option value="month">Mes</option>
          <option value="year">Año</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <button class="poas-btn ghost" id="poas-sales-pdf">⬇️ PDF</button>
        <button class="poas-btn ghost" id="poas-sales-csv">⬇️ CSV</button>
      </div>
      <div id="poas-sales-summary-body"></div>
    `);

    const periodSelect = document.getElementById('poas-sales-period');
    periodSelect?.addEventListener('change', () => renderSummary(periodSelect.value));
    document.getElementById('poas-sales-pdf')?.addEventListener('click', downloadSummaryPDF);
    document.getElementById('poas-sales-csv')?.addEventListener('click', downloadSummaryCSV);
    renderSummary('day');
  };

  const bindEvents = () => {
    document.querySelectorAll('.poas-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.poas-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`tab-${tab.dataset.tab}`)?.classList.add('active');
      });
    });

    document.getElementById('poas-open-apartados')?.addEventListener('click', () => {
      document.querySelector('.poas-tab[data-tab="apartados"]')?.click();
    });

    nodes.productsGrid?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action="add"]');
      if (!btn) return;
      addToCart(btn.dataset.id);
    });

    nodes.cartItems?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      const variantId = btn.dataset.variant || '';
      const action = btn.dataset.action;
      if (action === 'increase') updateCartQty(id, 1, variantId || undefined);
      if (action === 'decrease') updateCartQty(id, -1, variantId || undefined);
      if (action === 'remove') removeFromCart(id, variantId || undefined);
    });

    nodes.productsSearch?.addEventListener('input', () => {
      poasCurrentPage = 1;
      renderProducts();
    });
    nodes.apartadosSearch?.addEventListener('input', renderApartados);
    nodes.clearCartBtn?.addEventListener('click', clearCart);
    nodes.checkoutBtn?.addEventListener('click', openCheckoutModal);
    nodes.createApartadoBtn?.addEventListener('click', openApartadoModal);

    nodes.apartadosList?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === 'abono') openAbonoModal(id);
      if (action === 'complete') completeApartado(id);
      if (action === 'cancel') cancelApartado(id);
    });

    nodes.openInvoicesBtn?.addEventListener('click', openInvoicesModal);
    document.getElementById('poas-sales-summary')?.addEventListener('click', openSalesSummaryModal);
    nodes.modalClose?.addEventListener('click', closeModal);
    nodes.modal?.addEventListener('click', (e) => {
      if (e.target === nodes.modal) closeModal();
    });
  };

  const init = () => {
    products = loadProducts();
    cart = loadCart();
    renderProducts();
    renderCart();
    renderApartados();
    bindEvents();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
