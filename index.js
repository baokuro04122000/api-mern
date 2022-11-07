require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk')
const ejs = require('ejs')
const session = require('express-session')
const passport = require('passport')

const mongoString = process.env.DATABASE_URL;
const PORT = 5000;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

paypal.configure({
  'mode': 'sandbox',
  'client_id': process.env.CLIENT_ID,
  'client_secret': process.env.CLIENT_SECRET,
})

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('index'))

app.get('/auth', (req, res) => res.render('auth')) 

app.get('/success', (req, res) => {
 console.log('==', userProfile)
  res.render('home', {user: userProfile});
});

app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_HOST}/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('==', accessToken)
    userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });


const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const authRoutes = require('./routes/auth.routes');
const paymentRoutes = require('./routes/payment.routes');
const organizerRoute = require('./routes/organizer.routes');

app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api', authRoutes);
app.use('/api', paymentRoutes);
app.use('/api', organizerRoute);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
