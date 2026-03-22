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

def select_objective_1(units):
    u1 = units.get("UNIT-I", []).copy()
    u2 = units.get("UNIT-II", []).copy()

    if len(u1) < 2 or len(u2) < 2:
        raise ValueError(
            f"Objective-1 requires at least 2 questions each in UNIT-I and UNIT-II. "
            f"Found UNIT-I={len(u1)}, UNIT-II={len(u2)}"
        )

    random.shuffle(u1)
    random.shuffle(u2)

    selected = []

    # mandatory
    selected.extend(u1[:2])
    selected.extend(u2[:2])

    # last random
    remaining_pool = u1[2:] + u2[2:]

    if not remaining_pool:
        raise ValueError("Not enough remaining questions for Objective-1")

    selected.append(random.choice(remaining_pool))

    random.shuffle(selected)

    return {
        "OBJECTIVE-1": selected
    }
def select_objective_2(units):
    u3 = units.get("UNIT-III", []).copy()
    u4 = units.get("UNIT-IV", []).copy()
    u5 = units.get("UNIT-V", []).copy()

    if len(u3) == 0 or len(u4) == 0 or len(u5) == 0:
        raise ValueError(
            "Objective-2 requires questions in UNIT-III, UNIT-IV, UNIT-V"
        )

    random.shuffle(u3)
    random.shuffle(u4)
    random.shuffle(u5)

    patterns = [
        (2,2,1),
        (2,1,2),
        (1,2,2)
    ]

    # only keep patterns that are possible
    valid_patterns = [
        p for p in patterns
        if len(u3) >= p[0] and len(u4) >= p[1] and len(u5) >= p[2]
    ]

    if not valid_patterns:
        raise ValueError("Not enough questions to generate Objective-2")

    p = random.choice(valid_patterns)

    selected = []
    selected.extend(u3[:p[0]])
    selected.extend(u4[:p[1]])
    selected.extend(u5[:p[2]])

    random.shuffle(selected)
    print("Selected:", selected)

    return {
        "OBJECTIVE-2": selected
    }