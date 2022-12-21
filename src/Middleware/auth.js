const forceLogin = (req, res, next) => {
  const ALLOWED_USERS = process.env.ALLOWED_USERS

  if (!req.user) {
    res.redirect('/login')
  } else if (ALLOWED_USERS.split(',').includes(req.user?.username)) {
    next()
  } else {
    res.status(401).send('KO')
  }
}

export { forceLogin }
