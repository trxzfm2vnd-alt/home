  // Cargar productos desde localStorage
  function loadProductsFromStorage() {
    try {
      const data = localStorage.getItem('products_data');
      if (data) {
        const products = JSON.parse(data);
        syncBodegaFromPoasToSophie(products);
        return products;
      }
      return [];
    } catch (e) {
      console.error('Error cargando productos desde localStorage:', e);
      return [];
    }
  }

  // Sincronizar bodega de Poás hacia Sophie al cargar
  function syncBodegaFromPoasToSophie(sophieProducts) {
    try {
      const poasProducts = JSON.parse(localStorage.getItem('poas_products_data') || '[]');
      let updated = false;
      
      sophieProducts.forEach(sophieProduct => {
        const poasProduct = poasProducts.find(pp => String(pp.id) === String(sophieProduct.id));
        if (poasProduct && poasProduct.inventory && typeof poasProduct.inventory.bodega === 'number') {
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
    } catch (e) {
      console.error('Error en syncBodegaFromPoasToSophie:', e);
    }
  }
  // Guardar productos en localStorage
  function saveProductsToStorage(productsArray) {
    try {
      localStorage.setItem('products_data', JSON.stringify(productsArray || []));
      syncBodegaToPoasFromSophie(productsArray);
    } catch (e) {
      console.error('Error guardando productos en localStorage:', e);
    }
  }

  // Sincronizar bodega de Sophie hacia Poás
  function syncBodegaToPoasFromSophie(sophieProducts) {
    try {
      const poasProducts = JSON.parse(localStorage.getItem('poas_products_data') || '[]');
      let updated = false;
      
      sophieProducts.forEach(sophieProduct => {
        const poasProduct = poasProducts.find(pp => String(pp.id) === String(sophieProduct.id));
        if (poasProduct && sophieProduct.inventory && typeof sophieProduct.inventory.bodega === 'number') {
          if (!poasProduct.inventory) poasProduct.inventory = {};
          if (poasProduct.inventory.bodega !== sophieProduct.inventory.bodega) {
            poasProduct.inventory.bodega = sophieProduct.inventory.bodega;
            updated = true;
          }
        }
      });
      
      if (updated) {
        localStorage.setItem('poas_products_data', JSON.stringify(poasProducts));
      }
    } catch (e) {
      console.error('Error en syncBodegaToPoasFromSophie:', e);
    }
  }
  // Asegura que todos los productos tengan un campo barcode
  function ensureBarcodesExist(arr) {
    return arr.map((p, idx) => {
      if (!p.barcode) {
        // Generar barcode si no existe
        p.barcode = p.id ? `SOPHIE${String(p.id).padStart(6, '0')}` : `SOPHIE${String(idx+1).padStart(6, '0')}`;
      }
      return p;
    });
  }
  let products = loadProductsFromStorage();
  if (!Array.isArray(products)) {
    products = [];
  }
  // ...existing code...
// ===============================
// LÓGICA DE MODAL CHECKOUT DE TRANSFERENCIA
// ===============================
document.addEventListener('DOMContentLoaded', function() {
  const transferInput = document.getElementById('transfer-input');
  const transferSuggestions = document.getElementById('transfer-suggestions');
  const transferList = document.getElementById('transfer-list');
  if (!transferInput || !transferSuggestions || !transferList) return;

  const getTransferProducts = () => {
    let list = [];
    if (typeof loadProductsFromStorage === 'function') {
      list = loadProductsFromStorage() || [];
    } else if (Array.isArray(products)) {
      list = products;
    }
    if (!Array.isArray(list)) list = [];
    return list;
  };

  const getVariantsBodegaTotal = (product) => {
    if (!product || !product.variants || !Array.isArray(product.variants.options)) return 0;
    return product.variants.options.reduce((sum, opt) => {
      const inv = opt && opt.inventory ? opt.inventory : {tienda1:0, tienda2:0, tienda3:0, bodega:0};
      return sum + (inv.bodega || 0);
    }, 0);
  };

  const findTransferEntry = (value, listOverride = null) => {
    const list = Array.isArray(listOverride) ? listOverride : getTransferProducts();
    const search = (value || '').trim().toLowerCase();
    if (!search) return null;
    for (const p of list) {
      if (p.barcode && p.barcode.toLowerCase() === search) {
        const totalVariants = getVariantsBodegaTotal(p);
        const hasVariants = totalVariants > 0;
        const productBodega = p.inventory && typeof p.inventory.bodega === 'number' ? p.inventory.bodega : 0;
        return { product: p, variant: null, variantIndex: null, usesVariants: hasVariants && productBodega === 0 };
      }
      if (p.title && p.title.toLowerCase() === search) {
        const totalVariants = getVariantsBodegaTotal(p);
        const hasVariants = totalVariants > 0;
        const productBodega = p.inventory && typeof p.inventory.bodega === 'number' ? p.inventory.bodega : 0;
        return { product: p, variant: null, variantIndex: null, usesVariants: hasVariants && productBodega === 0 };
      }
      if (p.variants && Array.isArray(p.variants.options)) {
        for (let i = 0; i < p.variants.options.length; i += 1) {
          const opt = p.variants.options[i];
          if (opt && opt.barcode && opt.barcode.toLowerCase() === search) {
            return { product: p, variant: opt, variantIndex: i, usesVariants: false };
          }
        }
      }
    }
    return null;
  };

  const getEntryBodegaQty = (entry) => {
    if (!entry) return 0;
    if (entry.variant) {
      return (entry.variant.inventory && typeof entry.variant.inventory.bodega === 'number') ? entry.variant.inventory.bodega : 0;
    }
    if (entry.usesVariants) {
      return getVariantsBodegaTotal(entry.product);
    }
    return (entry.product && entry.product.inventory && typeof entry.product.inventory.bodega === 'number') ? entry.product.inventory.bodega : 0;
  };

  const getEntryBarcode = (entry) => {
    if (!entry) return '';
    return entry.variant ? entry.variant.barcode : entry.product.barcode;
  };

  const getEntryTitle = (entry) => {
    if (!entry) return '';
    if (entry.variant && entry.variant.name) {
      return `${entry.product.title} (${entry.variant.name})`;
    }
    return entry.product.title || '';
  };

  // Permitir agregar productos manualmente por código/nombre al presionar Enter o Coma
  transferInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ',') {
      const value = transferInput.value.trim();
      if (value) {
        // Permitir agregar solo un producto por vez
        let entry = findTransferEntry(value);
        if (!entry && value.includes(',')) {
          // Si el usuario pone varios códigos separados por coma, tomar solo el primero
          const first = value.split(',')[0].trim();
          entry = findTransferEntry(first);
        }
        if (entry && entry.product) {
          if (getEntryBodegaQty(entry) > 0) {
            if (!window.selectedProducts) window.selectedProducts = [];
            const entryBarcode = getEntryBarcode(entry);
            
            // Obtener tiendas seleccionadas
            const tiendas = [];
            if (document.getElementById('transfer-tienda1')?.checked) tiendas.push('tienda1');
            if (document.getElementById('transfer-tienda2')?.checked) tiendas.push('tienda2');
            if (document.getElementById('transfer-tienda3')?.checked) tiendas.push('tienda3');
            
            if (tiendas.length === 0) {
              alert('Selecciona al menos una tienda destino');
              return;
            }
            
            // Agregar producto una vez por cada tienda seleccionada
            tiendas.forEach(destino => {
              window.selectedProducts.push({
                id: entry.product.id,
                title: getEntryTitle(entry),
                img: entry.product.img,
                barcode: entryBarcode,
                variantIndex: entry.variantIndex,
                usesVariants: entry.usesVariants === true,
                destino: destino,
                qty: 1
              });
            });
            if (typeof renderTransferList === 'function') renderTransferList();
          } else {
            alert('No se encontró ningún producto con inventario en bodega para transferir.');
          }
        } else {
          transferInput.value = '';
          transferSuggestions.style.display = 'none';
          transferSuggestions.innerHTML = '';
          alert('Producto no encontrado. Usa el autocompletado o verifica el código/nombre.');
        }
        transferInput.value = '';
        transferSuggestions.style.display = 'none';
        transferSuggestions.innerHTML = '';
        e.preventDefault();
      }
    }
  });
  // ...existing code...

  window.selectedProducts = window.selectedProducts || [];

  const getTiendaLabel = (tiendaKey) => {
    const map = { tienda1: 'Sophie Store', tienda2: 'Sophie Mall', tienda3: 'Sophie\'s Ticados' };
    return map[tiendaKey] || tiendaKey;
  };

  const getTiendaColor = (tiendaKey) => {
    const map = { tienda1: '#ff6b9d', tienda2: '#5a8dee', tienda3: '#ffc107' };
    return map[tiendaKey] || '#999';
  };

  function renderTransferList() {
    if (!transferList) return;
    if (window.selectedProducts.length === 0) {
      transferList.innerHTML = '<div style="color:#888;text-align:center;padding:18px 0">No hay productos seleccionados.</div>';
      return;
    }
    let totalQty = window.selectedProducts.reduce((sum, item) => sum + item.qty, 0);
    let html = window.selectedProducts.map((item, idx) => {
      const colorDestino = getTiendaColor(item.destino);
      const tiendaDestino = getTiendaLabel(item.destino);
      return `
        <div class=\"transfer-list-item\" style=\"display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid #f3e6f7\">\n          <img src=\"${item.img.startsWith('/') ? item.img : './' + item.img}\" alt=\"${item.title}\" style=\"width:50px;height:50px;border-radius:8px;object-fit:cover;border:1.5px solid #e3cfe0;background:#faf7fc\" />\n          <div style=\"flex:1;min-width:0\">\n            <div style=\"font-weight:600;font-size:1.05rem;color:#6b2840;white-space:nowrap;overflow:hidden;text-overflow:ellipsis\">${item.title}</div>\n            <div style=\"font-size:0.92rem;color:#888;margin-bottom:4px\">${item.barcode}</div>\n            <span style=\"display:inline-block;background:${colorDestino};color:white;padding:3px 8px;border-radius:4px;font-size:0.8rem;font-weight:600\">→ ${tiendaDestino}</span>\n          </div>\n          <input type=\"number\" min=\"1\" value=\"${item.qty}\" data-idx=\"${idx}\" class=\"transfer-qty\" style=\"width:60px;padding:6px;border-radius:6px;border:1px solid #e3cfe0;text-align:center;font-size:1rem\" />\n          <button type=\"button\" class=\"transfer-remove\" data-idx=\"${idx}\" style=\"background:none;border:none;color:#b04b70;font-size:1.2rem;cursor:pointer;padding:0 8px\">✕</button>\n        </div>\n      `;
    }).join('');
    html += `<div style=\"margin-top:18px;padding:14px 0;border-top:2px solid #e3cfe0;font-size:1.08rem;color:#5a2032;font-weight:600;display:flex;justify-content:space-between\">\n      <span>Total productos: ${window.selectedProducts.length}</span>\n      <span>Cantidad total: ${totalQty}</span>\n    </div>`;
    transferList.innerHTML = html;
  }

  // Agregar producto por sugerencia o código/nombre
  function addProductToTransfer(prod) {
    if (!prod || !prod.product) return;
    const entryBarcode = getEntryBarcode(prod);
    
    // Obtener tiendas seleccionadas
    const tiendas = [];
    if (document.getElementById('transfer-tienda1')?.checked) tiendas.push('tienda1');
    if (document.getElementById('transfer-tienda2')?.checked) tiendas.push('tienda2');
    if (document.getElementById('transfer-tienda3')?.checked) tiendas.push('tienda3');
    
    // Si no hay tiendas seleccionadas, no agregar
    if (tiendas.length === 0) {
      alert('Selecciona al menos una tienda destino');
      return;
    }
    
    // Agregar producto una vez por cada tienda seleccionada
    tiendas.forEach(destino => {
      window.selectedProducts.push({
        id: prod.product.id,
        title: getEntryTitle(prod),
        img: prod.product.img,
        barcode: entryBarcode,
        variantIndex: prod.variantIndex,
        usesVariants: prod.usesVariants === true,
        destino: destino,
        qty: 1
      });
    });
    
    renderTransferList();
  }

  transferSuggestions.addEventListener('mousedown', function(e) {
    const item = e.target.closest('.transfer-suggestion-item');
    if (item) {
      const entry = findTransferEntry(item.dataset.barcode || item.dataset.title);
      if (entry && entry.product) {
        const entryBarcode = getEntryBarcode(entry);
        
        // Obtener tiendas seleccionadas
        const tiendas = [];
        if (document.getElementById('transfer-tienda1')?.checked) tiendas.push('tienda1');
        if (document.getElementById('transfer-tienda2')?.checked) tiendas.push('tienda2');
        if (document.getElementById('transfer-tienda3')?.checked) tiendas.push('tienda3');
        
        if (tiendas.length === 0) {
          alert('Selecciona al menos una tienda destino');
          return;
        }
        
        tiendas.forEach(destino => {
          window.selectedProducts.push({
            id: entry.product.id,
            title: getEntryTitle(entry),
            img: entry.product.img,
            barcode: entryBarcode,
            variantIndex: entry.variantIndex,
            usesVariants: entry.usesVariants === true,
            destino: destino,
            qty: 1
          });
        });
        
        renderTransferList();
      }
      transferInput.value = '';
      transferSuggestions.style.display = 'none';
      transferSuggestions.innerHTML = '';
    }
  });

  transferInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ',') {
      const value = transferInput.value.trim();
      if (value) {
        // Permitir agregar solo un producto por vez
        let entry = findTransferEntry(value);
        if (!entry && value.includes(',')) {
          // Si el usuario pone varios códigos separados por coma, tomar solo el primero
          const first = value.split(',')[0].trim();
          entry = findTransferEntry(first);
        }
        if (entry && entry.product) {
          const entryBarcode = getEntryBarcode(entry);
          
          // Obtener tiendas seleccionadas
          const tiendas = [];
          if (document.getElementById('transfer-tienda1')?.checked) tiendas.push('tienda1');
          if (document.getElementById('transfer-tienda2')?.checked) tiendas.push('tienda2');
          if (document.getElementById('transfer-tienda3')?.checked) tiendas.push('tienda3');
          
          if (tiendas.length === 0) {
            alert('Selecciona al menos una tienda destino');
          } else {
            tiendas.forEach(destino => {
              window.selectedProducts.push({
                id: entry.product.id,
                title: getEntryTitle(entry),
                img: entry.product.img,
                barcode: entryBarcode,
                variantIndex: entry.variantIndex,
                usesVariants: entry.usesVariants === true,
                destino: destino,
                qty: 1
              });
            });
            renderTransferList();
          }
        } else {
          transferInput.value = '';
          transferSuggestions.style.display = 'none';
          transferSuggestions.innerHTML = '';
          alert('Producto no encontrado. Usa el autocompletado o verifica el código/nombre.');
        }
        transferInput.value = '';
        transferSuggestions.style.display = 'none';
        transferSuggestions.innerHTML = '';
        e.preventDefault();
      }
    }
  });

  transferList.addEventListener('input', function(e) {
    if (e.target.classList.contains('transfer-qty')) {
      const idx = parseInt(e.target.dataset.idx);
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      window.selectedProducts[idx].qty = val;
      renderTransferList();
    }
  });

  transferList.addEventListener('click', function(e) {
	if (e.target.classList.contains('transfer-remove')) {
		const idx = parseInt(e.target.dataset.idx);
		window.selectedProducts.splice(idx, 1);
		renderTransferList();
	}
});

  transferSuggestions.addEventListener('mousedown', function(e) {
    const item = e.target.closest('.transfer-suggestion-item');
    if (item) {
      const entry = findTransferEntry(item.dataset.barcode || item.dataset.title);
      if (entry && entry.product && getEntryBodegaQty(entry) > 0) {
        addProductToTransfer(entry);
      } else {
        alert('No se encontró ningún producto con inventario en bodega para transferir.');
      }
      transferInput.value = '';
      transferSuggestions.style.display = 'none';
      transferSuggestions.innerHTML = '';
    }
  });

  // Ocultar sugerencias si se pierde el foco
  transferInput.addEventListener('blur', function() {
    setTimeout(() => {
      transferSuggestions.style.display = 'none';
    }, 120);
  });

  // Event listeners para checkboxes de tiendas
  ['transfer-tienda1', 'transfer-tienda2', 'transfer-tienda3'].forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.addEventListener('change', function() {
        // Aquí podrías agregar lógica adicional si es necesaria
        // Por ejemplo, validar que al menos una tienda esté seleccionada
      });
    }
  });

  transferList.addEventListener('input', function(e) {
    if (e.target.classList.contains('transfer-qty')) {
      const idx = parseInt(e.target.dataset.idx);
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      window.selectedProducts[idx].qty = val;
      renderTransferList();
    }
  });

  transferList.addEventListener('click', function(e) {
    if (e.target.classList.contains('transfer-remove')) {
      const idx = parseInt(e.target.dataset.idx);
      window.selectedProducts.splice(idx, 1);
      renderTransferList();
    }
  });

  // Al enviar el formulario, actualizar inventario y limpiar selección
  const formTransfer = document.getElementById('form-transfer-bodega');
  if (formTransfer) {
    formTransfer.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!window.selectedProducts || window.selectedProducts.length === 0) {
        alert('Agrega al menos un producto para transferir.');
        return;
      }
      let updated = false;
      const transferProducts = getTransferProducts();
      window.selectedProducts.forEach(sel => {
        const entry = findTransferEntry(sel.barcode, transferProducts);
        if (!entry || !entry.product) return;
        
        // Usar el destino específico de este producto
        const destino = sel.destino;
        
        if (entry.variant) {
          entry.variant.inventory = entry.variant.inventory || {tienda1:0, tienda2:0, tienda3:0, bodega:0};
          if (typeof entry.variant.inventory[destino] === 'number') {
            entry.variant.inventory.bodega = Math.max(0, entry.variant.inventory.bodega - sel.qty);
            entry.variant.inventory[destino] += sel.qty;
            updated = true;
          }
        } else if (entry.usesVariants && entry.product && entry.product.variants && Array.isArray(entry.product.variants.options)) {
          let remaining = sel.qty;
          entry.product.variants.options.forEach(opt => {
            if (remaining <= 0) return;
            opt.inventory = opt.inventory || {tienda1:0, tienda2:0, tienda3:0, bodega:0};
            const available = opt.inventory.bodega || 0;
            if (available > 0 && typeof opt.inventory[destino] === 'number') {
              const take = Math.min(available, remaining);
              opt.inventory.bodega -= take;
              opt.inventory[destino] += take;
              remaining -= take;
              updated = true;
            }
          });
        } else if (entry.product.inventory) {
          if (typeof entry.product.inventory[destino] === 'number') {
            entry.product.inventory.bodega = Math.max(0, entry.product.inventory.bodega - sel.qty);
            entry.product.inventory[destino] += sel.qty;
            updated = true;
          }
        }
      });
      if (updated) {
        products = transferProducts;
        localStorage.setItem('products_data', JSON.stringify(transferProducts));
        syncBodegaToPoasFromSophie(transferProducts);
        
        // Guardar en historial de transferencias
        const usuario = document.getElementById('transfer-usuario').value;
        const historyEntry = {
          id: Date.now(),
          fecha: new Date().toISOString(),
          usuario: usuario,
          productos: window.selectedProducts.map(p => ({
            titulo: p.title,
            codigo: p.barcode,
            cantidad: p.qty,
            destino: p.destino
          }))
        };
        const history = JSON.parse(localStorage.getItem('transfer_history') || '[]');
        history.push(historyEntry);
        localStorage.setItem('transfer_history', JSON.stringify(history));
        
        transferList.innerHTML = `<div style=\"background:#e8f5e9;color:#2e7d32;padding:24px 18px;border-radius:10px;text-align:center;font-size:1.15rem;font-weight:700;margin-top:24px\">✅ Transferencia realizada y inventario actualizado.</div>`;
        setTimeout(() => {
          window.selectedProducts = [];
          renderTransferList();
          document.getElementById('transfer-modal').setAttribute('aria-hidden','true');
          document.getElementById('transfer-modal').style.display = 'none';
        }, 1200);
      }
    });
  }

  // Render inicial
  renderTransferList();

  // ========== HISTORIAL DE TRANSFERENCIAS ==========
  function formatFecha(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function formatFechaHora(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  function getTiendaNombreFromKey(key) {
    const map = { tienda1: 'Sophie Store', tienda2: 'Sophie Mall', tienda3: 'Sophie\'s Ticados', ajuste: '⚙️ Ajuste Inventario' };
    return map[key] || key;
  }

  function renderHistoryModal() {
    const container = document.getElementById('history-container');
    if (!container) return;

    const history = JSON.parse(localStorage.getItem('transfer_history') || '[]');
    
    if (history.length === 0) {
      container.innerHTML = '<div style="text-align:center;color:#888;padding:24px">No hay transferencias registradas aún.</div>';
      return;
    }

    // Agrupar por mes y día
    const grouped = {};
    history.forEach(entry => {
      const date = new Date(entry.fecha);
      const mesAno = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
      const dia = date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
      
      if (!grouped[mesAno]) grouped[mesAno] = {};
      if (!grouped[mesAno][dia]) grouped[mesAno][dia] = [];
      grouped[mesAno][dia].push(entry);
    });

    let html = '';
    Object.keys(grouped).sort((a, b) => new Date(b.split(' ')[2]) - new Date(a.split(' ')[2])).forEach(mes => {
      html += `<div style="margin-bottom:24px">`;
      html += `<h3 style="margin:0 0 12px 0;color:#5a2032;font-size:1.1rem;border-bottom:2px solid #e3cfe0;padding-bottom:8px;font-weight:700">${mes}</h3>`;
      
      Object.keys(grouped[mes]).sort((a, b) => new Date(b) - new Date(a)).forEach(dia => {
        const dayEntries = grouped[mes][dia];
        html += `<div style="margin-bottom:16px;padding:12px;background:white;border-radius:6px;border-left:4px solid #ff9800">`;
        html += `<div style="font-weight:600;color:#5a2032;margin-bottom:8px;font-size:0.95rem">📅 ${dia}</div>`;
        
        dayEntries.forEach((entry, idx) => {
          html += `<div style="background:#f8f5fa;padding:10px;border-radius:4px;margin-bottom:8px;font-size:0.9rem">`;
          html += `<div style="color:#333;font-weight:500;margin-bottom:4px">${formatFechaHora(entry.fecha)} - Usuario: <strong>${entry.usuario}</strong></div>`;
          html += `<div style="margin-left:0;padding-top:4px;border-top:1px solid #e3cfe0">`;
          
          entry.productos.forEach(prod => {
            const tienda = getTiendaNombreFromKey(prod.destino);
            html += `<div style="padding:4px 0;font-size:0.85rem;color:#555">
              • ${prod.titulo} (${prod.codigo}) × ${prod.cantidad} → <strong style="color:#ff6b9d">${tienda}</strong>
            </div>`;
          });
          
          html += `</div></div>`;
        });
        
        html += `</div>`;
      });
      
      html += `</div>`;
    });

    container.innerHTML = html;
  }

  // Event listeners para modal de historial
  const historyOpenBtn = document.getElementById('open-history-modal');
  const historyModal = document.getElementById('history-modal');
  const historyCloseBtn = document.getElementById('close-history-modal');

  if (historyOpenBtn && historyModal) {
    historyOpenBtn.addEventListener('click', () => {
      renderHistoryModal();
      historyModal.setAttribute('aria-hidden', 'false');
      historyModal.style.display = 'block';
    });
  }

  if (historyCloseBtn && historyModal) {
    historyCloseBtn.addEventListener('click', () => {
      historyModal.setAttribute('aria-hidden', 'true');
      historyModal.style.display = 'none';
    });
  }

  if (historyModal) {
    historyModal.addEventListener('click', (e) => {
      if (e.target === historyModal) {
        historyModal.setAttribute('aria-hidden', 'true');
        historyModal.style.display = 'none';
      }
    });
  }

  // Exportar historial como PDF
  function exportToExcel() {
    const history = JSON.parse(localStorage.getItem('transfer_history') || '[]');
    
    if (history.length === 0) {
      alert('No hay transferencias para exportar.');
      return;
    }

    // Generar HTML del PDF
    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Historial de Transferencias</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #FF9800;
          padding-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          color: #5a2032;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          background-color: #FF9800;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          border: 1px solid #ddd;
        }
        td {
          padding: 10px 12px;
          border: 1px solid #ddd;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f0f0f0;
        }
        .tienda-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 12px;
        }
        .tienda1 { background-color: #ff6b9d; color: white; }
        .tienda2 { background-color: #5a8dee; color: white; }
        .tienda3 { background-color: #ffc107; color: white; }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #999;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Historial de Transferencias</h1>
        <p>Generado el ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Usuario</th>
            <th>Producto</th>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Tienda Destino</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Agregar filas de datos
    history.forEach(entry => {
      const date = new Date(entry.fecha);
      const fechaStr = date.toLocaleDateString('es-ES');
      const horaStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      
      entry.productos.forEach(prod => {
        const tienda = getTiendaNombreFromKey(prod.destino);
        const tiendaClass = prod.destino;
        html += `
          <tr>
            <td>${fechaStr}</td>
            <td>${horaStr}</td>
            <td>${entry.usuario}</td>
            <td>${prod.titulo}</td>
            <td>${prod.codigo}</td>
            <td>${prod.cantidad}</td>
            <td><span class="tienda-badge ${tiendaClass}">${tienda}</span></td>
          </tr>
        `;
      });
    });

    html += `
        </tbody>
      </table>

      <div class="footer">
        <p>Total de transferencias: ${history.length}</p>
        <p>Documento generado automáticamente por Sophie - Sistema de Inventario</p>
      </div>

      <div class="no-print" style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
        <button onclick="window.print()" style="background: #FF9800; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold; margin-right: 10px;">
          🖨️ Guardar como PDF
        </button>
        <button onclick="window.close()" style="background: #999; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold;">
          ✕ Cerrar
        </button>
      </div>
    </body>
    </html>
    `;

    // Abrir en nueva ventana
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(html);
    printWindow.document.close();
  }

  function exportToCsv() {
    const history = JSON.parse(localStorage.getItem('transfer_history') || '[]');
    
    if (history.length === 0) {
      alert('No hay transferencias para exportar.');
      return;
    }

    let csv = 'Fecha;Hora;Usuario;Producto;Código;Cantidad;Tienda Destino\n';
    
    history.forEach(entry => {
      const date = new Date(entry.fecha);
      const fechaStr = date.toLocaleDateString('es-ES');
      const horaStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      
      entry.productos.forEach(prod => {
        const tienda = getTiendaNombreFromKey(prod.destino);
        csv += `"${fechaStr}";"${horaStr}";"${entry.usuario}";"${prod.titulo}";"${prod.codigo}";${prod.cantidad};"${tienda}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historial-transferencias-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  }

  // Event listeners para descargas
  const exportExcelBtn = document.getElementById('export-history-excel');
  const exportCsvBtn = document.getElementById('export-history-csv');

  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', exportToExcel);
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportToCsv);
  }
});

// Función para calcular si un producto está agotado basado en su stock total o marca manual
function isProductOutOfStock(product) {
  // Primero verificar si está marcado manualmente como agotado
  if (product.outOfStock === true) {
    return true;
  }
  
  const OUT_OF_STOCK_THRESHOLD = 3;
  // Si tiene variantes, sumar el stock de todas las opciones
  if (product.variants && product.variants.options && product.variants.options.length > 0) {
    let totalStock = 0;
    product.variants.options.forEach(option => {
      const inventory = option.inventory || {tienda1:0, tienda2:0, tienda3:0, bodega:0};
      totalStock += (inventory.tienda1 || 0) + (inventory.tienda2 || 0) + (inventory.tienda3 || 0) + (inventory.bodega || 0);
    });
    return totalStock <= OUT_OF_STOCK_THRESHOLD;
  }
  
  // Si no tiene variantes, usar el inventario general
  const inventory = product.inventory || {tienda1:0, tienda2:0, tienda3:0, bodega:0};
  const totalStock = (inventory.tienda1 || 0) + (inventory.tienda2 || 0) + (inventory.tienda3 || 0) + (inventory.bodega || 0);
  return totalStock <= OUT_OF_STOCK_THRESHOLD;
}

// Función para asegurar que todos los productos tengan código de barras
function ensureBarcodesExist(productsArray) {
  return productsArray.map(product => {
    // Código de barras para producto principal
    if (!product.barcode) {
      product.barcode = 'SOPHIE' + String(product.id).padStart(6, '0');
    }
    
    // Códigos de barras para variantes
    if (product.variants && product.variants.options && product.variants.options.length > 0) {
      product.variants.options = product.variants.options.map((option, index) => {
        if (!option.barcode) {
          option.barcode = 'SOPHIE' + String(product.id).padStart(6, '0') + '-' + String(index + 1);
        }
        return option;
      });
    }
    
    return product;
  });
}

// Función para resetear productos a los valores por defecto
function resetProducts() {
  localStorage.removeItem('products_data');
  var productsToSave = ensureBarcodesExist([...defaultProducts]);
  saveProductsToStorage(productsToSave);
  products = productsToSave;
  console.log('✅ Productos reseteados a valores por defecto');
  if (typeof renderProductsTable === 'function') renderProductsTable();
  if (typeof renderPOSProducts === 'function') renderPOSProducts();
  if (typeof renderInventoryTable === 'function') renderInventoryTable();
  return products;
}

const grid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const modal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsNode = document.getElementById('cart-items');
const cartSubtotalNode = document.getElementById('cart-subtotal');
const cartTaxNode = document.getElementById('cart-tax');
const cartTotalNode = document.getElementById('cart-total');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout');
const accountBtn = document.getElementById('account-btn');
const drawerAccountBtn = document.getElementById('drawer-account');

const TAX_RATE = 0.10;
const MAX_PRODUCTS_PER_PAGE = 20;
let currentPage = 1;

function formatPrice(n){ return `₡${n.toFixed(2)}` }

function getPriceDisplay(product) {
  // Si el producto tiene variantes, mostrar rango de precios
  if (product.variants && product.variants.options && product.variants.options.length > 0) {
    const prices = product.variants.options.map(opt => opt.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    } else {
      return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
  }
  
  // Si no tiene variantes, mostrar el precio normal
  return formatPrice(product.price);
}

function loadCart(){
  return JSON.parse(localStorage.getItem('cart_v2')||'[]');
}

function saveCart(cart){
  localStorage.setItem('cart_v2',JSON.stringify(cart));
  if(typeof renderCartCount === 'function') renderCartCount(cart);
}

function getUserSession(){
  try{
    const raw = localStorage.getItem('user_session');
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

function setUserSession(session){
  localStorage.setItem('user_session', JSON.stringify(session));
}

function clearUserSession(){
  localStorage.removeItem('user_session');
}

function renderUserSession(){
  const session = getUserSession();
  if(accountBtn){
    accountBtn.textContent = session ? `👤 ${session.name || 'Mi cuenta'}` : '👤 Iniciar sesión';
    accountBtn.dataset.state = session ? 'logged-in' : 'logged-out';
  }
  if(drawerAccountBtn){
    drawerAccountBtn.textContent = session ? 'Cerrar sesión' : 'Iniciar sesión';
    drawerAccountBtn.dataset.state = session ? 'logout' : 'login';
    drawerAccountBtn.href = session ? '#' : 'user-login.html';
  }
  const accountMenu = document.getElementById('account-menu');
  if(accountMenu){
    accountMenu.classList.toggle('hidden', !session);
    accountMenu.setAttribute('aria-hidden', session ? 'false' : 'true');
  }
}

function renderCartCount(cart){
  if(!cartCount) return;
  const totalItems = Array.isArray(cart) ? cart.reduce((s,i)=>s+(i.qty||0),0) : 0;
  cartCount.textContent = totalItems;
}

function addToCart(product, qty=1){
  // No permitir agregar productos agotados
  if(product.outOfStock){
    alert('Este producto está agotado y no se puede agregar al carrito.');
    return;
  }
  const cart = loadCart();

  // Usar id y barcode para identificar el producto/variante en el carrito
  let barcode = product.selectedVariantBarcode || product.barcode;
  const cartKey = `${product.id}|${barcode}`;

  const found = cart.find(i => i.id === product.id && i.barcode === barcode);
  if(found){
    found.qty += qty;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      qty: qty,
      barcode: barcode
    });
  }
  saveCart(cart);
}

function setItemQty(id, qty){
  const cart = loadCart();
  // Buscar por id y barcode
  const idx = cart.findIndex(i => i.id === id.id && i.barcode === id.barcode);
  if(idx!==-1){
    if(qty<=0) cart.splice(idx,1);
    else cart[idx].qty = qty;
    saveCart(cart);
  }
}

function clearCart(){ localStorage.removeItem('cart_v2'); if(cartCount) renderCartCount([]); if(typeof renderCartDrawer === 'function') renderCartDrawer(); }

function computeTotals(cart){
  const total = cart.reduce((s,i)=>s + i.price * i.qty,0);
  return {total};
}

function renderCartDrawer(){
  if(!cartItemsNode) return;
  const cart = loadCart();
  cartItemsNode.innerHTML = '';
  if(!Array.isArray(cart) || cart.length===0){
    cartItemsNode.innerHTML = '<p>Tu carrito está vacío.</p>';
    if(cartTotalNode) cartTotalNode.textContent=formatPrice(0);
    return;
  }
  cart.forEach(item=>{
    const el = document.createElement('div'); el.className='cart-item';
    el.innerHTML = `
      <img src="${item.img}" alt="${item.title}" />
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${item.title}</strong>
          <button class="remove-item" data-id="${item.id}" data-barcode="${item.barcode}" style="border:none;background:transparent;color:#b04b70;cursor:pointer">Eliminar</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
          <div class="qty-controls" data-id="${item.id}" data-barcode="${item.barcode}">
            <button class="qty-decrease" data-id="${item.id}" data-barcode="${item.barcode}">-</button>
            <span class="qty" data-id="${item.id}" data-barcode="${item.barcode}">${item.qty}</span>
            <button class="qty-increase" data-id="${item.id}" data-barcode="${item.barcode}">+</button>
          </div>
          <div class="item-price">${formatPrice(item.price * item.qty)}</div>
        </div>
      </div>
    `;
    cartItemsNode.appendChild(el);
  });
  const totals = computeTotals(cart);
  if(cartTotalNode) cartTotalNode.textContent = formatPrice(totals.total);
}

function openCart(){ if(cartOverlay) cartOverlay.setAttribute('aria-hidden','false'); if(cartDrawer) cartDrawer.setAttribute('aria-hidden','false'); renderCartDrawer(); }
function closeCart(){ if(cartOverlay) cartOverlay.setAttribute('aria-hidden','true'); if(cartDrawer) cartDrawer.setAttribute('aria-hidden','true'); }


const hamburger = document.getElementById('hamburger');
const navOverlay = document.getElementById('nav-overlay');
const navDrawer = document.getElementById('nav-drawer');
const closeNavBtn = document.getElementById('close-nav');

function openNav(){ navOverlay.setAttribute('aria-hidden','false'); navDrawer.setAttribute('aria-hidden','false'); }
function closeNav(){ navOverlay.setAttribute('aria-hidden','true'); navDrawer.setAttribute('aria-hidden','true'); }
if(hamburger) hamburger.addEventListener('click',openNav);
if(closeNavBtn) closeNavBtn.addEventListener('click',closeNav);
if(navOverlay) navOverlay.addEventListener('click',closeNav);

function handleAccountAction(e){
  const session = getUserSession();
  const accountMenu = document.getElementById('account-menu');
  
  if(session){
    e.preventDefault();
    // Mostrar/ocultar el dropdown
    if(accountMenu){
      accountMenu.classList.toggle('hidden');
      accountMenu.setAttribute('aria-hidden', accountMenu.classList.contains('hidden') ? 'true' : 'false');
    }
  } else {
    // Si no hay sesión, redirigir al login
    window.location.href = 'user-login.html';
  }
}

function handleLogout(){
  if(confirm('¿Deseas cerrar sesión?')){
    clearUserSession();
    renderUserSession();
    const accountMenu = document.getElementById('account-menu');
    if(accountMenu){
      accountMenu.classList.add('hidden');
      accountMenu.setAttribute('aria-hidden', 'true');
    }
    closeNav();
    alert('Sesión cerrada');
    window.location.href = 'index.html';
  }
}

if(accountBtn) accountBtn.addEventListener('click', handleAccountAction);
if(drawerAccountBtn) drawerAccountBtn.addEventListener('click', handleAccountAction);

// Logout button handler
const logoutBtn = document.getElementById('logout-btn');
if(logoutBtn) logoutBtn.addEventListener('click', handleLogout);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  const accountMenu = document.getElementById('account-menu');
  if(accountMenu && !accountMenu.classList.contains('hidden') && !accountBtn.contains(e.target) && !accountMenu.contains(e.target)){
    accountMenu.classList.add('hidden');
    accountMenu.setAttribute('aria-hidden', 'true');
  }
});


document.addEventListener('DOMContentLoaded',()=>{
  const prodToggle = document.getElementById('nav-products-toggle');
  const prodSub = document.getElementById('nav-products-submenu');
  if(prodToggle && prodSub){
    prodToggle.setAttribute('aria-expanded','false');
    prodToggle.addEventListener('click',()=>{
      const isHidden = prodSub.getAttribute('aria-hidden') === 'true' || !prodSub.classList.contains('show');
      prodSub.setAttribute('aria-hidden', String(!isHidden));
      prodSub.classList.toggle('show', isHidden);
      prodToggle.setAttribute('aria-expanded', String(isHidden));
    });

    try{
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('cat');
      if(cat){
        prodSub.setAttribute('aria-hidden','false');
        prodSub.classList.add('show');
        const link = prodSub.querySelector(`a[href*="cat=${cat}"]`);
        if(link){ link.classList.add('active'); }

        const categoryControl = document.getElementById('filter-category');
        if(categoryControl){ categoryControl.value = cat; renderProducts(undefined,undefined,1); }
      }
    }catch(e){/* ignore in older browsers */}
  }
});


document.addEventListener('click',(e)=>{
  try{
    const closestFn = e && e.target && e.target.closest ? e.target.closest.bind(e.target) : null;
    const a = closestFn ? closestFn('.nav-drawer a') : null;
    if(a){ closeNav(); }
  }catch(err){ /* defensive */ }
});




const carousel = document.getElementById('carousel');
const slides = carousel ? Array.from(carousel.querySelectorAll('.slide')) : [];
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
const dotsNode = document.getElementById('carousel-dots');
let currentSlide = 0;
let carouselTimer = null;

function goToSlide(n){
  slides.forEach((s,i)=> s.classList.toggle('active', i===n));
  Array.from(dotsNode.children).forEach((d,i)=> d.classList.toggle('active', i===n));
  currentSlide = n;
}

function nextSlide(){ goToSlide((currentSlide+1) % slides.length); }
function prevSlideFn(){ goToSlide((currentSlide-1+slides.length) % slides.length); }

function startCarousel(){ if(carouselTimer) clearInterval(carouselTimer); carouselTimer = setInterval(nextSlide,6000); }
function stopCarousel(){ if(carouselTimer) clearInterval(carouselTimer); carouselTimer = null; }

if(carousel && slides.length){
  slides.forEach((_,i)=>{ const b=document.createElement('button'); b.addEventListener('click',()=>{ goToSlide(i); startCarousel(); }); dotsNode.appendChild(b); });
  goToSlide(0); startCarousel();
  nextBtn.addEventListener('click',()=>{ nextSlide(); startCarousel(); });
  prevBtn.addEventListener('click',()=>{ prevSlideFn(); startCarousel(); });
  carousel.addEventListener('mouseenter', stopCarousel);
  carousel.addEventListener('mouseleave', startCarousel);
}


function showModal(product){
  const latestProducts = loadProductsFromStorage();
  const freshProduct = Array.isArray(latestProducts)
    ? latestProducts.find(p => p.id === product.id)
    : null;
  if (freshProduct) product = freshProduct;
  let currentImgIndex = 0;
  const images = product.images || [product.img];
  let selectedVariant = product.variants ? product.variants.options[0] : null;
  let currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const isOutOfStock = isProductOutOfStock(product);
  const isHP = /harry potter/i.test(product.title || '');
  const isSnoopy = /snoopy|peanuts/i.test(product.title || '');
  const modalContent = document.querySelector('.modal-content');
  if(modalContent){
    modalContent.classList.toggle('hp-theme', isHP);
    modalContent.classList.toggle('snoopy-theme', isSnoopy);
  }


  const colorMap = {
    'Azul Oscuro': '#00008B',
    'Rojo': '#DC143C',
    'Negro': '#000000',
    'Cian': '#00FFFF',
    'Rojo/Dorado': '#8B0000',
    'Verde': '#228B22',
    'Amarillo': '#FFD700',
    'Azul': '#1E90FF',
    'Café': '#6F4E37',
    'Hueso': '#E6D9C3',
    'Café Muy Oscuro': '#3B2A1A'
  };

  function getInventoryHTML(inv) {
    return `<div id="modal-inventory" style="margin:18px 0 0 0;padding:12px 18px;background:#f8f5f7;border-radius:10px;box-shadow:0 2px 8px rgba(90,32,50,0.07);font-size:0.98rem">
      <strong style="color:#6b2840">Inventario:</strong>
      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:8px">
        <span>🛒 Sophie Store: <b>${inv.tienda1 ?? 0}</b></span>
        <span>🏬 Sophie Mall: <b>${inv.tienda2 ?? 0}</b></span>
        <span>🛍️ Sophie's Ticados: <b>${inv.tienda3 ?? 0}</b></span>
        <span>📦 Bodega: <b>${inv.bodega ?? 0}</b></span>
      </div>
    </div>`;
  }

  let inventorySection = product.variants && selectedVariant ? getInventoryHTML(selectedVariant.inventory) : getInventoryHTML(product.inventory);

  modalBody.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:18px;position:relative;min-height:300px">
      <div id="modal-out-banner" style="background:rgba(220,53,69,0.95);color:#fff;font-weight:700;padding:12px 20px;border-radius:8px;text-align:center;font-size:1.1rem;box-shadow:0 4px 12px rgba(220,53,69,0.3);margin-bottom:8px;display:${isOutOfStock ? 'block' : 'none'}">⚠️ Producto Agotado</div>
      <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap${isHP ? ';animation:hpContentAppear 1.2s ease-out' : ''}">
        <div style="position:relative;width:240px${isHP ? ';animation:hpImageAppear 0.8s ease-out' : ''}">
          <div id="modal-out-overlay" style="position:absolute;top:8px;left:8px;background:rgba(220,53,69,0.95);color:#fff;font-weight:700;font-size:0.85rem;padding:4px 10px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:3;display:${isOutOfStock ? 'block' : 'none'}">Agotado</div>
          <img id="modal-img" src="${images[0]}" alt="${product.title}" style="width:240px;height:240px;border-radius:8px;object-fit:cover${isOutOfStock ? ';opacity:0.6;filter:grayscale(30%)' : ''}" />
          ${images.length > 1 ? `
            <button class="modal-prev" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.9);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15)">‹</button>
            <button class="modal-next" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.9);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15)">›</button>
            <div class="modal-dots" style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;background:rgba(255,255,255,0.7);padding:4px 8px;border-radius:12px">
              ${images.map((_, i) => `<span class="modal-dot ${i === 0 ? 'active' : ''}" data-index="${i}" style="width:8px;height:8px;border-radius:50%;background:${i === 0 ? '#6b2840' : '#ccc'};cursor:pointer"></span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div style="flex:1${isHP ? ';animation:hpTextAppear 1s ease-out 0.3s both' : ''}">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <h3 style="margin:0;font-family:'CenturyGothic',Playfair Display,serif">${product.title}</h3>
            ${isHP ? '<span class="hp-badge">Wizarding Edition</span>' : ''}
            ${isSnoopy ? '<span class="snoopy-badge">Snoopy Collection</span>' : ''}
          </div>
          <p style="color:${isHP ? '#e8dcc0' : '#6b6b6b'}">${product.desc}</p>
          <p id="modal-price" style="font-weight:700;color:${isHP ? '#d4af37' : '#6b2840'}">${formatPrice(currentPrice)}</p>
          ${product.variants ? `
            <div style="margin:12px 0">
              <label style="font-weight:600;color:${isHP ? '#fef5e7' : '#6b2840'};display:block;margin-bottom:8px">${product.variants.type.charAt(0).toUpperCase() + product.variants.type.slice(1)}:</label>
              ${product.variants.type === 'color' ? `
                <div style="display:flex;gap:10px;flex-wrap:wrap">
                  ${product.variants.options.map((opt, i) => `
                    <div class="color-option" data-index="${i}" role="button" tabindex="0" aria-label="${opt.name}" title="${opt.name}" style="position:relative;cursor:pointer;transition:transform 0.2s">
                      <div style="width:40px;height:40px;border-radius:50%;background:${colorMap[opt.name] || '#ccc'};border:4px solid ${i === 0 ? '#6b2840' : '#ddd'};box-shadow:0 4px 12px rgba(0,0,0,${i === 0 ? '0.4' : '0.25'}), inset 0 1px 2px rgba(255,255,255,0.3);transition:all 0.3s"></div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <select id="variant-select" style="padding:8px 12px;border:1px solid ${isHP ? '#d4af37' : '#eee'};border-radius:6px;font-size:1rem;width:100%;max-width:200px;cursor:pointer;background:${isHP ? '#1a1829' : 'white'};color:${isHP ? '#e8dcc0' : '#333'}">
                  ${product.variants.options.map((opt, i) => `<option value="${i}">${opt.name} - ${formatPrice(opt.price)}</option>`).join('')}
                </select>
              `}
            </div>
          ` : ''}
          <div style="display:flex;gap:8px;margin-top:10px;align-items:center">
            <label style="font-weight:600;color:${isHP ? '#fef5e7' : '#6b2840'}">Cantidad:</label>
            <input id="modal-qty" type="number" min="1" value="1" style="width:60px;padding:8px;border:1px solid ${isHP ? '#d4af37' : '#eee'};border-radius:6px;font-size:1rem;text-align:center;background:${isHP ? '#1a1829' : 'white'};color:${isHP ? '#e8dcc0' : '#333'}" />
          </div>
          ${inventorySection}
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:auto">
        <div id="modal-out-badge" class="badge-out" style="margin-right:12px;background:#f44336;color:white;padding:6px 16px;border-radius:8px;font-weight:700;display:${isOutOfStock ? 'inline-block' : 'none'}">Agotado</div>
        <button id="modal-add" class="add ${isHP ? 'hp-btn' : ''} ${isSnoopy ? 'snoopy-btn' : ''}" ${isOutOfStock ? 'disabled' : ''} style="${isOutOfStock ? 'background:#ddd;color:#777;cursor:not-allowed;box-shadow:none' : ''}">${isOutOfStock ? 'Agotado' : 'Agregar'}</button>
      </div>
    </div>
  `;
  // Actualizar inventario dinámicamente al cambiar variante
  function updateInventorySection(inv) {
    const invDiv = document.getElementById('modal-inventory');
    if (invDiv) invDiv.outerHTML = getInventoryHTML(inv);
  }

  function updateModalOutOfStock() {
    const out = isProductOutOfStock(product);
    const banner = document.getElementById('modal-out-banner');
    const overlay = document.getElementById('modal-out-overlay');
    const badge = document.getElementById('modal-out-badge');
    const addBtn = document.getElementById('modal-add');
    const img = document.getElementById('modal-img');

    if (banner) banner.style.display = out ? 'block' : 'none';
    if (overlay) overlay.style.display = out ? 'block' : 'none';
    if (badge) badge.style.display = out ? 'inline-block' : 'none';
    if (img) {
      img.style.opacity = out ? '0.6' : '1';
      img.style.filter = out ? 'grayscale(30%)' : 'none';
    }
    if (addBtn) {
      addBtn.disabled = out;
      addBtn.textContent = out ? 'Agotado' : 'Agregar';
      addBtn.style.background = out ? '#ddd' : '';
      addBtn.style.color = out ? '#777' : '';
      addBtn.style.cursor = out ? 'not-allowed' : '';
      addBtn.style.boxShadow = out ? 'none' : '';
    }
  }

  modal.setAttribute('aria-hidden','false');
  updateModalOutOfStock();


  if (product.variants) {
    if (product.variants.type === 'color') {
      const colorOptions = modalBody.querySelectorAll('.color-option');
      const priceDisplay = document.getElementById('modal-price');


      colorOptions.forEach((option) => {
        option.addEventListener('mouseenter', () => {
          option.style.transform = 'scale(1.1)';
        });
        option.addEventListener('mouseleave', () => {
          option.style.transform = 'scale(1)';
        });
      });

      colorOptions.forEach((option, index) => {
        const clickHandler = () => {

          colorOptions.forEach(opt => {
            const circle = opt.querySelector('div');
            circle.style.border = '3px solid transparent';
            circle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          });

          const selectedCircle = option.querySelector('div');
          selectedCircle.style.border = '3px solid #6b2840';
          selectedCircle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

          selectedVariant = product.variants.options[index];
          currentPrice = selectedVariant.price;
          priceDisplay.textContent = formatPrice(currentPrice);
          updateInventorySection(selectedVariant.inventory);
        };

        option.addEventListener('click', clickHandler);

        option.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            clickHandler();
          }
        });
      });
    } else {
      const variantSelect = document.getElementById('variant-select');
      const priceDisplay = document.getElementById('modal-price');

      variantSelect.addEventListener('change', (e) => {
        const optionIndex = parseInt(e.target.value);
        selectedVariant = product.variants.options[optionIndex];
        currentPrice = selectedVariant.price;
        priceDisplay.textContent = formatPrice(currentPrice);
        updateInventorySection(selectedVariant.inventory);
      });
    }
  }


  if (images.length > 1) {
    const modalImg = document.getElementById('modal-img');
    const prevBtn = modalBody.querySelector('.modal-prev');
    const nextBtn = modalBody.querySelector('.modal-next');
    const dots = modalBody.querySelectorAll('.modal-dot');

    const updateModalImage = (index) => {
      currentImgIndex = index;
      modalImg.src = images[index];
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.style.background = i === index ? '#6b2840' : '#ccc';
      });
    };

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = (currentImgIndex - 1 + images.length) % images.length;
      updateModalImage(newIndex);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newIndex = (currentImgIndex + 1) % images.length;
      updateModalImage(newIndex);
    });

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(dot.dataset.index);
        updateModalImage(index);
      });
    });
  }

  document.getElementById('modal-add').addEventListener('click',()=>{ 
    if (isProductOutOfStock(product)) {
      updateModalOutOfStock();
      return;
    }
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    let productToAdd;
    if(product.variants && selectedVariant){
      productToAdd = {
        ...product,
        price: selectedVariant.price,
        title: `${product.title} (${selectedVariant.name})`,
        selectedVariantBarcode: selectedVariant.barcode
      };
    } else {
      productToAdd = {...product, selectedVariantBarcode: product.barcode};
    }
    addToCart(productToAdd, qty);
    closeModal();
    openCart();
  });
}

function closeModal(){ modal.setAttribute('aria-hidden','true'); }


function renderProducts(filter='all',search='',page=null){
  // Recargar productos desde localStorage para obtener el inventario actualizado
  products = loadProductsFromStorage();
  
  grid.innerHTML = '';

  const categorySelect = document.getElementById('filter-category');
  const priceMinNode = document.getElementById('price-min');
  const priceMaxNode = document.getElementById('price-max');
  const searchNode = document.getElementById('search');
  if(categorySelect) filter = categorySelect.value || filter;
  if(searchNode && !search) search = searchNode.value;

  if(page) currentPage = page;
  if(!currentPage) currentPage = 1;

  const q = (search || '').trim().toLowerCase();
  const min = priceMinNode && priceMinNode.value !== '' ? parseFloat(priceMinNode.value) : null;
  const max = priceMaxNode && priceMaxNode.value !== '' ? parseFloat(priceMaxNode.value) : null;

  const list = products.filter(p=>{
    // Filtrar solo productos activos
    if(p.active === false) return false;
    if(filter!=='all' && p.category!==filter) return false;
    if(q && !(p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))) return false;
    if(min!==null && p.price < min) return false;
    if(max!==null && p.price > max) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(list.length / MAX_PRODUCTS_PER_PAGE));
  if(currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * MAX_PRODUCTS_PER_PAGE;
  const visible = list.slice(start, start + MAX_PRODUCTS_PER_PAGE);
  renderPagination(totalPages);
  visible.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    const images = (p.images && Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.img];
    const hasMultipleImages = images.length > 1;
    const dotsHTML = hasMultipleImages ? `<div class="card-dots">${images.map((_, i) => `<span data-index="${i}" class="${i === 0 ? 'active' : ''}"></span>`).join('')}</div>` : '';
    const navHTML = hasMultipleImages ? `
      <button class="card-nav prev" aria-label="Imagen anterior">‹</button>
      <button class="card-nav next" aria-label="Imagen siguiente">›</button>
    ` : '';

    // Verificar si el producto está agotado por inventario o por bandera manual
    const outOfStock = p.outOfStock === true || isProductOutOfStock(p);

    card.innerHTML = `
      <div class="card-img-container">
        ${outOfStock ? '<div class="badge-out">Agotado</div>' : ''}
        <img src="${images[0]}" alt="${p.title}" data-images='${JSON.stringify(images)}' data-current="0" />
        ${navHTML}
        ${dotsHTML}
      </div>
      <h3 style="font-family:'CenturyGothic',Playfair Display,serif">${p.title}</h3>
    `;
    grid.appendChild(card);

    // Evento para botón Agregar: si tiene variantes, abrir modal; si no, agregar directo
    const addBtn = card.querySelector('.add');
    if (addBtn && !outOfStock) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (p.variants && p.variants.options && p.variants.options.length > 0) {
          showModal(p);
          modal.setAttribute('aria-hidden', 'false');
        } else {
          addToCart(p, 1);
          openCart();
        }
      });
    }


    if(hasMultipleImages){
      const img = card.querySelector('img');
      const prevBtn = card.querySelector('.card-nav.prev');
      const nextBtn = card.querySelector('.card-nav.next');
      const dots = card.querySelectorAll('.card-dots span');

      const updateDots = (index) => {
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      };

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const current = parseInt(img.getAttribute('data-current'));
        const imgs = JSON.parse(img.getAttribute('data-images'));
        const newIndex = (current - 1 + imgs.length) % imgs.length;
        img.src = imgs[newIndex];
        img.setAttribute('data-current', newIndex);
        updateDots(newIndex);
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const current = parseInt(img.getAttribute('data-current'));
        const imgs = JSON.parse(img.getAttribute('data-images'));
        const newIndex = (current + 1) % imgs.length;
        img.src = imgs[newIndex];
        img.setAttribute('data-current', newIndex);
        updateDots(newIndex);
      });

      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(dot.getAttribute('data-index'));
          const imgs = JSON.parse(img.getAttribute('data-images'));
          img.src = imgs[index];
          img.setAttribute('data-current', index);
          updateDots(index);
        });
      });
    }
  });

  document.querySelectorAll('.category-pills .pill').forEach(p=>{
    p.addEventListener('click', (e)=>{
      const cat = e.currentTarget.getAttribute('data-cat') || 'all';
      const select = document.getElementById('filter-category');
      if(select){
        select.value = cat === 'all' ? 'all' : cat;
      }

      document.querySelectorAll('.category-pills .pill').forEach(x=>x.classList.remove('active'));
      e.currentTarget.classList.add('active');
      renderProducts();

      const url = new URL(window.location.href);
      if(cat === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat', cat);
      window.history.replaceState({},'',url.toString());
    })
  })

  const urlParams = new URLSearchParams(window.location.search);
  const activeCat = urlParams.get('cat') || 'all';
  const activePill = document.querySelector('.category-pills .pill[data-cat="'+activeCat+'"]');
  if(activePill) activePill.classList.add('active');
}


function renderBestSellers(count=6){
  const container = document.getElementById('best-sellers-grid');
  if(!container) return;
  container.innerHTML = '';
  // Filtrar solo productos activos antes de ordenar por vendidos
  const top = products.filter(p => p.active !== false).slice().sort((a,b)=>b.sold - a.sold).slice(0,count);
  top.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    const images = (p.images && Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.img];
    const hasMultipleImages = images.length > 1;
    const dotsHTML = hasMultipleImages ? `<div class="card-dots">${images.map((_, i) => `<span data-index="${i}" class="${i === 0 ? 'active' : ''}"></span>`).join('')}</div>` : '';
    const navHTML = hasMultipleImages ? `
      <button class="card-nav prev" aria-label="Imagen anterior">‹</button>
      <button class="card-nav next" aria-label="Imagen siguiente">›</button>
    ` : '';
    
    // Calcular dinámicamente si está agotado basado en el inventario actual
    const isOutOfStock = isProductOutOfStock(p);

    card.innerHTML = `
      <div class="card-img-container">
        ${isOutOfStock ? '<div class="badge-out">Agotado</div>' : ''}
        <img src="${images[0]}" alt="${p.title}" data-images='${JSON.stringify(images)}' data-current="0" />
        ${navHTML}
        ${dotsHTML}
      </div>
      <h3 style="font-family:'CenturyGothic',Playfair Display,serif">${p.title}</h3>
    `;
    container.appendChild(card);

    // Evento para botón Agregar: si tiene variantes, abrir modal; si no, agregar directo
    const addBtn = card.querySelector('.add');
    if (addBtn && !isOutOfStock) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (p.variants && p.variants.options && p.variants.options.length > 0) {
          showModal(p);
          modal.setAttribute('aria-hidden', 'false');
        } else {
          addToCart(p, 1);
          openCart();
        }
      });
    }


    if(hasMultipleImages){
      const img = card.querySelector('img');
      const prevBtn = card.querySelector('.card-nav.prev');
      const nextBtn = card.querySelector('.card-nav.next');
      const dots = card.querySelectorAll('.card-dots span');

      const updateDots = (index) => {
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      };

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const current = parseInt(img.getAttribute('data-current'));
        const imgs = JSON.parse(img.getAttribute('data-images'));
        const newIndex = (current - 1 + imgs.length) % imgs.length;
        img.src = imgs[newIndex];
        img.setAttribute('data-current', newIndex);
        updateDots(newIndex);
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const current = parseInt(img.getAttribute('data-current'));
        const imgs = JSON.parse(img.getAttribute('data-images'));
        const newIndex = (current + 1) % imgs.length;
        img.src = imgs[newIndex];
        img.setAttribute('data-current', newIndex);
        updateDots(newIndex);
      });

      dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(dot.getAttribute('data-index'));
          const imgs = JSON.parse(img.getAttribute('data-images'));
          img.src = imgs[index];
          img.setAttribute('data-current', index);
          updateDots(index);
        });
      });
    }
  });
}

function renderPagination(totalPages){
  const container = document.getElementById('products-pagination');
  if(!container) return;
  if(totalPages <= 1){
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';
  container.innerHTML = `
    <button class="page-btn prev" ${currentPage===1 ? 'disabled aria-disabled="true"' : ''}>Anterior</button>
    <span class="page-info">Página ${currentPage} de ${totalPages}</span>
    <button class="page-btn next" ${currentPage===totalPages ? 'disabled aria-disabled="true"' : ''}>Siguiente</button>
  `;
  const prev = container.querySelector('.page-btn.prev');
  const next = container.querySelector('.page-btn.next');
  if(prev) prev.addEventListener('click',()=>{ if(currentPage>1){ currentPage-=1; renderProducts(undefined,undefined,currentPage); } });
  if(next) next.addEventListener('click',()=>{ if(currentPage<totalPages){ currentPage+=1; renderProducts(undefined,undefined,currentPage); } });
}


const categoryControl = document.getElementById('filter-category');
if(categoryControl){
  categoryControl.addEventListener('change',()=>{ renderProducts(undefined,undefined,1); });
}
const priceMinControl = document.getElementById('price-min');
const priceMaxControl = document.getElementById('price-max');
if(priceMinControl) priceMinControl.addEventListener('input',()=>{ renderProducts(undefined,undefined,1); });
if(priceMaxControl) priceMaxControl.addEventListener('input',()=>{ renderProducts(undefined,undefined,1); });
const searchControl = document.getElementById('search');
if(searchControl) searchControl.addEventListener('input',()=>{ renderProducts(undefined,undefined,1); });
const clearFiltersBtn = document.getElementById('clear-filters');
if(clearFiltersBtn) clearFiltersBtn.addEventListener('click',()=>{
  if(categoryControl) categoryControl.value='all';
  if(searchControl) searchControl.value='';
  if(priceMinControl) priceMinControl.value='';
  if(priceMaxControl) priceMaxControl.value='';
  renderProducts(undefined,undefined,1);
});


document.addEventListener('click',(e)=>{
  try{

    if(e.target && e.target.matches && e.target.matches('.add') && e.target.dataset && e.target.dataset.id){
      const id = parseInt(e.target.dataset.id);
      const p = products.find(x=>x.id===id);
      if(p && !p.outOfStock){ addToCart(p,1); }
      return;
    }

    const cardEl = e.target && e.target.closest ? e.target.closest('.card') : null;
    if(cardEl && !(e.target && e.target.matches && e.target.matches('button'))){
      const titleNode = cardEl.querySelector('h3');
      const title = titleNode ? titleNode.textContent : null;
      const p = products.find(x=>x.title===title);
      if(p) showModal(p);
    }
  }catch(err){ /* defensive */ }
});


document.querySelectorAll('.nav .btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.nav .btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    renderProducts(filter,document.getElementById('search').value,1);
  });
});

const globalNavSearch = document.getElementById('search');
if(globalNavSearch){
  globalNavSearch.addEventListener('input',(e)=>{
    const active = document.querySelector('.nav .btn.active');
    const filter = active ? active.dataset.filter : 'all';
    renderProducts(filter,e.target.value,1);
  });
}


if(openCartBtn) openCartBtn.addEventListener('click',openCart);
if(closeCartBtn) closeCartBtn.addEventListener('click',closeCart);
if(cartOverlay) cartOverlay.addEventListener('click',closeCart);
if(clearCartBtn) clearCartBtn.addEventListener('click',()=>{ clearCart(); renderProducts(undefined,undefined,1); if(typeof renderCartDrawer==='function') renderCartDrawer(); });

if(cartItemsNode){
  cartItemsNode.addEventListener('click',(e)=>{
    try{
      const id = e.target && e.target.dataset ? parseInt(e.target.dataset.id) : null;
      const barcode = e.target && e.target.dataset ? e.target.dataset.barcode : null;
      if(id && barcode){
        const key = {id, barcode};
        const cart = loadCart();
        const item = cart.find(i=>i.id===id && i.barcode===barcode);
        if(e.target.matches('.qty-increase')){ if(item){ setItemQty(key, item.qty+1); renderCartDrawer(); } }
        if(e.target.matches('.qty-decrease')){ if(item){ setItemQty(key, item.qty-1); renderCartDrawer(); } }
        if(e.target.matches('.remove-item')){ setItemQty(key, 0); renderCartDrawer(); }
      }
    }catch(err){ /* defensive */ }
  });
}

if(checkoutBtn){
  checkoutBtn.addEventListener('click',()=>{
    const cart = loadCart();
    if(!Array.isArray(cart) || cart.length===0){
      alert('Tu carrito está vacío');
      return;
    }
    window.location.href = 'checkout.html';
  });
}

if(closeModalBtn) closeModalBtn.addEventListener('click',closeModal);
if(modal) modal.addEventListener('click',(e)=>{ if(e.target===modal) closeModal(); });


if(document.getElementById('best-sellers-grid')){
  renderBestSellers(5);
}
if(document.getElementById('products-grid')){
  renderProducts();
}
if(cartCount) renderCartCount(loadCart());
renderUserSession();

// ============================================================
// ACTUALIZAR INVENTARIO CUANDO CAMBIA EN OTRAS PESTAÑAS
// ============================================================
// Escuchar cambios en localStorage (cuando el inventario se actualiza en otra pestaña)
window.addEventListener('storage', (e) => {
  if (e.key === 'products_data') {
    // Recargar los productos desde localStorage
    products = loadProductsFromStorage();
    // Re-renderizar los más vendidos con el inventario actualizado
    if (document.getElementById('best-sellers-grid')) {
      renderBestSellers(5);
    }
    // Re-renderizar la cuadrícula de productos si existe
    if (document.getElementById('products-grid')) {
      renderProducts();
    }
  }
});

// Actualizar también cuando la pestaña regresa al foco (usuario vuelve de otra pestaña)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // La página se volvió visible - actualizar best sellers
    products = loadProductsFromStorage();
    if (document.getElementById('best-sellers-grid')) {
      renderBestSellers(5);
    }
    if (document.getElementById('products-grid')) {
      renderProducts();
    }
  }
});

// ============================================================
// GESTIÓN DE PEDIDOS ONLINE PENDIENTES
// ============================================================

function openPedidosOnlineTab() {
  // Limpiar pedidos vencidos primero
  cleanExpiredOnlineOrders();
  
  var modal = document.createElement('div');
  modal.id = 'pedidos-online-list-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:2000;display:flex;align-items:center;justify-content:center;';
  
  var content = '<div style="background:white;padding:30px;border-radius:12px;max-width:1200px;width:95%;max-height:90vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,0.3);">';
  
  // Header
  content += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:3px solid #9c27b0;padding-bottom:15px;">';
  content += '<h2 style="margin:0;color:#9c27b0">📦 Pedidos Online Pendientes</h2>';
  content += '<button onclick="document.getElementById(\'pedidos-online-list-modal\').remove();" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#666">✕</button>';
  content += '</div>';
  
  // Filtros
  content += '<div style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap">';
  content += '<div style="flex:1;min-width:200px">';
  content += '<label style="display:block;color:#333;font-weight:600;margin-bottom:5px">Estado:</label>';
  content += '<select id="pedidos-filter-status" onchange="filterPedidosOnlineDisplay()" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px">';
  content += '<option value="">Todos los estados</option>';
  content += '<option value="pendiente">⏳ Pendiente de pago</option>';
  content += '<option value="confirmado">✅ Confirmado</option>';
  content += '<option value="despachado">📦 Despachado</option>';
  content += '</select>';
  content += '</div>';
  content += '<div style="flex:1;min-width:200px">';
  content += '<label style="display:block;color:#333;font-weight:600;margin-bottom:5px">Cliente:</label>';
  content += '<input type="text" id="pedidos-filter-client" onchange="filterPedidosOnlineDisplay()" placeholder="Buscar cliente" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px">';
  content += '</div>';
  content += '<div style="flex:1;min-width:200px">';
  content += '<label style="display:block;color:#333;font-weight:600;margin-bottom:5px">Método Pago:</label>';
  content += '<select id="pedidos-filter-method" onchange="filterPedidosOnlineDisplay()" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px">';
  content += '<option value="">Todos los métodos</option>';
  content += '<option value="tarjeta">💳 Tarjeta</option>';
  content += '<option value="sinpe">📱 Sinpe</option>';
  content += '<option value="transferencia">🏦 Transferencia</option>';
  content += '</select>';
  content += '</div>';
  content += '</div>';
  
  // Contenedor de pedidos
  content += '<div id="pedidos-list-container" style="margin-top:20px"></div>';
  
  content += '</div>';
  
  modal.innerHTML = content;
  document.body.appendChild(modal);
  
  // Mostrar pedidos
  displayPedidosOnline();
}

function displayPedidosOnline() {
  try {
    var pedidos = JSON.parse(localStorage.getItem('onlineOrders') || '[]');
    console.log('📦 Pedidos encontrados en localStorage:', pedidos);
    var container = document.getElementById('pedidos-list-container');
    
    if (pedidos.length === 0) {
      console.log('⚠️ No hay pedidos registrados');
      container.innerHTML = '<p style="text-align:center;color:#999;padding:40px">No hay pedidos online registrados</p>';
      return;
    }
    
    var html = '';
    for (var i = pedidos.length - 1; i >= 0; i--) {
      var pedido = pedidos[i];
      var createdDate = new Date(pedido.date);
      var now = new Date();
      
      // Determinar color y badge según el estado
      var statusColor, statusBadge, statusIcon;
      if (pedido.status === 'pendiente') {
        statusColor = '#ff9800';
        statusBadge = '⏳ Pendiente de pago';
        statusIcon = '⏳';
      } else if (pedido.status === 'confirmado') {
        statusColor = '#4caf50';
        statusBadge = '✅ Confirmado';
        statusIcon = '✅';
      } else if (pedido.status === 'despachado') {
        statusColor = '#2196f3';
        statusBadge = '📦 Despachado';
        statusIcon = '📦';
      } else {
        statusColor = '#666';
        statusBadge = pedido.status;
        statusIcon = '●';
      }
      
      // Determinar color del método de pago
      var methodDisplay = '';
      if (pedido.paymentMethod === 'tarjeta') {
        methodDisplay = '💳 Tarjeta';
      } else if (pedido.paymentMethod === 'sinpe') {
        methodDisplay = '📱 Sinpe Móvil';
      } else if (pedido.paymentMethod === 'transferencia') {
        methodDisplay = '🏦 Transferencia';
      } else {
        methodDisplay = pedido.paymentMethod;
      }
      
      html += '<div style="border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:15px;background:#f9f9f9">';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px">';
      
      html += '<div>';
      html += '<div style="font-size:0.9rem;color:#666;margin-bottom:2px">ID Pedido</div>';
      html += '<div style="font-size:1.1rem;font-weight:bold;color:#333">' + pedido.id + '</div>';
      html += '</div>';
      
      html += '<div>';
      html += '<div style="font-size:0.9rem;color:#666;margin-bottom:2px">Cliente</div>';
      html += '<div style="font-size:1.1rem;font-weight:bold;color:#333">' + pedido.customerEmail + '</div>';
      html += '</div>';
      
      html += '<div>';
      html += '<div style="font-size:0.9rem;color:#666;margin-bottom:2px">Estado</div>';
      html += '<div style="display:inline-block;background:' + statusColor + ';color:white;padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600">' + statusBadge + '</div>';
      html += '</div>';
      
      html += '<div>';
      html += '<div style="font-size:0.9rem;color:#666;margin-bottom:2px">Método de Pago</div>';
      html += '<div style="font-size:1rem;font-weight:bold;color:#333">' + methodDisplay + '</div>';
      html += '</div>';
      
      html += '</div>';
      
      html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:15px">';
      
      html += '<div style="background:white;padding:10px;border-radius:4px;text-align:center">';
      html += '<div style="font-size:0.8rem;color:#666">Total</div>';
      html += '<div style="font-size:1.2rem;font-weight:bold;color:#2196f3">₡' + pedido.total.toLocaleString('es-CR', {minimumFractionDigits: 2}) + '</div>';
      html += '</div>';
      
      html += '<div style="background:white;padding:10px;border-radius:4px;text-align:center">';
      html += '<div style="font-size:0.8rem;color:#666">Cantidad Artículos</div>';
      html += '<div style="font-size:1.2rem;font-weight:bold;color:#4caf50">' + pedido.items.length + '</div>';
      html += '</div>';
      
      html += '<div style="background:white;padding:10px;border-radius:4px;text-align:center">';
      html += '<div style="font-size:0.8rem;color:#666">Envío</div>';
      html += '<div style="font-size:0.95rem;font-weight:bold;color:#333">' + (pedido.shippingMethod === 'pickup' ? '🏪 Retiro' : '📦 Envío') + '</div>';
      html += '</div>';
      
      html += '<div style="background:white;padding:10px;border-radius:4px;text-align:center">';
      html += '<div style="font-size:0.8rem;color:#666">Fecha</div>';
      html += '<div style="font-size:0.9rem;font-weight:bold;color:#333">' + createdDate.toLocaleDateString('es-CR') + '</div>';
      html += '</div>';
      
      html += '</div>';
      
      html += '<div style="margin-bottom:10px">';
      html += '<details>';
      html += '<summary style="cursor:pointer;color:#2196f3;font-weight:600;user-select:none">Ver artículos (' + pedido.items.length + ')</summary>';
      html += '<div style="padding:10px;margin-top:10px;background:white;border-radius:4px">';
      
      for (var j = 0; j < pedido.items.length; j++) {
        var item = pedido.items[j];
        var itemTotal = item.price * item.qty;
        
        html += '<div style="padding:5px 0;border-bottom:1px solid #eee;font-size:0.9rem">';
        html += '<div style="display:flex;justify-content:space-between">';
        html += '<span>' + item.title + ' x' + item.qty + '</span>';
        html += '<span style="font-weight:600">₡' + itemTotal.toLocaleString('es-CR', {minimumFractionDigits: 2}) + '</span>';
        html += '</div>';
        html += '</div>';
      }
      
      html += '</div>';
      html += '</details>';
      html += '</div>';
      
      // Botones de acción
      html += '<div style="display:flex;gap:10px;border-top:1px solid #ddd;padding-top:10px">';
      
      if (pedido.status === 'pendiente') {
        // Solo mostrar confirmar para tarjeta (confirmación automática)
        if (pedido.paymentMethod === 'tarjeta') {
          html += '<button onclick="confirmPedidoOnline(' + i + ')" style="flex:1;padding:8px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">✅ Confirmar Pago</button>';
        } else {
          html += '<button onclick="confirmPedidoOnline(' + i + ')" style="flex:1;padding:8px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">✅ Marcar Pagado</button>';
        }
        html += '<button onclick="cancelPedidoOnline(' + i + ')" style="flex:1;padding:8px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">❌ Cancelar</button>';
      } else if (pedido.status === 'confirmado') {
        html += '<button onclick="completarDespacho(' + i + ')" style="flex:1;padding:8px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">📦 Completar Despacho</button>';
        html += '<button onclick="cancelPedidoOnline(' + i + ')" style="flex:1;padding:8px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">❌ Cancelar</button>';
      } else if (pedido.status === 'despachado') {
        html += '<p style="margin:0;padding:8px;background:#e8f5e9;border-radius:4px;color:#2e7d32;font-weight:600;text-align:center">✅ Pedido completado</p>';
      }
      
      html += '</div>';
      
      html += '</div>';
    }
    
    container.innerHTML = html;
  } catch (err) {
    console.error('Error al mostrar pedidos online:', err);
    document.getElementById('pedidos-list-container').innerHTML = '<p style="color:#f44336">Error al cargar pedidos</p>';
  }
}

function filterPedidosOnlineDisplay() {
  var statusFilter = document.getElementById('pedidos-filter-status').value;
  var clientFilter = document.getElementById('pedidos-filter-client').value.toLowerCase();
  var methodFilter = document.getElementById('pedidos-filter-method').value;
  
  var pedidos = JSON.parse(localStorage.getItem('onlineOrders') || '[]');
  var filtered = pedidos.filter(function(pedido) {
    var statusMatch = !statusFilter || pedido.status === statusFilter;
    var clientMatch = !clientFilter || pedido.customerEmail.toLowerCase().includes(clientFilter);
    var methodMatch = !methodFilter || pedido.paymentMethod === methodFilter;
    return statusMatch && clientMatch && methodMatch;
  });
  
  var container = document.getElementById('pedidos-list-container');
  if (filtered.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#999;padding:40px">No hay pedidos que coincidan con los filtros</p>';
    return;
  }
  
  var html = '';
  for (var i = filtered.length - 1; i >= 0; i--) {
    var pedido = filtered[i];
    var createdDate = new Date(pedido.date);
    var now = new Date();
    
    // Determinar color y badge según el estado
    var statusColor, statusBadge, statusIcon;
    if (pedido.status === 'pendiente') {
      statusColor = '#ff9800';
      statusBadge = '⏳ Pendiente de pago';
      statusIcon = '⏳';
    } else if (pedido.status === 'confirmado') {
      statusColor = '#4caf50';
      statusBadge = '✅ Confirmado';
      statusIcon = '✅';
    } else if (pedido.status === 'despachado') {
      statusColor = '#2196f3';
      statusBadge = '📦 Despachado';
      statusIcon = '📦';
    } else {
      statusColor = '#666';
      statusBadge = pedido.status;
      statusIcon = '●';
    }
    
    // Determinar color del método de pago
    var methodDisplay = '';
    if (pedido.paymentMethod === 'tarjeta') {
      methodDisplay = '💳 Tarjeta';
    } else if (pedido.paymentMethod === 'sinpe') {
      methodDisplay = '📱 Sinpe Móvil';
    } else if (pedido.paymentMethod === 'transferencia') {
      methodDisplay = '🏦 Transferencia';
    } else {
      methodDisplay = pedido.paymentMethod;
    }
    
    // Encontrar el índice original
    var originalIndex = pedidos.indexOf(pedido);
    
    html += '<div style="border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:15px;background:#f9f9f9">';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px">';
    
    html += '<div>';
    html += '<div style="font-size:0.9rem;color:#666;margin-bottom:2px">ID Pedido</div>';
    html += '<div style="font-size:1.1rem;font-weight:bold;color:#333">' + pedido.id + '</div>';
    html += '</div>';
    
    html += '<div>';
    html += '<div style="font-size:0.9rem;color:#666;margin-bottom:2px">Cliente</div>';
    html += '<div style="font-size:1.1rem;font-weight:bold;color:#333">' + pedido.customerEmail + '</div>';
    html += '</div>';
    
    html += '<div>';
    html += '<div style="font-size:0.9rem;color:#666;margin-bottom:2px">Estado</div>';
    html += '<div style="display:inline-block;background:' + statusColor + ';color:white;padding:4px 12px;border-radius:20px;font-size:0.85rem;font-weight:600">' + statusBadge + '</div>';
    html += '</div>';
    
    html += '<div>';
    html += '<div style="font-size:0.9rem;color:#666;margin-bottom:2px">Método de Pago</div>';
    html += '<div style="font-size:1rem;font-weight:bold;color:#333">' + methodDisplay + '</div>';
    html += '</div>';
    
    html += '</div>';
    
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:15px">';
    
    html += '<div style="background:white;padding:10px;border-radius:4px;text-align:center">';
    html += '<div style="font-size:0.8rem;color:#666">Total</div>';
    html += '<div style="font-size:1.2rem;font-weight:bold;color:#2196f3">₡' + pedido.total.toLocaleString('es-CR', {minimumFractionDigits: 2}) + '</div>';
    html += '</div>';
    
    html += '<div style="background:white;padding:10px;border-radius:4px;text-align:center">';
    html += '<div style="font-size:0.8rem;color:#666">Cantidad Artículos</div>';
    html += '<div style="font-size:1.2rem;font-weight:bold;color:#4caf50">' + pedido.items.length + '</div>';
    html += '</div>';
    
    html += '<div style="background:white;padding:10px;border-radius:4px;text-align:center">';
    html += '<div style="font-size:0.8rem;color:#666">Envío</div>';
    html += '<div style="font-size:0.95rem;font-weight:bold;color:#333">' + (pedido.shippingMethod === 'pickup' ? '🏪 Retiro' : '📦 Envío') + '</div>';
    html += '</div>';
    
    html += '<div style="background:white;padding:10px;border-radius:4px;text-align:center">';
    html += '<div style="font-size:0.8rem;color:#666">Fecha</div>';
    html += '<div style="font-size:0.9rem;font-weight:bold;color:#333">' + createdDate.toLocaleDateString('es-CR') + '</div>';
    html += '</div>';
    
    html += '</div>';
    
    html += '<div style="margin-bottom:10px">';
    html += '<details>';
    html += '<summary style="cursor:pointer;color:#2196f3;font-weight:600;user-select:none">Ver artículos (' + pedido.items.length + ')</summary>';
    html += '<div style="padding:10px;margin-top:10px;background:white;border-radius:4px">';
    
    for (var j = 0; j < pedido.items.length; j++) {
      var item = pedido.items[j];
      var itemTotal = item.price * item.qty;
      
      html += '<div style="padding:5px 0;border-bottom:1px solid #eee;font-size:0.9rem">';
      html += '<div style="display:flex;justify-content:space-between">';
      html += '<span>' + item.title + ' x' + item.qty + '</span>';
      html += '<span style="font-weight:600">₡' + itemTotal.toLocaleString('es-CR', {minimumFractionDigits: 2}) + '</span>';
      html += '</div>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '</details>';
    html += '</div>';
    
    // Botones de acción
    html += '<div style="display:flex;gap:10px;border-top:1px solid #ddd;padding-top:10px">';
    
    if (pedido.status === 'pendiente') {
      // Solo mostrar confirmar para tarjeta (confirmación automática)
      if (pedido.paymentMethod === 'tarjeta') {
        html += '<button onclick="confirmPedidoOnline(' + originalIndex + ')" style="flex:1;padding:8px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">✅ Confirmar Pago</button>';
      } else {
        html += '<button onclick="confirmPedidoOnline(' + originalIndex + ')" style="flex:1;padding:8px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">✅ Marcar Pagado</button>';
      }
      html += '<button onclick="cancelPedidoOnline(' + originalIndex + ')" style="flex:1;padding:8px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">❌ Cancelar</button>';
    } else if (pedido.status === 'confirmado') {
      html += '<button onclick="completarDespacho(' + originalIndex + ')" style="flex:1;padding:8px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">📦 Completar Despacho</button>';
      html += '<button onclick="cancelPedidoOnline(' + originalIndex + ')" style="flex:1;padding:8px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;font-size:0.9rem">❌ Cancelar</button>';
    } else if (pedido.status === 'despachado') {
      html += '<p style="margin:0;padding:8px;background:#e8f5e9;border-radius:4px;color:#2e7d32;font-weight:600;text-align:center">✅ Pedido completado</p>';
    }
    
    html += '</div>';
    
    html += '</div>';
  }
  
  container.innerHTML = html;
}

function confirmPedidoOnline(index) {
  var pedidos = JSON.parse(localStorage.getItem('onlineOrders') || '[]');
  var pedido = pedidos[index];
  
  if (confirm('¿Confirmar pago del pedido de ' + pedido.customerEmail + '?\n\nTotal: ₡' + pedido.total.toLocaleString('es-CR', {minimumFractionDigits: 2}))) {
    pedido.status = 'confirmado';
    pedido.confirmedDate = getLocalISODateTime();
    
    // Si fue pagado con tarjeta, se confirma automáticamente
    if (pedido.paymentMethod === 'tarjeta') {
      console.log('✅ Pago con tarjeta confirmado automáticamente para pedido:', pedido.id);
    }
    
    localStorage.setItem('onlineOrders', JSON.stringify(pedidos));
    displayPedidosOnline();
    alert('✅ Pedido confirmado');
  }
}

function completarDespacho(index) {
  var pedidos = JSON.parse(localStorage.getItem('onlineOrders') || '[]');
  var pedido = pedidos[index];
  
  if (confirm('¿Completar despacho del pedido ' + pedido.id + '?\n\nCliente: ' + pedido.customerEmail)) {
    pedido.status = 'despachado';
    pedido.dispatchedDate = getLocalISODateTime();
    
    localStorage.setItem('onlineOrders', JSON.stringify(pedidos));
    displayPedidosOnline();
    alert('📦 Despacho completado');
  }
}

function cancelPedidoOnline(index) {
  var pedidos = JSON.parse(localStorage.getItem('onlineOrders') || '[]');
  var pedido = pedidos[index];
  
  if (confirm('¿Cancelar pedido ' + pedido.id + '?\n\nCliente: ' + pedido.customerEmail)) {
    pedidos.splice(index, 1);
    localStorage.setItem('onlineOrders', JSON.stringify(pedidos));
    displayPedidosOnline();
    alert('❌ Pedido cancelado');
  }
}

function cleanExpiredOnlineOrders() {
  try {
    var pedidos = JSON.parse(localStorage.getItem('onlineOrders') || '[]');
    var now = new Date();
    
    // Cancelar automáticamente pedidos pendientes con más de 7 días
    var activePedidos = pedidos.filter(function(pedido) {
      if (pedido.status === 'pendiente') {
        var createdDate = new Date(pedido.date);
        var daysOld = Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24));
        if (daysOld > 7) {
          console.log('🗑️ Pedido pendiente expirado:', pedido.id, '(' + daysOld + ' días)');
          return false; // Eliminar
        }
      }
      return true; // Mantener
    });
    
    if (activePedidos.length < pedidos.length) {
      localStorage.setItem('onlineOrders', JSON.stringify(activePedidos));
      console.log('✓ Pedidos expirados limpiados');
    }
  } catch (err) {
    console.error('Error al limpiar pedidos expirados:', err);
  }
}

function getLocalISODateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  var hour = String(now.getHours()).padStart(2, '0');
  var minute = String(now.getMinutes()).padStart(2, '0');
  var second = String(now.getSeconds()).padStart(2, '0');
  return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;
}

