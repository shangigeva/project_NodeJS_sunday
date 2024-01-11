type ICardInput = {
  title: string;
};
export type ICard = ICardInput & {
  //JWT=> userid
  //bizNumber => random Unique
  bizNumber?: number;
  userId?: string;
  _id?: string;
  createdAt: Date;
};
