# # main.py
# from fastapi import FastAPI, UploadFile, File, Form
# from extractor import extract_questions_from_docx
# from selector import select_questions_per_unit
# from fastapi.middleware.cors import CORSMiddleware


# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # React dev server
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# @app.post("/process")
# async def process_question_bank(
#     file: UploadFile = File(...),
#     exam_type: str = Form("assignment")
# ):
#     file_bytes = await file.read()

#     extracted = extract_questions_from_docx(file_bytes)

#     # Prototype logic
#     questions_per_unit = 4 if exam_type == "assignment" else 6
#     selected = select_questions_per_unit(extracted, questions_per_unit)

#     return {
#         "examType": exam_type,
#         "units": selected
#     }



# main.py
from fastapi import FastAPI, UploadFile, File, Form
from extractor import extract_questions_from_docx, validate_question_bank_docx

from selector import select_questions_per_unit,select_mid_1,select_mid_2
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/process")
async def process_question_bank(
    file: UploadFile = File(...),
    exam_type: str = Form("assignment")
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

    if exam_type == "assignment":
        # frontend sends unit
        selected = select_questions_per_unit(extracted, 4)
        selected = {"UNIT-I": selected.get("UNIT-I", [])}

    elif exam_type == "mid-1":
        try:
            selected = select_mid_1(extracted)
        except ValueError as e:
            return {
        "error": "Insufficient questions",
        "message": str(e)
    }

    elif exam_type == "mid-2":
        selected = select_mid_2(extracted)
    print(selected)


    # ✅ TEMP: return ONLY UNIT-I


    return {
        "examType": exam_type,
        "units": selected
    }

