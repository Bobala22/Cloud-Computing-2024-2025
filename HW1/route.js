const http = require('http');

module.exports = http.createServer((req, res) => {
    var userOps = require('./controller.js');

    /* ----------------- GET ----------------- */
    if(req.url == '/users' && req.method === 'GET') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.getUsers(req, res);
    }

    if(req.url.match(/^\/users\/\d+$/) && req.method === 'GET') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.getUserById(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts$/) && req.method === 'GET') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.getPostsByUserId(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+$/) && req.method === 'GET') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.getPostById(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+\/comments$/) && req.method === 'GET') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.getCommsByPostId(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+\/comments\/\d+$/) && req.method === 'GET') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.getCommById(req, res);
    }

    /* ----------------- POST ----------------- */
    if(req.url == '/users' && req.method === 'POST') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.createUser(req, res);
    }

    if(req.url.match(/^\/users\/\d+$/) && req.method === 'POST') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.createUserById(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts$/) && req.method === 'POST') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.createPost(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+$/) && req.method === 'POST') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.createPostById(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+\/comments$/) && req.method === 'POST') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.createComm(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+\/comments\/\d+$/) && req.method === 'POST') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.createCommById(req, res);
    }

    /* ----------------- PUT ----------------- */
    if(req.url == '/users' && req.method === 'PUT') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.updateUsers(req, res);
    }

    if(req.url.match(/^\/users\/\d+$/) && req.method === 'PUT') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.updateUser(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts$/) && req.method === 'PUT') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.updatePosts(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+$/) && req.method === 'PUT') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.updatePost(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+\/comments$/) && req.method === 'PUT') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.updateComms(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+\/comments\/\d+$/) && req.method === 'PUT') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.updateComm(req, res);
    }

    /* ----------------- DELETE ----------------- */
    if(req.url == '/users' && req.method === 'DELETE') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.deleteUsers(req, res);
    }

    if(req.url.match(/^\/users\/\d+$/) && req.method === 'DELETE') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.deleteUser(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts$/) && req.method === 'DELETE') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.deletePosts(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+$/) && req.method === 'DELETE') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.deletePost(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+\/comments$/) && req.method === 'DELETE') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.deleteComms(req, res);
    }

    if(req.url.match(/^\/users\/\d+\/posts\/\d+\/comments\/\d+$/) && req.method === 'DELETE') {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        userOps.deleteComm(req, res);
    }
});


