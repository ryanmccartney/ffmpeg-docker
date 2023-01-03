fs.watch("/path/to/folder", (eventType, filename) => {
    console.log(eventType);
    // could be either 'rename' or 'change'. new file event and delete
    // also generally emit 'rename'
    console.log(filename);
});
