import { useState, useCallback, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Control from "@/component/control";
import TranscriptionPanel from "@/component/transcriptionPanel";
import SettingPanel from "@/component/settingPanel";
import PlusMinus from "@/component/plusMinus";
import Nav from "@/component/nav";
import PromptInput from "@/component/promptInput";
import Toggle from "@/component/toggle";

export default function Switch() {
  const [latestWords, setLatestWords] = useState(80);
  const [toggleT, setToggleT] = useState(false);
  const [toggleC, setToggleC] = useState(false);
  const [fullConv, setFullConv] = useState(false);

  const [status, setStatus] = useState("default");
  const [words, setWords] = useState(["work", "casual"]);
  const [value, setValue] = useState(
    "Make the conversation transcription error free and choose a word from " +
      words.toString() +
      " that describes what the conversation is about. - "
  );
  const [prompt, setPrompt] = useState(
    "Make the conversation transcription error free and use the conversation to tell if the last part of the conversation is about work or not. If it's very likely to be about work, return 100 as probability, and if it's very likely to be unrelated to work and personal and casual, return 0 as probability. \n\n Answer in JSON format, with these keys - 'corrected_conversation', 'about_work' with boolean, and 'probability' with number."
  );

  const [completion, setCompletion] = useState({});

  const [transcriptArray, setTranscriptArray] = useState([]);
  const [triggerWordCount, setTriggerWordCount] = useState(30);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const trigger = useCallback(async () => {
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text:
          fullConv === true
            ? transcriptArray +
              "Make the following conversation transcription error free and use the conversation to tell if the last part of the conversation is about work or not. If it's very likely to be about work, return 100 as probability, and if it's very likely to be unrelated to work and personal and casual, return 0 as probability. \n\n Answer in JSON format, with these keys - 'corrected_conversation', 'about_work' with boolean, and 'probability' with number."
            : transcriptArray.slice(-latestWords) +
              "Make the following conversation transcription error free and use the conversation to tell if the last part of the conversation is about work or not. If it's very likely to be about work, return 100 as probability, and if it's very likely to be unrelated to work and personal and casual, return 0 as probability. \n\n Answer in JSON format, with these keys - 'corrected_conversation', 'about_work' with boolean, and 'probability' with number.",
        temperature: 1,
      }),
    });
    const data = await response.json();
    console.log(data.result.choices[0].message.content);
    setCompletion(JSON.parse(data.result.choices[0].message.content));
  }, [transcript]);

  useEffect(() => {
    setTranscriptArray(transcript.split(" "));
  }, [transcript]);

  useEffect(() => {
    if (
      transcriptArray.length % triggerWordCount === 0 &&
      transcriptArray.length !== 0
    ) {
      trigger();
    }
  }, [transcriptArray]);

  useEffect(() => {
    if (listening === true) {
      setStatus("progress");
    } else if (completion !== "") {
      setStatus("result");
    } else {
      setStatus("default");
    }
  }, [listening, completion]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Nav
        title="Contextual Switch"
        desc={`This prototype continuously checks if the conversation is about work or something casual. \n\n1. Click 'Listen' button to start, and have a conversation \n2. On the bottom of the screen, 'work' or 'casual' will be highlighted based on the context.\n`}
        question={[
          "What settings optimized when it's work conversation vs casual conversation?",
        ]}
        feedback="https://www.figma.com/file/vYtylB44ozZyTz8IyBFNo6/Hack---Silent-Assistant?type=design&node-id=158-262&mode=design&t=18PIboCGzmyFUJnT-4"
      />
      <TranscriptionPanel
        transcript={transcript}
        resetClick={() => {
          resetTranscript();
        }}
        toggleT={toggleT}
        latestWords={latestWords}
        fullConv={fullConv}
      />
      <SettingPanel toggleC={toggleC}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          Trigger every {triggerWordCount} words{" "}
          <PlusMinus
            onPlus={() => {
              setTriggerWordCount(triggerWordCount + 1);
            }}
            onMinus={() => {
              setTriggerWordCount(triggerWordCount - 1);
            }}
            btnColor={"#105BFB"}
            btnHoverColor={"#C8D9FF"}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          Use
          <Toggle
            fullConv={fullConv}
            onToggle={() => {
              setFullConv(!fullConv);
            }}
            btnColor={"#105BFB"}
            btnHoverColor={"#C8D9FF"}
          />
        </div>
        <div
          style={{
            display: fullConv === true ? "none" : "flex",
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          Use the latest {latestWords} words{" "}
          <PlusMinus
            onPlus={() => {
              setLatestWords(latestWords + 10);
            }}
            onMinus={() => {
              setLatestWords(latestWords - 10);
            }}
            btnColor={"#105BFB"}
            btnHoverColor={"#C8D9FF"}
          />
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
          }}
        >
          <PromptInput prompt={prompt} />
        </div>
      </SettingPanel>

      <div
        style={{
          background: "#DDE7EE",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          flexDirection: "row",
          overflow: "hidden",
          gap: 10,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 100,
            display: "flex",
            flexDirection: "row",
            padding: 15,
            gap: 15,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              color:
                // @ts-ignore
                completion.about_work === true && completion !== {}
                  ? "green"
                  : "lightgrey",
            }}
          >
            work
          </div>
          <div
            style={{ width: 1, height: 20, borderRight: "1px solid lightgrey" }}
          ></div>
          <div
            style={{
              color:
                // @ts-ignore
                completion.about_work === false && completion !== {}
                  ? "green"
                  : "lightgrey",
            }}
          >
            casual
          </div>
        </div>
      </div>

      <Control
        listening={listening}
        status={status}
        setToggleC={setToggleC}
        setToggleT={setToggleT}
        toggleC={toggleC}
        toggleT={toggleT}
        clickToListen={() => {
          SpeechRecognition.startListening({ continuous: true });
        }}
        clickToStop={() => {
          SpeechRecognition.stopListening();
        }}
      />
    </div>
  );
}
