import { Composition } from "remotion";
import { Intro } from "./Intro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={132}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntroPortrait"
        component={Intro}
        durationInFrames={132}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
