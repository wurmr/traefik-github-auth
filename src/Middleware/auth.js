const forceLogin = (req, res, next) => {
  const ALLOWED_USERS = process.env.ALLOWED_USERS

  if (ALLOWED_USERS.split(',').includes(req.user?.username)) {
    next()
  } else {
    res.status(401).send('KO')
    // res.redirect('/login')
  }
}

export { forceLogin }
