/**
 * Created by rsalesc on 15/07/16.
 */
require('../db')
var User = require('../models/User')();

console.log("Creating root/root user.\n" +
  "Make sure you change its password before going into production");

new User({
    handle: "root",
    name: "Root",
    password: "root",
    email: "root@root.com"
}).save((err) => {
    if(err) return console.log(err)
    console.log("root/root user created. You can now login and change its password\n"
      + "Make sure you never delete it. Otherwise, you will have you run this script again");
});