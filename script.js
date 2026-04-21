/* ============================================================
   CONFIG — replace with your actual Worker URL
   ============================================================ */
const WORKER_URL = "https://08-prj-loreal-chatbot.nghanathe1.workers.dev/api/chat";

const products = [
  {
    id: 1,
    name: "Revitalift Laser X3",
    brand: "L'Oréal Paris",
    category: "Skincare",
    image: "img/product1.jpg",
    description: "Anti-aging day cream with Pro-Xylane and hyaluronic acid. Visibly reduces wrinkles and firms skin in 4 weeks."
  },
  {
    id: 2,
    name: "Elvive Total Repair 5",
    brand: "L'Oréal Paris",
    category: "Haircare",
    image: "img/product2.jpg",
    description: "Reconstructing shampoo for damaged hair. Targets 5 signs of damage: breakage, dryness, roughness, dullness, and split ends."
  },
  {
    id: 3,
    name: "True Match Foundation",
    brand: "L'Oréal Paris",
    category: "Makeup",
    image: "img/product3.jpg",
    description: "Blendable liquid foundation with SPF 17 in 40 shades. Matches your skin's unique tone and texture for a natural finish."
  },
  {
    id: 4,
    name: "Age Perfect Golden Age",
    brand: "L'Oréal Paris",
    category: "Skincare",
    image: "img/product4.jpg",
    description: "Rosy re-fortifying care for mature skin. Enriched with centella asiatica and saffron flower to restore radiance and density."
  },
  {
    id: 5,
    name: "EverPure Sulfate-Free Shampoo",
    brand: "L'Oréal Paris",
    category: "Haircare",
    image: "img/product5.jpg",
    description: "Color-protecting sulfate-free shampoo with rosemary. Extends vibrancy and shine for color-treated hair without stripping."
  },
  {
    id: 6,
    name: "Infallible 24H Fresh Wear",
    brand: "L'Oréal Paris",
    category: "Makeup",
    image: "img/product6.jpg",
    description: "Long-wearing foundation with 24-hour wear, SPF 25, and a natural matte finish. Waterproof, transfer-proof, and sweat-proof."
  },
  {
    id: 7,
    name: "Hyaluron Expert Serum",
    brand: "L'Oréal Paris",
    category: "Skincare",
    image: "img/product7.jpg",
    description: "Replumping serum with 1.5% pure hyaluronic acid in 3 molecular weights to hydrate all skin layers and reduce fine lines."
  },
  {
    id: 8,
    name: "Elvive Dream Lengths",
    brand: "L'Oréal Paris",
    category: "Haircare",
    image: "img/product8.jpg",
    description: "No-haircut cream conditioner with castor oil and vitamins B3 & B5. Strengthens lengths and seals split ends without weighing down."
  },
  {
    id: 9,
    name: "Voluminous Mascara",
    brand: "L'Oréal Paris",
    category: "Makeup",
    image: "img/product9.jpg",
    description: "Creamy waterproof mascara that delivers up to 5x the volume. Ophthalmologist-tested and suitable for contact lens wearers."
  },
  {
    id: 10,
    name: "La Vie Est Belle",
    brand: "Lancôme",
    category: "Fragrance",
    image: "img/product10.jpg",
    description: "An iconic floral gourmand fragrance built on iris, patchouli, and vanilla. A celebration of happiness and individual freedom."
  },
  {
    id: 11,
    name: "Midnight Recover Concentrate",
    brand: "Kiehl's",
    category: "Skincare",
    image: "img/product11.jpg",
    description: "Overnight facial oil with lavender, primrose, and squalane. Works with skin's natural overnight regeneration for visibly renewed skin by morning."
  },
  {
    id: 12,
    name: "Brow Stylist Definer",
    brand: "L'Oréal Paris",
    category: "Makeup",
    image: "img/product12.jpg",
    description: "Ultra-fine mechanical pencil with 0.2 mm tip for hair-like eyebrow strokes. Smudge-proof formula with a blending spoolie."
  }
];

let selected = new Set(JSON.parse(localStorage.getItem("lorealSelected") || "[]").map(Number));
let currentModalId = null;

let conversationHistory = [
  {
    role: "system",
    content: "You are a L'Oréal beauty advisor. Only answer questions about L'Oréal products, skincare, haircare, makeup, fragrance, and beauty routines. If asked about unrelated topics, politely redirect to beauty. When generating routines, be specific about morning/evening steps and product order."
  }
];
const productGrid     = document.getElementById("productGrid");
const selectedList    = document.getElementById("selectedList");
const selectedCount   = document.getElementById("selectedCount");
const emptyState      = document.getElementById("emptyState");
const generateBtn     = document.getElementById("generateBtn");
const chatForm        = document.getElementById("chatForm");
const userInput       = document.getElementById("userInput");
const chatWindow      = document.getElementById("chatWindow");
const searchInput     = document.getElementById("searchInput");
const categoryFilter  = document.getElementById("categoryFilter");
const descModal       = document.getElementById("descModal");

appendMessage("ai", "👋 Hello! Select some products from the catalog and I'll build you a personalized beauty routine. You can also ask me anything about skincare, haircare, or makeup!");

renderGrid();
renderSelected();
function getFilteredProducts() {
  const query    = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  return products.filter(p => {
    const matchCat    = category === "all" || p.category === category;
    const matchSearch = !query || p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });
}

function renderGrid() {
  const filtered = getFilteredProducts();
  productGrid.innerHTML = "";

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p class="no-results">No products match your search.</p>`;
    return;
  }

  filtered.forEach(product => {
    const isSelected = selected.has(product.id);
    const card = document.createElement("div");
    card.className = "product-card" + (isSelected ? " selected" : "");
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='img/placeholder.jpg'" />
        ${isSelected ? '<div class="check-badge"><span class="material-icons">check</span></div>' : ""}
      </div>
      <div class="card-body">
        <p class="card-brand">${product.brand}</p>
        <h3 class="card-name">${product.name}</h3>
        <span class="card-category">${product.category}</span>
      </div>
      <button class="info-btn" data-id="${product.id}" title="View description">
        <span class="material-icons">info_outline</span>
      </button>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest(".info-btn")) return;
      toggleProduct(product.id);
    });

    card.querySelector(".info-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(product.id);
    });

    productGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", renderGrid);
categoryFilter.addEventListener("change", renderGrid);

function toggleProduct(id) {
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.add(id);
  }
  saveToStorage();
  renderGrid();
  renderSelected();
}

function clearAll() {
  selected.clear();
  saveToStorage();
  renderGrid();
  renderSelected();
}

function saveToStorage() {
  localStorage.setItem("lorealSelected", JSON.stringify([...selected]));
}

function renderSelected() {
  const count = selected.size;
  selectedCount.textContent = count;
  generateBtn.disabled = count === 0;

  if (count === 0) {
    selectedList.innerHTML = `<li class="empty-state" id="emptyState">No products selected yet — click cards to add them.</li>`;
    return;
  }

  selectedList.innerHTML = "";
  [...selected].forEach(id => {
    const p = products.find(p => p.id === id);
    if (!p) return;
    const li = document.createElement("li");
    li.className = "selected-item";
    li.innerHTML = `
      <span class="sel-category-dot" data-cat="${p.category}"></span>
      <div class="sel-info">
        <span class="sel-name">${p.name}</span>
        <span class="sel-brand">${p.brand} · ${p.category}</span>
      </div>
      <button class="remove-btn" title="Remove" onclick="toggleProduct(${p.id})">
        <span class="material-icons">close</span>
      </button>
    `;
    selectedList.appendChild(li);
  });
}

function openModal(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  currentModalId = id;

  document.getElementById("modalBrand").textContent    = p.brand;
  document.getElementById("modalName").textContent     = p.name;
  document.getElementById("modalCategory").textContent = p.category;
  document.getElementById("modalDesc").textContent     = p.description;

  const btn = document.getElementById("modalSelectBtn");
  btn.textContent = selected.has(id) ? "✓ Remove from selection" : "+ Add to selection";
  btn.className   = "modal-select-btn" + (selected.has(id) ? " is-selected" : "");

  descModal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(e) {
  if (e.target === descModal) closeModalBtn();
}

function closeModalBtn() {
  descModal.classList.remove("open");
  document.body.style.overflow = "";
  currentModalId = null;
}

function toggleFromModal() {
  if (currentModalId === null) return;
  toggleProduct(currentModalId);

  const btn = document.getElementById("modalSelectBtn");
  btn.textContent = selected.has(currentModalId) ? "✓ Remove from selection" : "+ Add to selection";
  btn.className   = "modal-select-btn" + (selected.has(currentModalId) ? " is-selected" : "");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModalBtn();
});

async function generateRoutine() {
  const selectedProducts = [...selected].map(id => {
    const p = products.find(p => p.id === id);
    return { name: p.name, brand: p.brand, category: p.category, description: p.description };
  });

  const prompt = `Based on these products I have selected, please create a personalized beauty routine for me. Include morning and evening steps where relevant, and explain how each product should be used:

${JSON.stringify(selectedProducts, null, 2)}

Format the routine clearly with step numbers and product names bolded.`;

  appendMessage("user", "✨ Generate a routine for my selected products.");
  conversationHistory.push({ role: "user", content: prompt });

  generateBtn.disabled = true;
  generateBtn.innerHTML = `<span class="material-icons spin">autorenew</span> Generating…`;

  try {
    const reply = await callWorker(conversationHistory);
    appendMessage("ai", reply);
    conversationHistory.push({ role: "assistant", content: reply });
  } catch (err) {
    appendMessage("ai", "⚠️ Couldn't generate routine. Please try again.");
    console.error(err);
  }

  generateBtn.disabled = false;
  generateBtn.innerHTML = `<span class="material-icons">auto_awesome</span> Generate My Routine`;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  conversationHistory.push({ role: "user", content: text });
  userInput.value = "";

  const thinkingEl = appendMessage("ai", "…", true);

  try {
    const reply = await callWorker(conversationHistory);
    thinkingEl.textContent = reply;
    conversationHistory.push({ role: "assistant", content: reply });
  } catch (err) {
    thinkingEl.textContent = "⚠️ Error connecting to beauty advisor. Please try again.";
    console.error(err);
  }
});

async function callWorker(messages) {
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Worker request failed");

  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error("No response from AI");
  return reply;
}

function appendMessage(role, text, isThinking = false) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", role);
  if (isThinking) msgDiv.classList.add("thinking");
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msgDiv;
}
function toggleRTL() {
  const html = document.documentElement;
  html.dir = html.dir === "rtl" ? "ltr" : "rtl";
  html.lang = html.dir === "rtl" ? "ar" : "en";
}
