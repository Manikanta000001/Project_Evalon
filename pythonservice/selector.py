# # selector.py
# import random

# def select_questions_per_unit(units, questions_per_unit=6):
#     selected = {}

#     for unit, questions in units.items():
#         if not questions:
#             continue

#         n = min(questions_per_unit, len(questions))
#         selected[unit] = random.sample(questions, n)

#     return selected




# selector.py
import random

import random

def select_mid_1(units):
    print(units)
    u1 = units.get("UNIT-I", []).copy()
    u2 = units.get("UNIT-II", []).copy()


    # ✅ HARD SAFETY CHECK
    if len(u1) < 3 or len(u2) < 3:
        raise ValueError(
            f"Mid-1 requires at least 3 questions each in UNIT-I and UNIT-II. "
            f"Found UNIT-I={len(u1)}, UNIT-II={len(u2)}"
        )

    random.shuffle(u1)
    random.shuffle(u2)

    u1_sel = u1[:3]
    u2_sel = u2[:3]

    ordered = [
        u1_sel[0], u1_sel[1],   # Q1 → U1, U1
        u2_sel[0], u2_sel[1],   # Q2 → U2, U2
        u1_sel[2], u2_sel[2],   # Q3 → U1, U2
    ]

    return {
        "UNIT-I": ordered
    }


def select_mid_2(units):
    u3 = units.get("UNIT-III", []).copy()
    u4 = units.get("UNIT-IV", []).copy()
    u5 = units.get("UNIT-V", []).copy()


    # ✅ HARD SAFETY CHECK
    if len(u3) < 2 or len(u4) < 2 or len(u5) < 2:
        raise ValueError(
            f"Mid-2 requires at least 2 questions each in "
            f"UNIT-III={len(u3)}, UNIT-IV={len(u4)}, UNIT-V={len(u5)}"
        )

    random.shuffle(u3)
    random.shuffle(u4)
    random.shuffle(u5)

    ordered = [
        u3[0], u3[1],   # Q1 → UNIT-III
        u4[0], u4[1],   # Q2 → UNIT-IV
        u5[0], u5[1],   # Q3 → UNIT-V
    ]

    return {
        "UNIT-III": ordered
    }

def select_questions_per_unit(units, questions_per_unit=6):
    selected = {}

    for unit, questions in units.items():
        if not questions:
            continue

        n = min(questions_per_unit, len(questions))
        selected[unit] = random.sample(questions, n)

    return selected
