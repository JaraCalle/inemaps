const { Router } = require("express");
const router = Router()
const passport = require('passport')
const initializePassport = require('../passportConfig')

const { pool } = require('../dbConfig')
const bcrypt = require('bcrypt')
const today = new Date();

const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

initializePassport(passport)

router.get('/', (req, res) => {
    res.render('index', {req})
})

router.get('/users/register', checkAunthenticated, (req, res) => {
    res.render('register', {req})
})

router.get('/users/login', checkAunthenticated, (req, res) => {
    res.render('login', {req})
})

router.get('/users/dashboard', checkNotAunthenticated, (req, res) => {
    res.render('dashboard', { user: req.user.name })
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
    res.render('bloques');
})


router.get('/posts', (req, res) => {
    pool.query('SELECT * FROM posts', (err, results) => {
        if (err) {
            throw err
        }
        //console.log(results.rows)
        res.render('posts', {results})
    })
})

router.get('/crear/post', (req, res) => {
    res.render('createPosts');
})

router.post('/crear/post', (req, res) => {
    const { id } = req.user
    const { description, categoria } = req.body
    if (req.isAuthenticated()) {
        pool.query(`INSERT INTO posts(fechapublicacion, descripcion, categoria, codigoestudiante) VALUES ('${date}', '${description}', '${categoria}', ${id})`, (err, results) => {
            if (err) {
                throw err
            }
            else {
                req.flash('succes_msg', 'Post added')
                res.redirect('/posts')
            }
        });
    } else {
        res.send('received')
    }

})

router.get('/crear/comentario/:id', (req,res) => {
    if(req.isAuthenticated()){
        
        res.render('createComentario', {req})
    }else {
        res.redirect('/posts/:id')
    }
})

router.post('/crear/comentario/:id', (req,res) => {
    if(req.isAuthenticated()){
        const {description} = req.body
        const {id} = req.user
        console.log(req.params.id)
        pool.query(`INSERT INTO comentarios(descripcion, fechapublicacion, codigoestudiante, idpost) VALUES('${description}', '${date}', ${id}, ${req.params.id})`, (err, results) => {
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
                            res.render('post', { results, resu, req })
                        }else {
                            res.render('post', {results, resu:0, req})
                        }
                    }
                })
            }
        }
    })
})

router.post('/users/register', async (req, res) => {
    let { name, email, password, password2 } = req.body;
    console.log({
        name,
        email,
        password,
        password2
    })

    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: 'Please enter all fields' })
    }

    if (password.length < 6) {
        errors.push({ message: 'Password should be at leats 6 characters' })
    }

    if (password != password2) {
        errors.push({ message: 'Passwords do not match' })
    }

    if (errors.length > 0) {
        res.render('register', { errors })
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
                errors.push({ message: "Email already registered" })
                res.render('register', { errors })
            } else {
                pool.query(
                    `INSERT INTO users (name,email,password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`, [name, email, hashedPassword], (err, result) => {
                    if (err) {
                        throw err
                    }
                    console.log(result.rows)
                    req.flash('succes_msg', 'You are now registered. Please log in')
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