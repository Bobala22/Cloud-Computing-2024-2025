# List of requests for the first homework

1. Get
- http://127.0.0.1:3000/users => all users
- http://127.0.0.1:3000/users/1 => user with id 1
- http://127.0.0.1:3000/users/1/posts => all posts of user with id 1
- http://127.0.0.1:3000/users/1/posts/3 => post with id 2 of user with id 1
- http://127.0.0.1:3000/users/1/posts/3/comments => all comments of the post with id 2 of user with id 1
- http://127.0.0.1:3000/users/1/posts/3/comments/3 => comment with id 3 of the post with id 2 of user with id 1
obs.: if user not found => error
if post not found => error
if comment not found => error

2. Post
- http://127.0.0.1:3000/users/ with body: 
```json
{
    "name": "John",
    "email": "john@gmail.com"
}
```
- http://127.0.0.1:3000/users/{id} with anything in body => error
- http://localhost:3000/users/1/posts with body:
```json
{
    "title": "Italy!",
    "content": "The trip to Venice was absolutely amazing! #IloveItaly"
}
```
obs.: if the user is not found => error ex.: 
- http://localhost:3000/users/1/posts/{id} with anything in body => error
- http://localhost:3000/users/1/posts/1/comments with body: http://localhost:3000/users/9/posts
```json
{ 
    "content": "In Iasi is a beautiful Spring!"
}
```
- http://localhost:3000/users/1/posts/1/comments/{id} with anything in body => error
obs.: if the post is not found => error ex.: http://localhost:3000/users/1/posts/9/comments

3. Put
- http://localhost:3000/users => error
- http://localhost:3000/users/1 with body:
```json
{
    "name": "Ana",
    "email": "ana@gmail.com"
}
```
- http://localhost:3000/users/1/posts => error
- http://localhost:3000/users/1/posts/1 with body:
```json
{
    "title": "Win!",
    "content": "Barcelona won at home with 3-0!"
}
```
- http://localhost:3000/users/1/posts/1/comments => error
- http://localhost:3000/users/1/posts/1/comments/4 with body:
```json
{
    "content": "Horay! We are going in Champions League!"
}
```
obs.: for a user, post or comm not existing => error 404
obs.: for no useful body => no content
obs.: only the fileds provided are updated

4. Delete
obs.: if we delete a user, we delete all his/hers posts
if we delete a post, we delete all its comments
- http://localhost:3000/users => error
- http://localhost:3000/users/6 => deletes user with id = 6 and all it's posts + comments
- http://localhost:3000/users/6/posts => error
- http://localhost:3000/users/6/posts/7 => delets the post with id 7 from user with id 6 and all the post's comments
- http://localhost:3000/users/6/posts/7/comments => error
- http://localhost:3000/users/6/posts/7/comments/8 => delets the comments with id 8 from the post with id 7 of the user with id 6



