import React, { useEffect, useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, Storage } from 'aws-amplify'; // Import Amplify and Storage modules from aws-amplify library
import { Authenticator , Button} from '@aws-amplify/ui-react'; // Import Authenticator and Button components from aws-amplify/ui-react
import awsExports from './aws-exports'; // Import AWS configuration
import ImageUpload from './ImageHandle.tsx'; // Import ImageUpload component
import './App.css'; // Import App.css file

Amplify.configure(awsExports); // Configure Amplify with the imported AWS configuration

function App() {
  const [fileList, setFileList] = useState([]); // Define state for fileList and setFileList
  const [fileData, setFileData] = useState(); // Define state for fileData and setFileData
  const [fileStatus, setFileStatus] = useState(false); // Define state for fileStatus and setFileStatus

  const uploadFile = async () => { // Define function for uploading file
    const result = await Storage.put(fileData.name, fileData, { // Use Storage.put method to upload file to S3 bucket
      level: "private", // Set file access level to private
      contentType: fileData.type, // Set content type of uploaded file
    });
    setFileStatus(true); // Set fileStatus state to true
    console.log(21, result); // Log the result to the console
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.attributes.email}</h1> {/* Display user email */}
          <div>
            <input type="file" onChange={(e) => setFileData(e.target.files[0])} /> {/* Allow user to select file to upload */}
          </div>
          <p></p>
          <div>
            <button onClick={uploadFile}>upload</button> {/* Button to upload file */}
          </div>
          <p></p>
          <div>
            {fileStatus ? 'File uploaded' : ''} {/* Display message if file was uploaded */}
          </div>

          <ImageUpload user={user} fileList={fileList} setFileList={setFileList} /> {/* Render ImageUpload component with user, fileList, and setFileList props */}
          
          <Button onClick={signOut}>Sign Out</Button> {/* Button to sign out user */}
          <p></p>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
