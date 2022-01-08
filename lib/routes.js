const fs = require('fs');
const express = require('express'); 

// import index.js
const editImage  = require('../index');

exports.addRoutes = function addRoutes(api) {

  // create routes for /uploads and /static
  api.use('/static', express.static('static'));
  api.use('/uploads', express.static('uploads'));

  // create route for home
  api.route('/').get((req, res) => {
    let data = JSON.parse(JSON. stringify(req.query));
    let imgSrc;
    let send;
    let today = new Date;
    let findTime = `${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;

    if(Object.keys(data).length > 0 && data.url != "")
    {
      let imgURL     = data.url;
      let format     = data.format;
      let width      = 0;
      let height     = 0;
      let cropLeft   = 0;
      let cropTop    = 0;
      let cropWidth  = 0;
      let cropHeight = 0;
      let color      = data.selectcolor;
      let rotate     = 0;

      // find the width and height, if they are selected
      if (data.w && (isNaN(data.w) === false)) 
      {
        width = parseInt(data.w);
      }
      else if (data.h && (isNaN(data.h) === false)) 
      {
        height = parseInt(data.h);
      }

      // if crop is selected
      if ( (data.width  && (isNaN(data.width)  === false)) || 
           (data.height && (isNaN(data.height) === false)) || 
           (data.top    && (isNaN(data.top)    === false)) || 
           (data.left   && (isNaN(data.left)   === false)) )
      {
        cropWidth  = parseInt(data.width);
        cropHeight = parseInt(data.height);
        cropTop    = parseInt(data.top);
        cropLeft   = parseInt(data.left);
      }

      // find the rotate degree
      if ((isNaN(data.selectrotate) === false) && (parseInt(data.selectrotate) > 0))
      {
        rotate = parseInt(data.selectrotate);
      }
      else if (data.rotation && (isNaN(data.rotation) === false ))
      {
        rotate = parseInt(data.rotation);
      }

      // extract the name of the image from the image url 
      // set it as the name of the edited image + current time
      let firstIndex = imgURL.lastIndexOf('/')+1;
		  let lastIndex  = imgURL.lastIndexOf('.');
		  let imageName  = imgURL.substring(firstIndex, lastIndex);

      // call edit function from index.js
      editImage.edit(imgURL, format, imageName, findTime, width, height, 
                    cropLeft, cropTop, cropWidth, cropHeight, color, rotate, res);
      imgSrc = `http://localhost:8080/uploads/${imageName}_${findTime}.${format}`;
      send = true;
    }
    res.render('index', { 
      title: `editor`,
      imgSrc: imgSrc,
      send, send
    });
  });

}
