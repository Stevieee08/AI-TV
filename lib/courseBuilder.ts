import { RandomUser, RandomProduct, Course } from "@/types";

export const buildCourses = (
  products: RandomProduct[],
  users: RandomUser[]
): Course[] => {
  return products.map((product, index) => {
    const instructor = users[index % users.length];
    const instructorName = instructor
      ? `${instructor.name.first} ${instructor.name.last}`
      : "Unknown Instructor";
    const instructorAvatar = instructor?.picture?.medium ?? "";
    const instructorCountry = instructor?.location?.country ?? "";

    return {
      id: String(product.id),
      title: product.title,
      description: product.description,
      price: product.price,
      rating: product.rating,
      category: product.category,
      thumbnail: product.thumbnail,
      images: product.images ?? [],
      instructor: {
        name: instructorName,
        avatar: instructorAvatar,
        country: instructorCountry,
      },
      duration: `${Math.floor(Math.random() * 20) + 2}h ${Math.floor(Math.random() * 60)}m`,
      lessons: Math.floor(Math.random() * 40) + 5,
    };
  });
};
