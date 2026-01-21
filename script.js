const defaultProducts = [
  {id:1,title:'Bulto Rosado de Flores',category:'mochilas',gender:'female',price:38000,desc:'Hermoso bulto escolar rosado con delicado estampado de flores. Cuenta con múltiples compartimentos, tirantes acolchados ajustables para mayor comodidad, bolsillo frontal con cierre y material resistente al agua.',img:'Fotos productos/Bulto rosado de flores/WhatsApp Image 2026-01-14 at 13.19.12.jpeg',images:['Fotos productos/Bulto rosado de flores/WhatsApp Image 2026-01-14 at 13.19.12.jpeg','Fotos productos/Bulto rosado de flores/WhatsApp Image 2026-01-14 at 13.19.12 (1).jpeg','Fotos productos/Bulto rosado de flores/WhatsApp Image 2026-01-14 at 13.19.12 (2).jpeg','Fotos productos/Bulto rosado de flores/WhatsApp Image 2026-01-14 at 13.19.13.jpeg','Fotos productos/Bulto rosado de flores/WhatsApp Image 2026-01-14 at 13.19.13 (1).jpeg'],sold:120,active:true,inventory:{tienda1:24,tienda2:18,tienda3:31,bodega:42}},
  {id:2,title:'Peluche Vaca',category:'peluches',gender:'unisex',price:11500,desc:'Adorable peluche de vaca fabricado con material ultra suave y seguro para niños. Con detalles bordados en ojos y manchas características de vaca.',img:'Fotos productos/Vaca/WhatsApp Image 2026-01-14 at 13.13.45.jpeg',images:['Fotos productos/Vaca/WhatsApp Image 2026-01-14 at 13.13.45.jpeg'],sold:92,active:true,inventory:{tienda1:0,tienda2:0,tienda3:0,bodega:0},variants:{type:'tamaño',options:[{name:'33cm',price:11500,inventory:{tienda1:14,tienda2:10,tienda3:11,bodega:18}},{name:'45cm',price:18000,inventory:{tienda1:14,tienda2:9,tienda3:11,bodega:17}}]}},
  {id:3,title:'Vaso Temático Disney',category:'vasos',gender:'female',price:14500,desc:'Hermoso vaso con pajilla reutilizable inspirado en tus películas Disney favoritas. Fabricado en material plástico durable y resistente a caídas.',img:'Fotos productos/Vaso tematico Disney/WhatsApp Image 2026-01-14 at 14.40.03.jpeg',images:['Fotos productos/Vaso tematico Disney/WhatsApp Image 2026-01-14 at 14.40.03.jpeg','Fotos productos/Vaso tematico Disney/WhatsApp Image 2026-01-14 at 14.40.04.jpeg','Fotos productos/Vaso tematico Disney/WhatsApp Image 2026-01-14 at 14.40.04 (1).jpeg','Fotos productos/Vaso tematico Disney/WhatsApp Image 2026-01-14 at 14.40.04 (2).jpeg'],sold:78,active:true,inventory:{tienda1:0,tienda2:0,tienda3:0,bodega:0},variants:{type:'personaje',options:[{name:'Minnie',price:14500,inventory:{tienda1:4,tienda2:6,tienda3:2,bodega:10}},{name:'Moana',price:14500,inventory:{tienda1:4,tienda2:5,tienda3:2,bodega:9}},{name:'Cars',price:14500,inventory:{tienda1:4,tienda2:6,tienda3:3,bodega:10}},{name:'Elsa',price:14500,inventory:{tienda1:3,tienda2:5,tienda3:2,bodega:9}}]}},
  {id:4,title:'Agenda Harry Potter',category:'papeleria',gender:'unisex',price:9500,desc:'Hermosa agenda inspirada en el universo mágico de Harry Potter. Perfecta para organizar tu vida cotidiana con estilo. Disponible en cuatro casas de Hogwarts.',img:'Fotos productos/Agenda Harry Potter/WhatsApp Image 2026-01-14 at 14.42.16.jpeg',images:['Fotos productos/Agenda Harry Potter/WhatsApp Image 2026-01-14 at 14.42.16.jpeg','Fotos productos/Agenda Harry Potter/WhatsApp Image 2026-01-14 at 14.42.16 (1).jpeg','Fotos productos/Agenda Harry Potter/WhatsApp Image 2026-01-14 at 14.42.16 (2).jpeg','Fotos productos/Agenda Harry Potter/WhatsApp Image 2026-01-14 at 14.42.17.jpeg'],sold:110,active:true,inventory:{tienda1:0,tienda2:0,tienda3:0,bodega:0},variants:{type:'casa',options:[{name:'Gryffindor',price:9500,inventory:{tienda1:3,tienda2:7,tienda3:5,bodega:11}},{name:'Slytherin',price:9500,inventory:{tienda1:3,tienda2:6,tienda3:5,bodega:10}},{name:'Hufflepuff',price:9500,inventory:{tienda1:3,tienda2:6,tienda3:5,bodega:11}},{name:'Ravenclaw',price:9500,inventory:{tienda1:3,tienda2:7,tienda3:4,bodega:11}}]}},
  {id:5,title:'Pluma Lapicero Harry Potter',category:'papeleria',gender:'unisex',price:2500,desc:'Elegante pluma temática de Harry Potter disponible en múltiples colores. Inspirada en el universo mágico de Hogwarts.',img:'Fotos productos/Pluma Lapicero H.P/WhatsApp Image 2026-01-14 at 14.42.44.jpeg',images:['Fotos productos/Pluma Lapicero H.P/WhatsApp Image 2026-01-14 at 14.42.44.jpeg'],sold:145,active:true,inventory:{tienda1:0,tienda2:0,tienda3:0,bodega:0},variants:{type:'color',options:[{name:'Azul Oscuro',price:2500,inventory:{tienda1:8,tienda2:4,tienda3:8,bodega:12}},{name:'Rojo',price:2500,inventory:{tienda1:8,tienda2:4,tienda3:7,bodega:12}},{name:'Negro',price:2500,inventory:{tienda1:9,tienda2:3,tienda3:7,bodega:12}},{name:'Cian',price:2500,inventory:{tienda1:8,tienda2:3,tienda3:7,bodega:12}}]}},
  {id:6,title:'Varita Lapicero Harry Potter',category:'papeleria',gender:'unisex',price:2500,desc:'Elegante varita lapicero temática de Harry Potter. Forma ergonómica cómoda para escribir con tinta fluida de calidad.',img:'Fotos productos/Lapicero Varita H.P/WhatsApp Image 2026-01-14 at 14.42.45.jpeg',images:['Fotos productos/Lapicero Varita H.P/WhatsApp Image 2026-01-14 at 14.42.45.jpeg'],sold:98,active:true,inventory:{tienda1:0,tienda2:0,tienda3:0,bodega:0},variants:{type:'color',options:[{name:'Café',price:2500,inventory:{tienda1:4,tienda2:8,tienda3:5,bodega:11}},{name:'Hueso',price:2500,inventory:{tienda1:4,tienda2:9,tienda3:6,bodega:12}},{name:'Café Muy Oscuro',price:2500,inventory:{tienda1:3,tienda2:8,tienda3:5,bodega:11}}]}},
  {id:7,title:'Taza Winnie The Pooh',category:'tazas',gender:'unisex',price:12000,desc:'Encantadora taza temática de Winnie The Pooh, perfecta para disfrutar tus bebidas favoritas. Fabricada en cerámica de alta calidad.',img:'Fotos productos/Tasa de Winnie Pooh/WhatsApp Image 2026-01-14 at 14.44.10.jpeg',images:['Fotos productos/Tasa de Winnie Pooh/WhatsApp Image 2026-01-14 at 14.44.10.jpeg'],sold:85,active:true,inventory:{tienda1:18,tienda2:12,tienda3:24,bodega:27}},
  {id:8,title:'Taza Stitch',category:'tazas',gender:'unisex',price:12000,desc:'Adorable taza temática de Stitch, el personaje más querido de Lilo & Stitch. Diseño vibrante con los colores e iconos de Stitch.',img:'Fotos productos/Tasa Stitch/WhatsApp Image 2026-01-14 at 14.44.11.jpeg',images:['Fotos productos/Tasa Stitch/WhatsApp Image 2026-01-14 at 14.44.11.jpeg'],sold:78,active:true,inventory:{tienda1:0,tienda2:0,tienda3:0,bodega:0},outOfStock:true},
  {id:9,title:'Peluche Kuromi',category:'peluches',gender:'female',price:13500,desc:'Adorable peluche de Kuromi, el personaje icónico de Sanrio con su característico corazón en la frente. Fabricado con material ultra suave.',img:'Fotos productos/Peluche de Kuromi/WhatsApp Image 2026-01-14 at 14.45.40.jpeg',images:['Fotos productos/Peluche de Kuromi/WhatsApp Image 2026-01-14 at 14.45.40.jpeg'],sold:67,active:true,inventory:{tienda1:23,tienda2:16,tienda3:20,bodega:38}},
  {id:10,title:'Lámpara de Lava Batman',category:'decoracion',gender:'unisex',price:45000,desc:'Lámpara de lava temática de Batman con acabado oscuro y emblema icónico. Ideal para ambientar espacios con un toque de cómic retro.',img:'Fotos productos/Lampara de Lava B.M/WhatsApp Image 2026-01-14 at 14.49.30.jpeg',images:['Fotos productos/Lampara de Lava B.M/WhatsApp Image 2026-01-14 at 14.49.30.jpeg'],sold:42,active:true,inventory:{tienda1:6,tienda2:8,tienda3:5,bodega:14}},
  {id:11,title:'Lámpara de Lava Hello Kitty',category:'decoracion',gender:'unisex',price:45000,desc:'Lámpara de lava temática de Hello Kitty con tonos suaves y diseño tierno. Perfecta para decorar habitaciones juveniles con luz relajante.',img:'Fotos productos/Lampara de lava H.K/WhatsApp Image 2026-01-14 at 14.49.30 (1).jpeg',images:['Fotos productos/Lampara de lava H.K/WhatsApp Image 2026-01-14 at 14.49.30 (1).jpeg'],sold:30,active:true,inventory:{tienda1:9,tienda2:11,tienda3:7,bodega:18}},
  {id:12,title:'Botella de STARWARS',category:'botellas',gender:'unisex',price:45000,desc:'Botella temática de STARWARS con tapa hermética, capacidad 750 ml y material libre de BPA. Ideal para mantener bebidas frías o calientes.',img:'Fotos productos/Botella STARWARS/WhatsApp Image 2026-01-14 at 14.58.20.jpeg',images:['Fotos productos/Botella STARWARS/WhatsApp Image 2026-01-14 at 14.58.20.jpeg'],sold:10,active:true,inventory:{tienda1:13,tienda2:10,tienda3:19,bodega:26}},
  {id:13,title:'Mochila Hello Kitty',category:'mochilas',gender:'female',price:35000,desc:'Hermosa mochila de Hello Kitty con diseño adorable y funcional. Perfecta para uso escolar o diario, con compartimentos espaciosos y material resistente.',img:'Fotos productos/Mochila Hello Kity/WhatsApp Image 2026-01-14 at 14.55.02.jpeg',images:['Fotos productos/Mochila Hello Kity/WhatsApp Image 2026-01-14 at 14.55.02.jpeg'],sold:5,active:true,inventory:{tienda1:16,tienda2:13,tienda3:11,bodega:23}},
  {id:14,title:'Pintura para el Cabello',category:'belleza',gender:'unisex',price:3750,desc:'Pintura temporal para el cabello en colores vibrantes. Perfecta para eventos, fiestas o cambiar tu look de forma temporal. Fácil de aplicar y lavar.',img:'Fotos productos/Pintura para el cabello/WhatsApp Image 2026-01-14 at 15.08.58.jpeg',images:['Fotos productos/Pintura para el cabello/WhatsApp Image 2026-01-14 at 15.08.58.jpeg'],sold:0,active:true,inventory:{tienda1:0,tienda2:0,tienda3:0,bodega:0},variants:{type:'color',options:[{name:'Negro',price:3750,inventory:{tienda1:4,tienda2:3,tienda3:5,bodega:6}},{name:'Verde',price:3750,inventory:{tienda1:4,tienda2:3,tienda3:4,bodega:7}},{name:'Blanco',price:3750,inventory:{tienda1:4,tienda2:3,tienda3:5,bodega:6}},{name:'Rosado',price:3750,inventory:{tienda1:3,tienda2:3,tienda3:4,bodega:6}},{name:'Naranja',price:3750,inventory:{tienda1:4,tienda2:3,tienda3:4,bodega:6}},{name:'Azul',price:3750,inventory:{tienda1:4,tienda2:2,tienda3:5,bodega:6}},{name:'Café',price:3750,inventory:{tienda1:3,tienda2:3,tienda3:5,bodega:6}}]}},
  {id:15,title:'Taza Satoru Gojo',category:'tazas',gender:'unisex',price:18000,desc:'Taza temática de Satoru Gojo de Jujutsu Kaisen. Perfecta para los fans del anime, con diseño de alta calidad. Fabricada en cerámica resistente, ideal para disfrutar tus bebidas favoritas.',img:'Fotos productos/Tasa Saroru Gojo/WhatsApp Image 2026-01-15 at 15.18.40.jpeg',images:['Fotos productos/Tasa Saroru Gojo/WhatsApp Image 2026-01-15 at 15.18.40.jpeg'],sold:15,active:true,inventory:{tienda1:14,tienda2:9,tienda3:17,bodega:29}},
  {id:16,title:'Taza Geto Suguru',category:'tazas',gender:'unisex',price:18000,desc:'Taza temática de Geto Suguru de Jujutsu Kaisen. Diseño exclusivo para fans del anime, con impresión de alta calidad. Fabricada en cerámica duradera y resistente.',img:'Fotos productos/Tasa Geto suguru/WhatsApp Image 2026-01-15 at 15.18.40.jpeg',images:['Fotos productos/Tasa Geto suguru/WhatsApp Image 2026-01-15 at 15.18.40.jpeg'],sold:12,active:true,inventory:{tienda1:11,tienda2:15,tienda3:8,bodega:21}},
  {id:17,title:'Snoopy Biplano',category:'bloques',gender:'unisex',price:13500,desc:'Set de bloques de construcción tipo LEGO de Snoopy en su biplano. Diseño divertido y coleccionable, perfecto para fans de Peanuts. Incluye figura de Snoopy y avión detallado.',img:'Fotos productos/Snoopy Biplane/86905-1.avif',images:['Fotos productos/Snoopy Biplane/86905-1.avif','Fotos productos/Snoopy Biplane/Pantasy 86905 - 02.jpg'],sold:8,active:true,inventory:{tienda1:9,tienda2:7,tienda3:12,bodega:16}},
  {id:18,title:'Snoopy Roadster',category:'bloques',gender:'unisex',price:13500,desc:'Set de bloques de construcción tipo LEGO de Snoopy en su auto deportivo. Modelo coleccionable con detalles encantadores. Perfecto para construir y exhibir.',img:'Fotos productos/Snoopy Roadster/PANT-86908_3540493780743145141_hu_12da1379a2799433.jpg',images:['Fotos productos/Snoopy Roadster/PANT-86908_3540493780743145141_hu_12da1379a2799433.jpg','Fotos productos/Snoopy Roadster/2_1956f2f3-a9a5-4a91-9d79-22361ff30261.webp'],sold:6,active:true,inventory:{tienda1:7,tienda2:10,tienda3:6,bodega:15}},
  {id:19,title:'Snoopy Bus Escolar',category:'bloques',gender:'unisex',price:13500,desc:'Set de bloques de construcción tipo LEGO del bus escolar de Snoopy. Diseño nostálgico de Peanuts con colores vibrantes. Ideal para coleccionistas y fans.',img:'Fotos productos/Snoopy Scool Bus/86906-SNOOPY-BUS-BIGFUNLEBANON.jpg-.jpg',images:['Fotos productos/Snoopy Scool Bus/86906-SNOOPY-BUS-BIGFUNLEBANON.jpg-.jpg','Fotos productos/Snoopy Scool Bus/PeanutsSchoolBusfeaturedbox.webp'],sold:7,active:true,inventory:{tienda1:12,tienda2:8,tienda3:14,bodega:22}},
  {id:20,title:'Snoopy Barco de Vapor',category:'bloques',gender:'unisex',price:13500,desc:'Set de bloques de construcción tipo LEGO del barco de vapor de Snoopy. Modelo clásico con detalles encantadores. Perfecto para construir y coleccionar.',img:'Fotos productos/Snoopy Steam Boat/1_63339c5c-baed-4d4f-ae3a-30a8d3ffd322.webp',images:['Fotos productos/Snoopy Steam Boat/1_63339c5c-baed-4d4f-ae3a-30a8d3ffd322.webp','Fotos productos/Snoopy Steam Boat/2_d3b405ad-136a-4a5e-9ad9-806a2bb0ed52.webp'],sold:5,active:true,inventory:{tienda1:10,tienda2:6,tienda3:11,bodega:19}},
  {id:21,title:'Snoopy en su Casita',category:'bloques',gender:'unisex',price:13500,desc:'Set de bloques de construcción de la icónica casita de Snoopy con figura incluida. Modelo compacto y adorable con detalles encantadores. Perfecto para comenzar tu colección Peanuts.',img:'Fotos productos/Peanuts Snoopy 5002/hsanhecaco-s002-ngoi-nha-mau-do-snoopy-canh.jpg',images:['Fotos productos/Peanuts Snoopy 5002/hsanhecaco-s002-ngoi-nha-mau-do-snoopy-canh.jpg','Fotos productos/Peanuts Snoopy 5002/88266ca5-1d62-4ed8-90f3-2cfe4cd9a034.fce03bb67b054b475fc31e3e2f98ddf7.webp'],sold:4,active:true,inventory:{tienda1:13,tienda2:11,tienda3:9,bodega:20}},
  {id:22,title:'Snoopy Ruta Escolar',category:'bloques',gender:'unisex',price:13500,desc:'Set de bloques de construcción de Snoopy en su jardín con casa y árbol. Diseño encantador con detalles de naturaleza y figuras. Ideal para fans de Peanuts y coleccionistas.',img:'Fotos productos/Peanuts Snoopy 5008/DSC03114_1024x1024@2x.webp',images:['Fotos productos/Peanuts Snoopy 5008/DSC03114_1024x1024@2x.webp','Fotos productos/Peanuts Snoopy 5008/562c1f0863f147e79c8ce17a5e499b4f.webp','Fotos productos/Peanuts Snoopy 5008/8ae18d8a-8ae4-4eef-a625-37e4860469a5.cbeb72933edc1ccd8d76442ad96fc5ab.webp'],sold:3,active:true,inventory:{tienda1:8,tienda2:12,tienda3:7,bodega:18}},
  {id:23,title:'Snoopy Vuelo Tropical',category:'bloques',gender:'unisex',price:13500,desc:'Set de bloques de construcción de Snoopy y sus amigos en concierto. Incluye escenario, figuras con instrumentos musicales y accesorios. Perfecto para recrear momentos musicales de Peanuts.',img:'Fotos productos/Peanuts Snoopy 5009/S2ffbf1b83ba145438941eb0f95f10200d.webp',images:['Fotos productos/Peanuts Snoopy 5009/S2ffbf1b83ba145438941eb0f95f10200d.webp','Fotos productos/Peanuts Snoopy 5009/Captura de pantalla 2026-01-16 003254.png','Fotos productos/Peanuts Snoopy 5009/Captura de pantalla 2026-01-16 003349.png'],sold:2,active:true,inventory:{tienda1:15,tienda2:10,tienda3:13,bodega:24}}

];

// Sistema de gestión de productos con localStorage
function loadProductsFromStorage() {
  const stored = localStorage.getItem('products_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Verificar si hay datos válidos con inventario
      if (parsed && Array.isArray(parsed) && parsed.length > 0 && parsed[0].inventory) {
        console.log('Productos cargados desde localStorage');
        // Asegurar que todos los productos tengan código de barras
        return ensureBarcodesExist(parsed);
      }
    } catch (e) {
      console.error('Error al cargar productos:', e);
    }
  }
  
  // Si no hay datos válidos, usar defaultProducts y guardar en localStorage
  console.log('Guardando defaultProducts en localStorage');
  var productsToSave = ensureBarcodesExist([...defaultProducts]);
  saveProductsToStorage(productsToSave);
  return productsToSave;
}

// Función para sincronizar inventario desde defaultProducts
function syncInventoryFromDefaults() {
  const stored = localStorage.getItem('products_data');
  if (stored) {
    try {
      const storedProducts = JSON.parse(stored);
      // NO sobrescribir inventarios existentes - solo sincronizar estructura
      // Mantener todos los datos del localStorage (inventario incluido)
      return storedProducts;
    } catch (e) {
      console.error('Error al cargar productos:', e);
      return defaultProducts;
    }
  }
  // Si no hay nada en localStorage, usar defaultProducts
  return defaultProducts;
}

function saveProductsToStorage(productsArray) {
  try {
    localStorage.setItem('products_data', JSON.stringify(productsArray));
    return true;
  } catch (e) {
    console.error('Error al guardar productos:', e);
    return false;
  }
}

// Cargar productos (desde localStorage o usar por defecto)
let products = loadProductsFromStorage();

// Función para calcular si un producto está agotado basado en su stock total
function isProductOutOfStock(product) {
  // Si tiene variantes, sumar el stock de todas las opciones
  if (product.variants && product.variants.options && product.variants.options.length > 0) {
    let totalStock = 0;
    product.variants.options.forEach(option => {
      const inventory = option.inventory || {tienda1:0, tienda2:0, tienda3:0, bodega:0};
      totalStock += (inventory.tienda1 || 0) + (inventory.tienda2 || 0) + (inventory.tienda3 || 0) + (inventory.bodega || 0);
    });
    return totalStock === 0;
  }
  
  // Si no tiene variantes, usar el inventario general
  const inventory = product.inventory || {tienda1:0, tienda2:0, tienda3:0, bodega:0};
  const totalStock = (inventory.tienda1 || 0) + (inventory.tienda2 || 0) + (inventory.tienda3 || 0) + (inventory.bodega || 0);
  return totalStock === 0;
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
  const cart = loadCart();

  const cartKey = `${product.id}|${product.title}`;
  const found = cart.find(i=>`${i.id}|${i.title}`===cartKey);
  if(found){ found.qty += qty; }
  else{ cart.push({id:product.id,title:product.title,price:product.price,img:product.img,qty:qty}); }
  saveCart(cart);
}

function setItemQty(id, qty){
  const cart = loadCart();
  const idx = cart.findIndex(i=>i.id===id);
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
          <button class="remove-item" data-id="${item.id}" style="border:none;background:transparent;color:#b04b70;cursor:pointer">Eliminar</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
          <div class="qty-controls" data-id="${item.id}">
            <button class="qty-decrease" data-id="${item.id}">-</button>
            <span class="qty" data-id="${item.id}">${item.qty}</span>
            <button class="qty-increase" data-id="${item.id}">+</button>
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
  let currentImgIndex = 0;
  const images = product.images || [product.img];
  let selectedVariant = product.variants ? product.variants.options[0] : null;
  let currentPrice = selectedVariant ? selectedVariant.price : product.price;
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
      ${product.outOfStock ? '<div style="background:rgba(220,53,69,0.95);color:#fff;font-weight:700;padding:12px 20px;border-radius:8px;text-align:center;font-size:1.1rem;box-shadow:0 4px 12px rgba(220,53,69,0.3);margin-bottom:8px">⚠️ Producto Agotado</div>' : ''}
      <div style="display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap${isHP ? ';animation:hpContentAppear 1.2s ease-out' : ''}">
        <div style="position:relative;width:240px${isHP ? ';animation:hpImageAppear 0.8s ease-out' : ''}">
          ${product.outOfStock ? '<div style="position:absolute;top:8px;left:8px;background:rgba(220,53,69,0.95);color:#fff;font-weight:700;font-size:0.85rem;padding:4px 10px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,0.15);z-index:3">Agotado</div>' : ''}
          <img id="modal-img" src="${images[0]}" alt="${product.title}" style="width:240px;height:240px;border-radius:8px;object-fit:cover${product.outOfStock ? ';opacity:0.6;filter:grayscale(30%)' : ''}" />
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
            <h3 style="margin:0">${product.title}</h3>
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
        <button id="modal-add" class="add ${isHP ? 'hp-btn' : ''} ${isSnoopy ? 'snoopy-btn' : ''}" ${product.outOfStock ? 'disabled style="background:#ddd;color:#777;cursor:not-allowed;box-shadow:none"' : ''}>${product.outOfStock ? 'Agotado' : 'Agregar'}</button>
      </div>
    </div>
  `;
  // Actualizar inventario dinámicamente al cambiar variante
  function updateInventorySection(inv) {
    const invDiv = document.getElementById('modal-inventory');
    if (invDiv) invDiv.outerHTML = getInventoryHTML(inv);
  }

  modal.setAttribute('aria-hidden','false');


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
    if(product.outOfStock) return;
    const qty = parseInt(document.getElementById('modal-qty').value) || 1;
    const productToAdd = product.variants && selectedVariant ? 
      {...product, price: selectedVariant.price, title: `${product.title} (${selectedVariant.name})`} : 
      product;
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

    // Verificar si el producto está agotado basándose en su stock total
    const outOfStock = isProductOutOfStock(p);

    card.innerHTML = `
      <div class="card-img-container">
        ${outOfStock ? '<div class="badge-out">Agotado</div>' : ''}
        <img src="${images[0]}" alt="${p.title}" data-images='${JSON.stringify(images)}' data-current="0" />
        ${navHTML}
        ${dotsHTML}
      </div>
      <h3>${p.title}</h3>
      <div class="price">${getPriceDisplay(p)}</div>
      <button class="add" data-id="${p.id}" ${outOfStock ? 'disabled aria-disabled="true"' : ''}>${outOfStock ? 'Agotado' : 'Agregar'}</button>
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
      <h3>${p.title}</h3>
      <div class="price">${getPriceDisplay(p)}</div>
      <button class="add" data-id="${p.id}" ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}>${isOutOfStock ? 'Agotado' : 'Agregar'}</button>
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
      if(e.target.matches('.qty-increase') && id){ const cart = loadCart(); const item = cart.find(i=>i.id===id); if(item){ setItemQty(id,item.qty+1); renderCartDrawer(); } }
      if(e.target.matches('.qty-decrease') && id){ const cart = loadCart(); const item = cart.find(i=>i.id===id); if(item){ setItemQty(id,item.qty-1); renderCartDrawer(); } }
      if(e.target.matches('.remove-item') && id){ setItemQty(id,0); renderCartDrawer(); }
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



