export type Product = {
  id: string
  name: string
  thai: string
  description: string
  price: number
  category: string
  image: string
  tag?: string
}

export const products: Product[] = [
  {
    id: 'thai-tea',
    name: 'Original Thai Iced Tea',
    thai: 'ชาไทยเย็น',
    description: 'Strong Ceylon tea, condensed milk and fresh milk over ice.',
    price: 75,
    category: 'Thai favourites',
    tag: 'Bestseller',
    image:
      'https://images.unsplash.com/photo-1644031995386-fe9665dc5b57?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'thai-coffee',
    name: 'Thai Iced Coffee',
    thai: 'โอเลี้ยงนมสด',
    description: 'Bold Thai coffee with a silky layer of lightly sweetened milk.',
    price: 80,
    category: 'Thai favourites',
    tag: 'House special',
    image:
      'https://images.unsplash.com/photo-1644203541701-0c534473e616?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'coconut-latte',
    name: 'Coconut Iced Latte',
    thai: 'ลาเต้มะพร้าว',
    description: 'Espresso, fresh coconut milk and palm sugar for a tropical finish.',
    price: 95,
    category: 'Coffee',
    image:
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Iced Macchiato',
    thai: 'คาราเมลมัคคิอาโต้',
    description: 'Double espresso, milk and house caramel poured over ice.',
    price: 105,
    category: 'Coffee',
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'mango-soda',
    name: 'Mango Passion Soda',
    thai: 'มะม่วงโซดา',
    description: 'Mango, passion fruit, fresh lime and sparkling soda.',
    price: 85,
    category: 'Coolers',
    tag: 'Refreshing',
    image:
      'https://images.unsplash.com/photo-1567357771040-95bb44633d80?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'gelato-cup',
    name: 'Tropical Gelato Cup',
    thai: 'เจลาโต้ทรอปิคอล',
    description: 'Two scoops of our daily small-batch gelato. Choose your flavours.',
    price: 120,
    category: 'Gelato',
    image:
      'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'pandan-gelato',
    name: 'Coconut Pandan Gelato',
    thai: 'เจลาโต้มะพร้าวใบเตย',
    description: 'Creamy coconut gelato scented with fragrant Thai pandan.',
    price: 75,
    category: 'Gelato',
    tag: 'Local flavour',
    image:
      'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'basque-cheesecake',
    name: 'Basque Cheesecake',
    thai: 'ชีสเค้กหน้าไหม้',
    description: 'Caramelised on top, soft and creamy in the centre.',
    price: 135,
    category: 'Cakes',
    image:
      'https://images.unsplash.com/photo-1708175313856-8573b2bf8a3a?auto=format&fit=crop&w=900&q=85',
  },
]

export const categories = ['All', 'Thai favourites', 'Coffee', 'Coolers', 'Gelato', 'Cakes']

export const drinkCategories = new Set(['Thai favourites', 'Coffee', 'Coolers'])

export function findProduct(id: string) {
  return products.find((product) => product.id === id)
}
