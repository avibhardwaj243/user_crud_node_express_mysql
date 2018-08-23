const User = require('../models/user.model');

exports.index = function(req, res, next){
   req.getConnection(function(error, conn) {
       var searchWhere = ' 1 ';
       var searchName = '';
       var searchEmail = '';
       var searchAge = '';
       if(req.query.s1 != undefined && req.query.s1 != null){
            var searchName = req.query.s1;
            searchWhere += " AND name like '%"+searchName+"%'";
       }
       if(req.query.s2 != undefined && req.query.s2 != null){
            var searchAge = req.query.s2;
            searchWhere += " AND age = '"+searchAge+"'";
       }
       if(req.query.s3 != undefined && req.query.s3 != null){
            var searchEmail = req.query.s3;
            searchWhere += " AND email like '%"+searchEmail+"%'";
       }

        var orderBy = "DESC";
        var orderByColumn = "id";
        var orderByArg = "desc";
        if(req.params.type != undefined && req.params.type != null){
            if(req.params.type == "nme"){
               orderByColumn = "name";
            } else if(req.params.type == "ag"){
               orderByColumn = "age";
            } else if(req.params.type == "eml"){
               orderByColumn = "email";
            }
        }
        if(req.params.orderby != undefined && req.params.orderby != null){
            if(req.params.orderby == "desc"){
                orderBy = "DESC";
                orderByArg = "asc";
            } else if(req.params.orderby == "asc"){
                orderBy = "ASC";
                orderByArg = "desc";
            }
        }
        var query = 'SELECT * FROM users WHERE '+ searchWhere +' ORDER BY ' + orderByColumn + ' ' +orderBy;
        conn.query(query,function(err, rows, fields) {
            if (err) {
                //res.send({title: 'User List', message : 'Some Error Has occured : ' + err, data: ''});
                req.flash('error', err)
                res.render('user/list', {title: 'User List', data: ''});
            } else {
                //res.send({title: 'User List', data: rows, orderBY:orderByArg, s1:searchName, s2:searchAge, s3:searchEmail});
                res.render('user/list', {title: 'User List', data: rows, orderBY:orderByArg, s1:searchName, s2:searchAge, s3:searchEmail});
            }
        })
    });
};

// SHOW ADD USER FORM
exports.add_form = function(req, res, next){
    res.render('user/add', {title: 'Add New User', name: '', age: '', email: ''});
};

// ADD NEW USER POST ACTION
exports.user_add = function(req, res, next){
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!
        var user = {
            name: req.sanitize('name').escape().trim(),
            age: req.sanitize('age').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ?', user, function(err, result) {
                if (err) {
                    //res.send({title: 'User Add', message : 'Some Error Has occured : ' + err});
                    req.flash('error', err)
                    res.render('user/add', {
                        title: 'Add New User',
                        name: user.name,
                        age: user.age,
                        email: user.email
                    });
                } else {
                    //res.send({title: 'User Add', message : 'Data added successfully!'});
                    req.flash('success', 'Data added successfully!')
                    res.render('user/add', {
                        title: 'Add New User',
                        name: '',
                        age: '',
                        email: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })

        //res.send({title: 'User Add', message : 'Some Error Has occured : ' + error_msg});
        req.flash('error', error_msg)
        res.render('user/add', {
            title: 'Add New User',
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        })
    }
};

// SHOW EDIT USER FORM
exports.edit_form = function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err

            if (rows.length <= 0) {
                //res.send({title: 'View User', message : 'User not found with id = ' + req.params.id});
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/user')
            }
            else {
                res.render('user/edit', {
                    title: 'Edit User',
                    //data: rows[0],
                    id: rows[0].id,
                    name: rows[0].name,
                    age: rows[0].age,
                    email: rows[0].email
                });
                //res.send({title: 'View User', data : rows});
            }
        })
    })
};

// EDIT USER POST ACTION
exports.user_update = function(req, res, next){
    req.assert('name', 'Name is required').notEmpty()           //Validate name
    req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email

    var errors = req.validationErrors()

    if( !errors ) {
        var user = {
            name: req.sanitize('name').escape().trim(),
            age: req.sanitize('age').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                if (err) {
                    //res.send({title: 'Update User', message : 'Some Error has accoured ' + err});
                    req.flash('error', err);
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        name: req.body.name,
                        age: req.body.age,
                        email: req.body.email
                    });
                } else {
                    //res.send({title: 'Update User', message : 'Data updated successfully!'});
                    req.flash('success', 'Data updated successfully!');
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        name: req.body.name,
                        age: req.body.age,
                        email: req.body.email
                    });
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        });
        //res.send({title: 'Update User', message : 'Some Error has accoured ' + error_msg});
        req.flash('error', error_msg);
        res.render('user/edit', {
            title: 'Edit User',
            id: req.params.id,
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        });
    }
};

// DELETE USER
exports.user_delete = function(req, res, next){
    var user = { id: req.params.id }
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
            if (err) {
                //res.send({title: 'Delete User', message : 'Some Error has accoured ' + err});
                req.flash('error', err);
                res.redirect('/user');
            } else {
                //res.send({title: 'Delete User', message : 'User deleted successfully! id = ' + req.params.id});
                req.flash('success', 'User deleted successfully! id = ' + req.params.id);
                res.redirect('/user');
            }
        })
    })
};
