class UserModel{
    
    constructor(dbObject){
        this.databaseObj = dbObject;
    }
    
    executeQuery(sql, callback){
        this.databaseObj.query(sql,function(err, result){
            if(err){
                return callback(err);
            }
            return callback(null, result);
        });
    }
    
    executeQueryModify(sql, data, callback){
        this.databaseObj.query(sql, data, function(err, result){
            if(err){
                return callback(err);
            }
            return callback(null, result);
        });
    }
}

module.exports = UserModel;