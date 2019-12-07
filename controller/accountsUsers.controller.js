const AccountsUsers = require('../models/model.accountsUsers.js');

module.exports.create = (req, res) => {
    const accountsUsersToCreate = new AccountsUsers(
        {
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            address: req.body.address,
            age: req.body.age,
            email: req.body.email,
            contactnumber: req.body.contactnumber,
            username: req.body.username,
            password: req.body.password
        });

    accountsUsersToCreate.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error!"
            });
        });

}

module.exports.AllUsers = (req, res) => {
    AccountsUsers.findOne(req.body, (err, user) => {
        if (err) {
            res.json(err)
        } else if (user != null) {
            res.json(user)
        }
        // req.checkbody('password', 'Password do not match').equals(req.body.password);
    })
}


exports.getById = (req, res) => {
    AccountsUsers.findById(req.params.accountsUsersID, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
}

exports.login = (username, password, res) =>{
    AccountsUsers.findOne({username: username}, (err, dbres)=>{
        if(err){
            return res.send(err)
        }else{
            if (dbres != null){
                if (password == dbres.password){
                    res.send({
                        status: true,
                        data: dbres,
                        sms: "Login successfully"
                    })
                }else{
                    res.send({
                        status: false,
                        data: null,
                        sms: "Wrong password"
                    })
                }
            }else{
                res.send({
                    status: false,
                    data: null,
                    sms: "Username Not Found"
                })
            }
        }
    })
}

