const axios = require('axios');

const url1 = 'https://api.hahow.in/api/users/me/boughtCourses';
const url2 = 'https://jsonplaceholder.typicode.com/todos/1';
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzU5MmZjNjc5ZjE5OTAwMjJkZmYxMjAiLCJpc3MiOiJNakF5TURBMiIsImlhdCI6MTU5MjM4Mjg0MywiZXhwIjoxNTk3NTY2ODQzfQ.xQeTqXOxH7dWJqiQj-hJCkfLDKG4Os6FivMeZgbiKao';

axios({
    method: "GET",
    url: url2,
    headers: {Authorization: `Bearer ${jwtToken}`},
})
    .then(response => {
        console.log(response.data)
    })
    .catch(error => {
        console.error(error.response)
    });