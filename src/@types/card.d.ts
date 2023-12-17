type IAddress = {
  state?: string;
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  zip?: number;
};

type IImage = {
  alt: string;
  url: string;
};
type ICard = {
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  address: IAddress;
  image?: IImage;
};

export { ICard, IImage, IAddress };
