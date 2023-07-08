export type ProductElem = {
    id: number;
    category: string;
    fullPrice: string;
    discountPrice: string;
    discountProcentague: string;
    name: string;
    image: string;
    rating: number[];
    comments: Comment[];

    value?: string;
    lable?: string;
}

export type CategoryElem = {
    value: string;
    lable: string;
    name?: string;
    id?: number;
}

export type Cart = {
    id: number;
    data: ProductElem[];
}

export type Favorite = {
    id: number;
    data: ProductElem[];
}

export type Comment = {
    id: number;
    userId: string;
    name: string;
    rating: number;
    text: string;
    date: string;
}

