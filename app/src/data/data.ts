import { PublicKey } from "@solana/web3.js";

export interface Idea {
  publicKey?: PublicKey;

  title: string;
  description: string;
  owner: PublicKey;
  price: number;
  isForSale: boolean;
}
