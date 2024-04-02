import Masonry from "@mui/lab/Masonry";
import { Idea } from "../data/data.ts";
import IdeaCard from "./IdeaCard";

const IdeasGrid = ({ ideas }: { ideas: Idea[] }) => {
  return (
    <Masonry columns={4} spacing={2}>
      {ideas.map((idea, key) => (
        <IdeaCard key={key} idea={idea} />
      ))}
    </Masonry>
  );
};

export default IdeasGrid;
