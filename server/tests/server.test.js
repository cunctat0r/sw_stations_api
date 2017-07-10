const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Station} = require('./../models/station');

const stations = [{
    '_id' : new ObjectID(),
    'name' : 'First test station',
    'freq' : 123.456,
    'actual': false
  }, {
    '_id' : new ObjectID(),
    'name': 'Second test station',
    'freq': 987.456,
    'actual': true
  }, {
    '_id' : new ObjectID(),
    'name': 'Third test station',
    'freq': 1987.456,
    'actual': false
  } 
];

beforeEach((done) => {
  Station.remove({}).then(() => {
    Station.insertMany(stations);
  }).then(() => done());
});

describe('POST /stations', () => {
  it('should create a new station', (done) => {
    var name = 'Test station name';
    var freq = 666.999;

    request(app)
      .post('/stations')
      .send({name, freq})
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        
        Station.find({name}).then((stations) => {
          expect(stations.length).toBe(1);
          expect(stations[0].name).toBe(name);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create station with invalid body data', (done) => {
    request(app)
      .post('/stations')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Station.find().then((stations) => {
          expect(stations.length).toBe(3);
          done();
        }).catch((e) => done(e));
      })
  });

});

describe('GET /stations', () => {
  it('Should get all stations', (done) => {
    request(app)
      .get('/stations')
      .expect(200)
      .expect((res) => {
        expect(res.body.stations.length).toBe(3);
      })
      .end(done);
      });
});

describe('GET /stations/:id', () => {
  it('Should return 404 for non-valid id', (done) => {
    request(app)
      .get('/stations/123')
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-existing id', (done) => {
    var newId = new ObjectID();
    request(app)
      .get(`/stations/${newId.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return station for valid id', (done) => {
    request(app)
      .get(`/stations/${stations[0]['_id']}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(stations[0]['name']);
      })
      .end(done)
  });
});
/*
describe('DELETE /todos/:id', () => {
  it('should return 404 for non-valid id', (done) => {
    var newId = '123abc';
    request(app)
      .delete(`/todos/${newId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-existing id', (done) => {
    var newId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${newId}`)
      .expect(404)
      .end(done);  
  });

  it('should delete document for valid id and return this document', (done) => {
    var newId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${newId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(newId);
        expect(res.body.todo.text).toBe('First test todo');
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(newId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });
})

describe('PATCH /todos/:id', () => {
  it('should make todo completed', (done) => {
    var patchTodo = {
      'text' : 'Todo is patched',
      'completed': true
    };
    var newId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${newId}`)
      .send(patchTodo)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(newId).then((todo) => {
          expect(todo.completed).toBe(true);
          expect(todo.completedAt).toBeA('number');
          expect(todo.text).toBe(patchTodo.text);
          done();
        }).catch((e) => done(e))
      })

  });

  it('should make todo uncompleted', () => {
    var patchTodo = {
      'completed': false
    };
    var newId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${newId}`)
      .send(patchTodo)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(newId).then((todo) => {
          expect(todo.completed).toBe(false);
          expect(todo.completedAt).toBe(null);
          done();
        }).catch((e) => done(e))
      })
  });
});
*/
