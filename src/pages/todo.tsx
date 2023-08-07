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

export default function Todo() {
  const [prompt, setPrompt] = useState(
    "Make the conversation transcription error-free without additional completion and find action items from it. Answer in JSON format, with these keys - 'corrected_conversation', 'action_items' with array. If there's no action item, return null for 'action_items' "
  );
  const [latestWords, setLatestWords] = useState(80);
  const [toggleT, setToggleT] = useState(false);
  const [toggleC, setToggleC] = useState(false);

  const [status, setStatus] = useState("default");
  const [words, setWords] = useState(["work", "casual"]);
  const [fullConv, setFullConv] = useState(false);

  const [completion, setCompletion] = useState(null);

  const [transcriptArray, setTranscriptArray] = useState([]);
  const [triggerWordCount, setTriggerWordCount] = useState(30);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [value, setValue] = useState(
    "Make the following conversation transcription error free without additional completion [" +
      transcript +
      "] and find all the action items. Answer in JSON format, with these keys - 'corrected_conversation', 'action_items' as an array. If there's no action item, return null for 'action_items'. If an action item should be done by someone else, start the person's name with @ "
  );

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
              "Make the conversation transcription error-free without additional completion and find action items from it. Answer in JSON format, with these keys - 'corrected_conversation', 'action_items' with array. If there's no action item, return null for 'action_items' "
            : transcriptArray.slice(-latestWords) +
              "Make the conversation transcription error-free without additional completion and find action items from it. Answer in JSON format, with these keys - 'corrected_conversation', 'action_items' with array. If there's no action item, return null for 'action_items' ",
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
        title={"Find to-do"}
        desc={`Extract action items from the conversation. \n\n1. Click 'Listen' button to start, and have a conversation \n2. A list of action items from the conversation will appear. \n`}
        question={[]}
        feedback="https://www.figma.com/file/vYtylB44ozZyTz8IyBFNo6/Hack---Silent-Assistant?type=design&node-id=158-316&mode=design&t=18PIboCGzmyFUJnT-4"
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
          alignItems: "center",
          flexDirection: "column",
          overflow: "hidden",
          gap: 10,
        }}
      >
        {completion !== null &&
          completion.action_items !== null &&
          // @ts-ignore
          completion.action_items.map((info, index) => {
            return (
              <div
                key={index}
                style={{
                  width: "fit-content",
                  height: "fit-content",
                  background: "white",
                  borderRadius: 5,
                  padding: 20,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{ width: 15, height: 15, border: "2px solid black" }}
                ></div>
                {info.split(" ").map((word, i) => {
                  return (
                    <span
                      key={word + i}
                      style={{
                        background:
                          word.includes("@") === true
                            ? "yellow"
                            : "transparent",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            );
          })}
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
