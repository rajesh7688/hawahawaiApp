const mysql = require('mysql2');
const database = require('./database.js');


const createRestApi = app => {
    // customer detailss

    app.post('/', async (request, response) => {
        const customer = {
            name: request.body.name,
            email: request.body.email,
            member: request.body.member,
            amount: request.body.amount,
            totalAmount: request.body.totalAmount,
            date: request.body.date
        };

        const connection = await database.createConnection();

        try {
            const result = await connection.query(`
            INSERT INTO customers (name, email, member, amount, totalAmount, date)
            VALUES (${mysql.escape(customer.name)}, ${mysql.escape(customer.email)}, ${mysql.escape(customer.member)}, ${mysql.escape(customer.amount)}, ${mysql.escape(customer.totalAmount)}, ${mysql.escape(customer.date)})
          `);
            response.send('Customer details submitted successfully.');
        } catch (e) {
            console.error(e);
            response.json({ result: 'ERROR', message: 'Failed to insert customer details.' });
        } finally {
            await connection.end();
        }

    });


    // getting customer data from database
    app.get('/getData', async (request, response) => {
        const connection = await database.createConnection();
        
    
        try {
            const result = await connection.query('SELECT * FROM customers ORDER BY id DESC');
            const formData = result.sort((a, b) => b - a);
            
            let html = '<html><body><table>';
            html += '<head>'
            html += '<style>'
            html += 'table {';
            html += '  border-collapse: collapse;';
            html += '  width: 100%;';
            html += '}';

            html += 'th, td {';
            html += '  padding: 8px;';
            html += '  text-align: left;';
            html += '  border-bottom: 1px solid #ddd;';
            html += '}';

            html += 'th {';
            html += '  background-color: #f2f2f2;';
            html += '}';

            html += '</style></head><body><table>'

            html += '<thead><tr>';
            html += '<th>Name</th>';
            html += '<th>Number</th>';
            html += '<th>Pex</th>';
            html += '<th>Amount</th>';
            html += '<th>Total Amount</th>';
            html += '<th>Date</th>';
            html += '<th>Delete</th>';
            html += '</tr></thead>';

            // Iterate over the formData and generate table rows
            for (const data of formData) {
                html += '<tr>';
                html += `<td>${data.name}</td>`;
                html += `<td>${data.email}</td>`;
                html += `<td>${data.member}</td>`;
                html += `<td>${data.amount}</td>`;
                html += `<td>${data.totalAmount}</td>`;
                html += `<td>${data.date}</td>`;
                html += `<td><button onclick="deleteCustomer(${data.id})" class="btn bg-danger">Delete</button></td>`;

                html += '</tr>';
            }

            html += '</table></body></html>';

            html += `
            <script>
              const deleteCustomer = async (customerId) => {
                try {
                  const response = await fetch('/deleteData/' + customerId, {
                    method: 'DELETE'
                  });
                  const result = await response.json();
                  console.log(result);
                  // Refresh the displayed data after deletion
                  showData();
                } catch (error) {
                  console.error('Failed to delete customer:', error);
                  // Handle error case here
                }
              };
            </script>
          </body>
        </html>
        `;

            response.send(html)
        } catch (error) {
            console.error('Failed to fetch form data:', error);
            response.status(500).json({ error: 'Failed to fetch form data' });
        } finally {
            await connection.end();
        }
    });

    // admin login
    app.post('/user/login', async (request, response) => {
        if (request.session.userId) {
            response.json({ result: 'ERROR', message: 'User already logged in.' });
        } else {
            const user = {
                username: request.body.username,
                password: request.body.password
            };
            const connection = await database.createConnection();
            try {
                const result = await connection.query(`
                    SELECT id 
                    FROM users 
                    WHERE 
                            username=${mysql.escape(user.username)}
                        AND password=${mysql.escape(user.password)}
                    LIMIT 1
                `);
                if (result.length > 0) {
                    const user = result[0];
                    request.session.userId = user.id;
                    response.json({ result: 'SUCCESS', userId: user.id });
                } else {
                    response.json({ result: 'ERROR', message: 'Indicated username or/and password are not correct.' });
                }
            } catch (e) {
                console.error(e);
                response.json({ result: 'ERROR', message: 'Request operation error.' });
            } finally {
                await connection.end();
            }
        }
    });

    // user register
    app.post('/register', async (request, response) => {

        const user = {
            name: request.body.name,
            username: request.body.username,
            password: request.body.password,
        };

        const connection = await database.createConnection();
        try {
            const result = await connection.query(`
            INSERT INTO users (name, username, password)
            VALUES (${mysql.escape(user.name)}, ${mysql.escape(user.username)}, ${mysql.escape(user.password)})
          `);
            response.json({ result: 'SUCCESS', message: 'Customer details inserted successfully.', alert: 'success' });
        } catch (e) {
            console.error(e);
            response.json({ result: 'ERROR', message: 'Failed to insert customer details.' });
        } finally {
            await connection.end();
        }

    });

    app.get('/user/logout', async (request, response) => {
        if (request.session.userId) {
            delete request.session.userId;
            response.json({ result: 'SUCCESS' });
        } else {
            response.json({ result: 'ERROR', message: 'User is not logged in.' });
        }
    });


    // Delete customer data
    app.delete('/deleteData/:id', async (request, response) => {
        const customerId = request.params.id;

        const connection = await database.createConnection();
        try {
            const result = await connection.query(`
        DELETE FROM customers WHERE id = ${mysql.escape(customerId)}
      `);
            if (result.affectedRows > 0) {
                response.json({ result: 'SUCCESS', message: 'Customer data deleted successfully.' });
            } else {
                response.json({ result: 'ERROR', message: 'Customer data not found.' });
            }
        } catch (e) {
            console.error(e);
            response.json({ result: 'ERROR', message: 'Failed to delete customer data.' });
        } finally {
            await connection.end();
        }
    });

};

module.exports = {
    createRestApi
};

