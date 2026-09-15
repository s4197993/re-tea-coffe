/**
* RMIT University Vietnam
* Course: COSC3060 Web Programming Studio
* Semester: 2025B
* Assessment: Fullstack in-class Lab Test
* Author: Your names (e.g. Nguyen Van Minh)
* ID: Your student ids (e.g. s1234567)
* Acknowledgement: Acknowledge the resources that you use here.
*/

// Declare packages used for this server file
const express = require('express');
require('dotenv').config();
const {Book, ReadingList} = require('./db/bookModel');

// Setup server
const app = express();
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

async function getRandomList() {
    const total = await ReadingList.countDocuments();
    const randomIndex = Math.floor(Math.random()*total);
    const list = await ReadingList.findOne().skip(randomIndex)
    return list;
}

function makeDayBoxes(list) {
    if (!list) {
        return []
    }
    const textbooks = list.books.filter(function(book){
        return book.category === "TEXTBOOK";
    })
    const philosophyBooks = list.books.filter(function(book){
        return book.category === "PHILOSOPHY";
    })
    const novels = list.books.filter(function(book){
        return book.category === "NOVEL";
    })
    const mondayToWednesday = {dayLabel: 'Monday-Wednesday', booksForThisDay: textbooks}
    const thursdayToFriday = {dayLabel: 'Thursday-Friday', booksForThisDay: philosophyBooks}
    const saturdayToSunday = {dayLabel: 'Saturday-Sunday', booksForThisDay: novels}
    return [mondayToWednesday,thursdayToFriday,saturdayToSunday]
}

/** Routes */
// Homepage endpoint that when accessed will produce a random reading list for a week
app.get('/', async function (req, res) {
    const list = await getRandomList();
    const dayBoxes = makeDayBoxes(list);
    res.render('list',{dayBoxes:dayBoxes});
})
app.post('/', async function (req, res) {
    const list = await getRandomList();
    const dayBoxes = makeDayBoxes(list);
    res.render('list',{dayBoxes:dayBoxes});
})
// Book endpoint that when accessed will show detail information about a book and related books found in the database
app.get('/book/:title', async function (req, res) {
    const book = await Book.findOne({title: req.params.title})
    const related = await Book.find({
        category: book.category,
        title:{$ne: book.title}
    });
    res.render('book', {book,related});
});

// Port number
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log(`Server started and is running on: http://localhost:${port}`);
});