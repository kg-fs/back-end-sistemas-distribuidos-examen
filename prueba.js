require("dotenv").config();
const express = require("express");
const os = require("os");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== VALIDACIÓN ENV ====================
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error("❌ Faltan variables de entorno de Supabase");
  process.exit(1);
}

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ==================== SUPABASE ====================
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ==================== RUTAS ====================

// Health check (IMPORTANTE para VPS)
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando 🚀",
    server: os.hostname()
  });
});

app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    server: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

// Crear nota
app.post("/notes", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({
        error: "El campo 'text' es obligatorio y no puede estar vacío"
      });
    }

    const { data, error } = await supabase
      .from("Notes")
      .insert([{ text: text.trim() }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Nota creada exitosamente",
      server: os.hostname(),
      note: data
    });

  } catch (err) {
    console.error("❌ Error POST /notes:", err);
    res.status(500).json({
      error: err.message || "Error interno del servidor"
    });
  }
});

// Obtener todas
app.get("/notes", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("Notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      server: os.hostname(),
      count: data.length,
      notes: data
    });

  } catch (err) {
    console.error("❌ Error GET /notes:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener por ID
app.get("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("Notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Nota no encontrada" });
    }

    res.json({
      server: os.hostname(),
      note: data
    });

  } catch (err) {
    console.error("❌ Error GET /notes/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar
app.put("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "El campo 'text' es obligatorio" });
    }

    const { data, error } = await supabase
      .from("Notes")
      .update({ text: text.trim() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Nota no encontrada" });

    res.json({
      message: "Nota actualizada",
      server: os.hostname(),
      note: data
    });

  } catch (err) {
    console.error("❌ Error PUT /notes/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar
app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("Notes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      message: "Nota eliminada",
      server: os.hostname()
    });

  } catch (err) {
    console.error("❌ Error DELETE /notes/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== MANEJO GLOBAL DE ERRORES ====================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor ${os.hostname()} corriendo en puerto ${PORT}`);
});