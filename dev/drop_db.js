console.log("Dropping the current database...");
mongoose.connection.db.dropDatabase();
console.log("Database was dropped.");