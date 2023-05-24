const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours: tours } });
};

exports.getTour = (req, res) => {
  const reqId = req.params.id * 1;

  if (reqId >= tours.length) {
    return res.status(404).json({
      status: 'failed',
      messege: 'Id not exist',
    });
  }
  const getOneTour = tours.find((eachTour) => eachTour.id === reqId);
  res.status(200).send(getOneTour);
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({ status: 'success', data: { tours: newTour } });
      console.log('Post done');
    }
  );
};

exports.updateTour = (req, res) => {
  const newId = req.params.id * 1;
  const newData = req.body;
  if (newId >= tours.length) {
    res.status(404).json({
      status: 'bad request',
      messege: 'Id does not exist',
    });
  }

  newData.id = newId;
  const newTours = tours.map((eachTour) => {
    return eachTour.id == newId ? (eachTour = newData) : eachTour;
  });

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    () => {
      res.status(200).json({
        status: 'successful patch',
        data: newData,
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  const newId = req.params.id * 1;
  if (newId >= tours.length) {
    res.status(404).json({
      status: 'bad request',
      messege: 'Id does not exist',
    });
  }

  const newTours = tours.filter((eachTour) => eachTour.id !== newId);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    (err) => {
      res.status(200).json({
        status: 'successful Delete',
        messege: `Tour with Id ${newId} removed fromthe api`,
        data: 'null',
      });
    }
  );
};
