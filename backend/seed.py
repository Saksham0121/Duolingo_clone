"""
Seed script for the Duolingo Clone — German Course.

Populates:
  - 1 German course
  - 3 Units (Basics, People & Places, Travel)
  - 9 Skills (3 per unit)
  - 27 Lessons (3 per skill)
  - 135 Exercises (5 per lesson, all 5 types covered)
  - 1 default learner (user_id=1) with partial progress
  - 9 seeded leaderboard users for the weekly ranking
  - Sample achievements for the default learner

Audio strategy:
  - audio_url is left None for all exercises.
  - The frontend uses the Web Speech API (speechSynthesis, lang='de-DE')
    to read the German prompt aloud — no API key required.

Run from the backend/ directory:
    python seed.py
"""

import json
import sys
import os
from datetime import datetime, date, timedelta, timezone

# Make sure the app package is importable
sys.path.insert(0, os.path.dirname(__file__))

from app.database import engine, SessionLocal
from app.models import (
    Base, Course, Unit, Skill, Lesson, Exercise,
    User, UserProgress, Streak, Hearts, XPLog,
    LeaderboardEntry, Achievement,
)


def reset_tables(db):
    """Drop and recreate all tables (idempotent seed)."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------------------------
# Exercise factories (keep code DRY)
# ---------------------------------------------------------------------------

def mc(lesson_id, order, prompt, correct, options):
    """Multiple-choice exercise."""
    return Exercise(
        lesson_id=lesson_id, type="multiple_choice",
        prompt=prompt, correct_answer=correct,
        options_json=json.dumps(options), order_index=order,
    )


def wb(lesson_id, order, prompt, correct, word_bank):
    """Word-bank / tap-the-words exercise."""
    correct_words = correct.split()
    bank_copy = list(word_bank)
    for word in correct_words:
        needed = correct_words.count(word)
        current = bank_copy.count(word)
        if current < needed:
            bank_copy.extend([word] * (needed - current))

    return Exercise(
        lesson_id=lesson_id, type="word_bank",
        prompt=prompt, correct_answer=correct,
        word_bank_json=json.dumps(bank_copy), order_index=order,
    )


def mp(lesson_id, order, prompt, pairs):
    """Match pairs exercise — correct_answer is JSON of the pairs."""
    return Exercise(
        lesson_id=lesson_id, type="match_pairs",
        prompt=prompt, correct_answer=json.dumps(pairs),
        pairs_json=json.dumps(pairs), order_index=order,
    )


def fb(lesson_id, order, prompt, correct):
    """Fill-in-the-blank exercise. Prompt contains ___ placeholder."""
    return Exercise(
        lesson_id=lesson_id, type="fill_blank",
        prompt=prompt, correct_answer=correct, order_index=order,
    )


def ta(lesson_id, order, prompt, correct):
    """Type-the-answer (free text) exercise."""
    return Exercise(
        lesson_id=lesson_id, type="type_answer",
        prompt=prompt, correct_answer=correct, order_index=order,
    )


# ---------------------------------------------------------------------------
# Main seed function
# ---------------------------------------------------------------------------

def seed():
    db = SessionLocal()
    try:
        reset_tables(db)

        # ------------------------------------------------------------------ #
        # COURSE
        # ------------------------------------------------------------------ #
        german = Course(
            name="German",
            flag_emoji="🇩🇪",
            description="Learn German from scratch — greetings, numbers, travel, and more.",
        )
        db.add(german)
        db.flush()  # get german.id

        # ------------------------------------------------------------------ #
        # UNITS
        # ------------------------------------------------------------------ #
        unit1 = Unit(course_id=german.id, title="Unit 1: Absolute Basics",
                     description="Greetings, numbers, and simple phrases",
                     order_index=1, color_hex="#58cc02")
        unit2 = Unit(course_id=german.id, title="Unit 2: People & Places",
                     description="Family, home, and everyday objects",
                     order_index=2, color_hex="#ce82ff")
        unit3 = Unit(course_id=german.id, title="Unit 3: Travel & Food",
                     description="Restaurants, transport, and city navigation",
                     order_index=3, color_hex="#ff9600")
        db.add_all([unit1, unit2, unit3])
        db.flush()

        # ------------------------------------------------------------------ #
        # SKILLS
        # ------------------------------------------------------------------ #
        # Unit 1
        s_greet   = Skill(unit_id=unit1.id, title="Greetings",    icon_emoji="👋", order_index=1, total_lessons=3)
        s_numbers = Skill(unit_id=unit1.id, title="Numbers",      icon_emoji="🔢", order_index=2, total_lessons=3)
        s_phrases = Skill(unit_id=unit1.id, title="Phrases",      icon_emoji="💬", order_index=3, total_lessons=3)
        # Unit 2
        s_family  = Skill(unit_id=unit2.id, title="Family",       icon_emoji="👨‍👩‍👧", order_index=4, total_lessons=3)
        s_home    = Skill(unit_id=unit2.id, title="At Home",      icon_emoji="🏠", order_index=5, total_lessons=3)
        s_objects = Skill(unit_id=unit2.id, title="Objects",      icon_emoji="📦", order_index=6, total_lessons=3)
        # Unit 3
        s_food    = Skill(unit_id=unit3.id, title="Food & Drink", icon_emoji="🍕", order_index=7, total_lessons=3)
        s_travel  = Skill(unit_id=unit3.id, title="Travel",       icon_emoji="✈️", order_index=8, total_lessons=3)
        s_city    = Skill(unit_id=unit3.id, title="City",         icon_emoji="🏙️", order_index=9, total_lessons=3)

        all_skills = [s_greet, s_numbers, s_phrases, s_family, s_home, s_objects, s_food, s_travel, s_city]
        db.add_all(all_skills)
        db.flush()

        # ------------------------------------------------------------------ #
        # LESSONS
        # ------------------------------------------------------------------ #
        def make_lessons(skill, titles):
            lessons = [Lesson(skill_id=skill.id, title=t, order_index=i+1) for i, t in enumerate(titles)]
            db.add_all(lessons)
            db.flush()
            return lessons

        l_greet   = make_lessons(s_greet,   ["Hello & Goodbye", "How Are You?", "Formal Greetings"])
        l_numbers = make_lessons(s_numbers, ["1 to 10", "11 to 100", "Counting Things"])
        l_phrases = make_lessons(s_phrases, ["Yes & No", "Please & Thank You", "I Don't Understand"])
        l_family  = make_lessons(s_family,  ["Mother & Father", "Brothers & Sisters", "Extended Family"])
        l_home    = make_lessons(s_home,    ["Rooms", "Furniture", "Daily Routine"])
        l_objects = make_lessons(s_objects, ["Colors", "Shapes", "Common Items"])
        l_food    = make_lessons(s_food,    ["At the Café", "Ordering Food", "Drinks"])
        l_travel  = make_lessons(s_travel,  ["At the Airport", "On the Train", "Directions"])
        l_city    = make_lessons(s_city,    ["Landmarks", "Shopping", "Asking for Help"])

        # ------------------------------------------------------------------ #
        # EXERCISES  (5 per lesson × 27 lessons = 135 total)
        # ------------------------------------------------------------------ #
        exercises = []

        # ── GREETINGS ────────────────────────────────────────────────────── #
        # Lesson: Hello & Goodbye
        lid = l_greet[0].id
        exercises += [
            mc(lid, 1, "What does 'Hallo' mean in English?", "Hello",
               ["Hello", "Goodbye", "Please", "Thank you"]),
            wb(lid, 2, "Translate to German: 'Hello, how are you?'",
               "Hallo wie geht es dir",
               ["Hallo", "wie", "geht", "es", "dir", "danke", "bitte"]),
            mp(lid, 3, "Match the German to English:",
               [{"left":"Hallo","right":"Hello"},{"left":"Tschüss","right":"Bye"},
                {"left":"Guten Morgen","right":"Good morning"},{"left":"Gute Nacht","right":"Good night"}]),
            fb(lid, 4, "Guten ___, wie geht es Ihnen?", "Morgen"),
            ta(lid, 5, "How do you say 'Good evening' in German?", "Guten Abend"),
        ]

        # Lesson: How Are You?
        lid = l_greet[1].id
        exercises += [
            mc(lid, 1, "What does 'Wie geht es dir?' mean?", "How are you?",
               ["How are you?", "Where are you?", "What is your name?", "How old are you?"]),
            wb(lid, 2, "Translate: 'I am fine, thank you'",
               "Mir geht es gut danke",
               ["Mir", "geht", "es", "gut", "danke", "schlecht", "bitte"]),
            mp(lid, 3, "Match the phrases:",
               [{"left":"Gut","right":"Good"},{"left":"Schlecht","right":"Bad"},
                {"left":"Müde","right":"Tired"},{"left":"Glücklich","right":"Happy"}]),
            fb(lid, 4, "Mir geht es ___, danke.", "gut"),
            ta(lid, 5, "How do you say 'Not so good' in German?", "Nicht so gut"),
        ]

        # Lesson: Formal Greetings
        lid = l_greet[2].id
        exercises += [
            mc(lid, 1, "Which is the formal 'you' in German?", "Sie",
               ["Sie", "du", "ihr", "wir"]),
            wb(lid, 2, "Translate formally: 'Good day, how are you?'",
               "Guten Tag wie geht es Ihnen",
               ["Guten", "Tag", "wie", "geht", "es", "Ihnen", "dir", "bitte"]),
            mp(lid, 3, "Match formal/informal:",
               [{"left":"Wie geht es Ihnen?","right":"Formal"},{"left":"Wie geht es dir?","right":"Informal"},
                {"left":"Sie","right":"Formal you"},{"left":"du","right":"Informal you"}]),
            fb(lid, 4, "Guten ___, mein Herr!", "Tag"),
            ta(lid, 5, "Say 'Goodbye' formally in German.", "Auf Wiedersehen"),
        ]

        # ── NUMBERS ──────────────────────────────────────────────────────── #
        lid = l_numbers[0].id
        exercises += [
            mc(lid, 1, "What is 'fünf' in English?", "5",
               ["5", "4", "6", "3"]),
            wb(lid, 2, "Put the numbers in order: one two three",
               "eins zwei drei",
               ["eins", "zwei", "drei", "vier", "fünf", "sechs"]),
            mp(lid, 3, "Match numbers:",
               [{"left":"eins","right":"1"},{"left":"zwei","right":"2"},
                {"left":"drei","right":"3"},{"left":"vier","right":"4"}]),
            fb(lid, 4, "Eins, zwei, ___, vier, fünf.", "drei"),
            ta(lid, 5, "How do you say '8' in German?", "acht"),
        ]

        lid = l_numbers[1].id
        exercises += [
            mc(lid, 1, "What is 'zwanzig' in English?", "20",
               ["20", "12", "30", "22"]),
            wb(lid, 2, "Translate: 'I have fifteen euros'",
               "Ich habe fünfzehn Euro",
               ["Ich", "habe", "fünfzehn", "Euro", "zwanzig", "Dollar"]),
            mp(lid, 3, "Match numbers:",
               [{"left":"elf","right":"11"},{"left":"zwölf","right":"12"},
                {"left":"dreißig","right":"30"},{"left":"hundert","right":"100"}]),
            fb(lid, 4, "Zehn plus zehn ist ___.", "zwanzig"),
            ta(lid, 5, "How do you say '50' in German?", "fünfzig"),
        ]

        lid = l_numbers[2].id
        exercises += [
            mc(lid, 1, "How do you say 'three cats' in German?", "drei Katzen",
               ["drei Katzen", "drei Katze", "dreis Katzen", "drei Hunde"]),
            wb(lid, 2, "Translate: 'two dogs and five birds'",
               "zwei Hunde und fünf Vögel",
               ["zwei", "Hunde", "und", "fünf", "Vögel", "drei", "Katzen"]),
            mp(lid, 3, "Match animals and numbers:",
               [{"left":"ein Hund","right":"one dog"},{"left":"zwei Katzen","right":"two cats"},
                {"left":"drei Vögel","right":"three birds"},{"left":"vier Fische","right":"four fish"}]),
            fb(lid, 4, "Ich habe ___ Geschwister. (two)", "zwei"),
            ta(lid, 5, "Say 'seven apples' in German.", "sieben Äpfel"),
        ]

        # ── PHRASES ──────────────────────────────────────────────────────── #
        lid = l_phrases[0].id
        exercises += [
            mc(lid, 1, "What does 'Ja' mean?", "Yes",
               ["Yes", "No", "Maybe", "Please"]),
            wb(lid, 2, "Translate: 'Yes, that is correct'",
               "Ja das ist richtig",
               ["Ja", "das", "ist", "richtig", "Nein", "falsch"]),
            mp(lid, 3, "Match:",
               [{"left":"Ja","right":"Yes"},{"left":"Nein","right":"No"},
                {"left":"Vielleicht","right":"Maybe"},{"left":"Natürlich","right":"Of course"}]),
            fb(lid, 4, "___, das stimmt!", "Ja"),
            ta(lid, 5, "How do you say 'No, thank you' in German?", "Nein, danke"),
        ]

        lid = l_phrases[1].id
        exercises += [
            mc(lid, 1, "What does 'Bitte' mean?", "Please / You're welcome",
               ["Please / You're welcome", "Thank you", "Sorry", "Excuse me"]),
            wb(lid, 2, "Translate: 'Thank you very much'",
               "Vielen Dank",
               ["Vielen", "Dank", "Bitte", "Entschuldigung", "danke"]),
            mp(lid, 3, "Match polite phrases:",
               [{"left":"Danke","right":"Thank you"},{"left":"Bitte","right":"Please"},
                {"left":"Entschuldigung","right":"Excuse me"},{"left":"Es tut mir leid","right":"I'm sorry"}]),
            fb(lid, 4, "___, wo ist die Toilette?", "Entschuldigung"),
            ta(lid, 5, "How do you say 'You're welcome' in German?", "Bitte"),
        ]

        lid = l_phrases[2].id
        exercises += [
            mc(lid, 1, "How do you say 'I don't understand'?", "Ich verstehe nicht",
               ["Ich verstehe nicht", "Ich weiß nicht", "Ich spreche nicht", "Ich lerne nicht"]),
            wb(lid, 2, "Translate: 'Can you speak slowly please?'",
               "Können Sie bitte langsam sprechen",
               ["Können", "Sie", "bitte", "langsam", "sprechen", "schnell", "laut"]),
            mp(lid, 3, "Match phrases:",
               [{"left":"Ich verstehe nicht","right":"I don't understand"},
                {"left":"Sprechen Sie Englisch?","right":"Do you speak English?"},
                {"left":"Wie bitte?","right":"Pardon?"},
                {"left":"Wiederholen Sie bitte","right":"Please repeat"}]),
            fb(lid, 4, "Ich ___ nicht Deutsch. (speak)", "spreche"),
            ta(lid, 5, "How do you say 'Please speak more slowly'?", "Sprechen Sie bitte langsamer"),
        ]

        # ── FAMILY ───────────────────────────────────────────────────────── #
        lid = l_family[0].id
        exercises += [
            mc(lid, 1, "What does 'Mutter' mean?", "Mother",
               ["Mother", "Father", "Sister", "Brother"]),
            wb(lid, 2, "Translate: 'My mother is very kind'",
               "Meine Mutter ist sehr nett",
               ["Meine", "Mutter", "ist", "sehr", "nett", "streng", "Vater"]),
            mp(lid, 3, "Match family members:",
               [{"left":"Mutter","right":"Mother"},{"left":"Vater","right":"Father"},
                {"left":"Eltern","right":"Parents"},{"left":"Kind","right":"Child"}]),
            fb(lid, 4, "Mein ___ heißt Thomas. (father)", "Vater"),
            ta(lid, 5, "How do you say 'My parents' in German?", "Meine Eltern"),
        ]

        lid = l_family[1].id
        exercises += [
            mc(lid, 1, "What does 'Bruder' mean?", "Brother",
               ["Brother", "Sister", "Cousin", "Uncle"]),
            wb(lid, 2, "Translate: 'I have two brothers and one sister'",
               "Ich habe zwei Brüder und eine Schwester",
               ["Ich", "habe", "zwei", "Brüder", "und", "eine", "Schwester", "Cousin"]),
            mp(lid, 3, "Match:",
               [{"left":"Bruder","right":"Brother"},{"left":"Schwester","right":"Sister"},
                {"left":"Zwilling","right":"Twin"},{"left":"Geschwister","right":"Siblings"}]),
            fb(lid, 4, "Meine ___ heißt Anna. (sister)", "Schwester"),
            ta(lid, 5, "Say 'older brother' in German.", "älterer Bruder"),
        ]

        lid = l_family[2].id
        exercises += [
            mc(lid, 1, "What does 'Großmutter' mean?", "Grandmother",
               ["Grandmother", "Grandfather", "Aunt", "Uncle"]),
            wb(lid, 2, "Translate: 'My grandfather is 80 years old'",
               "Mein Großvater ist 80 Jahre alt",
               ["Mein", "Großvater", "ist", "80", "Jahre", "alt", "jung"]),
            mp(lid, 3, "Match extended family:",
               [{"left":"Oma","right":"Grandma"},{"left":"Opa","right":"Grandpa"},
                {"left":"Tante","right":"Aunt"},{"left":"Onkel","right":"Uncle"}]),
            fb(lid, 4, "Meine ___ kommt aus Berlin. (aunt)", "Tante"),
            ta(lid, 5, "How do you say 'cousin (male)' in German?", "Cousin"),
        ]

        # ── AT HOME ──────────────────────────────────────────────────────── #
        lid = l_home[0].id
        exercises += [
            mc(lid, 1, "What does 'Küche' mean?", "Kitchen",
               ["Kitchen", "Bathroom", "Bedroom", "Living room"]),
            wb(lid, 2, "Translate: 'The bathroom is upstairs'",
               "Das Badezimmer ist oben",
               ["Das", "Badezimmer", "ist", "oben", "unten", "Küche", "groß"]),
            mp(lid, 3, "Match rooms:",
               [{"left":"Schlafzimmer","right":"Bedroom"},{"left":"Wohnzimmer","right":"Living room"},
                {"left":"Küche","right":"Kitchen"},{"left":"Badezimmer","right":"Bathroom"}]),
            fb(lid, 4, "Das ___ hat zwei Fenster. (bedroom)", "Schlafzimmer"),
            ta(lid, 5, "How do you say 'garden' in German?", "Garten"),
        ]

        lid = l_home[1].id
        exercises += [
            mc(lid, 1, "What does 'Stuhl' mean?", "Chair",
               ["Chair", "Table", "Bed", "Sofa"]),
            wb(lid, 2, "Translate: 'The sofa is in the living room'",
               "Das Sofa ist im Wohnzimmer",
               ["Das", "Sofa", "ist", "im", "Wohnzimmer", "Schlafzimmer", "groß"]),
            mp(lid, 3, "Match furniture:",
               [{"left":"Bett","right":"Bed"},{"left":"Tisch","right":"Table"},
                {"left":"Schrank","right":"Wardrobe"},{"left":"Lampe","right":"Lamp"}]),
            fb(lid, 4, "Der ___ ist kaputt. (chair)", "Stuhl"),
            ta(lid, 5, "How do you say 'bookshelf' in German?", "Bücherregal"),
        ]

        lid = l_home[2].id
        exercises += [
            mc(lid, 1, "What does 'schlafen' mean?", "To sleep",
               ["To sleep", "To eat", "To shower", "To cook"]),
            wb(lid, 2, "Translate: 'I wake up at seven o'clock'",
               "Ich wache um sieben Uhr auf",
               ["Ich", "wache", "um", "sieben", "Uhr", "auf", "acht", "schlafen"]),
            mp(lid, 3, "Match daily routine:",
               [{"left":"aufwachen","right":"wake up"},{"left":"frühstücken","right":"have breakfast"},
                {"left":"duschen","right":"shower"},{"left":"schlafen gehen","right":"go to sleep"}]),
            fb(lid, 4, "Ich ___ um 22 Uhr. (go to sleep)", "schlafe"),
            ta(lid, 5, "How do you say 'I brush my teeth' in German?", "Ich putze mir die Zähne"),
        ]

        # ── OBJECTS ──────────────────────────────────────────────────────── #
        lid = l_objects[0].id
        exercises += [
            mc(lid, 1, "What does 'rot' mean?", "Red",
               ["Red", "Blue", "Green", "Yellow"]),
            wb(lid, 2, "Translate: 'The sky is blue and the grass is green'",
               "Der Himmel ist blau und das Gras ist grün",
               ["Der", "Himmel", "ist", "blau", "und", "das", "Gras", "ist", "grün", "rot"]),
            mp(lid, 3, "Match colors:",
               [{"left":"rot","right":"red"},{"left":"blau","right":"blue"},
                {"left":"grün","right":"green"},{"left":"gelb","right":"yellow"}]),
            fb(lid, 4, "Meine Lieblingsfarbe ist ___. (purple)", "lila"),
            ta(lid, 5, "How do you say 'orange' in German?", "orange"),
        ]

        lid = l_objects[1].id
        exercises += [
            mc(lid, 1, "What does 'Kreis' mean?", "Circle",
               ["Circle", "Square", "Triangle", "Rectangle"]),
            wb(lid, 2, "Translate: 'The box is square and big'",
               "Die Box ist quadratisch und groß",
               ["Die", "Box", "ist", "quadratisch", "und", "groß", "klein", "rund"]),
            mp(lid, 3, "Match shapes:",
               [{"left":"Kreis","right":"circle"},{"left":"Quadrat","right":"square"},
                {"left":"Dreieck","right":"triangle"},{"left":"Rechteck","right":"rectangle"}]),
            fb(lid, 4, "Ein ___ hat drei Seiten. (triangle)", "Dreieck"),
            ta(lid, 5, "How do you say 'round' in German?", "rund"),
        ]

        lid = l_objects[2].id
        exercises += [
            mc(lid, 1, "What does 'Schlüssel' mean?", "Key",
               ["Key", "Phone", "Wallet", "Bag"]),
            wb(lid, 2, "Translate: 'Where is my phone?'",
               "Wo ist mein Telefon",
               ["Wo", "ist", "mein", "Telefon", "dein", "Schlüssel", "Tasche"]),
            mp(lid, 3, "Match objects:",
               [{"left":"Schlüssel","right":"key"},{"left":"Geldbeutel","right":"wallet"},
                {"left":"Brille","right":"glasses"},{"left":"Uhr","right":"watch"}]),
            fb(lid, 4, "Ich kann meine ___ nicht finden. (glasses)", "Brille"),
            ta(lid, 5, "How do you say 'umbrella' in German?", "Regenschirm"),
        ]

        # ── FOOD & DRINK ─────────────────────────────────────────────────── #
        lid = l_food[0].id
        exercises += [
            mc(lid, 1, "What does 'Kaffee' mean?", "Coffee",
               ["Coffee", "Tea", "Water", "Juice"]),
            wb(lid, 2, "Translate: 'One coffee and one croissant please'",
               "Einen Kaffee und ein Croissant bitte",
               ["Einen", "Kaffee", "und", "ein", "Croissant", "bitte", "Tee", "Kuchen"]),
            mp(lid, 3, "Match café items:",
               [{"left":"Kaffee","right":"coffee"},{"left":"Tee","right":"tea"},
                {"left":"Kuchen","right":"cake"},{"left":"Brötchen","right":"bread roll"}]),
            fb(lid, 4, "Ich möchte einen ___ bitte. (tea)", "Tee"),
            ta(lid, 5, "How do you say 'the bill please' in German?", "Die Rechnung bitte"),
        ]

        lid = l_food[1].id
        exercises += [
            mc(lid, 1, "What does 'Ich möchte bestellen' mean?", "I would like to order",
               ["I would like to order", "I have ordered", "The menu please", "I am done"]),
            wb(lid, 2, "Translate: 'I would like the schnitzel with salad'",
               "Ich möchte das Schnitzel mit Salat",
               ["Ich", "möchte", "das", "Schnitzel", "mit", "Salat", "Suppe", "Brot"]),
            mp(lid, 3, "Match food:",
               [{"left":"Brot","right":"bread"},{"left":"Suppe","right":"soup"},
                {"left":"Fleisch","right":"meat"},{"left":"Gemüse","right":"vegetables"}]),
            fb(lid, 4, "Ist das ___ vegetarisch? (dish)", "Gericht"),
            ta(lid, 5, "How do you say 'I am a vegetarian' in German?", "Ich bin Vegetarier"),
        ]

        lid = l_food[2].id
        exercises += [
            mc(lid, 1, "What does 'Wasser' mean?", "Water",
               ["Water", "Wine", "Beer", "Juice"]),
            wb(lid, 2, "Translate: 'A glass of water please'",
               "Ein Glas Wasser bitte",
               ["Ein", "Glas", "Wasser", "bitte", "Bier", "Wein", "Saft"]),
            mp(lid, 3, "Match drinks:",
               [{"left":"Wasser","right":"water"},{"left":"Bier","right":"beer"},
                {"left":"Wein","right":"wine"},{"left":"Saft","right":"juice"}]),
            fb(lid, 4, "Ich trinke gerne ___. (beer)", "Bier"),
            ta(lid, 5, "How do you say 'sparkling water' in German?", "Mineralwasser"),
        ]

        # ── TRAVEL ───────────────────────────────────────────────────────── #
        lid = l_travel[0].id
        exercises += [
            mc(lid, 1, "What does 'Flughafen' mean?", "Airport",
               ["Airport", "Train station", "Bus stop", "Hotel"]),
            wb(lid, 2, "Translate: 'My flight is at ten o'clock'",
               "Mein Flug ist um zehn Uhr",
               ["Mein", "Flug", "ist", "um", "zehn", "Uhr", "elf", "zwölf"]),
            mp(lid, 3, "Match travel words:",
               [{"left":"Flughafen","right":"airport"},{"left":"Ticket","right":"ticket"},
                {"left":"Koffer","right":"suitcase"},{"left":"Pass","right":"passport"}]),
            fb(lid, 4, "Darf ich Ihren ___ sehen? (passport)", "Pass"),
            ta(lid, 5, "How do you say 'departure gate' in German?", "Abfluggate"),
        ]

        lid = l_travel[1].id
        exercises += [
            mc(lid, 1, "What does 'Zug' mean?", "Train",
               ["Train", "Bus", "Car", "Taxi"]),
            wb(lid, 2, "Translate: 'The train to Berlin departs at noon'",
               "Der Zug nach Berlin fährt um zwölf Uhr ab",
               ["Der", "Zug", "nach", "Berlin", "fährt", "um", "zwölf", "Uhr", "ab"]),
            mp(lid, 3, "Match transport:",
               [{"left":"Zug","right":"train"},{"left":"Bus","right":"bus"},
                {"left":"U-Bahn","right":"subway"},{"left":"Taxi","right":"taxi"}]),
            fb(lid, 4, "Ich fahre mit dem ___ nach München. (train)", "Zug"),
            ta(lid, 5, "How do you say 'platform 5' in German?", "Gleis fünf"),
        ]

        lid = l_travel[2].id
        exercises += [
            mc(lid, 1, "What does 'links' mean?", "Left",
               ["Left", "Right", "Straight ahead", "Behind"]),
            wb(lid, 2, "Translate: 'Turn right at the traffic light'",
               "Biegen Sie an der Ampel rechts ab",
               ["Biegen", "Sie", "an", "der", "Ampel", "rechts", "links", "ab"]),
            mp(lid, 3, "Match directions:",
               [{"left":"links","right":"left"},{"left":"rechts","right":"right"},
                {"left":"geradeaus","right":"straight ahead"},{"left":"zurück","right":"back"}]),
            fb(lid, 4, "Gehen Sie ___ und dann links. (straight)", "geradeaus"),
            ta(lid, 5, "How do you say 'How far is it?' in German?", "Wie weit ist es?"),
        ]

        # ── CITY ─────────────────────────────────────────────────────────── #
        lid = l_city[0].id
        exercises += [
            mc(lid, 1, "What does 'Museum' mean?", "Museum",
               ["Museum", "Park", "Church", "City hall"]),
            wb(lid, 2, "Translate: 'The Brandenburg Gate is in Berlin'",
               "Das Brandenburger Tor ist in Berlin",
               ["Das", "Brandenburger", "Tor", "ist", "in", "Berlin", "München", "Hamburg"]),
            mp(lid, 3, "Match landmarks:",
               [{"left":"Rathaus","right":"city hall"},{"left":"Kirche","right":"church"},
                {"left":"Schloss","right":"castle"},{"left":"Brücke","right":"bridge"}]),
            fb(lid, 4, "Der ___ ist am Wochenende geöffnet. (museum)", "Museum"),
            ta(lid, 5, "How do you say 'town square' in German?", "Marktplatz"),
        ]

        lid = l_city[1].id
        exercises += [
            mc(lid, 1, "What does 'Kaufhaus' mean?", "Department store",
               ["Department store", "Supermarket", "Pharmacy", "Bakery"]),
            wb(lid, 2, "Translate: 'How much does this cost?'",
               "Wie viel kostet das",
               ["Wie", "viel", "kostet", "das", "billig", "teuer", "günstig"]),
            mp(lid, 3, "Match shopping words:",
               [{"left":"billig","right":"cheap"},{"left":"teuer","right":"expensive"},
                {"left":"Rabatt","right":"discount"},{"left":"Kasse","right":"checkout"}]),
            fb(lid, 4, "Ich suche die ___. (checkout)", "Kasse"),
            ta(lid, 5, "How do you say 'Do you accept card?' in German?", "Akzeptieren Sie Karte?"),
        ]

        lid = l_city[2].id
        exercises += [
            mc(lid, 1, "What does 'Krankenhaus' mean?", "Hospital",
               ["Hospital", "Police station", "Fire station", "School"]),
            wb(lid, 2, "Translate: 'I need help, call the police!'",
               "Ich brauche Hilfe rufen Sie die Polizei",
               ["Ich", "brauche", "Hilfe", "rufen", "Sie", "die", "Polizei", "Feuerwehr"]),
            mp(lid, 3, "Match emergency places:",
               [{"left":"Krankenhaus","right":"hospital"},{"left":"Polizei","right":"police"},
                {"left":"Apotheke","right":"pharmacy"},{"left":"Arzt","right":"doctor"}]),
            fb(lid, 4, "Bitte rufen Sie einen ___! (doctor)", "Arzt"),
            ta(lid, 5, "How do you say 'I am lost' in German?", "Ich habe mich verirrt"),
        ]

        db.add_all(exercises)
        db.flush()

        # ------------------------------------------------------------------ #
        # DEFAULT LEARNER (user_id = 1)
        # ------------------------------------------------------------------ #
        learner = User(
            username="learner",
            email="learner@duolingo-clone.dev",
            avatar_url="https://api.dicebear.com/7.x/adventurer/svg?seed=learner&backgroundColor=b6e3f4",
            total_xp=340,
        )
        db.add(learner)
        db.flush()

        # Partial progress: first 3 skills completed, skill 4 in progress
        for i, skill in enumerate(all_skills):
            if i < 3:
                progress = UserProgress(
                    user_id=learner.id, skill_id=skill.id,
                    xp_earned=skill.total_lessons * 10,
                    completed_lessons=skill.total_lessons,
                    crowns=1, completed=True,
                )
            elif i == 3:
                progress = UserProgress(
                    user_id=learner.id, skill_id=skill.id,
                    xp_earned=10, completed_lessons=1,
                    crowns=0, completed=False,
                )
            else:
                progress = UserProgress(
                    user_id=learner.id, skill_id=skill.id,
                    xp_earned=0, completed_lessons=0,
                    crowns=0, completed=False,
                )
            db.add(progress)

        # Streak
        streak = Streak(
            user_id=learner.id,
            current_streak=7,
            longest_streak=14,
            last_activity_date=date.today(),
        )
        db.add(streak)

        # Hearts
        hearts = Hearts(
            user_id=learner.id,
            count=4,
            max_hearts=5,
            last_refill_at=datetime.now(timezone.utc) - timedelta(hours=1),
        )
        db.add(hearts)

        # XP log
        xp_entries = [
            XPLog(user_id=learner.id, amount=10, source="lesson_complete"),
            XPLog(user_id=learner.id, amount=10, source="lesson_complete"),
            XPLog(user_id=learner.id, amount=15, source="lesson_complete"),
            XPLog(user_id=learner.id, amount=20, source="lesson_complete"),
        ]
        db.add_all(xp_entries)

        # Achievements
        ach = [
            Achievement(user_id=learner.id, badge_type="first_lesson",
                        badge_name="First Step", badge_description="Complete your first lesson"),
            Achievement(user_id=learner.id, badge_type="streak_7",
                        badge_name="Week Warrior", badge_description="7-day streak"),
            Achievement(user_id=learner.id, badge_type="xp_100",
                        badge_name="XP Centurion", badge_description="Earn 100 XP"),
        ]
        db.add_all(ach)

        # ------------------------------------------------------------------ #
        # LEADERBOARD — 9 seeded users + default learner
        # ------------------------------------------------------------------ #
        seeded_users = [
            ("fluent_felix",   "felix@example.com",   "felix",    820, "Gold",   1),
            ("german_greta",   "greta@example.com",   "greta",    760, "Gold",   2),
            ("berliner_ben",   "ben@example.com",     "ben",      680, "Silver", 3),
            ("vocab_victor",   "victor@example.com",  "victor",   540, "Silver", 4),
            ("daily_daria",    "daria@example.com",   "daria",    490, "Silver", 5),
            ("streak_sophie",  "sophie@example.com",  "sophie",   420, "Bronze", 6),
            ("beginner_baris", "baris@example.com",   "baris",    380, "Bronze", 7),
            ("curious_kate",   "kate@example.com",    "kate",     340, "Bronze", 8),
            ("newbie_noah",    "noah@example.com",    "noah",     210, "Bronze", 9),
        ]

        for (uname, email, seed_name, wxp, league, rank) in seeded_users:
            u = User(
                username=uname, email=email,
                avatar_url=f"https://api.dicebear.com/7.x/adventurer/svg?seed={seed_name}&backgroundColor=b6e3f4",
                total_xp=wxp,
            )
            db.add(u)
            db.flush()
            db.add(LeaderboardEntry(user_id=u.id, weekly_xp=wxp, total_xp=wxp, league=league, rank=rank))
            db.add(Streak(user_id=u.id, current_streak=0, longest_streak=0, last_activity_date=None))
            db.add(Hearts(user_id=u.id, count=5, max_hearts=5))

        # Learner's own leaderboard entry (rank 8 to start)
        db.add(LeaderboardEntry(
            user_id=learner.id, weekly_xp=340, total_xp=340, league="Bronze", rank=8
        ))

        db.commit()
        print("✅  Seed complete!")
        print(f"    Course: German 🇩🇪")
        print(f"    Units: 3  |  Skills: 9  |  Lessons: 27  |  Exercises: 135")
        print(f"    Users: 10 (1 learner + 9 seeded leaderboard users)")

    except Exception as e:
        db.rollback()
        print(f"❌  Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
