const express = require("express");
const cors = require("cors");
const { Client, Databases, ID } = require('node-appwrite');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const client = new Client()
    .setEndpoint(process.env.ENDPOINT)
    .setProject(process.env.PROJECT_ID)
    .setKey(process.env.API_KEY);

const databases = new Databases(client);
const dbId = process.env.DATABASE_ID;
const colId = process.env.COLLECTION_ID;


app.get('/api/data', async (req, res) => {
    try {
        const response = await databases.listDocuments(dbId, colId);
        const formattedData = response.documents.map(doc => ({
            id: doc.$id,
            nama: doc.nama,
            nim: doc.nim,
            jurusan: doc.jurusan,
        }));
        console.log(formattedData);
        res.json({ data: formattedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE
app.post('/api/data', async (req, res) => {
    try {
        const response = await databases.createDocument(dbId, colId, ID.unique(), {
            nama: req.body.nama,
            nim: req.body.nim,
            jurusan: req.body.jurusan
        });
        res.json({ message: "Data tersimpan", data: response });
    } catch (error) {
        // Baris ini akan mencetak error secara detail di terminal VSCode/CMD Anda
        console.error("GAGAL MENYIMPAN KE APPWRITE:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
app.put('/api/data/:id', async (req, res) => {
    try {
        await databases.updateDocument(dbId, colId, req.params.id, {
            nama: req.body.nama,
            nim: req.body.nim,
            jurusan: req.body.jurusan,

        });
        res.json({ message: "Data diubah" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE
app.delete('/api/data/:id', async (req, res) => {
    try {
        await databases.deleteDocument(dbId, colId, req.params.id);
        res.json({ message: "Data dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
async function cekKoneksi() {
    try {
        await databases.listDocuments(dbId, colId);
        console.log("✅ Appwrite Terkoneksi!");
    } catch (error) {
        console.error("❌ Appwrite Gagal:", error.message);
    }
}

cekKoneksi();
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});