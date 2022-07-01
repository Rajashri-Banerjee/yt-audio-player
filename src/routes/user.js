const express = require('express')
const Playlist = require('../models/playlist')
const ytdl = require('ytdl-core')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const  userAuth = require('../middlewares/userAuth')

const router = express.Router()

router.get('/profile', async(req,res) => {
    const profile = {
        name : req.query.name
    }
    res.json({
        profile
    })
})

router.post('/playlist', userAuth, async(req,res) => {

    try {
        const playlist = new Playlist({
            title : req.body.title,
            poster : req.body.poster,
            owner : req.user._id
        })
    
        await playlist.save()
        
        const playlists = await Playlist.find({owner : req.user._id})

        res.json({
            playlists
        })   

    } catch (error) {
        res.json({
            status: 'failed',
            error: error.message
        })   
    }
})

router.get('/playlists', userAuth, async(req,res) => {
    const playlists = await Playlist.find({owner : req.user._id})
    
    res.json({
        playlists
    })
})

router.patch('/playlist', async(req,res) => {

    try {
        const playlist = await Playlist.findById(req.body.id)
        const info = await ytdl.getInfo(req.body.url)

        playlist.list = playlist.list.concat({
            url : req.body.url,
            title : info.videoDetails.title,
            description : info.videoDetails.description,
            thumbnail : info.videoDetails.thumbnails[info.videoDetails.thumbnails.length-1].url
        })

        await playlist.save()

        res.json({
            playlist
        })
    } catch (error) {
        res.json({
            status : 'failed',
            error : error.message
        })
    }
})

router.get('/playlist', async(req,res) => {

    const playlist = await Playlist.findById(req.query._id)

    res.json({
        playlist
    })
})

router.patch('/playlist-remove', async(req,res) => {

    const playlist = await Playlist.findOne({'list._id':req.body.id})
    if (!playlist) {
        return res.json({
            status : 'Failed',
            error : `This playlist can't be found`
        })
    }
    const filteredPlaylist = playlist.list.filter(item => {
        return item._id.toString() !== req.body.id.toString()
    })

    playlist.list = filteredPlaylist

    await playlist.save()

    res.json({
        playlist,
        status : 'success'
    })
})

router.get('/audioinfo',async(req,res)=> {
    let info = await ytdl.getInfo(req.query.url);
    let format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
    res.json({
        title : info.videoDetails.title,
        description : info.videoDetails.description,
        thumbnail : info.videoDetails.thumbnails[info.videoDetails.thumbnails.length-1].url,
        url : format.url,
        yt_url : req.query.url
    })
})

router.delete('/playlist', userAuth, async(req,res) => {
    try {
        if (!req.body.id){
            res.json({
                status: 'failed',
                error : 'Playlist ID is inaccurate'
            })
        }

        const pl = await Playlist.findById(req.body.id)
        if(!pl){
            return res.json({
                status : 'failed',
                error :   `This playlist doesn't exist or has been deleted`
            })
        }
        if(req.user._id.toString() !== pl.owner.toString()){
            return res.json({
                status : 'failed',
                error : `You don't have permission to delete this playlist`
            })
        }

        const playlist = await Playlist.findByIdAndDelete(req.body.id)
       
       res.json({
           playlist,
           status: 'Success!'
       })

    } catch (error) {
        res.json({
            status: 'failed',
            error: error.message
        })
    }
})

router.post('/signup', async(req,res) => {
    try {
        const user = new User ({
            fullname: req.body.fullname,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        })
        
        await user.save()

        res.json({
            user,
            status:'success'
        })

    } catch (error) {
        res.json({
            status: 'failed',
            error: error.message
        })
    }
})

router.post('/login', async(req,res) => {
    try {
        const user = await User.findOne({
            username : req.body.username,
        })
        if(!user){
            res.json({
                status : 'failed',
                error : 'Register first!'
            })
            return
        }
        if(user.password !== req.body.password){
            res.json({
                error: 'Incorrect password!'
            })
            return
        }
        
        const token = await jwt.sign({ _id : user._id }, 'SGDHEYRIUPQOWBNXZ')
        
        res.json({
            user,
            token
        })
    } catch (error) {
        res.json({
            status : 'failed',
            error: error.message
        }) 
    }
})

router.get('/me', userAuth, async(req,res) => {
    try {
        res.json({
            user : req.user
        })
    } catch (error) {
        res.json({
            status: 'failed',
            error: error.message
        })
    }
})

module.exports = router