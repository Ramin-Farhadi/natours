const fs = require('fs');
const express = require('express');
express.json();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.checkID = (req, res, next, val) => {
  const reqId = val * 1;
  if (reqId >= tours.length || !reqId) {
    return res.status(404).json({
      status: 'failed',
      messege: 'Id not exist',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    console.log('missing price');
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours: tours } });
};

exports.getTour = (req, res) => {
  const reqId = req.params.id * 1;
  const getOneTour = tours.find((eachTour) => eachTour.id === reqId);
  res.status(200).send(getOneTour);
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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

  newData.id = newId;
  const newTours = tours.map((eachTour) => {
    return eachTour.id == newId ? (eachTour = newData) : eachTour;
  });

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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

  const newTours = tours.filter((eachTour) => eachTour.id !== newId);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
