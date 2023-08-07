import ProjectLink from "@/component/projectLink";

export default function Home() {
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
      <p style={{ color: "#105BFB" }}>2023 Q1 Hack project</p>
      <h1 style={{ fontSize: 40, color: "#105BFB" }}>Silent Assistant</h1>
      <br />
      <br />
      <br />
      <div style={{ display: "flex", gap: 15 }}>
        <ProjectLink
          link={"/research"}
          title={`\ncontextual research`}
          index={"01"}
          hoverColor="#105BFB"
        />{" "}
        <ProjectLink
          link={"/switch"}
          title={`\ncontextual switch`}
          index={"02"}
          hoverColor="#105BFB"
        />{" "}
        <ProjectLink
          link={"/background"}
          title={`\nbackground as \ncompanion`}
          index={"03"}
          hoverColor="#105BFB"
        />{" "}
        <ProjectLink
          link={"/todo"}
          title={`\nfind \nto-dos`}
          index={"04"}
          hoverColor="#105BFB"
        />
      </div>
      <div style={{ display: "flex", gap: 15, marginTop: 15 }}>
        <ProjectLink
          link={
            "https://www.figma.com/file/vYtylB44ozZyTz8IyBFNo6/Hack---Silent-Assistant?type=design&node-id=0%3A1&mode=design&t=ri5sIRK69iFdLM8Y-1"
          }
          title={`\nproject brief & Insights`}
          index={"++"}
          hoverColor="#105BFB"
          newtab={true}
          shape="horizontal"
        />
        <ProjectLink
          link={"/playground"}
          title={`\nconversation playground`}
          index={"++"}
          hoverColor="#105BFB"
          shape="horizontal"
        />
      </div>
      <br />
      <br />
      <br />
      <p style={{ color: "grey" }}>
        DELL EIG STUDIO / contact :{" "}
        <a
          href="mailto:seungmee_lee@dell.com"
          style={{ textDecoration: "underline" }}
        >
          seungmee_lee@dell.com
        </a>
      </p>
    </div>
  );
}
