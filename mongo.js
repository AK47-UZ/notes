const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.error('Usage: node mongo.js <password>')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const hosts = [
  'ac-lxts4mc-shard-00-00.d5uwldz.mongodb.net:27017',
  'ac-lxts4mc-shard-00-01.d5uwldz.mongodb.net:27017',
  'ac-lxts4mc-shard-00-02.d5uwldz.mongodb.net:27017',
].join(',')
const url = `mongodb://admin:${password}@${hosts}/notesApp?authSource=admin&replicaSet=atlas-6izpz2-shard-0&tls=true&retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
const Note = mongoose.model('Note', noteSchema)

const saveNote = async () => {
  try {
    await mongoose.connect(url)
    console.log('Connected to MongoDB Atlas')

    const note = new Note({
      content: 'call-backs functions suck',
      important: true,
    })

  Note.find({}).then(result => {
    result.forEach(note => {
    console.log(note)
     })
    mongoose.connection.close()
   })
    await note.save()
    console.log('Note saved!')
  } catch (error) {
    console.error('MongoDB connection or save failed:', error.message)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

saveNote()