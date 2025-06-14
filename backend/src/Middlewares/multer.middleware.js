import multer from 'multer'


const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, './public/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.originalname + '-' + uniqueSuffix)
    }
  })
 

  export const upload = multer({ storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 } 
   })