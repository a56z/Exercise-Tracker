const User = require('./models').User;
const Exercise = require('./models').Exercise;

exports.newUser = function (req, res, next) {
  if (req.body.username) {
    let user = new User({username: req.body.username});
    let query = { username: req.body.username }
    User.findOne(query, function (err, data) {
      if (err) next(err);
      if (data) {
        next({status: 400, message: 'username already exists'});
      } else {
        user.save(function (err, data) {
          if (err) next(err);
          res.json(data);
        });
      }
    })
  } else { next({status: 400, message: 'no username given'}) }
}

exports.users = function (req, res, next) {
  User.find(function (err, users) {
    if (err) next(err);
    res.json(users);
  });
}

exports.add = function (req, res, next) {
  if (req.body) {
    for (let prop in req.body) {
      if (prop !== 'date' && !req.body[prop]) {
        next({status: 400, message: 'missing ' + prop});
      }
    }

    User.findOne({"_id": req.body.userId}, function (err, data) {
      if (err) next(err);
      if (!data) next({status: 400, message: 'no correct user ID given'});
      
      let userName = data.username;      
      let exercise = new Exercise({
        user_id: req.body.userId,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date ? new Date(req.body.date) : Date.now()
      });
      exercise.save(function (err, data) {
        if (err) next(err);
        let newObj = data.toObject();
        newObj.username = userName
        res.json(newObj);
      });
    });
  } else { next({status: 400, message: 'no data given'}) }
}

exports.log = function (req, res, next) {
  if (req.query.userId) {   
    let dateFrom = req.query.from ? new Date(req.query.from) : new Date('1970-01-01');
    let dateTo = req.query.to ? new Date(req.query.to) : Date.now();
    let limitNum = req.query.limit ? Number(req.query.limit) : 0;
    let query = { user_id: req.query.userId, date: { $gte: dateFrom, $lte: dateTo } };
    
    Exercise.find(query).limit(limitNum).exec(function (err, data) {
      if (err) next(err);
      if (!data) {
        next({status: 400, message: 'no correct user ID given'});
      } else {
        res.json(data);
      }
    });
  }
}