import { PublicKey } from "@solana/web3.js";

export interface Idea {
  publicKey?: PublicKey;

  title: string;
  uri: string;
  content: IdeaContent;
  owner: PublicKey;
  price: number;
  isForSale: boolean;
}

export interface IdeaContent {
  description: string;
}
