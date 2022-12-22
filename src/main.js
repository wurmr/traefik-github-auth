import cookieSession from 'cookie-session'
import dotenv from 'dotenv'
import express from 'express'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { forceLogin } from './Middleware/auth.js'

if (process.env.NODE_ENV !== 'production') dotenv.config()

const clientID = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET
const callbackURL = process.env.CALL_BACK_URL
const port = process.env.PORT || 80

const app = express()

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(
  new GitHubStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile)
    }
  )
)

app.get('/auth/error', (req, res) => res.send('Unknown Error'))
app.set('trust proxy', true)

app.use(
  cookieSession({
    name: 'github-auth',
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.COOKIE_DOMAIN,
    maxAge: 60 * 60 * 1000,
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/login', passport.authenticate('github'))

app.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth/error',
  })
)

app.get('/', forceLogin, (req, res) => {
  res.send(`<p>OK</p><a href='/logout'>logout</a>`)
})

app.get('/logout', (req, res) => {
  req.session.destroy
  req.logout()
  res.send(`<p>Logged out</p><a href='/login'>login</a>`)
})

app.listen(port, () => console.log(`running on port ${port}!`))
