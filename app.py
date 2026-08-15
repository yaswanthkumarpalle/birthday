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
        photos = request.files.getlist("photos")
        feelings = request.form.getlist("feelings")

        wish_id = uuid.uuid4().hex[:10]
        slides = []

        for i, photo in enumerate(photos):
            if photo and photo.filename and allowed_file(photo.filename):
                ext = photo.filename.rsplit(".", 1)[1].lower()
                photo_filename = f"{wish_id}_{i}.{ext}"
                photo.save(os.path.join(UPLOAD_FOLDER, photo_filename))
                
                feeling_text = feelings[i].strip() if i < len(feelings) else ""
                slides.append({"photo": photo_filename, "feeling": feeling_text})

        data = load_data()
        data[wish_id] = {
            "name": name,
            "sender": sender,
            "slides": slides
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
        name=entry["name"] or "there",
        sender=entry["sender"],
        slides=entry.get("slides", [])
    )
    


if __name__ == "__main__":
    app.run(debug=True)