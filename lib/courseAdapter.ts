import { Course, RandomProduct, RandomUser } from '@/types';

const CATEGORY_IMAGES: Record<string, string[]> = {
  smartphones: [
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1603015128825-7e600e82def4?w=500&q=75&auto=format',
  ],
  laptops: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=75&auto=format',
  ],
  fragrances: [
    'https://images.unsplash.com/photo-1590156546806-a2c9a3d4ef3e?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1592003906553-c014ccbbd8e6?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1571782742078-f5a9e8c0ad95?w=500&q=75&auto=format',
  ],
  skincare: [
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&q=75&auto=format',
  ],
  groceries: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=500&q=75&auto=format',
  ],
  'home-decoration': [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab6?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&q=75&auto=format',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=75&auto=format',
  ],
};

const FALLBACK: string[] = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=75&auto=format',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=75&auto=format',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=75&auto=format',
];

function isValidUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  if (url.startsWith('data:')) return false;
  return url.startsWith('http');
}

export function adaptToCourses(products: RandomProduct[], users: RandomUser[]): Course[] {
  const catCounters: Record<string, number> = {};

  return products.map((product, index) => {
    const user = users[index % users.length];
    const instructorName = user ? `${user.name.first} ${user.name.last}` : 'Unknown Instructor';

    const catKey = product.category in CATEGORY_IMAGES ? product.category : null;
    if (catKey) catCounters[catKey] = (catCounters[catKey] ?? 0);

    const catImages = catKey ? CATEGORY_IMAGES[catKey] : null;
    const catIdx = catKey ? (catCounters[catKey]++ % (catImages?.length ?? 1)) : index % FALLBACK.length;

    const thumbnail = catImages
      ? catImages[catIdx]
      : isValidUrl(product.thumbnail)
      ? product.thumbnail
      : FALLBACK[index % FALLBACK.length];

    const images = catImages
      ? catImages
      : [thumbnail, ...FALLBACK];

    return {
      id: String(product.id),
      title: product.title,
      description: product.description,
      thumbnail,
      images,
      instructor: {
        id: user?.login?.uuid || String(index),
        name: instructorName,
        email: user?.email || '',
        avatar: user?.picture?.medium || '',
        expertise: product.category,
      },
      price: product.price,
      rating: product.rating,
      category: product.category,
      duration: `${Math.floor(Math.random() * 18) + 3}h ${Math.floor(Math.random() * 50) + 10}m`,
      enrolled: false,
      bookmarked: false,
    };
  });
}
