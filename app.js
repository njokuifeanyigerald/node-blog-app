const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')

// to overide the POST method to PUT when editing
const methodOverride = require('method-override')  

const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose =require('mongoose')



// load config
dotenv.config({path: './config/config.env'})
// conect database
connectDB()

// passport config
require('./config/passport')(passport)

// call app
const app = express()


// morgan for logging it shows status code
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Body Parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())


// method overide
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
)

// handlerbars helpers
const {formatDate, stripTags, truncate, editIcon,select} = require('./helpers/hbs')

// handlebars
app.engine('.hbs', exphbs({helpers: {
    formatDate,
    stripTags,
    editIcon,
    truncate,
    select
    },
    defaultLayout: "main",extname: '.hbs'}));
    app.set('view engine', '.hbs');

// session, make sure its above the passport middleware
app.use(session({
    secret: 'keyboard ct',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
    // cookie: { secure: true } requires https
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// set global var
app.use((req,res,next) => {
    res.locals.user = req.user || null
    next()
})

// route
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/newStory'))

// static
app.use(express.static(path.join(__dirname, 'public')))

// port
const PORT = process.env.PORT || 5000

app.listen(PORT,console.log(`running in ${process.env.NODE_ENV} mode on port ${PORT}`))