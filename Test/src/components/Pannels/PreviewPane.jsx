import ExamPaper from "./ExamPaper";

const PreviewPane = ({ data, scale }) => {
  return (
    <div className=" flex items-center justify-center bg-gray-100  ">
      <div
        style={{
          width: "210mm",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ExamPaper data={data} />
      </div>
    </div>
  );
};
export default PreviewPane;
