const fs = require('fs');
const dirs = ['old_posts','images'];
const README = __dirname + '/' + 'README.md';
let number_of_last_posts = 5;

// Checking if the directory exists
dirs.forEach((dir) => {
	if(!fs.existsSync(__dirname + '/' + dir)) {
		console.log('The directory '+ dir +' does not exists , creating it.');

		fs.mkdirSync(__dirname + '/' + dir);
	}
});

// Checking if there is the new post parameter

if(process.argv[2] == 'new') {

	// Check if there is a README.md file , and move it to the old page
	if(fs.existsSync(README)) {
		let stats 	= fs.statSync(README);
		let time 	= new Date(stats.mtime).getTime();

		// Move the README.md to the Old Posts 	
		fs.createReadStream(README).pipe(
			fs.createWriteStream(__dirname + '/old_posts/' + time + '.md')
		);
	}
	
	// DELETE THE README.MD file
	if(fs.existsSync(README)) fs.unlinkSync(README);

	// Create a new README File
	fs.open(README, 'wx', (err, fd) => {
		if (err) {
			if (err.code === 'EEXIST') {
				console.error('myfile already exists');
				return;
			}
			throw err;
		}
	});

	// Create an File Stream
	var logger = fs.createWriteStream(README, {
  		flags: 'a' // 'a' means appending (old data will be preserved)
	});


	logger.write('Post of date : ' + new Date().getTime() + '\n');
	logger.write('Post of date : ' + new Date().getTime() + '\n');


	let last_files = fs.readdirSync(__dirname + '/old_posts').map((file) => {
		return Number(file.substr(0, file.indexOf('.')) );
	}).sort().reverse().slice(0, number_of_last_posts);

	logger.write('# Last Posts \n');

	last_files.forEach((file , index) => {
		logger.write(index + ". Post ["+new Date(file)+"]( "+'old_posts/'+file+ '.md'+" ) \n");
	})
}
