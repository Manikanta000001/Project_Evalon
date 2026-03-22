

# main.py
from fastapi import FastAPI, UploadFile, File, Form
from extractor import extract_questions_from_docx, validate_question_bank_docx

from selector import select_questions_per_unit,select_mid_1,select_mid_2,select_objective_1,select_objective_2
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://evalonsystems.vercel.app"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/process")
async def process_question_bank(
    file: UploadFile = File(...),
    # exam_type: str = Form("assignment")
    exam_type: str = Form(None)
    
):
    file_bytes = await file.read()
        # ✅ VALIDATE FIRST
    is_valid, error = validate_question_bank_docx(file_bytes)
    if not is_valid:
        return {
            "error": "Invalid document structure",
            "message": error
        }

    extracted = extract_questions_from_docx(file_bytes)
    print("Exam type received:", exam_type)

    # ✅ If no exam_type → only validate & parse
    if not exam_type:
        return {
            "message": "File parsed successfully",
            "valid": True
        }

    # if exam_type == "assignment":
        # frontend sends unit
        # selected = select_questions_per_unit(extracted, 4)
        # selected = {"UNIT-I": selected.get("UNIT-I", [])}

    if exam_type.startswith("Assignment"):
        assignment_unit_map = {
            "Assignment 1": "UNIT-I",
            "Assignment 2": "UNIT-II",
            "Assignment 3": "UNIT-III",
            "Assignment 4": "UNIT-IV",
            "Assignment 5": "UNIT-V",
        }

        unit = assignment_unit_map.get(exam_type)

        if not unit:
            return {
                "error": "Invalid assignment type",
                "message": f"Unknown exam type: {exam_type}"
            }

        selected = select_questions_per_unit(extracted, 4)
        selected = {unit: selected.get(unit, [])}


    elif exam_type == "Mid 1":
        try:
            selected = select_mid_1(extracted)
        except ValueError as e:
            return {
                "error": "Insufficient questions",
                "message": str(e)
            }

    elif exam_type == "Mid 2":
        selected = select_mid_2(extracted)

    elif exam_type == "Objective 1":
        try:
            print("hello")
            selected = select_objective_1(extracted)
        except ValueError as e:
            return {
                "error": "Insufficient questions",
                "message": str(e)
        }

    elif exam_type == "Objective 2":
        print("hi")
        try:
            selected = select_objective_2(extracted)
            print(selected)
        except ValueError as e:
            print("ERROR:", e)
            return {
                "error": "Insufficient questions",
                "message": str(e)
        }
    else:
        return {
            "error": "Invalid exam type",
            "message": f"Unsupported exam type: {exam_type}"
        }

    print("The seleted questions",selected)

    return {
        "examType": exam_type,
        "units": selected
    }
