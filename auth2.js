const mongoose = require('mongoose');
const models = require('./models/');
const crypto = require("crypto");

const Schema = mongoose.Schema;

const getTokenModel = (db) => {
    let TokenSchema = new Schema({
        _id: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        expiresAt: { type: Date, required: true },
        roles: [{ type: String }]
    });

    return db.models.Token
        ? db.model("Token")
        : db.model("Token", TokenSchema);
};

const getAuthorizationToken = (req) => {
    let authorizationToken = req.get("Authorization")
                ? req.get("Authorization").split(" ").pop()
                : null;

    if(!authorizationToken && req.cookies.token)
        authorizationToken = req.cookies.token;
    return authorizationToken;
};

module.exports = {
    initialize: (opts = {}) => (req, res, next) => {
        if(!opts.db)
            return next(new Error("mongoose db must be provided to Auth2"));
        if(!opts.age)
            opts.age = 60 * 60;
        if(!opts.secret)
            opts.secret = "";
        if(!opts.model)
            return next(new Error("model must be provided to Auth2"));
        if(!opts.id)
            opts.id = "_id";
        if(!opts.usernameField)
            opts.usernameField = "username";
        if(!opts.passwordField)
            opts.passwordField = "password";
        if(!opts.usernameSchema)
            opts.usernameSchema = "username";
        if(!opts.passwordSchema)
            opts.passwordSchema = "password";

        req.getUsername = () => req.body[opts.usernameField];
        req.getPassword = () => req.body[opts.passwordField];

        if(!opts.requiredFieldsFn)
            opts.requiredFieldsFn = (model, req) => {
                return req.getUsername() && req.getPassword();
            };

        if(!opts.filterFn)
            opts.filterFn = (model, req) => {
                let qs = {};
                qs[opts.usernameSchema] = req.getUsername();
                return qs;
            };

        if(!opts.queryFn)
            opts.queryFn = (model, req, resolve, reject) => {
                model.findOne(opts.filterFn(model, req), (err, user) => {
                    if(err)
                        return reject(err);

                    resolve(user);
                });
            };

        if(!opts.passwordFn)
            opts.passwordFn = (user, req) => user[opts.passwordSchema] == req.getPassword();
        if(!opts.roleFn)
            opts.roleFn = (user) => [];

        req.auth2 = { opts };
        next();
    },
    authenticate: (roles = [], success, failure) => (req, res, next) => {
        if(!Array.isArray(roles))
            roles = [roles];

        if(!req.auth2 || !req.auth2.opts)
            return failure
                ? failure(req, res, next, { code: 500, message: "invalid auth2 footprint"  })
                : res.status(500).json({ error: "invalid auth2 footprint"});
        
        const opts = req.auth2.opts;
        const User = opts.model;

        if(!opts.requiredFieldsFn(User, req))
            return !failure
                ? res.status(401).json({ error: "unauthorized" })
                : failure(req, res, next, { code: 401, message: "unauthorized" });

        opts.queryFn(User, req, (user) => {
            if(!user || !opts.passwordFn(user, req))
                return !failure
                ? res.status(401).json({ error: "unauthorized" })
                : failure(req, res, next, { code: 401, message: "unauthorized" });

            const matchedRoles = roles.filter((role) => opts.roleFn(user).indexOf(role) !== -1);

            if(roles.length > 0 && matchedRoles.length === 0)
                return !failure
                ? res.status(401).json({ error: "unauthorized" })
                : failure(req, res, next, { code: 401, message: "unauthorized" });

            const randomToken = crypto.randomBytes(20).toString("hex");
            const session = {
                _id: randomToken,
                user: user.toObject()[opts.id],
                expiresAt: new Date(Date.now() + opts.age * 1000),
                roles: matchedRoles
            };

            const Token = getTokenModel(opts.db);
            let tokenObject = new Token(session);
            tokenObject.save((err) => {
                if(err)
                    return next(err);
                
                res.cookie("token", randomToken, { maxAge: opts.age * 1000, httpOnly: true });
                req.auth2 = Object.assign({}, req.auth2, session, { user });
                return success
                    ? success(req, res, next)
                    : res.json({ token: session._id });
            });
        }, next);
    },
    isAuth: (roles = []) => (req, res, next) => {
        if(!Array.isArray(roles))
            roles = [roles];

        if(!req.auth2 || !req.auth2.opts)
            return res.status(500).json({ error: "invalid auth2 footprint"});

        const authorizationToken = getAuthorizationToken(req);

        if(!authorizationToken)
            return res.status(401).json({ error: "unauthorized" });

        const { opts } = req.auth2;
        const User = opts.model;
        const Token = getTokenModel(opts.db);

        Token.findOne({ _id: authorizationToken }, (err, token) => {
            if(err) {
                return next(err);
            }
            if(!token || new Date() > token.expiresAt) {
                res.clearCookie("token");
                if(token) 
                    token.remove();
                return res.status(401).json({ error: "unauthorized" });
            }
            
            // check if user really exists and retrieve its role array again
            let qs = {};
            qs[opts.id] = token.user;
            
            User.findOne(qs, (err, user) => {
                if(err)
                    return next(err);
                if(!user)
                    return res.status(401).json({ error: "unauthorized" });

                // console.log(opts.roleFn(user), token.roles);
                const matchedRoles = roles.filter(role => opts.roleFn(user).indexOf(role) !== -1);
                if(roles.length > 0 && matchedRoles.length === 0)
                    return res.status(403).json({ error: "no privilege" });

                const registeredRoles = matchedRoles.filter(role => token.roles.indexOf(role) !== -1);
                if(token.roles.length > 0 && registeredRoles.length === 0)
                    return res.status(401).json({ error: "unauthorized" });
                
                token.expiresAt = new Date(Date.now() + opts.age * 1000);
                token.save((err) => {
                    if(err)
                        return next(err);
                    res.cookie("token", authorizationToken, { maxAge: opts.age * 1000, httpOnly: true });
                    req.auth2 = Object.assign({}, req.auth2, token.toObject(), { user, token: authorizationToken });
                    next();
                });
            });
        });
    },
    possiblyAuth: (roles = []) => (req, res, next) => {
        if(!Array.isArray(roles))
            roles = [roles];

        if(!req.auth2 || !req.auth2.opts)
            return res.status(500).json({ error: "invalid auth2 footprint"});

        const authorizationToken = getAuthorizationToken(req);

        if(!authorizationToken)
            return next();

        const { opts } = req.auth2;
        const User = opts.model;
        const Token = getTokenModel(opts.db);

        Token.findOne({ _id: authorizationToken }, (err, token) => {
            if(err) {
                return next();
            }
            if(!token || new Date() > token.expiresAt) {
                res.clearCookie("token");
                if(token) 
                    token.remove();
                return next();
            }
            
            // check if user really exists and retrieve its role array again
            let qs = {};
            qs[opts.id] = token.user;
            
            User.findOne(qs, (err, user) => {
                if(err)
                    return next();
                if(!user)
                    return next();

                const matchedRoles = roles.filter(role => opts.roleFn(user).indexOf(role) !== -1);
                if(roles.length > 0 && matchedRoles.length === 0)
                    return next();

                const registeredRoles = matchedRoles.filter(role => token.roles.indexOf(role) !== -1);
                if(token.roles.length > 0 && registeredRoles.length === 0)
                    return next();
                
                token.expiresAt = new Date(Date.now() + opts.age * 1000);
                token.save((err) => {
                    if(err)
                        return next(err);
                    res.cookie("token", authorizationToken, { maxAge: opts.age * 1000, httpOnly: true });
                    req.auth2 = Object.assign({}, req.auth2, token.toObject(), { user, token: authorizationToken });
                    next();
                });
            });
        });
    },
    dispose: (redirect) => (req, res, next) => {
        if(!req.auth2 || !req.auth2.opts)
            return res.status(500).json({ error: "invalid auth2 footprint" });

        const authorizationToken = getAuthorizationToken(req);
        
        if(!authorizationToken)
            return redirect
             ? redirect(req, res, next)
             : res.sendStatus(200);

        const { opts } = req.auth2;
        
        const Token = getTokenModel(opts.db);
        Token.findOneAndRemove({ _id: req.auth2.token }, (err) => {
            if(err)
                next(err);
            
            req.auth2 = { opts: req.auth2.opts };
            res.clearCookie("token");
            
            return redirect
             ? redirect(req, res, next)
             : res.sendStatus(200);
        });
    }
};
