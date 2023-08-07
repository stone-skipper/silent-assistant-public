export default function Resource({ srcs }) {
  return (
    <div
      style={{
        width: "100%",
        height: "fit-content",
        display: "flex",
        flexDirection: "row",
        background: "black",
      }}
    >
      {srcs.map((info, index) => {
        return <div key={index}>{info.title}</div>;
      })}
    </div>
  );
}
