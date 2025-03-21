const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const express = require('express');

const noteRoutes = require('../routes/note.routes');
const noteController = require('../controllers/note.controller');

const { expect } = chai;

const app = express();
app.use(express.json());
app.use('/api', noteRoutes);

describe('Note Routes', () => {
    let request;

    before(() => {
        request = supertest(app);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('POST /api/notes', () => {
        it('should create and return a new note', async () => {
            const newNote = { title: 'Test Note', content: 'Test Content' };

            sinon.stub(noteController, 'create').resolves(newNote);

            const response = await request.post('/api/notes').send(newNote);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message', 'Note created successfully');
            expect(response.body).to.have.property('note').that.includes(newNote);
        });
    });
});
