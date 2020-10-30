const {google} = require('googleapis');
const mailComposer = require('nodemailer/lib/mail-composer');

class CreateMail{

	constructor(auth, to, sub, body, task){
    this.me = 'vishnoi.harsh20@gmail.com';
    this.task = task;
    this.auth = auth;
    this.to = to;
    this.sub = sub;
    this.body = body;
    this.gmail = google.gmail({version: 'v1', auth});
	}


	makeBody(){
		let mail;

		// Mail Composed Using mailComposer
		mail = new mailComposer({
			to: this.to,
			text: this.body,
			subject: this.sub,
			textEncoding: "base64"
		});


		mail.compile().build((err, msg) => {
			if (err)
				return console.log('Error compiling email ' + error);

			// It is necessary to have raw data in encode :- base64
			const encodedMessage = Buffer.from(msg)
			  .toString('base64')
			  .replace(/\+/g, '-')
			  .replace(/\//g, '_')
			  .replace(/=+$/, '');

			if(this.task === 'mail'){
				this.sendMail(encodedMessage);
			}else{
				this.saveDraft(encodedMessage);
			}
		});
	}

	/*
		functionality to sendMail
	*/
	sendMail(encodedMessage){
		this.gmail.users.messages.send({
			userId: this.me,
			resource: {
				// Raw message received using base64 textEncoding
				raw: encodedMessage,
			}
		}, (err, result) => {
			if(err)
				return console.log('NODEMAILER - The API returned an error: ' + err);

			console.log("MAIL SEND ....... ")
			console.log("NODEMAILER - Sending email reply from server:", result.data);
		});
	}

	/*
		functionality to save mail in drafts
	*/
	saveDraft(encodedMessage){
		this.gmail.users.drafts.create({
			'userId': this.me,
			'resource': {
			  'message': {
				'raw': encodedMessage
			  }
			}
		})
	}

	/*
		functionality to delete mail in drafts
	*/
  deleteDraft(id){
		this.attachment.gmail.users.drafts.delete({
			id: id,
			userId: this.me
		});
	}


	listAllDrafts(){
    	this.gmail.users.drafts.list({
        	userId: this.me
    	}, (err, res) => {
  		if(err){
  			console.log(err);
  		}else{
    		console.log(res.data);
    	}
		});
	}
}

module.exports = CreateMail;
