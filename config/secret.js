


module.exports=
{
  database:'mongodb://localhost:27017/voidstorm',
  port:8080,
  secretKey: 'abc123',
  facebook:{
    clientID:'2072141753038929',     //(vidhya)
     //clientID:'303567557066382',    //(umayal)
     //clientID: '253081112213937',    //vidhyaal
    clientSecret:'ce0e5679f9d6942e239a04d03907985b',      //(vidhya)
     //clientSecret:'33bee3e6cfeb8e409d23420dd7d07f61',    //(umayal)
     //clientSecret:'33222f8a24ae5ef7a933307b24f350b0',  //vidhyaal

    // clientID:'741819039488661',
     //clientSecret:'57527acd94c772929d96b17228cdad74',
     profileFields:['emails', 'displayName'],
     callbackURL:'http://localhost:8080/auth/facebook/callback',
     passReqToCallback:true
 },
 google:{
  clientID: "363862883803-m17aun0k8n0cn8hmegp0uhmhfcb10q3n.apps.googleusercontent.com",
  clientSecret: "p008k5S7XkM18nR7uY3h9N5t",
  callbackURL: "http://localhost:8080/auth/google/callback"
 }
}

// const url = 'mongodb://localhost:27017/example';
// const connect = mongoose.connect(url,{
//     useNewUrlParser: true
// });
// connect.then((db) => {

//     console.log('Connected correctly to server');
// });