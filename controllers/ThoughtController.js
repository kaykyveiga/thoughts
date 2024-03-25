const { raw } = require('express');
const Thoughts = require('../models/Thoughts');
const User = require('../models/User');

const {Op, or} = require('sequelize')

module.exports = class ThoughtsController {
    static async showAllThoughts(req, res) {

        let search = ''
        if(req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old') {
            order = 'ASC'
        }


        const thoughtsData =  await  Thoughts.findAll({
            include: User,
            where : {
                title: {[Op.like] : `%${search}%`}
            },
            order : [['createdAt', order]]
        });
       
        const thoughts =thoughtsData.map((result) => result.get({plain : true})) 

        let thoughtsQty = thoughts.length

        if(thoughtsQty === 0 ) {
            thoughtsQty = false
        }
        res.render('thoughts/home', {thoughts, search, thoughtsQty})
    }
    static async dashboard(req, res) {
        if (!req.session.userid) {
            res.redirect('/login');
            return;
        }

        const userId = req.session.userid;

        try {
            const user = await User.findOne({
                where: {
                    id: userId
                },
                include: Thoughts,
                plain: true
            });

            if (!user) {
                res.redirect('/login');
                return;
            }

            const thoughts = user.Thoughts.map((result) => result.dataValues);

            let emptyThoughts = false;

            if(thoughts.length === 0) {
                emptyThoughts= true
            }

            res.render('thoughts/dashboard', { thoughts, emptyThoughts });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).send('Erro ao buscar usuário. Por favor, tente novamente mais tarde.');
        }
    }

    static createThoughts(req, res) {
        res.render('thoughts/create')
    }

    static async createThoughtsSave(req, res) {
        const thoughts = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Thoughts.create(thoughts)

            req.flash('successMessage', 'Pensamento criado com sucesso!')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(`Ocorreu um erro! ${error}`)
        }
    }

    static async removeThoughts(req, res) {
        const id = req.body.id
        const userId = req.session.userid

        try {
            await Thoughts.destroy({ where: { id: id, userId: userId } })

            req.flash('successMessage', 'Pensamento excluído com sucesso!')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }

    }

    static async updateThoughts(req, res) {
        const id = req.params.id 
        const thoughts = await Thoughts.findOne({where:{id: id}, raw:true});

        res.render('thoughts/update', {thoughts})
    }

    static async updateThoughtsSave(req, res) {
        const id = req.body.id 
        const thoughtUpdated = {
            title : req.body.title,
        }

        try {
            await Thoughts.update(thoughtUpdated, {where: {id: id}});
            req.flash('successMessage', 'Pensamento editado com sucesso!')
            req.session.save(() => {
                res.redirect('/thoughts/dashboard')
            })
            
        } catch (error) {
            console.log(error)
        }
    }
}