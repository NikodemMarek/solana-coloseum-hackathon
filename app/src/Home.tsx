import React, { useEffect, useState } from "react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Box, Button } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Idea } from "./data/data.ts";
import IdeaEditor from "./components/IdeaEditor.tsx";
import IdeasGrid from "./components/IdeasGrid.tsx";

import { createIdea, getIdeas } from "./data/api.ts";

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

  useEffect(() => {
    (async () => {
      const ideas = await getIdeas(connection, wallet);
      setIdeas(ideas);
    })();
  }, [connection]);
  const [ideas, setIdeas] = useState([]);

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
      </Box>
    </Box>
  );
};

export default Home;
