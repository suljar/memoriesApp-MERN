import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import PostMessage from '../models/postMessage.js'

export const getPosts = asyncHandler(async (req, res) => {
  const postMessages = await PostMessage.find()
  res.json(postMessages)
})

export const createPost = asyncHandler(async (req, res) => {
  const post = req.body
  const newPost = await new PostMessage(post)
  try {
    await newPost.save()
    res.status(201).json(newPost)
  } catch (e) {
    res.status(409).json({ msg: e.message })
  }
})

export const updatePost = asyncHandler(async (req, res) => {
  const id = req.params.id

  const post = req.body
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('No Post found')

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { ...post, _id: id },
    {
      new: true,
    }
  )
  res.json(updatedPost)
})

export const deletePost = asyncHandler(async (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send('No Post found')

  await PostMessage.findByIdAndRemove(id)
  res.json({ message: 'Post deleted successfully.' })
})
export const likePost = async (req, res) => {
  const { id } = req.params

  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' })
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`)

  const post = await PostMessage.findById(id)

  const index = post.likes.findIndex((id) => id === String(req.userId))

  if (index === -1) {
    post.likes.push(req.userId)
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId))
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  })
  res.status(200).json(updatedPost)
}
