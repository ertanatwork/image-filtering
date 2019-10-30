import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, isValidImage } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  const files: string[] = [];
  /**************************************************************************** */
  app.get("/filteredimage", (req: Request, res: Response): void => {
    const { image_url } = req.query;

    if (!isValidImage(image_url)) {
      res
        .status(400)
        .json({ msg: "Not a valid url" });

      // Stop execution of rest in case of bad input
      return;
    }

    filterImageFromURL(image_url)
    .then((path) => {
      files.push(path);
      res
        .status(200)
        .json({ msg: "success", path });
    })
    .catch(err => {
      console.log("Error while filtering image", err);
      res
        .status(400)
        .json({ msg: "Bad request" });
    });
  });

  //! END @TODO1

  // Also adding the delete file functinalities
  app.get("/delete-images", (req: Request, res: Response) => {
    deleteLocalFiles(files)
    .then((isSuccessful) => {
      if (isSuccessful) {
        res.status(200).json({ msg: "Successfully deleted local files" });
      }
    })
    .catch(err => {
      console.log("Error while deleting local files", err);
      res
        .status(500)
        .json({ msg: "Error occured while trying delete local files" });
    })
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();