import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Control from "@/component/control";
import TranscriptionPanel from "@/component/transcriptionPanel";
import SettingPanel from "@/component/settingPanel";
import PlusMinus from "@/component/plusMinus";
import PromptInput from "@/component/promptInput";
import Nav from "@/component/nav";
import Toggle from "@/component/toggle";

import { sleep } from "../helper/utils";

export default function Background() {
  const [latestWords, setLatestWords] = useState(80);
  const [toggleT, setToggleT] = useState(false);
  const [toggleC, setToggleC] = useState(false);
  const [final, setFinal] = useState([]);
  const [imgPrompt, setImagePrompt] = useState("");
  const [keyword, setKeyword] = useState("");
  const [fullConv, setFullConv] = useState(false);

  const [status, setStatus] = useState("default");
  const [prompt, setPrompt] = useState(
    `Make the conversation transcription error-free. And find a keyword from it. And write a detailed text-to-image prompt to generate a realistic photo of a indoor room or outdoor landscape that is the most suitable for the conversation.
    \nAnswer in JSON format, with these keys - 'keyword' and 'imagePrompt'. If the keyword is about ${keyword} return the original keyword.`
  );
  const [completion, setCompletion] = useState("");

  const [transcriptArray, setTranscriptArray] = useState([]);
  const [triggerWordCount, setTriggerWordCount] = useState(40);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const trigger = useCallback(async () => {
    console.log("ask chatgpt to write a prompt");
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text:
          fullConv === true
            ? transcriptArray +
              `Make the conversation transcription error-free. And find a keyword from it. And write a detailed text-to-image prompt to generate a realistic photo of a indoor room or outdoor landscape that is the most suitable for the conversation.
      \nAnswer in JSON format, with these keys - 'keyword' and 'imagePrompt'. If the keyword is about ${keyword} return the original keyword.`
            : transcriptArray.slice(-latestWords) +
              `Make the conversation transcription error-free. And find a keyword from it. And write a detailed text-to-image prompt to generate a realistic photo of a indoor room or outdoor landscape that is the most suitable for the conversation.
        \nAnswer in JSON format, with these keys - 'keyword' and 'imagePrompt'. If the keyword is about ${keyword} return the original keyword.`,
        temperature: 0.2,
      }),
    });
    const data = await response.json();
    console.log(JSON.parse(data.result.choices[0].message.content));
    setImagePrompt(
      JSON.parse(data.result.choices[0].message.content)["imagePrompt"]
    );
    setKeyword(JSON.parse(data.result.choices[0].message.content)["keyword"]);
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

  const generate = useCallback(async () => {
    console.log("start drawing");

    const imgResponse = await fetch("/api/stablediffusion", {
      // using replicate stable diffusion
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt:
          imgPrompt +
          " high quality photorealistic Nikon D810 | ISO 64 | focal length 20 mm (Voigtländer 20 mm f3.5) | aperture f/9 | exposure time 1/40 Sec (DRI)",
        num_outputs: 1,
        width: 1024,
        height: 1024,
      }),
    });
    const data = await imgResponse.json();
    console.log(data);
    while (data.status !== "succeeded" && data.status !== "failed") {
      await sleep(1000);
      const response = await fetch("/api/" + data.id);
      const result = await response.json();
      //   if (response.status !== 200) {
      //     // setError(prediction.detail);
      //     return;
      //   }
      //   setPredictions(predictions.concat([prediction]));

      if (result.status === "succeeded") {
        console.log(result.output);
        setFinal((prev) => [...prev, result.output[0]]);
        return;
      }
    }
  }, [keyword]);

  useEffect(() => {
    if (keyword !== "") {
      generate();
    }
  }, [keyword]);

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
        title={"Background as a companion"}
        desc={`A background image for the conversation will be generated, when the keyword of the conversation changes.\n\n1. Click 'Listen' button to start, and have a conversation. \n2. The background image will be updated based on your topic.\n`}
        feedback="https://www.figma.com/file/vYtylB44ozZyTz8IyBFNo6/Hack---Silent-Assistant?type=design&node-id=158-290&mode=design&t=18PIboCGzmyFUJnT-4"
      />

      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",

          position: "relative",
          zIndex: 0,
        }}
      >
        <Image
          fill={true}
          src={final[final.length - 1]}
          alt={imgPrompt}
          style={{
            objectFit: "cover",
            opacity:
              final[final.length - 1] === undefined ||
              final[final.length - 1] === null
                ? 0
                : 1,
          }}
        ></Image>

        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            color: "white",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "flex-end",
            bottom: 0,
            zIndex: 1,
            padding: 20,
            fontSize: "0.8em",
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: keyword === "" ? 0 : 1 }}
        >
          {imgPrompt}
        </motion.div>
        <div
          style={{
            width: "100%",
            height: "fit-content",
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            zIndex: 1,
            bottom: 15,
          }}
        >
          {keyword !== "" && (
            <div
              style={{
                padding: 15,
                background: "white",
                borderRadius: 100,
                width: "fit-content",
                height: "fit-content",
              }}
            >
              keyword: {keyword}
            </div>
          )}
        </div>
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
