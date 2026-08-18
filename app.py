from flask import Flask, render_template, request, url_for
import os, json, uuid

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join("static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
DATA_FILE = "wishes.json"

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({}, f)

def load_data():
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


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

        data = load_data()
        data[wish_id] = {
            "name": name,
            "sender": sender,
            "slides": slides,
            "balloon_themes": balloon_themes
        }
        save_data(data)

        link = url_for("wish", wish_id=wish_id, _external=True)
        return render_template("created.html", link=link)

    return render_template("create.html")


@app.route("/wish/<wish_id>")
def wish(wish_id):
    data = load_data()
    entry = data.get(wish_id)
    if not entry:
        return "Wish not found 💔", 404

    return render_template(
        "wish.html",
        name=entry.get("name") or "there",
        sender=entry.get("sender", ""),
        slides=entry.get("slides", []),
        balloon_themes=entry.get("balloon_themes", ["classic"])
    )


if __name__ == "__main__":
    app.run(debug=True)
