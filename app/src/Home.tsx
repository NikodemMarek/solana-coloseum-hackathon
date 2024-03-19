import React, { useState } from "react";

import { Box, Button } from "@mui/material";

import Idea from "./data/Idea.ts";
import IdeaEditor from "./components/IdeaEditor.tsx";
import IdeasGrid from "./components/IdeasGrid.tsx";
const Home = () => {
  const [idea, setIdea] = useState({
    title: "",
    description: "",
    authors: [],
  } as Idea);

  const [ideas, setIdeas] = useState([]);

  return (
    <Box display="flex" flexDirection="row" margin={2} gap={2}>
      <Box minWidth="25%" display="flex" flexDirection="column" gap={2}>
        <IdeaEditor idea={idea} onChange={setIdea} />
        <Button
          variant="outlined"
          onClick={() => {
            setIdeas([...ideas, idea]);
            setIdea({
              title: "",
              description: "",
              authors: [],
            });
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
