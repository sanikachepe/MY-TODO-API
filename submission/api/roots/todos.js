const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Todo = require('../models/todo');

router.get('/', (req, res, next) => {
  Todo.find()
    .select('title note _id')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        todos: docs.map((doc) => {
          return {
            title: doc.title,
            note: doc.note,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:5000/todos/' + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post('/', (req, res, next) => {
  const todo = new Todo({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    note: req.body.note,
  });
  console.log(todo);
  todo
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        msg: 'Created Note Successfully',
        createdTodo: {
          title: result.title,
          note: result.note,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/todos/' + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get('/:todoId', (req, res, next) => {
  const id = req.params.todoId;
  Todo.findById(id)
    .select('title note _id')
    .exec()
    .then((doc) => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          todo: doc,
          request: {
            type: 'GET',
            description: 'GET all Todos',
            url: 'http://localhost:5000/todos/',
          },
        });
      } else {
        res
          .status(404)
          .json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch('/:todoId', (req, res, next) => {
  const id = req.params.todoId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Todo.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      //console.log(result);
      res.status(200).json({
        message: 'Todo Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:5000/todos/' + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:todoId', (req, res, next) => {
  const id = req.params.todoId;
  Todo.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Todo Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:5000/todos/',
          description: 'CREATE_A_TASK',
          body: { title: 'String', note: 'String' },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
