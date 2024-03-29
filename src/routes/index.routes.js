const { Router } = require("express");
const router = Router()
const passport = require('passport')
const initializePassport = require('../passportConfig')
const moment = require('moment');
const images = require('../images')

const { pool } = require('../dbConfig')
const bcrypt = require('bcrypt')
var today = new Date();

const bloquesJS = require('../Bloques');

const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const date2 = moment().format();

initializePassport(passport)

router.get('/', (req, res) => {
    res.render('index', {req})
    console.log(req.user)
    console.log(date)
})

router.get('/users/register', checkAunthenticated, (req, res) => {
    res.render('register', {req})
})

router.get('/users/login', checkAunthenticated, (req, res) => {
    res.render('login', {req})
})

router.get('/users/dashboard', checkNotAunthenticated, (req, res) => {
    var ranNum = Math.floor(Math.random() * images.length) + 1;
    res.render('dashboard', { user: req.user.name, req, ranNum, images})
    console.log(ranNum)
})

router.get('/users/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('succes_msg', 'You have logged out')
    res.redirect('/users/login')
  });
});


//BLOQUES Y COMENTARIOS

router.get('/bloques', (req, res) => {
    res.render('bloques', {req, bloquesJS});
    console.log(req.user);
})


router.get('/posts', (req, res) => {
    pool.query('SELECT * FROM posts ORDER BY fechapublicacion DESC', (err, results) => {
        if (err) {
            throw err
        }
        
        pool.query('SELECT * FROM categoria ', (err, resu) => {
            if (err) {
                throw err
            }

            //console.log(resu.rows)

            pool.query('SELECT * FROM users', (err, resul) => {
                if(err){
                    throw err
                }

                for(var i = 0; i < results.rows.length; i++)
                {
                    var splitFecha = results.rows[i].fechapublicacion;
                    var esto = splitFecha.toString()
                    var splitjaja = esto.split(" ") + splitjaja;
                }


                res.render('posts', {req, results, resu, resul, splitjaja})

            })

        })
        //console.log(results.rows)
        
    })
})

router.get('/crear/post', checkNotAunthenticated, (req, res) => {
    res.render('createPosts', {req});
})

router.post('/crear/post', checkNotAunthenticated, (req, res) => {
    const { id } = req.user
    const { titlepost, description, categoria } = req.body
    console.log(req.body)
    if (req.isAuthenticated()) {
        pool.query(`INSERT INTO posts(titlepost, fechapublicacion, descripcion, idcategoria, codigoestudiante) VALUES ('${titlepost}', '${date2}', '${description}', '${categoria}', ${id})`, (err, results) => {
            if (err) {
                throw err
            }
            else {
                req.flash('succes_msg', 'Publicacion agregada')
                res.redirect('/posts')
            }
        });
    } else {
        res.send('received')
    }

})

router.get('/posts/:id', (req, res) => {
    pool.query(`SELECT * FROM posts WHERE idpost = ${req.params.id}`, (err, results) => {
        if (err) {
            throw err
        } else {
            if (results.rowCount > 0) {
                console.log(results.rows)

                pool.query(`SELECT * from comentarios WHERE idpost = ${req.params.id}`, (err, resu) => {
                    if (err) {
                        throw err
                    } else {
                        if (resu.rowCount > 0) {
                            console.log(resu.rows)
                            pool.query('SELECT * FROM categoria', (err, resul) => {
                                if(err){
                                    throw err
                                }

                                pool.query('SELECT * FROM users', (err, resUsers) => {
                                    if(err){
                                        throw err
                                    }
                                    res.render('post', { results, resu, req, resul, resUsers })
                                })
                            })
                        }else {
                            pool.query('SELECT * FROM categoria', (err, resul) => {
                                if(err){
                                    throw err
                                }

                                pool.query('SELECT * FROM users', (err, resUsers) => {
                                    if(err){
                                        throw err
                                    }

                                    res.render('post', {results, resu:0, req, resul, resUsers})
                                })
                            })
                        }
                    }
                })
            }
        }
    })
})

router.post('/posts/:id', checkNotAunthenticated, (req,res) => {
    if(req.isAuthenticated()){
        const {description} = req.body
        const {id} = req.user
        console.log(req.params.id)
        pool.query(`INSERT INTO comentarios(descripcion, fechapublicacion, codigoestudiante, idpost) VALUES('${description}', '${date2}', ${id}, ${req.params.id})`, (err, results) => {
            if(err){
                throw err
            }else {
                res.redirect(`/posts/${req.params.id}`)
            }
        })
    }else {
        res.redirect('/')
    }
})


router.post('/users/register', async (req, res) => {
    let { id, name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    })

    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: 'Por favor ingresa todos los campos' })
    }

    if (password.length < 6) {
        errors.push({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    if (password != password2) {
        errors.push({ message: 'Las contraseñas no coinciden' })
    }

    if (errors.length > 0) {
        res.render('register', { req, errors })
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results) => {
            if (err) {
                throw err
            }
            console.log(results.rows)
            if (results.rows.length > 0) {
                errors.push({ message: "Ese email ya se encuentra registrado" })
                res.render('register', { req, errors })
            } else {
                pool.query(
                    `INSERT INTO users (id, name,email,password)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id, password`, [id, name, email, hashedPassword], (err, result) => {
                    if (err) {
                        throw err
                    }
                    console.log(result.rows)
                    req.flash('succes_msg', 'Ya te registraste. Por favor inicia sesión')
                    res.redirect('/users/login')
                }
                )
            }
        }
        )
    }
})

router.post('/users/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}))


router.get('/users/logout', (req,res) => {
    req.logout();
    res.redirect('/');
})

function checkAunthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

function checkNotAunthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/users/login')
}

module.exports = router