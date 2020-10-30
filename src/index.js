// const fs = require('fs');
// const {google} = require('googleapis');
// const http = require('http');
// const opn = require('open');
// const destroyer = require('server-destroy');
// const url = require('url');

var Mail;
/***
  google : Used to call Google Mail Api
  fs : Used to read credentials downloaded ( OAuth2 )
***/

// SCOPES : Permissions Required
const SCOPES = ['https://mail.google.com/'];
// TOKEN_PATH : Token created after OAuth2 Process
const TOKEN_PATH = 'token.json';

function getStarted(){
  // Read credentials if available else throw err
  fs.readFile('./client_secret.json', (err, content) => {
      console.log("fs.readFile running ... ");
      if (err)
        return console.log('Error loading client secret file:', err);
      /*
        authorize function will try authorize using the credentials above and get a callback 'getAuth'
      */
      authorize(JSON.parse(content), getAuth);
  });
}

function authorize(credentials, callback) {
  // Credentials in credentials.json created in Google project
  const {client_secret, client_id, redirect_uris} = credentials.web;
  // Call google API OAuth2 to get Authentication from the user to access SCOPES by the application
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // This read the token file if present
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err)
      return getNewToken(oAuth2Client, callback);

    // Set credentials using the token received after Authentication
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// This function receives the Authentication and issue new tokens
async function getNewToken(oAuth2Client, callback) {
  return new Promise((resolve, reject) => {
    // Url to give Authentication access generated using generateAuthUrl method
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES.join(' '),
    });

    /*
      Redierct to new Page Where Authentication process will take place
      Create new Server that will serve auth process
    */
    const server = http.createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
             /*
                Parse URL
                Now qs will have the whole url
             */
             const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
             res.end('Authentication successful! Please return to the console.');
             server.destroy();

             // Token or Code received after authentication process
             var code = qs.get('code');
             oAuth2Client.getToken(code, (err, tokens) => {
               if (err)
                 return console.error('Error retrieving access token', err);

               // Set credentials using the token received after Authentication
               oAuth2Client.setCredentials(tokens);
               fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), (err) => {
                 // Write token in our database in file name Token.json
                 if (err)
                   return console.error(err);
                 console.log('Token stored to', TOKEN_PATH);
             });
             // callback Received
             callback(oAuth2Client);
           });

           // oAuth2Client.credentials = tokens;
           resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      }).listen(3000, () => {
        opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
    destroyer(server);
  });
}

function getAuth(auth){
    Mail = require('./createMail.js');
}

function sendMail(){
    var obj = new Mail(auth, "vipin.vishnoi0627@gmail.com", 'Subject', 'Body', 'mail');
    obj.makeBody();
}
