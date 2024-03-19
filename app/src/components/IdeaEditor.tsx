import React from "react";

import { Box, TextField } from "@mui/material";

import Idea from "../data/Idea.ts";

function IdeaEditor({ idea, onChange }: { Idea; nge: (idea: Idea) => void }) {
  let handleTitleChange = (e) => {
    let input = e.target.value;
    onChange({ ...idea, title: input });
  };

  let handleDescriptionChange = (e) => {
    let input = e.target.value;
    onChange({ ...idea, description: input });
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        id="outlined-basic"
        label="Name your idea"
        variant="outlined"
        onChange={handleTitleChange}
        value={idea.title}
      />
      <TextField
        id="outlined-textarea"
        label="Describe your idea"
        variant="outlined"
        onChange={handleDescriptionChange}
        value={idea.description}
        minRows={3}
        multiline
      />
    </Box>
  );
}

export default IdeaEditor;
