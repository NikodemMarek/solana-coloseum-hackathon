import { Button, Card, CardContent, Tooltip, Typography } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Idea } from "../data/data.ts";
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

        {idea.isForSale && !wallet.publicKey?.equals(idea.owner) && (
          <Button
            variant="outlined"
            disabled={wallet.publicKey==null}
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
        {idea.isForSale && wallet.publicKey?.equals(idea.owner) && 
          <Button
            variant="outlined"
            disabled={true}
          >
            Your idea
          </Button>
        }
      </CardContent>
    </Card>
  );
}

export default IdeaCard;
