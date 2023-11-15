const passport = require("passport");
const logger = require("@utils/logger")(module);
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const jwtStrategy = (settings) => {
    const options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.AUTH_KEY || "averysecretkey",
        issuer: "accounts.examplesoft.com",
        audience: "yoursite.net",
    };

    return new JwtStrategy(options, function (jwt_payload, done) {
        User.findOne({ id: jwt_payload.sub }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    });
};

module.exports = {
    local: jwtStrategy,
};
