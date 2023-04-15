// Select the database to use.
use('mydata');
// db.coll2.find({'MAILADDRESS':{$exists:true}}).count();

// const x = db.coll2.aggregate({ $unset: ['MAILADDRESS', 'MAILCITY', 'MAILSTATE', 'MAILZIP'] })
// console.log(x);
// goals:

db.getCollection('coll2').aggregate([
    { $unset: ['MAILADDRESS', 'MAILCITY', 'MAILSTATE', 'MAILZIP'] },
    {$out:'coll3'}
]);

// db.coll2.find({'MAILADDRESS':{$exists:true}}).count();

// 1) test coll1
// 2) if it works run first 2 pipelines run and send it in