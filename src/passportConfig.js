const LocalStrategy = require('passport-local').Strategy;
const {pool} = require('./dbConfig')
const bcrypt = require('bcrypt');

const filtro = /@(\w+)/;

function initialize(passport){

const aunthenticateUser = (email, password, done) => {

    const filtrado = email.match(filtro);
    console.log(filtrado)

    if(filtrado[1] == 'inemjose'){
            pool.query(
            `SELECT * FROM users 
            WHERE email = $1`, [email], (err, result) => {
                if(err){
                    throw err
                }
                console.log(result.rows)

                if(result.rows.length > 0){
                    const user = result.rows[0];

                    bcrypt.compare(password, user.password, (err, isMatch) =>{
                        if(err){
                            throw err
                        }

                        if(isMatch) {
                            return done(null, user)
                        }else{
                            return done(null, false, {message: 'Password is not correct'})
                        }
                    })
                }else{
                    return done(null,false, {message: 'Email is not registered'})
                }
            }
        )
        } else {
            return done(null,false, {message: 'Email not supported (@inemjose)'})
        }
            
}



    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password'
            }, 
            aunthenticateUser
        )
    )

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        pool.query(
            `SELECT * FROM users 
            WHERE id = $1`, [id], (err, result) => {
                if(err){
                    throw err
                }
                return done(null, result.rows[0])
            }
        )
    })
}

module.exports = initialize