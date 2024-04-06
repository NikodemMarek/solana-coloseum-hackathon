import React, { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Box, Button } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Idea } from "./data/data.ts";
import IdeaEditor from "./components/IdeaEditor.tsx";
import IdeasGrid from "./components/IdeasGrid.tsx";

import {
  createIdea,
  getNotOwnedIdeasForSale,
  getOwnedIdeas,
} from "./data/api.ts";

const Home = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [idea, setIdea] = useState({
    title: "",
    description: "",
    price: 1 * LAMPORTS_PER_SOL,
    isForSale: true,
    owner: wallet.publicKey,
  } as Idea);

  const [ownedIdeas, setOwnedIdeas] = useState([]);
  const [ideas, setIdeas] = useState([]);
  useEffect(() => {
    (async () => {
      if (!wallet.publicKey) return;

      try {
        const ideas = await getNotOwnedIdeasForSale(connection, wallet);
        setIdeas(ideas);
      } catch (error) {
        console.error("Error getting ideas", error);
      }

      try {
        const ownedIdeas = await getOwnedIdeas(connection, wallet);
        setOwnedIdeas(ownedIdeas);
      } catch (error) {
        console.error("Error getting ideas", error);
      }
    })();
  }, [wallet.publicKey]);

  return (
    <Box display="flex" flexDirection="row" margin={2} gap={2}>
      <Box minWidth="25%" display="flex" flexDirection="column" gap={2}>
        <IdeaEditor idea={idea} onChange={setIdea} />
        <Button
          variant="outlined"
          onClick={async () => {
            try {
              await createIdea(
                connection,
                wallet,
                idea.title,
                idea.description,
                idea.price,
                idea.isForSale,
                wallet.publicKey,
              );
              setIdeas([...ideas, idea]);
              setIdea({
                title: "",
                description: "",
                authors: [],
              });
            } catch (error) {
              console.error("Error creating idea", error);
            }
          }}
        >
          Add Idea
        </Button>
      </Box>

      <Box flex={1}>
        <IdeasGrid ideas={ideas} />

        <hr />

        <IdeasGrid ideas={ownedIdeas} />
      </Box>
    </Box>
  );
};

export default Home;
