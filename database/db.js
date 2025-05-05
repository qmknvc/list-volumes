import createMysql from 'mysql2-promise';
const db = createMysql();
db.configure({
    host: 'localhost',
    user: 'root',
    password: 'alem',
    database: 'usb_app'
});
const saveToDB = async (user_email, user_phone) => {
    try {
        await db.query('INSERT INTO users (user_email, user_phone) VALUES (?, ?)', [user_email, user_phone]);
      } catch (error) {
        console.error('Error saving data:', error);
      } 
}

export { saveToDB };