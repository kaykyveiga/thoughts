const User = require('../models/User');
const bcrypt = require('bcryptjs');



module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            req.flash('alertMessage', 'Usuário não encontrado!')
            res.render('auth/login');
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            req.flash('alertMessage', 'Senha inválida!')
            res.render('auth/login');
            return
        }

        req.session.userid = user.id
        req.flash('successMessage', 'Autenticado com sucesso!')
        req.session.save(() => {
            res.redirect('/')
        })
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmPassword } = req.body;

        if (password != confirmPassword) {
            req.flash('alertMessage', 'As senhas não conferem, tente novamente!')
            res.render('auth/register');
            return;
        }

        const checkIfUserExists = await User.findOne({ where: { email: email } });

        if (checkIfUserExists) {
            req.flash('alertMessage', 'Este email já está cadastrado, tente novamente!')
            res.render('auth/register');
            return;
        }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user);
            req.session.userid = createdUser.id
            req.flash('successMessage', 'Cadastrado com sucesso!')
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (error) {
            console.log(`Ocorreu um erro ${error}`);
            req.flash('alertMessage', 'Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente.');
            res.render('auth/register');
        }
    }
    static logout(req, res) {
        res.render('auth/logout')
    }

    static async logoutPost(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email: email } });

            if (!user) {
                req.flash('alertMessage', 'Usuário não encontrado!');
                return res.render('auth/logout');
            }

            const passwordMatch = bcrypt.compareSync(password, user.password);

            if (!passwordMatch) {
                req.flash('alertMessage', 'Senha inválida!');
                return res.render('auth/logout');
            }

            await User.destroy({ where: { id: user.id } });

            req.flash('successMessage', 'Sentiremos sua falta!');
            req.session.destroy(() => {
                res.redirect('/');
            });
        } catch (error) {
            console.error('Ocorreu um erro ao excluir o usuário:', error);
            req.flash('alertMessage', 'Ocorreu um erro ao processar o logout. Por favor, tente novamente.');
            res.render('auth/logout');
        }
    }
}