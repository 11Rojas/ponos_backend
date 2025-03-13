interface Notifications {

}

interface ResponseReview {
    createdAt: Date,
    message: string
}

interface ReviewsAsSeller {
    productId: string
    name: string,
    createdAt: Date,
    stars: number,
    message: string,
    likes: number,
    dislike: number,
    response: ResponseReview
}

interface ReviewAsBuyer {
    productId: string
    name: string,
    createdAt: Date,
    stars: number,
    message: string,
    likes: number,
    dislike: number,
    response: ResponseReview
}


export default interface IUser {
    _id: string;
    id: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    phone: string;
    updatedAt: Date;
    ips?: string[];
    isActive: boolean;
    image: string;
    bio: string;
    location: string;
    website: string;
    followers: string[];
    following: string[];
    products: string[];
    shipping_information: {
        postal_code: string;
        country: string;
        city: string;
        address: string;
        phone: string;
        name: string;
        isDefault: boolean;
    },
    birthDate: Date,
    notifications: string[]
    ratingAsSeller: {
        rating: number,
        reviews: ReviewsAsSeller
    },
    ratingAsBuyer: {
        rating: number,
        reviews: ReviewAsBuyer
    }
}