import createMysql from 'mysql2-promise';
const db = createMysql();
db.configure({
    host: 'localhost',
    user: 'root',
    password: 'alem',
    database: 'usb_app'
});
const saveToDB = async (user_email, user_password, user_phone) => {
    try {
        await db.query('INSERT INTO users (user_email, user_phone) VALUES (?, ?)', [user_email, user_phone]);
      } catch (error) {
        console.error('Error saving data:', error);
      } 
}

const validateEmail = async (user_email) => {
  try {
      const [rows] = await db.query(
          'SELECT user_password FROM users WHERE user_email = ?',
          [user_email]
      );
      if (rows.length === 0) {
          return null;
      }
      return rows[0].user_password;
  } catch (error) {
      console.error('Error checking user credentials:', error);
      return null;
  }
}

export { saveToDB };