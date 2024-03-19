import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

import Idea from "../data/Idea";

function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Card sx={{ maxWidth: 350 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {idea.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {idea.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default IdeaCard;
