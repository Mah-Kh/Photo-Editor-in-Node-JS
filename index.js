const { createLogger } = require('./lib/logger');
const { createServer } = require('./lib/server');

const config = {
  host:     process.env.HOST || 'localhost',
  port:     parseInt(process.env.PORT || '8080', 10),
  logLevel: process.env.LOG_LEVEL || 'debug'
};

const logger = createLogger(config.logLevel);
const server = createServer({ logger });

server.listen(config.port, err => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info(`Server running at http://${config.host}:${config.port}`);
});

/****************************************************************************/
server.set('view engine', 'jade');

// Export edit function to use in routes.js 
module.exports.edit = function(imgURL, format, imageName, findTime, width, height, 
                              cropLeft, cropTop, cropWidth, cropHeight, color, rotate, res){
  const got = require("got");
  const sharp = require("sharp");
  const sharpStream = sharp({
    failOnError: false
  });

  // if resize is selected
  if (width > 0) 
  {
    sharpStream
      .resize({ width: width,
          height: null })
  }
  else if (height > 0) 
  {
    sharpStream
      .resize({ width: null,
        height: height })
  }

  // if crop is selected
  if((cropLeft > 0 || cropTop > 0) && (cropWidth > 0 && cropHeight > 0))
  {
    sharpStream
      .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
  }

  // if color is selected
  if(color != 'Select color manipulation')
  {
    if (color === 'greyscale')
    {
      sharpStream
        .grayscale()
    }
    else if(color === 'threshold')
    {
      sharpStream
          .threshold()
    }
    else if(color === 'blur')
    {
      sharpStream
        .blur()
    }
  }
  // if rotate is selected
  if(rotate != 0)
  {
    sharpStream
			.rotate(rotate)
  }

  if(typeof(imgURL) === 'string')
  {
			got.stream(imgURL).pipe(sharpStream);
	}

  async function editImage() {
    await sharpStream
      .clone()
      .toFile(`uploads/${imageName}_${findTime}.${format}`)
  }

  editImage();
}




