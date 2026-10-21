export type Property = {
  id: string;
  slug: string;
  title: string;
  cover: string | null;
  location: string | null;
  price_per_night: number;
  rating_avg: number | null;
  ratings_count: number;
};

export type PropertyDetail = Property & {
  description: string | null;
  pictures: string[];
  equipments: string[];
  tags: string[];
};
