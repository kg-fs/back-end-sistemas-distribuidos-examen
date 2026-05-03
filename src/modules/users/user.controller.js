const userService = require('./user.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        
        res.status(201).json({
            success: true,
            message: "Usuario registrado correctamente",
            insertId: result.insertId
        });
    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({
            success: false,
            message: "Error al registrar el usuario",
            error: error.message
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email y contraseña son requeridos"
            });
        }

        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.Password_user);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas"
            });
        }

        
        const token = jwt.sign(
            { 
                Num_user: user.Num_user,
                Email: user.Email,
                Num_rol: user.Num_rol 
            },
            "12yuaaku2517dbdiyvbakui72rbf",
            { expiresIn: '24h' }   
        );

        
        const userResponse = {
            Num_user: user.Num_user,
            Firs_name_user: user.Firs_name_user,
            Last_name_user: user.Last_name_user,
            Email: user.Email,
            Num_rol: user.Num_rol,
            Num_cat_state: user.Num_cat_state
        };

        // Enviar JWT como cookie
        res.cookie('token', token, {
            httpOnly: true, // Solo accesible por HTTP
            secure: false,  // Cambiar a true en producción con HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
            sameSite: 'strict' // Protección contra CSRF
        });

        res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso",
            user: userResponse
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: "Error en el servidor durante el login",
            error: error.message
        });
    }
};


const getProfile = async (req, res) => {
    try {
        const num_user = req.user?.Num_user || req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el ID del usuario"
            });
        }

        const user = await userService.findUserById(num_user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        delete user.Password_user; 

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error en getProfile:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener el perfil",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error en getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener la lista de usuarios",
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    getAllUsers
};
