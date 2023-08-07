import { useState, useCallback, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import PlusMinus from "@/component/plusMinus";
import Control from "@/component/control";
import TranscriptionPanel from "@/component/transcriptionPanel";
import SettingPanel from "@/component/settingPanel";
import Nav from "@/component/nav";
import Toggle from "@/component/toggle";

export default function Playground() {
  const [value, setValue] = useState(
    "What is the keyword of the conversation?"
  );
  const [prompt, setPrompt] = useState("");
  const [latestWords, setLatestWords] = useState(80);
  const [status, setStatus] = useState("default");
  const [completion, setCompletion] = useState("");
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [triggerWordCount, setTriggerWordCount] = useState(12);
  const [toggleT, setToggleT] = useState(false);
  const [toggleC, setToggleC] = useState(false);
  const [fullConv, setFullConv] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  useEffect(() => {
    if (listening === true) {
      setStatus("progress");
    } else if (completion !== "") {
      setStatus("result");
    } else {
      setStatus("default");
    }
  }, [listening, completion]);

  const trigger = useCallback(async () => {
    // setPrompt(transcript);
    setCompletion("Loading...");
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text:
          fullConv === true
            ? value + transcriptArray
            : value + transcriptArray.slice(-latestWords),
        temperature: 0.2,
      }),
    });
    const data = await response.json();
    console.log(data.result.choices[0].message.content);
    setCompletion(data.result.choices[0].message.content);
  }, [transcript]);

  useEffect(() => {
    setTranscriptArray(transcript.split(" "));
  }, [transcript]);

  useEffect(() => {
    if (
      transcriptArray.length !== 0 &&
      transcriptArray.length % triggerWordCount === 0
    ) {
      trigger();
    }
  }, [transcriptArray]);

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
        background: "#DDE7EE",
      }}
    >
      <Nav
        title={"Playground"}
        desc={`Got an idea of what to detect from a conversation? Try writing a prompt by yourself.\n`}
        feedback="https://www.figma.com/file/vYtylB44ozZyTz8IyBFNo6/Hack---Silent-Assistant?type=design&node-id=158-323&mode=design&t=18PIboCGzmyFUJnT-4"
      />
      <div
        style={{
          width: "100vw",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          overflow: "hidden",
          gap: 10,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 50,
            gap: 10,
          }}
        >
          <input
            placeholder={"instruction"}
            value={value}
            onChange={handleInput}
            style={{
              width: "80%",
              background: "none",
              marginBottom: 40,
              textAlign: "center",
              fontSize: 20,
              borderBottom: "1px solid grey",
              paddingBottom: 10,
            }}
          />
          {/* result comes here */}
          <p
            style={{
              opacity: completion === "" ? 0.5 : 1,
              textAlign: "center",
            }}
          >
            {completion === "" ? "No result yet" : completion}
          </p>
        </div>
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
              display: fullConv === false ? "flex" : "none",
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
        </SettingPanel>
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
