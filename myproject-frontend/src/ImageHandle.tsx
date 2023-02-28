import React, { useEffect, useState } from "react";
import {Collection, Image, withAuthenticator} from "@aws-amplify/ui-react"; // Import Collection, Image, and withAuthenticator components from aws-amplify/ui-react library
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"; // Import S3Client and GetObjectCommand modules from aws-sdk/client-s3 library
import {Storage} from "aws-amplify"; // Import Storage module from aws-amplify library
import "@aws-amplify/ui-react/styles.css"; // Import styling for aws-amplify components
import "./App.css"; // Import App.css file
import {S3ProviderListOutputItem} from "@aws-amplify/storage"; // Import S3ProviderListOutputItem type from aws-amplify/storage module
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; // Import getSignedUrl function from aws-sdk/s3-request-presigner module
import awsExports from './aws-exports'; // Import AWS configuration


function ImageUpload(){

  const [imageKeys, setImageKeys] = useState<S3ProviderListOutputItem[]>(); // Define state for imageKeys and setImageKeys
  const [images, setImages] = useState<string[]>([]); // Define state for images and setImages

  const fetchImages = async () => { // Define function to fetch images
      const {results} = await Storage.list("", {level: "private"}); // Use Storage.list method to get a list of private images from S3 bucket
      setImageKeys(results); // Set imageKeys state to the results of Storage.list method
      const s3Images = await Promise.all( // Use Promise.all to asynchronously get all images from the list of results
          results.map(
              async image => await Storage.get(image.key!, {level:"private"})
          )
      );
      setImages(s3Images); // Set images state to the fetched images
  };

  console.log("data", images); // Log images to the console

  useEffect(() => {
      fetchImages(); // Call fetchImages function on component mount
  }, []);

  const deleteImage = async (key: string) => { // Define function to delete an image
    try {
      await Storage.remove(key, { level: "private" }); // Use Storage.remove method to delete image from S3 bucket
      console.log('File ${key} removed successfully from storage');
      fetchImages(); // Fetch updated images after successful deletion
    } catch (error) {
      console.error('Error removing file ${key} from storage:', error); // Log error if deletion fails
    }
  };


  const shareImage = async (key: string) => { // Define function to generate pre-signed URL for sharing an image
    try {
      console.log("in shareImage")
      console.log(key)
      const s3 = new S3Client({ region: awsExports.aws_user_files_s3_bucket_region}); // Create an S3 client with the bucket region from AWS configuration
      const command = new GetObjectCommand({ Bucket: awsExports.aws_user_files_s3_bucket, Key: key }); // Create a new GetObjectCommand with the S3 bucket and image key
      console.log(command)
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // Use getSignedUrl function to generate a pre-signed URL for the image
      console.log(signedUrl);
        // display the signed URL to the user
        // alert(signedUrl);
      } catch (error) {
        console.error('Error generating signed URL for file ${key}:', error); // Log error if generating pre-signed URL fails
      }
    };


    return(
        <>
        <Collection
        items = {images}
        type="grid"
        padding="2rem"
        maxWidth={"1100px"}
        margin="0 auto"
        templateColumns={{
          base: "minmax(0, 500px",
          medium: "repeat(2 ,minmax(0,1fr))",
          large: "repeat(3 ,minmax(0,1fr))"
        }}
        gap="small"
        >
            {(item,index) => ( // Use a callback function to render each item in the Collection component
                <div key={index}>
                  <Image src={item} alt=""></Image>
                  <button onClick={() => deleteImage(imageKeys![index].key)}>Delete</button> {/* Button to delete an image */}
                  &emsp;
                  <button onClick={() => shareImage(imageKeys![index].key)}>Share</button> {/* Button to share an image */}
                </div>
            )}
        </Collection>
        </>
    );
}


export default withAuthenticator(ImageUpload);  // Export the ImageUpload component wrapped in the withAuthenticator HOC for user authentication.