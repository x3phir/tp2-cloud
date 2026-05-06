import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# =====================================================================
# DILARANG MENGUBAH ATAU MENG-HARDCODE BAGIAN INI!
# =====================================================================
nama_owner = os.environ.get('NAMA_PRAKTIKAN', 'Misterius')
nim_owner  = os.environ.get('NIM_PRAKTIKAN',  '00000000')
# =====================================================================

# Tema: Gaming & Virtual Inventory — Loadout Senjata
katalog_data = {
    "judul_katalog": f"Virtual Armory — Milik {nama_owner}",
    "pemilik": nama_owner,
    "nim": nim_owner,
    "items": [
        "AK-47 | Redline (Field-Tested)",
        "AWP | Dragon Lore (Factory New)",
        "M4A4 | Howl (Minimal Wear)"
    ]
}

@app.route('/api/info', methods=['GET'])
def get_info():
    return jsonify(katalog_data)

@app.route('/api/add-item', methods=['POST'])
def add_item():
    new_item = request.json.get('item')
    if new_item:
        katalog_data["items"].append(new_item)
        return jsonify({"message": "Item berhasil ditambahkan!", "items": katalog_data["items"]}), 201
    return jsonify({"error": "Data tidak valid"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
