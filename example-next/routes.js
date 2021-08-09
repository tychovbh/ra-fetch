import {Router} from 'ra-fetch'

Router.api('placeholder', 'https://jsonplaceholder.typicode.com')
    .index('posts', '/posts')
    .store('posts', '/posts', {form_data: true})


Router.api('sanctum', 'http://127.0.0.1:8000')
    .store('categories', '/api/categories', {form_data: true})
