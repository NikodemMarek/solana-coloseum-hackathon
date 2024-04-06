import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import Idea from "../data/Idea";
import { buyIdea } from "../data/api.ts";

function IdeaCard({ idea }: { idea: Idea }) {
  const { connection } = useConnection();
  const wallet = useWallet();

  return (
    <Card sx={{ maxWidth: 350 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {idea.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {idea.description}
        </Typography>

        {idea.isForSale && !wallet.publicKey.equals(idea.owner) && (
          <Button
            variant="outlined"
            onClick={async () => {
              try {
                await buyIdea(connection, wallet, idea, wallet.publicKey);
              } catch (error) {
                console.error("Error creating idea", error);
              }
            }}
          >
            Buy Idea
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default IdeaCard;
