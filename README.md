# 🔒 SecureImage Web App

SecureImage Web App is a highly advanced and user-friendly web platform designed to securely **encrypt and decrypt files within images** using a combination of **AES-256-CBC encryption** and **LSB steganography**.  
It ensures secure, private, and efficient data transmission by hiding encrypted content inside image pixels.

---

## 🚀 Features

- 🧠 **AES-256-CBC Encryption** — Ensures strong and industry-grade data security.
- 🖼️ **LSB Steganography** — Embeds encrypted data within image pixels invisibly.
- 🔐 **End-to-End File Protection** — Both encryption and decryption handled securely on the client/server.
- 💡 **Intuitive Interface** — Simple, responsive, and minimal UI for seamless workflow.
- ⚙️ **Dual Workflow** — Supports both file-to-image encryption and image-to-file decryption.
- 🌍 **Web Deployment Ready** — Fully optimized for Vercel deployment.

---

## 🏗️ Project Structure

```
secureimage-web-app/
├── frontend/           # Frontend code (React/Next.js)
├── api/                # Backend serverless API (Flask or FastAPI)
│   ├── encrypt.py
│   ├── decrypt.py
│   └── __init__.py
├── requirements.txt    # Python dependencies
├── package.json        # Frontend dependencies
├── vercel.json         # Vercel deployment configuration
└── README.md
```

---

## ⚙️ Tech Overview

| Layer | Technology Used |
|-------|------------------|
| Frontend | React / Next.js |
| Backend | Python (Flask / FastAPI) |
| Encryption | AES-256-CBC |
| Steganography | LSB (Least Significant Bit) |
| Deployment | Vercel |

---

## 💻 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/secureimage-web-app.git
cd secureimage-web-app
```

### 2️⃣ Setup Backend
```bash
cd api
pip install -r requirements.txt
```

Run locally:
```bash
python encrypt.py
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

App runs locally at:  
👉 `http://localhost:3000`

---

## 🌐 Deploying on Vercel

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/).
3. Import your repository.
4. Vercel auto-detects the setup.
5. Click **Deploy** 🎉

### Sample `vercel.json`
```json
{
  "version": 2,
  "builds": [
    { "src": "frontend/package.json", "use": "@vercel/static-build" },
    { "src": "api/**/*.py", "use": "@vercel/python" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1.py" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ]
}
```

---

## 🔐 Usage

1. Upload any **file** you wish to encrypt.
2. Choose a **carrier image**.
3. App encrypts your file using AES-256-CBC.
4. The encrypted file is embedded into the image using LSB steganography.
5. Download the **encoded image**.
6. For decryption, upload the encoded image and the **correct key** to retrieve the original file.

---

## 📸 Example Workflow

| Step | Description |
|------|--------------|
| Upload File | Select file you want to secure |
| Choose Image | Pick an image to hide data inside |
| Encrypt | AES encryption applied |
| Embed | Data hidden inside image |
| Download | Get stego-image |
| Decrypt | Recover original file securely |

---

## 🧠 Future Enhancements

- 🔄 Drag-and-drop encryption
- ☁️ Cloud key storage (secure vault)
- 📊 Visualization of pixel embedding
- 🧩 Support for audio/video steganography

---

## 👨‍💻 Author

**Developed by:** Shree Charan N  
🎓 B.Tech CSE (Cyber Security) — VIT Bhopal University  

---

## 📄 License

This project is licensed under the **MIT License** — you’re free to use, modify, and distribute it with attribution.

---

### ⭐ Don’t forget to star this repo if you like it!
