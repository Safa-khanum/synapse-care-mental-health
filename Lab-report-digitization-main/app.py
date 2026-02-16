import io
import os
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import pytesseract
from pdf2image import convert_from_bytes
from gtts import gTTS

# ================== CONFIG ==================
app = Flask(__name__, static_folder="static")
CORS(app)

os.makedirs("static/audio", exist_ok=True)

# Tesseract Path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# ================== STATIC FILE SERVING ==================
@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory("static", filename)


# ================== HOME ==================
@app.route("/")
def home():
    return jsonify({"message": "Flask OCR API running successfully!"})


# ================== OCR + ANALYSIS ==================
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        file = request.files.get("report")
        if not file:
            return jsonify({"ok": False, "error": "No file uploaded"}), 400

        filename = file.filename
        file_bytes = file.read()

        # PDF or image OCR
        if filename.lower().endswith(".pdf"):
            pages = convert_from_bytes(file_bytes)
            text = "\n".join([pytesseract.image_to_string(p, lang="eng") for p in pages])
        else:
            img = Image.open(io.BytesIO(file_bytes))
            text = pytesseract.image_to_string(img, lang="eng")

        summary = analyze_text(text)

        return jsonify({
            "ok": True,
            "summary": summary,
            "report_type": detect_report_type(text)
        })

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"ok": False, "error": str(e)})


# ================== TEXT-TO-SPEECH ==================
@app.route("/speak", methods=["POST"])
def speak():
    try:
        text = request.form.get("text", "")
        lang = request.form.get("lang", "en")

        if not text:
            return jsonify({"ok": False, "error": "Empty text"})

        filename = f"report_{lang}.mp3"
        output_path = os.path.join("static/audio", filename)

        # Generate speech
        tts = gTTS(text=text, lang=lang)
        tts.save(output_path)

        # Full accessible URL
        file_url = f"http://127.0.0.1:5000/static/audio/{filename}"

        return jsonify({"ok": True, "url": file_url})

    except Exception as e:
        print("❌ SPEAK ERROR:", e)
        return jsonify({"ok": False, "error": str(e)})


# ================== HELPERS ==================
def detect_report_type(text):
    t = text.lower()
    if any(k in t for k in ["mri", "hippocampi", "ventricles"]):
        return "MRI Report"
    if any(k in t for k in ["ecg", "qrs", "t wave"]):
        return "ECG Report"
    return "Lab Report"


def analyze_text(text):
    t = text.lower()
    findings = []

    def extract_number(pattern):
        match = re.search(pattern, t)
        if match:
            value = match.group(1)
            try:
                return float(value)
            except:
                return None
        return None

    # SAFELY extract possible values
    hemoglobin = extract_number(r"hemoglobin[:\s]*([0-9.]+)")
    cholesterol = extract_number(r"cholesterol[:\s]*([0-9.]+)")
    glucose = extract_number(r"(glucose|sugar)[:\s]*([0-9.]+)")
    urea = extract_number(r"urea[:\s]*([0-9.]+)")
    creatinine = extract_number(r"creatinine[:\s]*([0-9.]+)")
    hdl = extract_number(r"hdl[:\s]*([0-9.]+)")
    ldl = extract_number(r"ldl[:\s]*([0-9.]+)")
    triglycerides = extract_number(r"triglycerides[:\s]*([0-9.]+)")

    # HEALTH CHECKS
    if hemoglobin is not None:
        if hemoglobin < 12:
            findings.append(f"Hemoglobin is low ({hemoglobin}). Possible anemia.")
        elif hemoglobin > 17:
            findings.append(f"Hemoglobin is high ({hemoglobin}). Possible polycythemia.")
        else:
            findings.append(f"Hemoglobin is normal ({hemoglobin}).")

    if cholesterol is not None:
        if cholesterol > 200:
            findings.append(f"Cholesterol is high ({cholesterol}). Reduce fatty foods.")
        else:
            findings.append(f"Cholesterol is normal ({cholesterol}).")

    if glucose is not None:
        if glucose > 140:
            findings.append(f"Glucose is high ({glucose}). Possible diabetes risk.")
        else:
            findings.append(f"Glucose is normal ({glucose}).")
    else:
        if "glucose" in t or "sugar" in t:
            findings.append("Glucose mentioned but no numeric value found.")

    if creatinine is not None:
        if creatinine > 1.3:
            findings.append(f"Creatinine is high ({creatinine}). Kidney function may be reduced.")
        else:
            findings.append(f"Creatinine is normal ({creatinine}).")

    if urea is not None:
        if urea > 50:
            findings.append(f"Urea is high ({urea}). Kidney stress possible.")
        else:
            findings.append(f"Urea is normal ({urea}).")

    if hdl is not None:
        if hdl < 40:
            findings.append(f"HDL is low ({hdl}). Improve diet and exercise.")
        else:
            findings.append(f"HDL is healthy ({hdl}).")

    if ldl is not None:
        if ldl > 130:
            findings.append(f"LDL is high ({ldl}). Risk of cholesterol buildup.")
        else:
            findings.append(f"LDL level is normal ({ldl}).")

    if triglycerides is not None:
        if triglycerides > 150:
            findings.append(f"Triglycerides are high ({triglycerides}). Reduce sugar & carbs.")
        else:
            findings.append(f"Triglycerides are normal ({triglycerides}).")

    # If nothing found
    if not findings:
        return "No numeric values detected. Your report text was read but exact numbers were not found."

    return " ".join(findings)


# ================== RUN SERVER ==================
if __name__ == "__main__":
    app.run(debug=True, port=5000)
