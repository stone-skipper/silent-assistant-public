/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import PlusMinus from "@/component/plusMinus";
import Control from "@/component/control";
import TranscriptionPanel from "@/component/transcriptionPanel";
import SettingPanel from "@/component/settingPanel";
import Nav from "@/component/nav";
import PromptInput from "@/component/promptInput";
import Toggle from "@/component/toggle";

export default function Research() {
  const [prompt, setPrompt] = useState(
    "Make the conversation transcription error free and use the conversation to infer a short phrase as a query to search after the conversation. And tell whether the speakers are looking for new information beyond the conversation that they're having. \n\n Answer in JSON format, with these keys - 'corrected_conversation','key_phrase' and 'seeking_new_info'."
  );
  const [value, setValue] = useState("");

  const [latestWords, setLatestWords] = useState(80);

  const [status, setStatus] = useState("default");
  const [completion, setCompletion] = useState(null);
  const [toggleT, setToggleT] = useState(false);
  const [toggleC, setToggleC] = useState(false);

  const [transcriptArray, setTranscriptArray] = useState([]);
  const [triggerWordCount, setTriggerWordCount] = useState(40);
  const [fullConv, setFullConv] = useState(false);

  const [searchWord, setSearchWord] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [resultFlow, setResultFlow] = useState([]); //accumulating the search result returned
  const [keywordLog, setKeywordLog] = useState([]); //accumulating the keywords used

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const trigger = useCallback(async () => {
    // setPrompt(transcript);
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text:
          fullConv === true
            ? transcriptArray +
              "\n\n Make the conversation transcription error free and use the conversation to infer a short phrase as a query to search after the conversation. And tell whether the speakers are looking for new information beyond the conversation that they're having. \n\n Answer in JSON format, with these keys - 'corrected_conversation','key_phrase' and 'seeking_new_info'."
            : transcriptArray.slice(-latestWords) +
              "\n\n Make the conversation transcription error free and use the conversation to infer a short phrase as a query to search after the conversation. And tell whether the speakers are looking for new information beyond the conversation that they're having. \n\n Answer in JSON format, with these keys - 'corrected_conversation','key_phrase' and 'seeking_new_info'.",

        temperature: 0.2,
      }),
    });
    const data = await response.json();
    console.log(JSON.parse(data.result.choices[0].message.content));
    setCompletion(JSON.parse(data.result.choices[0].message.content));
  }, [transcript]);

  useEffect(() => {
    setTranscriptArray(transcript.split(" "));
  }, [transcript]);

  useEffect(() => {
    if (
      transcriptArray.length > 0 &&
      transcriptArray.length % triggerWordCount === 0
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

  useEffect(() => {
    if (completion !== null && completion["seeking_new_info"] !== false) {
      // setSearchWord(completion.split("*").pop().split("$")[0]);
      setSearchWord(completion["key_phrase"]);
    }
  }, [completion]);

  const search = useCallback(async () => {
    setSearchResult([]);
    const response = await fetch("/api/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchWord, number: 1 }),
    });
    setKeywordLog((old) => [...old, searchWord]);
    const data = await response.json();
    console.log(data);
    if (data.items !== undefined) {
      setResultFlow((old) => [...old, data.items[0]]);
    }
    setCompletion(null);
    setSearchResult(data.items);
  }, [searchWord]);

  useEffect(() => {
    if (searchWord !== "") {
      search();
    }
  }, [searchWord]);

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
        title={"Contextual Research"}
        desc={`Based on the conversation, relevant resources like images and links will be provided as an inspiration. \n\n1. Click 'Listen' button to start, and have a conversation \n2. Images and links will continously appear on the screen.\n`}
        feedback="https://www.figma.com/file/vYtylB44ozZyTz8IyBFNo6/Hack---Silent-Assistant?type=design&node-id=158-252&mode=design&t=18PIboCGzmyFUJnT-4"
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
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "start",
            padding: 50,
            gap: 10,
            flexWrap: "wrap",
            flexFlow: "row wrap",
            overflowY: "scroll",
          }}
        >
          {resultFlow.length !== 0 &&
            resultFlow.map((info, index) => {
              return (
                <motion.div
                  key={"result" + index}
                  style={{
                    fontSize: "0.8em",
                    width: "25%",
                    height: "fit-content",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 10,
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <motion.a
                    href={info.image.contextLink}
                    target="_blank"
                    rel="noopener"
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "rgba(0,0,0,0.7)",
                      display: "flex",
                      color: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      textAlign: "center",
                      flexDirection: "column",
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {info.title}
                    <br />
                    <br />
                    <span style={{ fontSize: "0.8em" }}>
                      keyword : {keywordLog[index]}
                    </span>
                  </motion.a>
                  <img
                    src={info.link}
                    alt={info.title}
                    style={{
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                </motion.div>
              );
            })}
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
