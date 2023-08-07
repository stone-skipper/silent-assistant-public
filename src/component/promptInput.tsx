export default function PromptInput({ prompt }) {
  return (
    <div
      style={{
        width: "100%",
        height: "fit-content",
      }}
    >
      Current Prompt:
      <br />
      <span style={{ opacity: 0.6 }}> {prompt.toString()}</span>
    </div>
  );
}
