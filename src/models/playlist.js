const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    owner : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    poster : {
        type : String
    },
    list : [{
        url : {
            type : String,
            required : true
        },
        title : {
            type : String,
            required : true
        },
        description : {
            type : String
        },
        thumbnail : {
            type : String,
            required : true
        },
        channel : {
            type : String
        }
    }]
})

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist