import os
import random
import json
import numpy as np
import pandas as pd
import faiss
import requests
import matplotlib.pyplot as plt
from datetime import datetime
from collections import Counter
from bs4 import BeautifulSoup
import PyPDF2
import mysql.connector
from dotenv import load_dotenv
import string

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# HuggingFace
from transformers import pipeline

# TensorFlow for emotion model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Embedding, Conv1D, GlobalMaxPooling1D, Dense, Dropout

# Sentence embeddings
from sentence_transformers import SentenceTransformer

# ---------------- Load Environment ----------------
load_dotenv()  # Load .env file
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "password")
DB_NAME = os.getenv("DB_NAME", "chatbot_db")

# ---------------- Flask App ----------------
app = Flask(__name__)
CORS(app)

if not os.path.exists("static"):
    os.makedirs("static")

# ---------------- PDF & Web Scraping ----------------
def load_pdf(file_path):
    pdf_reader = PyPDF2.PdfReader(file_path)
    text = ""
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + " "
    return text

def chunk_text(text, chunk_size=150):
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

def scrape_websites(url_list):
    docs = []
    for url in url_list:
        try:
            r = requests.get(url, timeout=5)
            soup = BeautifulSoup(r.text, "html.parser")
            paragraphs = soup.find_all("p")
            text = " ".join([p.get_text() for p in paragraphs])
            docs.extend(chunk_text(text))
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    return docs

# ---------------- Load Knowledge Base ----------------
docs = []
pdf_folder = "pdfs"

if os.path.exists(pdf_folder):
    for file in os.listdir(pdf_folder):
        if file.endswith(".pdf"):
            text = load_pdf(os.path.join(pdf_folder, file))
            docs.extend(chunk_text(text))

urls = [
    "https://www.nimh.nih.gov/health/topics/depression",
    "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    "https://www.mayoclinic.org/diseases-conditions/depression/symptoms-causes/syc-20356007",
    "https://www.verywellmind.com/depression-4157281",
    "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/",
    "https://www.healthdirect.gov.au/mental-health-recovery",
    "https://www.mind.org.uk/information-support/types-of-mental-health-problems/mental-health-problems-introduction/types-of-mental-health-problems/",
    "https://mhanational.org/resources/31-tips-to-boost-your-mental-health/"
]
docs.extend(scrape_websites(urls))

print("Building FAISS index...")
st_model = SentenceTransformer("all-MiniLM-L6-v2")

if os.path.exists("faiss_index.bin") and os.path.exists("docs.npy"):
    index = faiss.read_index("faiss_index.bin")
    docs = np.load("docs.npy", allow_pickle=True).tolist()
    print("Loaded FAISS index from disk.")
else:
    embeddings = st_model.encode(docs)
    d = embeddings.shape[1]
    index = faiss.IndexFlatL2(d)
    index.add(np.array(embeddings))
    faiss.write_index(index, "faiss_index.bin")
    np.save("docs.npy", docs)
    print("Knowledge base built and saved.")

# ---------------- Load FAQ Dataset ----------------
try:
    faq_df = pd.read_csv("mental_health_faq.csv", encoding="latin1")
    faq_df.dropna(inplace=True)
    faq_df.columns = faq_df.columns.str.strip()  # remove extra spaces
    print("FAQ dataset loaded with", len(faq_df), "entries.")
except Exception as e:
    print("Could not load FAQ dataset:", e)
    faq_df = pd.DataFrame(columns=["Questions", "Answers"])

# ---------------- Text Cleaning ----------------
def clean_text(text):
    if not isinstance(text, str):
        return ""
    return text.lower().translate(str.maketrans("", "", string.punctuation)).strip()

faq_df["Questions_clean"] = faq_df["Questions"].apply(clean_text)
faq_df["Answers_clean"] = faq_df["Answers"].apply(str)

# ---------------- Sentence Transformer for Context Matching ----------------
st_model_faq = SentenceTransformer("all-MiniLM-L6-v2")
faq_embeddings = st_model_faq.encode(faq_df["Questions_clean"].tolist())

# ---------------- Dataset Reply Function ----------------
def dataset_reply(user_input, threshold=0.65):
    user_input_clean = clean_text(user_input)

    exact_match = faq_df.loc[faq_df["Questions_clean"] == user_input_clean]
    if not exact_match.empty:
        return exact_match["Answers_clean"].values[0]

    user_emb = st_model_faq.encode([user_input_clean])
    user_emb_norm = user_emb / np.linalg.norm(user_emb, axis=1, keepdims=True)
    faq_emb_norm = faq_embeddings / np.linalg.norm(faq_embeddings, axis=1, keepdims=True)
    similarities = np.dot(user_emb_norm, faq_emb_norm.T)[0]

    best_idx = np.argmax(similarities)
    if similarities[best_idx] >= threshold:
        return faq_df["Answers_clean"].iloc[best_idx]

    return None

# ---------------- Greeting Detection ----------------
GREETINGS = ["hi", "hello", "hey", "good morning", "good afternoon"]

def detect_greeting(message):
    msg = message.lower()
    for greeting in GREETINGS:
        if greeting in msg:
            return "Hello! How are you feeling today?"
    return None

# ---------------- Emotion Classifier ----------------
def load_emotion_dataset(file_path):
    df = pd.read_csv(file_path)
    if "content" in df.columns and "sentiment" in df.columns:
        texts = df["content"].astype(str).tolist()
        labels = df["sentiment"].astype(str).tolist()
    else:
        texts = df.iloc[:, 0].astype(str).tolist()
        labels = df.iloc[:, 1].astype(str).tolist()
    label_to_int = {label: idx for idx, label in enumerate(sorted(set(labels)))}
    int_to_label = {v: k for k, v in label_to_int.items()}
    y = [label_to_int[l] for l in labels]
    return texts, y, int_to_label

texts, labels, int_to_label = load_emotion_dataset("tweet_emotions.csv")
tokenizer = Tokenizer(num_words=5000, oov_token="<OOV>")
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded_sequences = pad_sequences(sequences, padding="post", maxlen=50)

if os.path.exists("emotion_cnn.h5"):
    cnn_model = load_model("emotion_cnn.h5")
    print("Loaded saved CNN emotion model.")
else:
    cnn_model = Sequential([
        Embedding(input_dim=5000, output_dim=32, input_length=50),
        Conv1D(128, 5, activation="relu"),
        GlobalMaxPooling1D(),
        Dense(64, activation="relu"),
        Dropout(0.3),
        Dense(len(int_to_label), activation="softmax")
    ])
    cnn_model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])
    cnn_model.fit(padded_sequences, np.array(labels), epochs=5, batch_size=64, validation_split=0.2)
    cnn_model.save("emotion_cnn.h5")
    print("Trained and saved CNN emotion model.")

def predict_emotion(message):
    seq = tokenizer.texts_to_sequences([message])
    pad = pad_sequences(seq, padding="post", maxlen=50)
    pred = cnn_model.predict(pad, verbose=0)
    return int_to_label[np.argmax(pred)]

# ---------------- HuggingFace Chat Generator ----------------
chat_generator = pipeline("text-generation", model="distilgpt2")

def generate_llm_reply(user_input, history):
    prompt = ""
    for turn in history[-2:]:
        prompt += f"User: {turn['user']}\nBot: {turn['bot']}\n"
    prompt += f"User: {user_input}\nBot:"
    response = chat_generator(
        prompt,
        max_length=60,
        num_return_sequences=1,
        temperature=0.7,
        do_sample=True
    )
    return response[0]["generated_text"].split("Bot:")[-1].strip()

# ---------------- Conversation Memory ----------------
conversation_history = []
mood_log = []
badges = set()

EMOTION_RESPONSES = {emo: f"I sense you may be feeling {emo}. Would you like me to share some suggestions?"
                     for emo in int_to_label.values()}

def update_memory(user_input, bot_response, emotion=None):
    conversation_history.append({
        "user": user_input,
        "bot": bot_response,
        "emotion": emotion
    })




def user_wants_info(message):
    keywords = ["more info", "tell me more", "details", "explain", "how", "what is", "why", "suggest", "symptoms"]
    return any(word in message.lower() for word in keywords)

def shorten_text(text, max_words=60):
    words = text.split()
    return text if len(words) <= max_words else " ".join(words[:max_words]) + "..."

# ---------------- Emotion Options ----------------
def emotion_options():
    """Returns emotion options with a friendly greeting."""
    return (
        "Hello! How are you feeling today?\n\n"
        "💬 You can choose one of these:\n"
        "1️⃣ Happy 😊\n"
        "2️⃣ Sad 😞\n"
        "3️⃣ Anxious 😰\n"
        "4️⃣ Tired 😴\n"
        "5️⃣ Angry 😡\n"
        "6️⃣ Neutral 🙂"
    )

def emotion_choice_reply(choice):
    """Provides a custom response for chosen emotions."""
    choice = choice.lower().strip()
    responses = {
        "happy": "That's wonderful! Keep smiling and spreading positivity 🌟",
        "sad": "I'm sorry to hear that. Would you like me to share some tips to feel better?",
        "anxious": "Anxiety can be tough. Would you like me to suggest a quick calming activity?",
        "tired": "Seems like you could use a rest 😴 Maybe take a short break?",
        "angry": "It’s okay to feel angry sometimes. Would you like me to help you cool down?",
        "neutral": "Got it 🙂 Seems like a calm day!"
    }
    for key, reply in responses.items():
        if key in choice:
            return reply
    return None

# ---------------- Hybrid Chatbot Response ----------------
def chatbot_response(user_input):
    msg = user_input.lower().strip()
    emotion = predict_emotion(msg)

    # ---------------- Update mood log & badges ----------------
    if emotion:
        mood_log.append(emotion)
        if len(mood_log) == 1:
            badges.add("First Chat")
        if len(mood_log) >= 5:
            badges.add("Mood Tracker")

    # ---------------- Greeting ----------------
    greeting_reply = detect_greeting(msg)
    if greeting_reply:
        update_memory(user_input, greeting_reply, emotion)
        return greeting_reply

    # ---------------- Mood Flow ----------------
    # Triggered only if bot just asked "How are you feeling today?"
    if getattr(chatbot_response, "moodFlowActive", False):
        valid_moods = ["happy", "sad", "anxious", "tired", "angry", "neutral"]
        mood_tips = {
            "happy": ["Awesome! Keep spreading positivity.", "Take a moment to appreciate yourself.", "Enjoy your day!"],
            "sad": ["I'm sorry to hear that.", "Try talking to someone you trust.", "Do a small activity you enjoy."],
            "anxious": ["Take a deep breath.", "Write down your worries.", "Focus on one task at a time."],
            "tired": ["Make sure to rest and hydrate.", "Short naps can help.", "Avoid heavy work for now."],
            "angry": ["Take a few deep breaths.", "Step away for a moment.", "Try a calming activity."],
            "neutral": ["It's a good day to reflect.", "Try journaling your thoughts.", "Engage in a hobby you like."]
        }

        if not hasattr(chatbot_response, "awaitingDeepDive"):
            chatbot_response.awaitingDeepDive = False

        if not chatbot_response.awaitingDeepDive:
            if msg in valid_moods:
                tips = mood_tips[msg]
                chatbot_response.selectedMood = msg
                chatbot_response.awaitingDeepDive = True
                update_memory(user_input, "\n".join(tips), emotion)
                return "\n".join(tips) + "\n\nDo you want to dive deeper? I can help you with that. (Yes/No)"
            else:
                # Unknown mood typed → normal chatbot
                chatbot_response.moodFlowActive = False
                chatbot_response.awaitingDeepDive = False
                return "I didn't recognize that mood. Please select from the options or type how you feel in your own words."

        # Handle Yes/No response for "dive deeper"
        if msg in ["yes", "ya"]:
            chatbot_response.awaitingDeepDive = False
            chatbot_response.moodFlowActive = False
            update_memory(user_input, "Okay! You can continue chatting or select another mood next time.", emotion)
            return "Okay! You can continue chatting or select another mood next time."
        else:
            chatbot_response.awaitingDeepDive = False
            chatbot_response.moodFlowActive = False

    # ---------------- Dataset Q&A ----------------
    dataset_ans = dataset_reply(user_input)
    if dataset_ans:
        update_memory(user_input, dataset_ans, emotion)
        return dataset_ans

    # ---------------- Knowledge Base ----------------
    if user_wants_info(msg):
        query_emb = st_model.encode([user_input])
        D, I = index.search(np.array(query_emb), k=2)  # top 2 results
        results = []
        for i in I[0]:
            chunk = docs[i]
            results.append(shorten_text(chunk, max_words=40))  # concise tips
        reply = "Here’s what I found:\n"
        for idx, res in enumerate(results, start=1):
            reply += f"{idx}. {res}\n"
        update_memory(user_input, reply.strip(), emotion)
        return reply.strip()

    # ---------------- GPT Fallback ----------------
    reply = generate_llm_reply(user_input, conversation_history)
    if emotion in EMOTION_RESPONSES:
        reply = EMOTION_RESPONSES[emotion] + "\n\n" + reply
    if len(conversation_history) >= 2:
        reply += "\n\n" + recall_past_filtered()

    update_memory(user_input, reply, emotion)
    return reply


# ---------------- MySQL Database ----------------
try:
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME
    )
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_msg TEXT,
        bot_reply TEXT,
        emotion VARCHAR(50),
        timestamp DATETIME
    )
    """)
    conn.commit()
    print("MySQL database connected and table ready.")
except mysql.connector.Error as e:
    print(f"Error connecting to MySQL: {e}")
    conn = None
    cursor = None

def save_conversation(user_msg, bot_reply, emotion):
    if conn and cursor:
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute(
            "INSERT INTO conversations (user_msg, bot_reply, emotion, timestamp) VALUES (%s, %s, %s, %s)",
            (user_msg, bot_reply, emotion, ts)
        )
        conn.commit()

def get_last_conversations(limit=5):
    if conn and cursor:
        cursor.execute(
            "SELECT user_msg, bot_reply, emotion, timestamp FROM conversations ORDER BY id DESC LIMIT %s",
            (limit,)
        )
        return cursor.fetchall()
    return []

# ---------------- Flask Routes ----------------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_msg = data.get("message", "")
    reply = chatbot_response(user_msg)
    save_conversation(user_msg, reply, predict_emotion(user_msg))
    return jsonify({"reply": reply})

@app.route("/history", methods=["GET"])
def history():
    past_chats = get_last_conversations(10)
    return jsonify({"history": past_chats})

@app.route("/dashboard")
def dashboard():
    return jsonify({
        "mood_log": mood_log,
        "badges": list(badges)
    })

@app.route("/mood_chart")
def mood_chart():
    mood_counts = Counter(mood_log)
    moods = list(mood_counts.keys())
    counts = list(mood_counts.values())

    plt.figure(figsize=(10, 5))
    plt.bar(moods, counts, color=["#4CAF50", "#F44336", "#FFC107"])
    plt.title("User Mood Distribution")
    plt.xlabel("Mood")
    plt.ylabel("Count")
    plt.tight_layout()

    chart_path = "static/mood_chart.png"
    plt.savefig(chart_path)
    plt.close()

    return render_template("mood_chart.html", chart_path=chart_path)

# ---------------- Run App ----------------
if __name__ == "__main__":
   app.run(debug=True, port=5001)
