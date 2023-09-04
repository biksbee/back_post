import Router from 'express'
import {createPost, getPostByUser, deletePostByUser, updatePost, getPostAll, getPostByTitle, getPostByTags} from "../controller/post.controller.js";
import { checkAuth, checkAuthCurrentUser} from "../utils/checkAuth.js";

export const postRouter = new Router()

//создание статьи, только авторизированный пользователь
postRouter.post('/post', checkAuth, createPost)
// получение всех статей по конкретному пользователю (ник), если запрос был сделан создателем статей, то показывать всю информацию о создателе иначе, только ник и почту создателя
postRouter.post('/post/by_user', getPostByUser)
//получение однйо конкретной статьи по названию
postRouter.post('/post/by_title', getPostByTitle)
// получение всех статей из базы данных (для всех пользователей)
postRouter.post('/post/by_tags', getPostByTags)
postRouter.get('/post/all', getPostAll)
// обновление статьи после авторизации, обновлять можно только свои статьи
postRouter.put('/post', checkAuthCurrentUser, updatePost)
// удалять может только авторизированный пользователь и только свои статье
postRouter.delete('/post/:id', checkAuth, deletePostByUser)


