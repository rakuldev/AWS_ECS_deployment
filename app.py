from flask import Flask, request, jsonify
import pandas as pd
import numpy as np 
from flask_cors import CORS
import random

# Initialize Flask app
print("Initializing Flask...")
app = Flask(__name__)
print("Flask Initialized.")

# Enable CORS for the Flask app
CORS(app)

# Load Excel data
excel_file = "vocalbulary_tracker.xlsx"
sheet_name = "Vocabulary tracker"
df = pd.read_excel(excel_file, sheet_name=sheet_name)

# Function to fetch synonym and antonym
def get_synonym_antonym(word):
    result = df[df["Word"].str.strip().str.lower() == word.strip().lower()]
    if not result.empty:
        synonym = result.iloc[0].get("Synonyms", "Synonym not found")
        antonym = result.iloc[0].get("Antonyms", "Antonym not found")

        # Handle NaN values (if synonym/antonym are NaN in the sheet)
        if isinstance(synonym, float) and np.isnan(synonym):
            synonym = "Synonym not found"
        if isinstance(antonym, float) and np.isnan(antonym):
            antonym = "Antonym not found"

        return synonym, antonym
    else:
        return "Synonym not found", "Antonym not found"
    
@app.route("/api/get_random_word", methods=["GET"])
def get_random_word():
    random_word = random.choice(df["Word"].dropna().values)
    return jsonify({"word": random_word})

@app.route('/validate-answer', methods=['POST'])
def validate_answer():
    data = request.json
    word = data.get("word")
    answer = data.get("answer")
    type = data.get("type")  # synonym or antonym

    # Find the row for the word
    word_row = df[df['Word'].str.lower() == word.lower()]
    
    if word_row.empty:
        return jsonify({"isValid": False, "message": "No such word found"})

    # Check for synonym or antonym based on the dropdown value
    if type == "synonym":
        synonyms = word_row['Synonyms'].values[0]
        if pd.isna(synonyms) or answer.lower() not in synonyms.lower().split(','):
            return jsonify({"isValid": False, "message": "Incorrect synonym", "Answers": synonyms})
        else:
            return jsonify({"isValid": True, "message": "Correct synonym", "Answers": synonyms})
    
    elif type == "antonym":
        antonyms = word_row['Antonyms'].values[0]
        if pd.isna(antonyms) or answer.lower() not in antonyms.lower().split(','):
            return jsonify({"isValid": False, "message": "Incorrect antonym", "Answers": antonyms})
        else:
            return jsonify({"isValid": True, "message": "Correct antonym", "Answers": antonyms})

    return jsonify({"isValid": False, "message": "Invalid type"})

@app.route('/get-next-word', methods=['GET'])
def get_next_word():
    # Get a random word from the "Word" column
    random_word = random.choice(df['Word'].dropna().tolist())  # Choose a random word
    return jsonify({"word": random_word})

# API endpoint for page 1 logic
@app.route("/api/vocabulary", methods=["POST"])
def vocabulary():
    data = request.json
    word = data.get("word")

    if not word:
        return jsonify({"error": "Word is required"}), 400

    synonym, antonym = get_synonym_antonym(word)
    return jsonify({"synonym": synonym, "antonym": antonym})

# Run Flask app
if __name__ == "__main__":
    print("Starting Flask App...")
    app.run(host="0.0.0.0", debug=True)
