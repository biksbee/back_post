import {db} from "../db.js";

export const createPost = async (req, res) => {
    try{
        const {title, content, tags} = req.body
        const now = new Date();
        const newPost = await db.query(`INSERT INTO post (title, content, date_change, user_id) values ($1, $2, $3, $4) RETURNING *`, [title, content, now, req.userId])
        res.json(newPost.rows[0])
    } catch (err){
        console.log(err)
        res.statusCode.json({
            message: "Failed to create post!"
        })
    }//

    }
export const getPostByUser = async (req, res) => {
    try {
        const { nick } = req.body
        const posts = await db.query(`select * from post where user_id = (select id from person where nick = $1)`, [nick])
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        if (token) {
            try {
                const user = await db.query(`select email from person where nick = $1`, [nick])
                const { email } = user.rows[0]
                res.json({
                    ...posts.rows,
                    nick,
                    email
                })
            } catch (err) {
                console.log(err)
                res.statusCode.json({
                    message: "Failed to view posts!"
                })
            }
        } else {
            const length = posts.rows.length
            res.json({
                length,
                nick,
            })
        }
    } catch (err){
        console.log(err)
        res.statusCode.json({
            message: "Failed to get post!"
        })
    }
}
export const getPostByTitle = async (req, res) => {
    const { title } = req.body;
    const titles = await db.query(`select * from post`)
    const result = titles.rows.filter(item => item.title.startsWith(title))
    const id = result[0].user_id
    const nick = await db.query(`select nick from person where id = $1`, [id])
    const nick_user = nick.rows[0]
    res.json({
        result,
        nick_user
    })
}

export const getPostByTags = async (req, res) => {
    const { tags } = req.body
    const posts = []
    await tags.forEach(element => {
        posts.push(db.query(`select * from post where $1 = any(tags)`, [element]))
    })
    // const posts = await db.query(`select * from post where 'test2' = any(tags)`)
    console.log(posts.rows)
    res.json({
        success: true
    })
}//
export const getPostAll = async (req, res) => {
        const posts = await db.query(`SELECT * FROM post`)
        res.json(posts.rows)
    }
export const updatePost = async (req, res) => {
        const { id, title, content, tags } = req.body
        const now = new Date();
        const updatePost = await db.query(`UPDATE post set title = $1, content = $2, date_change = $3, tags = $4 where id = $5 RETURNING *`, [title, content, now, tags, id])
        res.json(updatePost.rows[0])
    }
export const deletePostByUser = async (req, res) => {
        const id = req.params.id
        const post = await db.query(`DELETE FROM post where id = $1`, [id])
        res.json(post.rows[0])
    }
