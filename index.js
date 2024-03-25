const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();
const conn = require('./db/conn');

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.static('public'))

app.use(express.json())

//controller
const ThoughtController = require('./controllers/ThoughtController')

//models

const Thoughts = require('./models/Thoughts');
const User = require('./models/User');

//routes
const thoughtsRoutes = require('./routes/thoughtsRoutes')
const authRoutes = require('./routes/authRoutes')


// session middleware

app.use(
    session({
        name: 'session',
        secret: 'our_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: ({
            secure: false,
            maxAge: 36000000,
            expires: new Date(Date.now() + 36000000),
            httpOnly: true
        })
    })
)

// flash messages

app.use(flash())

// set session to res

app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }
    next();
})

app.use('/thoughts', thoughtsRoutes)
app.use('/', authRoutes)
app.get('/' , ThoughtController.showAllThoughts)

conn.sync().then(() => {
    app.listen(3000);
}).catch((err) => console.log(err))