const AccountsProvider = require('./models/model.accountsProvider.js');


//ADDING PROVIDERS TO DB
exports.create('/accountsProvider', (req, res) => {
    let accountsProviderToCreate = new AccountsProvider(
        {
            companyID: req.body.companyID,
            url: req.body.url,
            companyName: req.body.companyName,
            companyAddress: req.body.companyAddress,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
    );
    accountsProviderToCreate.save((err, AccountsProvider) => {
        if (err) {
            res.send(err);
        }
        res.json(AccountsProvider);
    });

});


//GETTING USERS FROM DB
exports.getAll('/accountsUserList', (req, res) => {
    AccountsProvider.find({}, (err, AccountsUsers) => {
        if (err) {
            res.send(err);
        }
        res.json({ AccountsUsers: AccountsUsers });
    });

});

//Getting company accounts by ID
exports.getById = (req, res) => {
    AccountsProvider.findById(req.params.companyID, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
}



