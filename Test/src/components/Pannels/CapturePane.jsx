import ExamPaper from "./ExamPaper";


const CapturePane = ({ data }) => {
  return (
    <div
      id="printable-paper"
      className="print-area"
      style={{
        position: "absolute",
        top: 0,
        left: "-9999px",
        width: "210mm",
        background: "white",
      }}
    >
      <ExamPaper data={data} />
    </div>
  );
};
export default CapturePane;
