from flask import Flask, render_template, request, url_for
import json
import os
from datetime import datetime, timedelta, timezone
from threading import RLock
import uuid

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024

UPLOAD_FOLDER = os.path.join(app.root_path, "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
DATA_FILE = os.path.join(app.root_path, "wishes.json")
data_lock = RLock()
data_cache = None
data_mtime_ns = None
WISH_LIFETIME = timedelta(hours=24)

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({}, f)

def load_data():
    global data_cache, data_mtime_ns
    current_mtime_ns = os.stat(DATA_FILE).st_mtime_ns
    with data_lock:
        if data_cache is None or current_mtime_ns != data_mtime_ns:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                try:
                    data_cache = json.load(f)
                except json.JSONDecodeError:
                    data_cache = {}
                    with open(DATA_FILE, "w", encoding="utf-8") as repaired_file:
                        json.dump(data_cache, repaired_file)
            data_mtime_ns = os.stat(DATA_FILE).st_mtime_ns
        return data_cache

def save_data(data):
    global data_cache, data_mtime_ns
    temporary_file = f"{DATA_FILE}.tmp"
    with data_lock:
        with open(temporary_file, "w", encoding="utf-8") as f:
            json.dump(data, f, separators=(",", ":"))
        os.replace(temporary_file, DATA_FILE)
        data_cache = data
        data_mtime_ns = os.stat(DATA_FILE).st_mtime_ns

ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


def wish_expired(entry):
    try:
        created_at = datetime.fromisoformat(entry["created_at"])
    except (KeyError, TypeError, ValueError):
        return True

    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    return datetime.now(timezone.utc) - created_at >= WISH_LIFETIME


@app.after_request
def add_static_cache_headers(response):
    if request.path.startswith("/static/"):
        response.cache_control.public = True
        response.cache_control.max_age = 86400
        response.cache_control.no_cache = False
    return response


@app.route("/", methods=["GET", "POST"])
def create():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        sender = request.form.get("sender", "").strip()
        if not name or not sender:
            return "Please provide both the recipient's name and your name.", 400

        balloon_themes = request.form.getlist("balloon_themes")
        if not balloon_themes:
            balloon_themes = ["classic"]

        photos = request.files.getlist("photos")
        feelings = request.form.getlist("feelings")

        wish_id = uuid.uuid4().hex[:10]
        slides = []

        for i, photo in enumerate(photos):
            if photo and photo.filename and allowed_file(photo.filename):
                feeling_text = feelings[i].strip() if i < len(feelings) else ""
                if not feeling_text:
                    return "Please add a feeling for every uploaded photo.", 400

                ext = photo.filename.rsplit(".", 1)[1].lower()
                photo_filename = f"{wish_id}_{i}.{ext}"
                photo.save(os.path.join(UPLOAD_FOLDER, photo_filename))

                slides.append({"photo": photo_filename, "feeling": feeling_text})

        if not slides:
            return "Please upload at least one photo with a feeling.", 400

        with data_lock:
            data = dict(load_data())
            data[wish_id] = {
                "name": name,
                "sender": sender,
                "slides": slides,
                "balloon_themes": balloon_themes,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            save_data(data)

        link = url_for("wish", wish_id=wish_id, _external=True)
        return render_template("created.html", link=link)

    return render_template("create.html")


@app.route("/wish/<wish_id>")
def wish(wish_id):
    with data_lock:
        data = dict(load_data())
        entry = data.get(wish_id)
    if not entry:
        return "Wish not found 💔", 404

    # Start the expiry window for records created before timestamps were added.
    if "created_at" not in entry:
        entry = dict(entry)
        entry["created_at"] = datetime.now(timezone.utc).isoformat()
        data[wish_id] = entry
        save_data(data)

    if wish_expired(entry):
        return "This wish has expired 💔", 404

    return render_template(
        "wish.html",
        name=entry.get("name") or "there",
        sender=entry.get("sender", ""),
        slides=entry.get("slides", []),
        balloon_themes=entry.get("balloon_themes", ["classic"])
    )


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "0") == "1")
