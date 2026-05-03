// modules/users/user.service.js
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const { generateUserId } = require('../utils/ids');


const createUser = async (userData) => {
    const Num_user = generateUserId();

    const { 
        Firs_name_user, 
        Last_name_user, 
        Email, 
        Password_user, 
        Num_rol, 
        Num_cat_state 
    } = userData;

    // Validación de campos obligatorios
    if (!Firs_name_user || !Last_name_user || !Email || !Password_user || !Num_rol || !Num_cat_state) {
        throw new Error("Todos los campos son obligatorios para crear un usuario");
    }

    // 1. Validar que el Email no exista
    const existingEmail = await db.query(
        `SELECT Num_user FROM users WHERE Email = ?`,
        [Email]
    );

    if (existingEmail[0].length > 0) {
        throw new Error("El email ya está registrado");
    }

    // 2. Validar que el Num_user no exista (por si hay colisión)
    const existingId = await db.query(
        `SELECT Num_user FROM users WHERE Num_user = ?`,
        [Num_user]
    );

    if (existingId[0].length > 0) {
        // Si hay colisión, generamos uno nuevo
        return createUser(userData); // Recursión simple (poco probable)
    }

    // 3. (Opcional) Validar combinación de nombres
    const existingName = await db.query(
        `SELECT Num_user FROM users 
         WHERE Firs_name_user = ? AND Last_name_user = ?`,
        [Firs_name_user, Last_name_user]
    );

    if (existingName[0].length > 0) {
        throw new Error("Ya existe un usuario con el mismo nombre y apellido");
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(Password_user, 10);

    // Insertar usuario
    const [result] = await db.query(
        `INSERT INTO users 
         (Num_user, Firs_name_user, Last_name_user, Email, Password_user, Num_rol, Num_cat_state) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [Num_user, Firs_name_user, Last_name_user, Email, hashedPassword, Num_rol, Num_cat_state]
    );

    return {
        insertId: Num_user,
        affectedRows: result.affectedRows
    };
};

const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        `SELECT * FROM users WHERE Email = ?`,
        [email]
    );
    return rows[0];
};


const findUserById = async (num_user) => {
    const [rows] = await db.query(
        `SELECT Num_user, Firs_name_user, Last_name_user, Email, Num_rol, Num_cat_state, created_at 
         FROM users 
         WHERE Num_user = ?`,
        [num_user]
    );
    return rows[0];
};

const getAllUsers = async () => {
    const [rows] = await db.query(
        `SELECT 
            Num_user,
            Firs_name_user,
            Last_name_user,
            Email,
            Num_rol,
            Num_cat_state,
            created_at
         FROM users 
         ORDER BY Num_user DESC`
    );
    return rows;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers     // ← Nueva función
};

