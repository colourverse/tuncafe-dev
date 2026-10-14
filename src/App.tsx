import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  thai: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tag?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Original Thai Iced Tea",
    thai: "ชาไทยเย็น",
    description: "Strong Ceylon tea, condensed milk and fresh milk over ice.",
    price: 75,
    category: "Thai favourites",
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1644031995386-fe9665dc5b57?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Thai Iced Coffee",
    thai: "โอเลี้ยงนมสด",
    description: "Bold Thai coffee with a silky layer of lightly sweetened milk.",
    price: 80,
    category: "Thai favourites",
    tag: "House special",
    image:
      "https://images.unsplash.com/photo-1644203541701-0c534473e616?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Coconut Iced Latte",
    thai: "ลาเต้มะพร้าว",
    description: "Espresso, fresh coconut milk and palm sugar for a tropical finish.",
    price: 95,
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Caramel Iced Macchiato",
    thai: "คาราเมลมัคคิอาโต้",
    description: "Double espresso, milk and house caramel poured over ice.",
    price: 105,
    category: "Coffee",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Mango Passion Soda",
    thai: "มะม่วงโซดา",
    description: "Mango, passion fruit, fresh lime and sparkling soda.",
    price: 85,
    category: "Coolers",
    tag: "Refreshing",
    image:
      "https://images.unsplash.com/photo-1567357771040-95bb44633d80?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Tropical Gelato Cup",
    thai: "เจลาโต้ทรอปิคอล",
    description: "Two scoops of our daily small-batch gelato. Choose your flavours.",
    price: 120,
    category: "Gelato",
    image:
      "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Coconut Pandan Gelato",
    thai: "เจลาโต้มะพร้าวใบเตย",
    description: "Creamy coconut gelato scented with fragrant Thai pandan.",
    price: 75,
    category: "Gelato",
    tag: "Local flavour",
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Basque Cheesecake",
    thai: "ชีสเค้กหน้าไหม้",
    description: "Caramelised on top, soft and creamy in the centre.",
    price: 135,
    category: "Cakes",
    image:
      "https://images.unsplash.com/photo-1708175313856-8573b2bf8a3a?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = ["All", "Thai favourites", "Coffee", "Coolers", "Gelato", "Cakes"];

function Icon({
  name,
  size = 20,
}: {
  name: "cart" | "plus" | "minus" | "pin" | "clock" | "arrow" | "close" | "check";
  size?: number;
}) {
  const paths = {
    cart: <><circle cx="9" cy="20" r="1" /><circle cx="19" cy="20" r="1" /><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function App() {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [table, setTable] = useState("");
  const [confirmedTable, setConfirmedTable] = useState("");
  const [paid, setPaid] = useState(false);

  const visible = category === "All" ? products : products.filter((item) => item.category === category);
  const cartItems = products.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] }));
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const changeQuantity = (id: number, change: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + change);
      const updated = { ...current, [id]: next };
      if (!next) delete updated[id];
      return updated;
    });
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#f8faf6] text-[#14352d]">
      <header className="sticky top-0 z-30 border-b border-[#14352d]/10 bg-[#f8faf6]/95 backdrop-blur-lg">
        <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 lg:px-10">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3" aria-label="Tuncafe home">
            <img src="/tuncafe-logo.png" alt="Tuncafe" className="h-[120px] w-[120px] translate-y-6 rounded-full object-cover" />
          </button>
          <nav className="hidden items-center gap-8 text-[14px] font-semibold md:flex">
            <button onClick={() => scrollTo("menu")} className="nav-link">Menu</button>
            <button onClick={() => scrollTo("story")} className="nav-link">Our story</button>
            <button onClick={() => scrollTo("visit")} className="nav-link">Visit us</button>
          </nav>
          <button onClick={() => setCartOpen(true)} className="cart-button">
            <Icon name="cart" size={19} />
            <span className="hidden sm:inline">Your order</span>
            {count > 0 && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#cfea6a] px-1.5 text-xs font-bold text-[#14352d]">{count}</span>}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="relative overflow-hidden bg-[#eaf2e5]">
          <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full border border-[#2e7053]/15" />
          <div className="absolute -left-2 top-10 h-80 w-80 rounded-full border border-[#2e7053]/10" />
          <div className="mx-auto grid min-h-[660px] max-w-[1380px] items-center gap-10 px-5 py-16 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-14">
            <div className="relative z-10 max-w-xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1e6048]/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1e6048]">
                <span className="h-2 w-2 rounded-full bg-[#75a83c]" /> Family-made in Pattaya
              </div>
              <h1 className="font-display text-[56px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#123c35] sm:text-[74px] lg:text-[86px]">
                A little taste of <span className="italic text-[#237eac]">Thailand.</span>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-8 text-[#46645c]">
                Cool down with handcrafted Thai drinks, small-batch gelato and homemade cakes—served with a warm family welcome.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button onClick={() => scrollTo("menu")} className="primary-button">
                  Explore our menu <Icon name="arrow" />
                </button>
                <button onClick={() => scrollTo("visit")} className="secondary-button">Find the cafe</button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-[#2d5147]">
                <span className="flex items-center gap-2"><Icon name="clock" size={18} /> Open daily, 8am–8pm</span>
                <span className="flex items-center gap-2"><Icon name="pin" size={18} /> Central Pattaya</span>
              </div>
            </div>
            <div className="relative h-[420px] lg:h-[560px]">
              <div className="hero-image absolute inset-0 overflow-hidden rounded-[36px]">
                <img src="https://images.unsplash.com/photo-1644031995386-fe9665dc5b57?auto=format&fit=crop&w=1300&q=90" alt="A refreshing Thai iced tea at Tuncafe" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-3 rounded-2xl bg-[#123c35] p-5 text-white shadow-xl sm:-left-8 sm:p-6">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#cfea6a]">Guest favourite</div>
                <div className="mt-2 font-display text-2xl font-semibold">Thai Iced Tea</div>
                <div className="mt-1 text-sm text-white/65">Creamy, fragrant, unmistakably Thai</div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#123c35] text-white">
          <div className="mx-auto flex max-w-[1380px] flex-col items-start justify-between gap-5 px-5 py-7 md:flex-row md:items-center lg:px-10">
            <div className="flex items-center gap-5">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#cfea6a] text-center text-xs font-black leading-tight text-[#123c35]">BUY 1<br />GET 1</div>
              <div>
                <div className="font-display text-xl font-semibold sm:text-2xl">Second Thai Iced Tea, half price</div>
                <p className="mt-1 text-sm text-white/65">Available 1 December 2026–31 January 2027. Applies to drinks of equal size.</p>
              </div>
            </div>
            <button onClick={() => { changeQuantity(1, 1); scrollTo("menu"); }} className="whitespace-nowrap text-sm font-bold text-[#cfea6a] underline-offset-4 hover:underline">
              Add the favourite
            </button>
          </div>
        </section>

        <section id="menu" className="mx-auto max-w-[1380px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="eyebrow">Made fresh for you</div>
              <h2 className="section-title">What are you craving?</h2>
            </div>
            <p className="max-w-md leading-7 text-[#5a706a]">From Thai classics to creamy gelato, every item is prepared in our little Pattaya kitchen.</p>
          </div>
          <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={`category-pill ${category === item ? "active" : ""}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-9 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((product) => (
              <article key={product.id} className="product-card group">
                <div className="relative aspect-[4/4.3] overflow-hidden rounded-[22px] bg-[#e5ebe1]">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
                  {product.tag && <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-bold text-[#184b3b] shadow-sm">{product.tag}</span>}
                  <button onClick={() => changeQuantity(product.id, 1)} className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-[#123c35] text-white shadow-lg transition hover:scale-105 hover:bg-[#237eac]" aria-label={`Add ${product.name}`}>
                    <Icon name="plus" size={21} />
                  </button>
                </div>
                <div className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[21px] font-semibold leading-6 tracking-[-0.02em]">{product.name}</h3>
                    <span className="shrink-0 font-bold text-[#237eac]">฿{product.price}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-[#3f8466]">{product.thai}</p>
                  <p className="mt-2 text-sm leading-6 text-[#687b76]">{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-5 pb-20 lg:px-10 lg:pb-28">
          <div className="table-panel grid overflow-hidden rounded-[30px] bg-[#dcebd3] md:grid-cols-[1.05fr_.95fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <div className="eyebrow">Dining with us?</div>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">We’ll bring it to your table.</h2>
              <p className="mt-5 max-w-lg leading-7 text-[#4c665e]">Enter the number on your table sign, choose your favourites and pay. We’ll take care of the rest.</p>
              <form className="mt-8 flex max-w-md gap-3" onSubmit={(event) => { event.preventDefault(); if (table) setConfirmedTable(table); }}>
                <label className="sr-only" htmlFor="table">Table number</label>
                <input id="table" type="number" min="1" max="99" value={table} onChange={(event) => setTable(event.target.value)} placeholder="Table number" className="min-w-0 flex-1 rounded-xl border border-[#123c35]/15 bg-white px-5 py-4 font-semibold outline-none focus:border-[#237eac] focus:ring-2 focus:ring-[#237eac]/15" />
                <button type="submit" className="primary-button px-6">Set table</button>
              </form>
              {confirmedTable && <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[#247653]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#247653] text-white"><Icon name="check" size={13} /></span> Table {confirmedTable} saved to your order</div>}
            </div>
            <div className="relative min-h-[320px]">
              <img src="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=1100&q=85" alt="Colourful small-batch gelato" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </section>

        <section id="story" className="bg-[#fffdf8] py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1380px] items-center gap-12 px-5 md:grid-cols-2 lg:gap-24 lg:px-10">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1624639643234-2c8ed366e76f?auto=format&fit=crop&w=1100&q=85" alt="The family behind Tuncafe" className="aspect-[4/3.5] w-full rounded-[28px] object-cover" />
              <div className="absolute -bottom-5 right-5 rounded-2xl bg-white px-5 py-4 shadow-xl">
                <div className="text-xs font-bold uppercase tracking-[.15em] text-[#3f8466]">From our family</div>
                <div className="mt-1 font-display text-lg font-semibold">With love, every day</div>
              </div>
            </div>
            <div>
              <div className="eyebrow">Our family story</div>
              <h2 className="section-title mt-4">Pattaya roots.<br />A warm welcome.</h2>
              <p className="mt-6 text-lg leading-8 text-[#536b64]">Tuncafe began with one simple idea: share the flavours our family loves with people from all over the world.</p>
              <p className="mt-4 leading-7 text-[#687b76]">We brew our Thai tea every morning, source tropical fruit locally and make our desserts in small batches. Whether Pattaya is home or a stop on your travels, we hope you feel like family here.</p>
              <div className="mt-8 flex gap-8 border-t border-[#14352d]/10 pt-7">
                <div><div className="font-display text-3xl font-semibold text-[#237eac]">Local</div><div className="mt-1 text-sm text-[#687b76]">Thai ingredients</div></div>
                <div><div className="font-display text-3xl font-semibold text-[#237eac]">Family</div><div className="mt-1 text-sm text-[#687b76]">Owned & operated</div></div>
                <div><div className="font-display text-3xl font-semibold text-[#237eac]">Fresh</div><div className="mt-1 text-sm text-[#687b76]">Made each day</div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="visit" className="mx-auto max-w-[1380px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="mb-12 text-center">
            <div className="eyebrow">Come say hello</div>
            <h2 className="section-title mt-4">Find us in sunny Pattaya</h2>
          </div>
          <div className="grid overflow-hidden rounded-[30px] border border-[#14352d]/10 bg-white shadow-[0_20px_70px_rgba(20,53,45,.08)] md:grid-cols-[1.15fr_.85fr]">
            <div className="map-pattern relative min-h-[380px] overflow-hidden bg-[#dce9e4] p-8">
              <div className="absolute left-[45%] top-[43%] grid h-16 w-16 place-items-center rounded-full bg-[#237eac] text-white shadow-xl"><Icon name="pin" size={29} /></div>
              <div className="absolute bottom-6 left-6 rounded-xl bg-white px-4 py-3 text-xs font-bold shadow-md">Central Pattaya</div>
            </div>
            <div className="p-8 sm:p-12">
              <h3 className="font-display text-3xl font-semibold">Tuncafe</h3>
              <div className="mt-8 space-y-7">
                <div className="flex gap-4"><div className="icon-box"><Icon name="pin" /></div><div><div className="font-bold">Address</div><p className="mt-1 text-sm leading-6 text-[#687b76]">Central Pattaya, Bang Lamung District<br />Chon Buri 20150, Thailand</p></div></div>
                <div className="flex gap-4"><div className="icon-box"><Icon name="clock" /></div><div><div className="font-bold">Opening hours</div><p className="mt-1 text-sm leading-6 text-[#687b76]">Monday–Sunday<br /><strong className="text-[#14352d]">8:00 AM–8:00 PM</strong></p></div></div>
              </div>
              <a href="https://maps.google.com/?q=Central+Pattaya+Thailand" target="_blank" rel="noreferrer" className="primary-button mt-9 w-full justify-center">
                Open in Google Maps <Icon name="arrow" />
              </a>
              <a href="https://www.google.com/search?q=Tuncafe+Pattaya" target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#14352d]/15 px-5 py-3.5 text-sm font-bold transition hover:bg-[#f3f6f1]">
                View on Google
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0c2d27] px-5 py-12 text-white lg:px-10">
        <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4"><img src="/tuncafe-logo.png" alt="" className="h-14 w-14 rounded-full object-cover" /><div><div className="font-display text-xl font-semibold">TUNCAFE</div><div className="text-xs text-white/50">Fresh flavours. Family welcome.</div></div></div>
          <div className="text-sm text-white/50">© 2026 Tuncafe Pattaya · Made with care in Thailand</div>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-[#081d18]/45 backdrop-blur-[2px]" onMouseDown={() => setCartOpen(false)}>
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-[#fbfcf8] shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#14352d]/10 px-6 py-5">
              <div><div className="font-display text-2xl font-semibold">Your order</div>{confirmedTable && <div className="mt-1 text-xs font-bold text-[#3f8466]">Table {confirmedTable}</div>}</div>
              <button onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[#edf1ea]" aria-label="Close order"><Icon name="close" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {paid ? (
                <div className="grid h-full place-items-center text-center">
                  <div><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#dcebd3] text-[#247653]"><Icon name="check" size={38} /></div><h3 className="mt-6 font-display text-3xl font-semibold">Order received</h3><p className="mt-3 leading-7 text-[#687b76]">Thank you. We’re preparing your order{confirmedTable ? ` for table ${confirmedTable}` : ""} now.</p></div>
                </div>
              ) : cartItems.length ? (
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1"><div className="font-display font-semibold">{item.name}</div><div className="mt-1 text-sm font-bold text-[#237eac]">฿{item.price}</div><div className="mt-2 flex w-fit items-center rounded-full border border-[#14352d]/15"><button onClick={() => changeQuantity(item.id, -1)} className="p-1.5"><Icon name="minus" size={15} /></button><span className="w-7 text-center text-xs font-bold">{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} className="p-1.5"><Icon name="plus" size={15} /></button></div></div>
                      <div className="text-sm font-bold">฿{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid h-full place-items-center text-center"><div><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#edf1ea] text-[#3f8466]"><Icon name="cart" size={31} /></div><h3 className="mt-5 font-display text-2xl font-semibold">Your tray is empty</h3><p className="mt-2 text-sm text-[#687b76]">Add something delicious from our menu.</p><button onClick={() => { setCartOpen(false); scrollTo("menu"); }} className="primary-button mx-auto mt-6">Browse menu</button></div></div>
              )}
            </div>
            {!paid && cartItems.length > 0 && (
              <div className="border-t border-[#14352d]/10 p-6">
                {!confirmedTable && <button onClick={() => { setCartOpen(false); document.getElementById("table")?.focus(); document.getElementById("table")?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="mb-4 w-full rounded-xl bg-[#edf3e9] px-4 py-3 text-sm font-bold text-[#247653]">Add your table number</button>}
                <div className="flex justify-between text-sm"><span className="text-[#687b76]">Subtotal</span><strong>฿{subtotal}</strong></div>
                <div className="mt-2 flex justify-between text-sm"><span className="text-[#687b76]">Service</span><strong>฿0</strong></div>
                <div className="mt-4 flex justify-between border-t border-[#14352d]/10 pt-4 font-display text-xl font-semibold"><span>Total</span><span>฿{subtotal}</span></div>
                <button onClick={() => setPaid(true)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 text-sm font-bold text-white transition hover:bg-[#222]"> Pay with <span className="text-base">Apple Pay</span></button>
                <button onClick={() => setPaid(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#14352d]/20 bg-white py-4 text-sm font-bold transition hover:bg-[#f1f4ef]"><span className="text-[#4285f4]">G</span> Pay with Google Pay</button>
                <p className="mt-4 text-center text-[11px] leading-4 text-[#82908c]">Demo checkout. Payment details are not collected.</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
